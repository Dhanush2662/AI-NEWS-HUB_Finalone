class GeminiService {
  constructor() {
    this.baseUrl = 'http://localhost:3001/api/gemini';
  }

  async summarizeNews(newsContent) {
    try {
      const response = await fetch(`${this.baseUrl}/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newsContent: newsContent
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText };
        }
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate summary`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error summarizing news:', error);
      throw new Error('Failed to generate summary');
    }
  }
}

const geminiServiceInstance = new GeminiService();
export default geminiServiceInstance;