import React, { useState, useEffect } from 'react';
import { biasCheckerAPI, healthAPI } from '../services/api';
import './BiasChecker.css';

const BiasChecker = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleAnalyze = async () => {
    if (activeTab === 'text' && !inputText.trim()) {
      setError('Please enter some text to analyze');
      return;
    }
    if (activeTab === 'url' && !inputUrl.trim()) {
      setError('Please enter a URL to analyze');
      return;
    }
    
    setError(null);
    setLoading(true);
    setResult(null);
    
    try {
      let response;
      
      if (activeTab === 'text') {
        response = await biasCheckerAPI.checkBias(inputText);
      } else {
        response = await biasCheckerAPI.checkBiasUrl(inputUrl);
      }
      
      setResult(response);
    } catch (err) {
      console.error('Error analyzing content:', err);
      setError('Failed to analyze content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBiasColor = (bias) => {
    const colors = {
      'Left': '#ff4444',
      'Left-Center': '#ff8844',
      'Least Biased': '#44ff44',
      'Right-Center': '#4488ff',
      'Right': '#8844ff'
    };
    return colors[bias] || '#666';
  };

  return (
    <div className="bias-checker">
      <div className="bias-checker-header">
        <h1>AI Bias Detector</h1>
        <p>Analyze political bias in news articles and text content</p>
        

      </div>

      <div className="bias-checker-tabs">
        <button 
          className={`tab ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          Text Analysis
        </button>
        <button 
          className={`tab ${activeTab === 'url' ? 'active' : ''}`}
          onClick={() => setActiveTab('url')}
        >
          URL Analysis
        </button>
      </div>

      <div className="bias-checker-content">
        {activeTab === 'text' ? (
          <div className="input-section">
            <label>Enter text to analyze:</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your news article or text content here..."
              rows={8}
            />
          </div>
        ) : (
          <div className="input-section">
            <label>Enter article URL:</label>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://example.com/news-article"
            />
          </div>
        )}

        <button 
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Bias'}
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {result && (
          <div className="bias-results">
            <h3>Political Bias Classification</h3>
            <div className="result-card">
              <div className="political-bias-display">
                <div className="classification-header">
                  <span className="color-indicator">{result.color_indicator}</span>
                  <span className="political-bias">{result.political_bias}</span>
                </div>
                <div className="confidence-display">
                  <span className="confidence-label">Confidence:</span>
                  <span className="confidence-value">{result.confidence}</span>
                </div>
              </div>
              
              {result.method && (
                <div className="method-display">
                  <span className="method-label">Detection Method:</span>
                  <span className="method-value">{result.method}</span>
                </div>
              )}
              
              {result.keywords && result.keywords.length > 0 && (
                <div className="keywords-display">
                  <span className="keywords-label">Bias Keywords:</span>
                  <ul className="keywords-list">
                    {result.keywords.map((keyword, index) => (
                      <li key={index}>{keyword}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.explanation && (
                <div className="explanation-display">
                  <span className="explanation-label">Explanation:</span>
                  <p className="explanation-text">{result.explanation}</p>
                </div>
              )}
              
              <div className="legend">
                <h4>Legend</h4>
                <div className="legend-items">
                  <div className="legend-item">
                    <span className="legend-indicator">🟥</span>
                    <span className="legend-text">Left – Liberal / Progressive</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-indicator">⚪</span>
                    <span className="legend-text">Center – Neutral / Balanced</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-indicator">🟦</span>
                    <span className="legend-text">Right – Conservative</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiasChecker;