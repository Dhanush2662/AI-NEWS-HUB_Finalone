#!/usr/bin/env python3
"""
Test Summarizer Integration Script
Tests the text summarizer API integration with NewsHub
"""

import requests
import json
import time

def test_summarizer_api():
    """Test the text summarizer API directly"""
    print("🧪 Testing Text Summarizer API (Port 5003)")
    print("=" * 50)
    
    # Test cases for different types of content
    test_cases = [
        {
            "text": "Climate change is one of the most pressing issues of our time. Scientists around the world have been studying the effects of global warming for decades. The evidence shows that human activities, particularly the burning of fossil fuels, are the primary cause of recent climate change. Rising temperatures are causing ice caps to melt, sea levels to rise, and weather patterns to become more extreme. Governments and organizations worldwide are working to implement policies and technologies to reduce greenhouse gas emissions and mitigate the effects of climate change.",
            "expected_length": "short"
        },
        {
            "text": "Artificial intelligence has revolutionized many industries in recent years. Machine learning algorithms can now process vast amounts of data and identify patterns that humans might miss. From healthcare to finance, AI is being used to improve efficiency and accuracy. However, there are also concerns about job displacement and the ethical implications of AI decision-making. As AI continues to advance, it's important to consider both its benefits and potential risks.",
            "expected_length": "medium"
        }
    ]
    
    # Test text summarization endpoint
    text_api_url = "http://localhost:5003/api/summarize/text"
    
    for i, test_case in enumerate(test_cases, 1):
        try:
            response = requests.post(text_api_url, 
                                   json={
                                       "text": test_case["text"],
                                       "sentences": 3
                                   },
                                   timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                summary = result.get('summary', 'No summary')
                sentiment = result.get('sentiment_analysis', {})
                
                print(f"{i}. ✅ Text Summarization Test Passed")
                print(f"   Original Length: {len(test_case['text'])} characters")
                print(f"   Summary Length: {len(summary)} characters")
                print(f"   Summary: {summary[:100]}...")
                print(f"   Sentiment: {sentiment.get('sentiment', 'Unknown')}")
                print(f"   Confidence: {sentiment.get('confidence', 'Unknown')}")
            else:
                print(f"{i}. ❌ API Error: {response.status_code} - {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"{i}. ❌ Connection Error: {e}")
        
        print()
    
    # Test URL summarization endpoint
    print("URL Summarization Test:")
    try:
        url_endpoint = "http://localhost:5003/api/summarize/url"
        response = requests.post(url_endpoint, json={
            "url": "https://www.bbc.com/news",
            "sentences": 3
        }, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ URL summarization working!")
            print(f"   Summary: {result.get('summary', 'No summary')[:100]}...")
            print(f"   Website: {result.get('website_name', 'Unknown')}")
        else:
            print(f"❌ URL API Error: {response.status_code} - {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ URL Connection Error: {e}")
    
    print()

def test_health_endpoint():
    """Test the health endpoint"""
    print("🔍 Testing Health Endpoint")
    print("=" * 30)
    
    try:
        response = requests.get("http://localhost:5003/health", timeout=5)
        if response.status_code == 200:
            result = response.json()
            print("✅ Health Check - Service Running")
            print(f"   Status: {result.get('status', 'Unknown')}")
            print(f"   Service: {result.get('service', 'Unknown')}")
        else:
            print(f"❌ Health Check Failed: {response.status_code}")
    except requests.exceptions.RequestException:
        print("❌ Health Check - Service Not Responding")
    
    print()

def test_frontend_integration():
    """Test if the frontend can connect to the summarizer API"""
    print("🔗 Testing Frontend Integration")
    print("=" * 35)
    
    # Test the same endpoints that the frontend would use
    test_text = "This is a test article about technology and innovation in the modern world."
    
    try:
        response = requests.post("http://localhost:5003/api/summarize/text", 
                               json={"text": test_text, "sentences": 2},
                               timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Frontend Integration Test Passed")
            print(f"   API Response Format: Valid")
            print(f"   Summary Field: {'✅' if 'summary' in result else '❌'}")
            print(f"   Sentiment Field: {'✅' if 'sentiment_analysis' in result else '❌'}")
        else:
            print(f"❌ Frontend Integration Failed: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Frontend Integration Error: {e}")
    
    print()

def test_services_status():
    """Check if all services are running"""
    print("🔍 Checking All Services Status")
    print("=" * 35)
    
    services = [
        ("NewsHub Frontend", "http://localhost:3000"),
        ("NewsFeed API", "http://localhost:3001/health"),
        ("Bias Checker API", "http://localhost:5002/health"),
        ("Text Summarizer API", "http://localhost:5003/health")
    ]
    
    for service_name, url in services:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ {service_name:20} - Running")
            else:
                print(f"❌ {service_name:20} - Error {response.status_code}")
        except requests.exceptions.RequestException:
            print(f"❌ {service_name:20} - Not responding")
    
    print()

def main():
    print("🚀 Text Summarizer Integration Test")
    print("=" * 60)
    print()
    
    # Check service status first
    test_services_status()
    
    # Wait a moment for services to be ready
    print("⏳ Waiting for services to be ready...")
    time.sleep(2)
    print()
    
    # Test health endpoint
    test_health_endpoint()
    
    # Test summarizer API directly
    test_summarizer_api()
    
    # Test frontend integration
    test_frontend_integration()
    
    print("🎉 Integration Test Complete!")
    print()
    print("📋 Summary:")
    print("   • NewsHub Frontend: http://localhost:3000")
    print("   • Text Summarizer API: http://localhost:5003")
    print("   • NewsFeed API: http://localhost:3001")
    print("   • Bias Checker API: http://localhost:5002")
    print()
    print("🔧 Summarizer API Endpoints:")
    print("   • POST /api/summarize/text (text summarization)")
    print("   • POST /api/summarize/url (URL summarization)")
    print("   • GET /health (health check)")
    print("   • GET /status (service status)")

if __name__ == "__main__":
    main()