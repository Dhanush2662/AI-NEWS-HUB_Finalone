#!/usr/bin/env python3
"""
Test Integration Script
Demonstrates the news bias checker integration
"""

import requests
import json
import time

def test_bias_api():
    """Test the bias checker API directly"""
    print("🧪 Testing Bias Checker API (Port 5002)")
    print("=" * 50)
    
    # Test cases with different political leanings
    test_cases = [
        {
            "text": "Progressive policies like universal healthcare and climate action are essential for social justice and equality.",
            "expected": "Left"
        },
        {
            "text": "Conservative values, lower taxes, and free market principles drive economic growth and prosperity.",
            "expected": "Right"
        },
        {
            "text": "The city council approved the annual budget after reviewing public input and financial projections.",
            "expected": "Center"
        }
    ]
    
    bias_api_url = "http://localhost:5002/api/bias/check"
    
    for i, test_case in enumerate(test_cases, 1):
        try:
            response = requests.post(bias_api_url, 
                                   json={"text": test_case["text"]},
                                   timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                political_bias = result.get('political_bias', 'Unknown')
                confidence = result.get('confidence', '0%')
                
                # Extract just the bias direction (Left/Center/Right)
                bias_direction = political_bias.split(' –')[0] if ' –' in political_bias else political_bias
                
                status = "✅" if bias_direction == test_case["expected"] else "❌"
                
                print(f"{i}. {status} Expected: {test_case['expected']:>6} | Got: {bias_direction:>6} ({confidence})")
                print(f"   Text: {test_case['text'][:60]}...")
                print(f"   Full Result: {political_bias}")
            else:
                print(f"{i}. ❌ API Error: {response.status_code} - {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"{i}. ❌ Connection Error: {e}")
        
        print()
    
    # Test 2: URL-based bias check
    print("URL Bias Check Test:")
    try:
        url_endpoint = "http://localhost:5002/api/bias/check-url"
        response = requests.post(url_endpoint, json={
            "url": "https://www.bbc.com/news"
        }, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ URL Bias Check: {result.get('bias_label', 'Unknown')} (Score: {result.get('bias_score', 'N/A')})")
        else:
            print(f"❌ API Error: {response.status_code} - {response.text[:100]}")
    except Exception as e:
        print(f"❌ Connection Error: {str(e)}")
    
    print()
    
    # Test 3: Invalid request
    print("Error Handling Test:")
    try:
        response = requests.post(bias_api_url, json={}, timeout=10)
        
        if response.status_code == 400:
            print("✅ Error Handling: Correctly rejected invalid request")
        else:
            result = response.json() if response.status_code == 200 else response.text
            print(f"❌ API Error: {response.status_code} - {str(result)[:100]}")
    except Exception as e:
        print(f"❌ Connection Error: {str(e)}")
    
    print()

def test_newsfeed_integration():
    """Test the NewsFeed server integration"""
    print("🔗 Testing NewsFeed Integration (Port 3001)")
    print("=" * 50)
    
    newsfeed_api_url = "http://localhost:3001/api/bias/check"
    
    test_text = "Climate change policies require immediate government intervention and regulation of carbon emissions."
    
    try:
        response = requests.post(newsfeed_api_url, 
                               json={"text": test_text},
                               timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ NewsFeed integration working!")
            print(f"   Political Bias: {result.get('political_bias', 'Unknown')}")
            print(f"   Confidence: {result.get('confidence', '0%')}")
            print(f"   Color: {result.get('color', 'Unknown')}")
        else:
            print(f"❌ NewsFeed API Error: {response.status_code} - {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ NewsFeed Connection Error: {e}")
    
    print()

def test_services_status():
    """Check if all services are running"""
    print("🔍 Checking Service Status")
    print("=" * 30)
    
    services = [
        ("Bias Checker API", "http://localhost:5002/health"),
        ("NewsFeed API", "http://localhost:3001/health"),
        ("NewsHub Frontend", "http://localhost:3000")
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

def main():
    print("🚀 News Bias Checker Integration Test")
    print("=" * 60)
    print()
    
    # Check service status first
    test_services_status()
    print()
    
    # Wait a moment for services to be ready
    print("⏳ Waiting for services to be ready...")
    time.sleep(2)
    print()
    
    # Test bias API directly
    test_bias_api()
    
    # Test NewsFeed integration
    test_newsfeed_integration()
    
    print("🎉 Integration Test Complete!")
    print()
    print("📋 Summary:")
    print("   • Bias Checker API: http://localhost:5002")
    print("   • NewsFeed API: http://localhost:3001")
    print("   • NewsHub Frontend: http://localhost:3000")
    print()
    print("🔧 API Endpoints:")
    print("   • POST /api/bias/check (text)")
    print("   • POST /api/bias/check-url (url)")
    print("   • POST /api/bias/check (via NewsFeed)")

if __name__ == "__main__":
    main()