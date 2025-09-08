# AI News Hub - Final Year Project

## 🚀 Project Overview

AI News Hub is a comprehensive news platform that integrates multiple AI technologies to provide intelligent news analysis, summarization, bias detection, and fact-checking capabilities. This project demonstrates the practical application of various AI models and APIs in a real-world news aggregation system.

## 🏗️ Architecture

The project consists of **4 main APIs** and **2 frontend applications**:

### Backend APIs (Python Flask)
1. **NewsHub Frontend API** (Port 3000) - Main React application
2. **NewsFeed API** (Port 3002) - News aggregation service
3. **Bias Checker API** (Port 5002) - AI-powered bias detection
4. **Fact Checker API** (Port 5001) - AI-powered fact verification
5. **Summarizer API** (Port 5003) - AI-powered text summarization

### Frontend Applications (React)
1. **NewsHub** - Main news platform with AI features
2. **NewsFeed** - News aggregation interface

## 🤖 AI Models & Technologies Used

### 1. **Google Gemini AI**
- **Purpose**: Fact-checking and content analysis
- **Implementation**: Used in Fact Checker API via Google Generative AI SDK
- **Features**: Natural language understanding, reasoning, and verification

### 2. **Transformers (Hugging Face)**
- **Purpose**: Bias detection in news articles
- **Implementation**: Used in Bias Checker API
- **Features**: Pre-trained language models for sentiment and bias analysis

### 3. **NLTK (Natural Language Toolkit)**
- **Purpose**: Text processing and summarization
- **Implementation**: Used in Summarizer API
- **Features**: Sentence tokenization, stopword removal, text analysis

### 4. **TextBlob**
- **Purpose**: Sentiment analysis
- **Implementation**: Used in Summarizer API for sentiment scoring
- **Features**: Polarity and subjectivity analysis

### 5. **Rule-Based AI Systems**
- **Purpose**: Enhanced bias detection
- **Implementation**: Custom keyword-based classification
- **Features**: Political bias detection using curated keyword sets

## 📊 API Endpoints

### Summarizer API (Port 5003)
- `POST /api/summarize` - Summarize text or URL
- `POST /api/summarize/text` - Text-only summarization
- `POST /api/summarize/url` - URL-based summarization
- `GET /health` - Health check

### Bias Checker API (Port 5002)
- `POST /api/bias/check` - Check text for bias
- `POST /api/bias/check-url` - Check URL content for bias
- `GET /api/model/status` - Model status
- `GET /health` - Health check

### Fact Checker API (Port 5001)
- `POST /api/fact-check` - Verify claims and facts
- `GET /health` - Health check

### NewsFeed API (Port 3002)
- News aggregation and filtering endpoints

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern UI framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Infinite Scroll** - Infinite scrolling components

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Python 3.x** - Core programming language

### AI/ML Libraries
- **@google/generative-ai** - Google Gemini integration
- **transformers** - Hugging Face transformers
- **torch** - PyTorch for deep learning
- **nltk** - Natural language processing
- **textblob** - Text analysis and sentiment
- **newspaper3k** - Article extraction

### Additional Tools
- **Gradio** - ML model interfaces
- **Streamlit** - Data app framework
- **Plotly** - Data visualization
- **Requests** - HTTP library
- **Validators** - Data validation

## 🎯 Key Features

1. **AI-Powered Summarization**
   - Extractive text summarization
   - Keyword extraction
   - Sentiment analysis
   - Compression ratio calculation

2. **Bias Detection**
   - Political bias classification
   - Rule-based and ML-based detection
   - Confidence scoring
   - Keyword highlighting

3. **Fact Checking**
   - AI-powered claim verification
   - Web search integration
   - Source verification
   - Credibility scoring

4. **News Aggregation**
   - Multi-source news feeds
   - Real-time updates
   - Category filtering
   - Infinite scroll interface

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- Git

### Environment Setup
1. Clone the repository
2. Set up environment variables:
   - `GEMINI_API_KEY` - Google Gemini API key
   - `SCRAPINGDOG_API_KEY` - Web scraping API key

### Installation

#### Frontend Setup
```bash
# NewsHub Frontend
cd NewsHub
npm install
npm start

# NewsFeed Frontend
cd NewsFeed
npm install
npm start
```

#### Backend Setup
```bash
# Install Python dependencies for each API
cd Factcheck
pip install -r requirements.txt
python api_server.py

cd Biaschecker/newsmind-bias-classifier
pip install -r requirements.txt
python simple_bias_api.py

cd Newssummarizer
python api_server.py
```

## 🎓 Final Year Project Suitability

### ✅ **Excellent Choice for Final Year Project**

**Reasons:**
1. **Multiple AI Technologies**: Integrates 4+ different AI models and approaches
2. **Real-World Application**: Addresses actual problems in news consumption
3. **Full-Stack Development**: Demonstrates both frontend and backend skills
4. **Scalable Architecture**: Microservices-based design
5. **Industry Relevance**: Tackles misinformation and bias in media
6. **Technical Complexity**: Appropriate level for final year demonstration

### 📈 **Project Complexity Score: 9/10**
- **AI Integration**: Advanced (Multiple models)
- **System Architecture**: Complex (5 APIs + 2 frontends)
- **Real-world Impact**: High (News analysis and verification)
- **Technical Skills**: Full-stack + AI/ML

## 🔧 Development Team
- **Developer**: Dhanush
- **Project Type**: Final Year Capstone Project
- **Domain**: AI/ML + Web Development

## 📝 License
This project is developed for educational purposes as part of a final year project.

---

**Note**: This project successfully demonstrates the integration of multiple AI technologies in a practical news platform, making it an excellent showcase for final year academic requirements.
