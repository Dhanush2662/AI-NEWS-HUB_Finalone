# 🚀 AI News Hub - Current Service Status

## ✅ Successfully Running Services

### 1. News Summarizer API (Port 5000)
- **Status**: ✅ Running
- **Terminal**: 5
- **URL**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **API Endpoint**: http://localhost:5000/api/summarize

### 2. Fact Checker API (Port 5001)
- **Status**: ✅ Running
- **Terminal**: 7
- **URL**: http://localhost:5001
- **Health Check**: http://localhost:5001/health
- **API Endpoint**: http://localhost:5001/api/fact-check

### 3. Bias Checker API (Port 5002)
- **Status**: ✅ Running
- **Terminal**: 8
- **URL**: http://localhost:5002
- **Health Check**: http://localhost:5002/health
- **API Endpoints**: 
  - POST /api/bias/check
  - POST /api/bias/check-url
  - GET /api/model/status

### 4. NewsFeed API (Port 3003)
- **Status**: ✅ Running
- **Terminal**: 9
- **URL**: http://localhost:3003
- **Health Check**: http://localhost:3003/health
- **API Endpoint**: http://localhost:3003/api/news

### 5. React Frontend (NewsHub)
- **Status**: 🔄 Starting (Compiling...)
- **Terminal**: 6
- **Expected URL**: http://localhost:3000
- **Directory**: D:\Capstoneprojectai\Newsapp\NewsHub

## 🎯 Complete VS Code Setup Commands

### Step 1: Open VS Code in Project Directory
```bash
code D:\Capstoneprojectai\Newsapp
```

### Step 2: Open 5 Terminals in VS Code

**Terminal 1 - News Summarizer API:**
```bash
cd Newssummarizer
python api_server.py
```

**Terminal 2 - Fact Checker API:**
```bash
cd Factcheck
python api_server.py
```

**Terminal 3 - Bias Checker API:**
```bash
cd Biaschecker
python simple_bias_api.py
```

**Terminal 4 - NewsFeed API:**
```bash
cd NewsFeed
$env:PORT=3003; node server.js
```

**Terminal 5 - React Frontend:**
```bash
cd NewsHub
npm start
```

## 🧪 API Testing Commands (Use in VS Code Terminal)

### Test News Summarizer:
```bash
curl -X POST http://localhost:5000/api/summarize -H "Content-Type: application/json" -d '{"text":"This is a sample news article to test summarization functionality."}'
```

### Test Fact Checker:
```bash
curl -X POST http://localhost:5001/api/fact-check -H "Content-Type: application/json" -d '{"claim":"The sky is blue"}'
```

### Test Bias Checker:
```bash
curl -X POST http://localhost:5002/api/bias/check -H "Content-Type: application/json" -d '{"text":"This is a neutral news article"}'
```

### Test NewsFeed:
```bash
curl http://localhost:3003/api/news?country=us&category=technology
```

## 🌐 Access URLs (Once All Services Are Running)

- **Main Application**: http://localhost:3000
- **News Summarizer**: http://localhost:5000
- **Fact Checker**: http://localhost:5001
- **Bias Checker**: http://localhost:5002
- **NewsFeed API**: http://localhost:3003

## 🔧 Troubleshooting

### If React App Doesn't Start:
1. Ensure you're in the NewsHub directory
2. Run `npm install` if dependencies are missing
3. Check if port 3000 is available

### If APIs Don't Respond:
1. Check if Python virtual environment is activated
2. Install requirements: `pip install -r requirements.txt`
3. Verify ports are not in use by other applications

### Common Port Issues:
- If port conflicts occur, modify the port numbers in respective config files
- Use `netstat -ano | findstr :PORT_NUMBER` to check port usage

## 📊 Project Architecture

```
AI News Hub
├── Frontend (React) - Port 3000
├── News Summarizer API (Python/Flask) - Port 5000
├── Fact Checker API (Python/Flask) - Port 5001
├── Bias Checker API (Python/Flask) - Port 5002
└── NewsFeed API (Node.js/Express) - Port 3003
```

## 🎯 Demonstration Flow

1. **Show VS Code Setup**: Open project in VS Code with 5 terminals
2. **Start Services**: Run each service in separate terminals
3. **Test APIs**: Use curl commands or Postman to test each API
4. **Show Frontend**: Access React app at http://localhost:3000
5. **Demonstrate Features**: Show news fetching, summarization, fact-checking, and bias detection

---
*Last Updated: $(Get-Date)*
*All services are configured and ready for demonstration!*