from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add the current directory to Python path to import trigger_crew_simple
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from trigger_crew_simple import fact_check_crew
except ImportError:
    print("Warning: Could not import fact_check_crew. Make sure trigger_crew_simple.py is available.")
    fact_check_crew = None

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': 'Fact Checker API is running',
        'service': 'fact-checker'
    }), 200

@app.route('/api/fact-check', methods=['POST'])
def fact_check():
    """Fact check endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                'error': 'Missing required field: text'
            }), 400
        
        text = data['text'].strip()
        
        if not text:
            return jsonify({
                'error': 'Text cannot be empty'
            }), 400
        
        if len(text) > 5000:  # Limit text length
            return jsonify({
                'error': 'Text too long. Maximum 5000 characters allowed.'
            }), 400
        
        # Check if fact_check_crew is available
        if fact_check_crew is None:
            return jsonify({
                'final_verdict': 'Service Configuration Error',
                'reasoning': 'Fact checking service is not properly configured. Please check the backend setup.',
                'supporting_articles': [],
                'sources_verified': 0,
                'execution_time': 0,
                'credibility_score': 0,
                'confidence_level': 'Low',
                'claim_analysis': {
                    'main_claims': ['Service unavailable'],
                    'verifiable_facts': [],
                    'questionable_statements': []
                },
                'summary': 'The fact-checking service is currently unavailable due to configuration issues.',
                'bias_analysis': {
                    'detected_bias': 'None',
                    'bias_indicators': [],
                    'neutrality_score': 0
                }
            }), 200
        
        # Call the fact checking function
        result = fact_check_crew(text)
        
        # Enhance the result with additional fields expected by the frontend
        enhanced_result = {
            'final_verdict': result.get('final_verdict', 'Unable to determine'),
            'reasoning': result.get('reasoning', 'Analysis could not be completed'),
            'supporting_articles': result.get('supporting_articles', []),
            'sources_verified': result.get('sources_verified', 0),
            'execution_time': result.get('execution_time', 0),
            'credibility_score': _calculate_credibility_score(result.get('final_verdict', '')),
            'confidence_level': _get_confidence_level(result.get('sources_verified', 0)),
            'claim_analysis': {
                'main_claims': _extract_claims(text),
                'verifiable_facts': _extract_facts(result.get('supporting_articles', [])),
                'questionable_statements': _extract_questionable(text, result.get('final_verdict', ''))
            },
            'summary': _generate_summary(result),
            'bias_analysis': {
                'detected_bias': _detect_bias(result.get('reasoning', '')),
                'bias_indicators': _get_bias_indicators(result.get('reasoning', '')),
                'neutrality_score': _calculate_neutrality_score(result.get('reasoning', ''))
            }
        }
        
        return jsonify(enhanced_result), 200
        
    except Exception as e:
        print(f"Error in fact_check endpoint: {str(e)}")
        return jsonify({
            'error': f'Internal server error: {str(e)}'
        }), 500

def _calculate_credibility_score(verdict):
    """Calculate credibility score based on verdict"""
    verdict_lower = verdict.lower()
    if 'true' in verdict_lower or 'accurate' in verdict_lower:
        return 85
    elif 'false' in verdict_lower or 'misleading' in verdict_lower:
        return 25
    elif 'mixed' in verdict_lower or 'partially' in verdict_lower:
        return 60
    else:
        return 50

def _get_confidence_level(sources_verified):
    """Get confidence level based on sources verified"""
    if sources_verified >= 5:
        return 'High'
    elif sources_verified >= 3:
        return 'Medium'
    elif sources_verified >= 1:
        return 'Low'
    else:
        return 'Very Low'

def _extract_claims(text):
    """Extract main claims from text"""
    # Simple claim extraction - split by sentences and take first few
    sentences = [s.strip() for s in text.split('.') if s.strip()]
    return sentences[:3]  # Return first 3 sentences as main claims

def _extract_facts(supporting_articles):
    """Extract verifiable facts from supporting articles"""
    facts = []
    for article in supporting_articles[:3]:  # Limit to first 3 articles
        if 'snippet' in article:
            facts.append(article['snippet'][:100] + '...' if len(article['snippet']) > 100 else article['snippet'])
    return facts

def _extract_questionable(text, verdict):
    """Extract questionable statements based on verdict"""
    if 'false' in verdict.lower() or 'misleading' in verdict.lower():
        # If verdict is negative, mark some statements as questionable
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        return sentences[:2]  # Return first 2 sentences as questionable
    return []

def _generate_summary(result):
    """Generate a summary of the fact-check result"""
    verdict = result.get('final_verdict', 'Unknown')
    sources = result.get('sources_verified', 0)
    
    return f"Fact-check analysis completed with verdict: {verdict}. Analysis based on {sources} verified sources."

def _detect_bias(reasoning):
    """Detect bias in the reasoning"""
    reasoning_lower = reasoning.lower()
    bias_keywords = {
        'political': ['democrat', 'republican', 'liberal', 'conservative'],
        'emotional': ['outrageous', 'shocking', 'unbelievable'],
        'sensational': ['breaking', 'exclusive', 'bombshell']
    }
    
    for bias_type, keywords in bias_keywords.items():
        if any(keyword in reasoning_lower for keyword in keywords):
            return bias_type.title()
    
    return 'None'

def _get_bias_indicators(reasoning):
    """Get bias indicators from reasoning"""
    indicators = []
    reasoning_lower = reasoning.lower()
    
    if 'opinion' in reasoning_lower:
        indicators.append('Contains opinion statements')
    if 'claim' in reasoning_lower:
        indicators.append('Makes unsubstantiated claims')
    if len([word for word in reasoning_lower.split() if word in ['very', 'extremely', 'absolutely']]) > 2:
        indicators.append('Uses excessive qualifiers')
    
    return indicators

def _calculate_neutrality_score(reasoning):
    """Calculate neutrality score based on reasoning"""
    reasoning_lower = reasoning.lower()
    bias_words = ['biased', 'unfair', 'partisan', 'propaganda']
    neutral_words = ['objective', 'factual', 'evidence', 'verified']
    
    bias_count = sum(1 for word in bias_words if word in reasoning_lower)
    neutral_count = sum(1 for word in neutral_words if word in reasoning_lower)
    
    if neutral_count > bias_count:
        return 80
    elif bias_count > neutral_count:
        return 40
    else:
        return 60

if __name__ == '__main__':
    print("Starting Fact Checker API server...")
    print("API will be available at: http://localhost:5001")
    print("Health check: http://localhost:5001/health")
    print("Fact check endpoint: http://localhost:5001/api/fact-check")
    
    app.run(debug=True, host='0.0.0.0', port=5001)