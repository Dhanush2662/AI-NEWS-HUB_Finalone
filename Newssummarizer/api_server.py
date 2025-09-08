from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from textblob import TextBlob
from newspaper import Article
import validators
import requests
from urllib.parse import urlparse
import re

# Download required NLTK data
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('vader_lexicon', quiet=True)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def summarize_text(text, num_sentences=5):
    """Extract key sentences from text"""
    try:
        # Clean the text
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Split into sentences
        sentences = nltk.sent_tokenize(text)
        
        if len(sentences) <= num_sentences:
            return text
        
        # Simple extractive summarization - take first few sentences
        # and some from middle and end for better coverage
        if num_sentences >= 3:
            selected_sentences = []
            selected_sentences.append(sentences[0])  # First sentence
            
            # Add sentences from middle
            mid_start = len(sentences) // 3
            mid_end = 2 * len(sentences) // 3
            middle_sentences = sentences[mid_start:mid_end]
            
            # Add some middle sentences
            for i in range(min(num_sentences - 2, len(middle_sentences))):
                selected_sentences.append(middle_sentences[i])
            
            # Add last sentence if we have room
            if len(selected_sentences) < num_sentences and len(sentences) > 1:
                selected_sentences.append(sentences[-1])
            
            return ' '.join(selected_sentences)
        else:
            return ' '.join(sentences[:num_sentences])
            
    except Exception as e:
        print(f"Summarization error: {e}")
        return text[:500] + "..." if len(text) > 500 else text

def analyze_sentiment(text):
    """Analyze sentiment using TextBlob"""
    try:
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        
        if polarity > 0.1:
            sentiment = 'Positive'
        elif polarity < -0.1:
            sentiment = 'Negative'
        else:
            sentiment = 'Neutral'
            
        return {
            'sentiment': sentiment,
            'polarity': round(polarity, 2),
            'confidence': round(abs(polarity), 2)
        }
    except Exception as e:
        print(f"Sentiment analysis error: {e}")
        return {
            'sentiment': 'Neutral',
            'polarity': 0.0,
            'confidence': 0.0
        }

def extract_article_content(url):
    """Extract article content from URL"""
    try:
        # Validate URL
        if not validators.url(url):
            raise ValueError("Invalid URL format")
        
        # Create article object
        article = Article(url)
        article.download()
        article.parse()
        
        if not article.text:
            raise ValueError("Could not extract text from article")
        
        return {
            'text': article.text,
            'title': article.title or 'Unknown Title',
            'authors': article.authors,
            'publish_date': str(article.publish_date) if article.publish_date else None,
            'top_image': article.top_image,
            'url': url
        }
        
    except Exception as e:
        print(f"Article extraction error: {e}")
        raise ValueError(f"Failed to extract article: {str(e)}")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'news-summarizer'}), 200

@app.route('/api/summarize', methods=['POST'])
def summarize():
    """Main summarization endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        # Get URL if provided
        url = data.get('url', '').strip()
        text = data.get('text', '').strip()
        num_sentences = data.get('sentences', 5)
        
        if not url and not text:
            return jsonify({'error': 'Either URL or text must be provided'}), 400
        
        # Extract content from URL if provided
        if url:
            try:
                article_data = extract_article_content(url)
                text = article_data['text']
                title = article_data['title']
                top_image = article_data['top_image']
            except ValueError as e:
                return jsonify({'error': str(e)}), 400
        else:
            title = 'Text Summary'
            top_image = None
        
        if not text:
            return jsonify({'error': 'No text content to summarize'}), 400
        
        # Generate summary
        summary = summarize_text(text, num_sentences)
        sentiment = analyze_sentiment(text)
        
        # Extract keywords (simple approach)
        blob = TextBlob(text)
        words = [word.lower() for word in blob.words if len(word) > 3]
        word_freq = {}
        for word in words:
            word_freq[word] = word_freq.get(word, 0) + 1
        
        keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:5]
        keywords = [word for word, freq in keywords]
        
        result = {
            'summary': summary,
            'title': title,
            'top_image': top_image,
            'original_length': len(text),
            'summary_length': len(summary),
            'compression_ratio': round((len(summary) / len(text)) * 100, 1) if text else 0,
            'sentiment_analysis': sentiment,
            'keywords': keywords
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Summarization error: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/summarize/text', methods=['POST'])
def summarize_text_only():
    """Text-only summarization endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing required field: text'}), 400
        
        text = data['text'].strip()
        if not text:
            return jsonify({'error': 'Text cannot be empty'}), 400
        
        if len(text) > 10000:
            return jsonify({'error': 'Text too long. Maximum 10000 characters allowed.'}), 400
        
        num_sentences = data.get('sentences', 5)
        if not isinstance(num_sentences, int) or num_sentences < 1 or num_sentences > 10:
            num_sentences = 5
        
        summary = summarize_text(text, num_sentences)
        sentiment = analyze_sentiment(text)
        
        # Extract keywords (simple approach)
        blob = TextBlob(text)
        words = [word.lower() for word in blob.words if len(word) > 3]
        word_freq = {}
        for word in words:
            word_freq[word] = word_freq.get(word, 0) + 1
        
        keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:5]
        keywords = [word for word, freq in keywords]
        
        result = {
            'summary': summary,
            'original_length': len(text),
            'summary_length': len(summary),
            'compression_ratio': round((len(summary) / len(text)) * 100, 1),
            'sentiment_analysis': sentiment,
            'keywords': keywords
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/summarize/url', methods=['POST'])
def summarize_url_only():
    """URL-only summarization endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'url' not in data:
            return jsonify({'error': 'Missing required field: url'}), 400
        
        url = data['url'].strip()
        if not url:
            return jsonify({'error': 'URL cannot be empty'}), 400
        
        num_sentences = data.get('sentences', 5)
        if not isinstance(num_sentences, int) or num_sentences < 1 or num_sentences > 10:
            num_sentences = 5
        
        # Extract content from URL
        try:
            article_data = extract_article_content(url)
            text = article_data['text']
            title = article_data['title']
            top_image = article_data['top_image']
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        
        if not text:
            return jsonify({'error': 'No text content found in the URL'}), 400
        
        summary = summarize_text(text, num_sentences)
        sentiment = analyze_sentiment(text)
        
        # Extract keywords (simple approach)
        blob = TextBlob(text)
        words = [word.lower() for word in blob.words if len(word) > 3]
        word_freq = {}
        for word in words:
            word_freq[word] = word_freq.get(word, 0) + 1
        
        keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:5]
        keywords = [word for word, freq in keywords]
        
        result = {
            'summary': summary,
            'title': title,
            'top_image': top_image,
            'original_length': len(text),
            'summary_length': len(summary),
            'compression_ratio': round((len(summary) / len(text)) * 100, 1),
            'sentiment_analysis': sentiment,
            'keywords': keywords
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

if __name__ == '__main__':
    print("Starting News Summarizer API server...")
    print("API will be available at: http://localhost:5003")
    print("Health check: http://localhost:5003/health")
    print("Summarize endpoint: http://localhost:5003/api/summarize")
    
    app.run(debug=True, host='0.0.0.0', port=5003)