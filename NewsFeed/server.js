const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint for news
app.get('/api/news', async (req, res) => {
  const {
    country = 'us',
    category = 'general',
    page = 1,
    pageSize = 8,
  } = req.query;

  const apiKey = '11e2c80f95584684a9a6f1849b8c4c48'; // NewsAPI key

  const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'error') {
      return res.status(400).json({ error: data.message });
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Gemini API proxy endpoint
app.post('/api/gemini/summarize', async (req, res) => {
  const { newsContent } = req.body;
  
  if (!newsContent) {
    return res.status(400).json({ error: 'News content is required' });
  }
  
  const GEMINI_API_KEY = 'AIzaSyB7p9oN5NVm30Aqhpn4f0hCccsz7NIlOa4';
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const prompt = `
Please analyze the following news article and provide a concise summary with key points:

Article: ${newsContent}

Please provide:
1. A brief 2-3 sentence summary
2. 3-5 key points in bullet format
3. Main entities involved (people, organizations, locations)

Format your response as JSON with the following structure:
{
  "summary": "Brief summary here",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "entities": ["Entity 1", "Entity 2", "Entity 3"]
}
`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return res.status(response.status).json({ error: 'Failed to generate summary' });
    }
    
    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      return res.status(500).json({ error: 'No response from Gemini API' });
    }
    
    // Try to parse JSON response
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResult = JSON.parse(jsonMatch[0]);
        res.status(200).json(parsedResult);
      } else {
        // Fallback: return raw text
        res.status(200).json({
          summary: generatedText,
          keyPoints: [],
          entities: []
        });
      }
    } catch (parseError) {
      // Fallback: return raw text
      res.status(200).json({
        summary: generatedText,
        keyPoints: [],
        entities: []
      });
    }
    
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Bias checking endpoints
app.post('/api/bias/check', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const response = await fetch('http://localhost:5002/api/bias/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.error || 'Failed to check bias' });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error checking bias:', error);
    res.status(500).json({ error: 'Failed to check bias', message: error.message });
  }
});

app.post('/api/bias/check-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const response = await fetch('http://localhost:5002/api/bias/check-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.error || 'Failed to check bias from URL' });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error checking bias from URL:', error);
    res.status(500).json({ error: 'Failed to check bias from URL', message: error.message });
  }
});

// Bias model status endpoint
app.get('/api/bias/model/status', async (req, res) => {
  try {
    const response = await fetch('http://localhost:5002/api/model/status');
    
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.error || 'Failed to get bias model status' });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error getting bias model status:', error);
    res.status(500).json({ error: 'Failed to get bias model status', message: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});