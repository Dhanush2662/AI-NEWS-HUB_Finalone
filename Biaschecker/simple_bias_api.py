from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from datetime import datetime
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Enhanced bias detection dictionaries
left_bias_keywords = {
    'progressive', 'liberal', 'social justice', 'equality', 'diversity', 'inclusion', 
    'climate change', 'renewable energy', 'universal healthcare', 'minimum wage',
    'gun control', 'abortion rights', 'lgbtq', 'immigration reform', 'wealth inequality',
    'corporate greed', 'wall street', 'big pharma', 'systemic racism', 'police reform',
    'democratic', 'biden', 'obama', 'pelosi', 'aoc', 'sanders', 'warren'
}

right_bias_keywords = {
    'conservative', 'traditional values', 'family values', 'free market', 'capitalism',
    'second amendment', 'pro-life', 'border security', 'illegal immigration', 'law and order',
    'fiscal responsibility', 'small government', 'deregulation', 'tax cuts', 'military strength',
    'patriotic', 'american values', 'religious freedom', 'constitutional rights',
    'republican', 'trump', 'desantis', 'mcconnell', 'cruz', 'hawley'
}

def rule_based_bias_detection(text):
    """Enhanced rule-based bias detection with better scoring"""
    text_lower = text.lower()
    
    # Count bias indicators with weighted scoring
    left_score = 0
    right_score = 0
    found_keywords = {"left": [], "right": []}
    
    # Check for left-leaning keywords
    for keyword in left_bias_keywords:
        if keyword in text_lower:
            weight = 2 if len(keyword.split()) > 1 else 1  # Multi-word phrases get higher weight
            left_score += weight
            found_keywords["left"].append(keyword)
    
    # Check for right-leaning keywords
    for keyword in right_bias_keywords:
        if keyword in text_lower:
            weight = 2 if len(keyword.split()) > 1 else 1
            right_score += weight
            found_keywords["right"].append(keyword)
    
    # Calculate total score and determine bias
    total_score = left_score + right_score
    
    if total_score == 0:
        return {
            "prediction": "Center",
            "confidence": 0.6,
            "detailed_label": "⚪ Center – Neutral / Balanced",
            "probabilities": {"Left": 0.2, "Center": 0.6, "Right": 0.2},
            "method": "rule_based_fallback",
            "found_keywords": found_keywords
        }
    
    # Calculate bias direction and confidence
    if left_score > right_score:
        bias_strength = min(left_score / (total_score + 2), 0.9)  # Cap at 90%
        return {
            "prediction": "Left",
            "confidence": 0.5 + bias_strength * 0.4,  # 50-90% confidence
            "detailed_label": "🟥 Left – Liberal / Progressive",
            "probabilities": {
                "Left": 0.5 + bias_strength * 0.4,
                "Center": 0.3 - bias_strength * 0.2,
                "Right": 0.2 - bias_strength * 0.2
            },
            "method": "rule_based_fallback",
            "found_keywords": found_keywords
        }
    elif right_score > left_score:
        bias_strength = min(right_score / (total_score + 2), 0.9)
        return {
            "prediction": "Right",
            "confidence": 0.5 + bias_strength * 0.4,
            "detailed_label": "🟦 Right – Conservative",
            "probabilities": {
                "Left": 0.2 - bias_strength * 0.2,
                "Center": 0.3 - bias_strength * 0.2,
                "Right": 0.5 + bias_strength * 0.4
            },
            "method": "rule_based_fallback",
            "found_keywords": found_keywords
        }
    else:
        # Equal scores - lean toward center
        return {
            "prediction": "Center",
            "confidence": 0.7,
            "detailed_label": "⚪ Center – Neutral / Balanced",
            "probabilities": {"Left": 0.25, "Center": 0.5, "Right": 0.25},
            "method": "rule_based_fallback",
            "found_keywords": found_keywords
        }

@app.route('/api/bias/check', methods=['POST'])
def check_bias():
    """Check bias for text content"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text is required'}), 400
        
        text = data['text'].strip()
        if not text:
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        if len(text) > 10000:  # Limit text length
            return jsonify({'error': 'Text too long (max 10,000 characters)'}), 400
        
        # Classify bias using rule-based method
        result = rule_based_bias_detection(text)
        
        # Format response
        response = {
            'political_bias': result['detailed_label'],
            'confidence': f"{result['confidence']:.1%}",
            'detailed_analysis': {
                'bias_label': result['detailed_label'],
                'confidence_score': result['confidence'],
                'probabilities': result['probabilities'],
                'method': result['method'],
                'found_keywords': result['found_keywords']
            },
            'timestamp': datetime.now().isoformat(),
            'content_analyzed': text[:200] + '...' if len(text) > 200 else text
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in bias check endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/bias/check-url', methods=['POST'])
def check_bias_url():
    """Check bias for URL content"""
    try:
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({'error': 'URL is required'}), 400
        
        url = data['url'].strip()
        if not url:
            return jsonify({'error': 'URL cannot be empty'}), 400
        
        # Validate URL format
        url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+'
            r'(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'
            r'localhost|'
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'
            r'(?::\d+)?'
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        
        if not url_pattern.match(url):
            return jsonify({'error': 'Invalid URL format'}), 400
        
        # For now, return a simple response since newspaper3k might have issues
        # In a production environment, you'd extract the article content here
        sample_text = "This is a placeholder for URL content analysis. The bias checker is working with rule-based detection."
        
        result = rule_based_bias_detection(sample_text)
        
        response = {
            'political_bias': result['detailed_label'],
            'confidence': f"{result['confidence']:.1%}",
            'detailed_analysis': {
                'bias_label': result['detailed_label'],
                'confidence_score': result['confidence'],
                'probabilities': result['probabilities'],
                'method': result['method']
            },
            'source_url': url,
            'timestamp': datetime.now().isoformat(),
            'note': 'URL analysis is currently using placeholder content. Text analysis is fully functional.'
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in bias check URL endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/model/status', methods=['GET'])
def model_status():
    """Get model status and information"""
    try:
        status = {
            'model_loaded': True,
            'model_name': 'Rule-based Bias Detector',
            'model_type': 'keyword_analysis',
            'device': 'cpu',
            'available_endpoints': [
                '/api/bias/check',
                '/api/bias/check-url',
                '/api/model/status'
            ],
            'timestamp': datetime.now().isoformat()
        }
        return jsonify(status)
        
    except Exception as e:
        logger.error(f"Error in model status endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Simple Bias Detection API',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    logger.info("🚀 Starting Simple Bias Detection API Server...")
    logger.info("✅ Rule-based bias detection ready")
    logger.info("🌐 Server will be available at: http://localhost:5002")
    logger.info("📋 API Endpoints:")
    logger.info("   POST /api/bias/check - Check bias for text")
    logger.info("   POST /api/bias/check-url - Check bias for URL")
    logger.info("   GET /api/model/status - Get model status")
    logger.info("   GET /health - Health check")
    
    app.run(host='0.0.0.0', port=5002, debug=False)