@echo off
echo ========================================
echo AI NEWS HUB - VS CODE DEMO SETUP
echo ========================================
echo.
echo This script will help you prepare for the demonstration
echo.

echo 1. Opening VS Code in project directory...
code .

echo.
echo 2. Project is ready for demonstration!
echo.
echo NEXT STEPS FOR MANUAL DEMO:
echo ========================================
echo 1. Open 5 terminals in VS Code
echo 2. Run these commands in separate terminals:
echo.
echo Terminal 1: cd Factcheck && python api_server.py
echo Terminal 2: cd Biaschecker && python simple_bias_api.py  
echo Terminal 3: cd Newssummarizer && python api_server.py
echo Terminal 4: cd NewsFeed && node server.js
echo Terminal 5: cd NewsHub && npm start
echo.
echo 3. Test APIs using Thunder Client extension
echo 4. Demo frontend at http://localhost:3000
echo.
echo ========================================
echo SAMPLE TEST DATA:
echo ========================================
echo.
echo For Summarizer:
echo "Artificial Intelligence is revolutionizing the way we process and analyze news content. Machine learning algorithms can now detect bias, verify facts, and generate summaries automatically."
echo.
echo For Bias Checker:
echo "The progressive policies implemented by the current administration have significantly improved social justice and equality in our society."
echo.
echo For Fact Checker:
echo "The Earth is flat and NASA has been hiding this truth from the public."
echo.
echo ========================================
echo Ready for presentation to sir!
echo ========================================
pause