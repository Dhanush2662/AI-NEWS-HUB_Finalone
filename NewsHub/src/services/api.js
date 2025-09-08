import axios from 'axios';

// Base URLs for different services
const NEWS_API_BASE = 'http://localhost:3002/api';
const FACTCHECK_API_BASE = 'http://localhost:5001';
const BIAS_CHECKER_API_BASE = 'http://localhost:5002';
const SUMMARIZER_API_BASE = 'http://localhost:5003';

// News Feed API
export const newsAPI = {
  // Main method used by NewsFeed component
  getNews: async (params = {}) => {
    try {
      const response = await axios.get(`${NEWS_API_BASE}/news`, {
        params: params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  // Get latest news
  getLatestNews: async (category = 'general', country = 'us') => {
    try {
      const response = await axios.get(`${NEWS_API_BASE}/news`, {
        params: { category, country }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  // Search news
  searchNews: async (query, sortBy = 'publishedAt') => {
    try {
      const response = await axios.get(`${NEWS_API_BASE}/search`, {
        params: { q: query, sortBy }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  },

  // Get news by category
  getNewsByCategory: async (category) => {
    try {
      const response = await axios.get(`${NEWS_API_BASE}/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching news by category:', error);
      throw error;
    }
  }
};

// Fact Checker API
export const factCheckerAPI = {
  // Check a claim
  checkClaim: async (claim) => {
    try {
      const response = await axios.post(`${FACTCHECK_API_BASE}/api/fact-check`, {
        text: claim
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 2 minutes timeout for fact checking
      });
      return response.data;
    } catch (error) {
      console.error('Error checking claim:', error);
      throw error;
    }
  },

  // Get fact check history
  getHistory: async () => {
    try {
      const response = await axios.get(`${FACTCHECK_API_BASE}/api/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching fact check history:', error);
      throw error;
    }
  }
};

// Bias Checker API
export const biasCheckerAPI = {
  // Check bias in text
  checkBias: async (text) => {
    try {
      const response = await axios.post(`${BIAS_CHECKER_API_BASE}/api/bias/check`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 1 minute timeout
      });
      return response.data;
    } catch (error) {
      console.error('Error checking bias:', error);
      throw error;
    }
  },

  // Check bias from URL
  checkBiasUrl: async (url) => {
    try {
      const response = await axios.post(`${BIAS_CHECKER_API_BASE}/api/bias/check-url`, { url }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 1 minute timeout
      });
      return response.data;
    } catch (error) {
      console.error('Error checking bias from URL:', error);
      throw error;
    }
  },

  // Check bias model status
  checkBiasModelStatus: async () => {
    try {
      const response = await axios.get(`${BIAS_CHECKER_API_BASE}/api/bias/model/status`);
      return response.data;
    } catch (error) {
      console.error('Error checking bias model status:', error);
      return { error: 'Failed to get model status', online: false };
    }
  },

  // Get bias analysis history
  getHistory: async () => {
    try {
      const response = await axios.get(`${BIAS_CHECKER_API_BASE}/api/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bias check history:', error);
      throw error;
    }
  }
};

// Summarizer API
export const summarizerAPI = {
  // Summarize text
  summarizeText: async (text, sentences = 3) => {
    try {
      const response = await axios.post(`${SUMMARIZER_API_BASE}/api/summarize/text`, {
        text: text,
        sentences: sentences
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 1 minute timeout
      });
      return response.data;
    } catch (error) {
      console.error('Error summarizing text:', error);
      throw error;
    }
  },

  // Summarize URL
  summarizeUrl: async (url, sentences = 3) => {
    try {
      const response = await axios.post(`${SUMMARIZER_API_BASE}/api/summarize/url`, {
        url: url,
        sentences: sentences
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 1 minute timeout
      });
      return response.data;
    } catch (error) {
      console.error('Error summarizing URL:', error);
      throw error;
    }
  },

  // Analyze sentiment
  analyzeSentiment: async (text) => {
    try {
      const response = await axios.post(`${SUMMARIZER_API_BASE}/api/analyze/sentiment`, {
        text: text
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await axios.get(`${SUMMARIZER_API_BASE}/health`);
      return response.data;
    } catch (error) {
      console.error('Error checking summarizer health:', error);
      throw error;
    }
  }
};

// Health check for all services
export const healthAPI = {
  checkNewsService: async () => {
    try {
      const response = await axios.get(`${NEWS_API_BASE}/health`);
      return response.data;
    } catch (error) {
      return { status: 'down', error: error.message };
    }
  },

  checkFactCheckService: async () => {
    try {
      const response = await axios.get(`${FACTCHECK_API_BASE}/health`);
      return response.data;
    } catch (error) {
      return { status: 'down', error: error.message };
    }
  },

  checkBiasCheckerService: async () => {
    try {
      const response = await axios.get(`${BIAS_CHECKER_API_BASE}/health`);
      return response.data;
    } catch (error) {
      return { status: 'down', error: error.message };
    }
  },

  checkBiasModelStatus: async () => {
    try {
      const response = await axios.get(`${BIAS_CHECKER_API_BASE}/api/model/status`);
      return response.data;
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  },

  checkSummarizerService: async () => {
    try {
      const response = await axios.get(`${SUMMARIZER_API_BASE}/health`);
      return response.data;
    } catch (error) {
      return { status: 'down', error: error.message };
    }
  }
};

// Utility functions
export const utils = {
  // Format date for display
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Truncate text
  truncateText: (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  // Validate URL
  isValidUrl: (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  },

  // Get confidence color
  getConfidenceColor: (confidence) => {
    if (confidence >= 80) return '#27ae60'; // Green
    if (confidence >= 60) return '#f39c12'; // Orange
    return '#e74c3c'; // Red
  },

  // Get bias color
  getBiasColor: (bias) => {
    const colors = {
      'Left': '#e74c3c',
      'Left-Center': '#f39c12',
      'Least Biased': '#27ae60',
      'Right-Center': '#3498db',
      'Right': '#9b59b6'
    };
    return colors[bias] || '#95a5a6';
  }
};

// Error handling utility
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data.message || 'Server error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'No response from server. Please check if the service is running.',
      status: 0,
      data: null
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
      data: null
    };
  }
};

// Default export with all APIs
const api = {
  news: newsAPI,
  factChecker: factCheckerAPI,
  biasChecker: biasCheckerAPI,
  summarizer: summarizerAPI,
  health: healthAPI,
  utils,
  handleApiError
};

export default api;