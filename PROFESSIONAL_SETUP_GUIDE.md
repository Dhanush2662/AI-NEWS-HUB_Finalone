# 🚀 AI News Hub - Professional VS Code Setup Guide
## Step-by-Step Commands for Complete System Launch

---

## 📋 **CURRENT STATUS CHECK**

✅ **Already Running:**
- Summarizer API (Port 5003) - Terminal 5 ✓

❌ **Need to Start:**
- Fact Checker API (Port 5001)
- Bias Checker API (Port 5002) 
- NewsFeed API (Port 3002)
- NewsHub Frontend (Port 3000)

---

## 🎯 **PROFESSIONAL SETUP SEQUENCE**

### **Step 1: Open VS Code Properly**
```bash
# Navigate to project root
cd d:\Capstoneprojectai\Newsapp

# Open VS Code in project directory
code .
```

### **Step 2: Terminal Setup (4 Additional Terminals Needed)**

**In VS Code:**
1. Press `Ctrl + Shift + `` (backtick) to open terminal
2. Click the `+` icon 4 times to create 4 new terminals
3. You should have terminals 1, 2, 3, 4, 6 (Terminal 5 already running)

---

## 🔧 **SERVICE STARTUP COMMANDS**

### **Terminal 1 - Fact Checker API (Port 5001)**
```bash
# Navigate to Fact Checker directory
cd Factcheck

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Start the Fact Checker API
python api_server.py
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5001
 * Debug mode: on
```

### **Terminal 2 - Bias Checker API (Port 5002)**
```bash
# Navigate to Bias Checker directory
cd Biaschecker

# Install dependencies (if needed)
pip install flask flask-cors transformers torch textblob

# Start the Bias Checker API
python simple_bias_api.py
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5002
 * Debug mode: on
```

### **Terminal 3 - NewsFeed API (Port 3002)**
```bash
# Navigate to NewsFeed directory
cd NewsFeed

# Install Node.js dependencies
npm install

# Start the NewsFeed server
node server.js
```

**Expected Output:**
```
Server running on port 3002
News API service started successfully
```

### **Terminal 4 - NewsHub Frontend (Port 3000)**
```bash
# Navigate to NewsHub directory
cd NewsHub

# Install React dependencies
npm install

# Start the React development server
npm start
```

**Expected Output:**
```
webpack compiled with 0 errors
Local:            http://localhost:3000
On Your Network:  http://192.168.x.x:3000
```

---

## 🧪 **TESTING YOUR APIS (Thunder Client)**

### **Install Thunder Client Extension**
1. In VS Code, press `Ctrl + Shift + X`
2. Search for "Thunder Client"
3. Install the extension
4. Click the Thunder Client icon in the sidebar

### **Test 1: Summarizer API (Already Running)**
```json
POST http://localhost:5003/api/summarize/text
Content-Type: application/json

{
    "text": "Artificial Intelligence is revolutionizing the way we process and analyze news content. Machine learning algorithms can now detect bias, verify facts, and generate summaries automatically. This technology helps users make informed decisions about the information they consume."
}
```

### **Test 2: Bias Checker API**
```json
POST http://localhost:5002/api/bias/check
Content-Type: application/json

{
    "text": "The progressive policies implemented by the current administration have significantly improved social justice and equality in our society."
}
```

### **Test 3: Fact Checker API**
```json
POST http://localhost:5001/api/fact-check
Content-Type: application/json

{
    "text": "The Earth is flat and NASA has been hiding this truth from the public."
}
```

### **Test 4: NewsFeed API**
```json
GET http://localhost:3002/api/news
```

---

## 🚨 **COMMON ERRORS & SOLUTIONS**

### **Error 1: Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5001
```
**Solution:**
```bash
# Find process using the port
netstat -ano | findstr :5001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### **Error 2: Module Not Found**
```
ModuleNotFoundError: No module named 'flask'
```
**Solution:**
```bash
# Install missing Python packages
pip install flask flask-cors requests python-dotenv
pip install nltk textblob newspaper3k transformers torch
```

### **Error 3: Node.js Dependencies Missing**
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
# In the specific directory (NewsFeed or NewsHub)
npm install

# If still issues, clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **Error 4: API Key Missing**
```
Error: API key not found
```
**Solution:**
```bash
# Create .env file in Factcheck directory
echo GEMINI_API_KEY=your_api_key_here > Factcheck\.env
echo SCRAPINGDOG_API_KEY=your_api_key_here >> Factcheck\.env

# Create .env file in NewsHub directory
echo REACT_APP_GEMINI_API_KEY=your_api_key_here > NewsHub\.env
```

### **Error 5: CORS Issues**
```
Access to fetch at 'http://localhost:5001' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution:**
- This should be handled automatically by Flask-CORS
- If issues persist, restart the API servers

---

## 🔍 **HEALTH CHECK COMMANDS**

### **Check All Services Status**
```bash
# Test all APIs are responding
curl http://localhost:5001/health
curl http://localhost:5002/health  
curl http://localhost:5003/health
curl http://localhost:3002/api/news
```

### **Check Ports in Use**
```bash
# Windows PowerShell
netstat -ano | findstr :5001
netstat -ano | findstr :5002
netstat -ano | findstr :5003
netstat -ano | findstr :3000
netstat -ano | findstr :3002
```

---

## 🎯 **PROFESSIONAL DEMO SEQUENCE**

### **1. Show Project Structure (30 seconds)**
- Open VS Code Explorer
- Expand all folders
- Highlight key files: `api_server.py`, `package.json`, `README.md`

### **2. Start Services (2 minutes)**
- Follow the terminal commands above
- Show each service starting successfully
- Verify all ports are active

### **3. API Testing (2 minutes)**
- Use Thunder Client to test each API
- Show real responses with data
- Highlight AI processing results

### **4. Frontend Demo (2 minutes)**
- Open http://localhost:3000 in browser
- Test each feature: Summarizer, Bias Checker, Fact Checker
- Show real-time AI processing

### **5. Code Walkthrough (1 minute)**
- Show key AI integration files
- Highlight Google Gemini, NLTK, Transformers usage
- Explain architecture briefly

---

## 📊 **SUCCESS INDICATORS**

✅ **All Services Running:**
- Terminal 1: Fact Checker API (Port 5001) ✓
- Terminal 2: Bias Checker API (Port 5002) ✓  
- Terminal 3: NewsFeed API (Port 3002) ✓
- Terminal 4: NewsHub Frontend (Port 3000) ✓
- Terminal 5: Summarizer API (Port 5003) ✓ (Already running)

✅ **APIs Responding:**
- All health checks return 200 OK
- Thunder Client tests successful
- No CORS errors in browser console

✅ **Frontend Working:**
- React app loads without errors
- All AI features functional
- Real-time processing visible

---

## 🚀 **NEXT STEPS AFTER SETUP**

1. **Test Each Feature Thoroughly**
2. **Prepare Sample Data for Demo**
3. **Practice the Presentation Flow**
4. **Have Backup Plans Ready**
5. **Document Any Issues Encountered**

---

**Follow these commands step by step, and report any errors you encounter. I'll help you troubleshoot each issue professionally!**