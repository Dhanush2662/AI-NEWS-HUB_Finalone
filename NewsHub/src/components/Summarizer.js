import React, { useState } from 'react';
import axios from 'axios';
import { summarizerAPI } from '../services/api';

const Summarizer = () => {
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('text');


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim() && !inputUrl.trim()) {
      setError('Please enter some text or provide a URL to summarize.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let result;
      const sentences = 5; // Fixed to 5 sentences like the original project
      
      if (activeTab === 'text') {
        result = await summarizerAPI.summarizeText(inputText.trim(), sentences);
      } else {
        result = await summarizerAPI.summarizeUrl(inputUrl.trim(), sentences);
      }
      
      // Transform the result to match the expected format
      const transformedResult = {
        summary: {
          extractive: result.summary,
          abstractive: result.summary,
          bullet: result.summary.split('. ').filter(s => s.trim()).map(s => `• ${s.trim()}`)
        },
        sentiment: {
          label: result.sentiment_analysis?.sentiment || 'Neutral',
          confidence: result.sentiment_analysis?.confidence || 0,
          polarity: result.sentiment_analysis?.polarity || 0
        },
        key_topics: result.keywords || [],
        readability: {
          score: Math.round((result.compression_ratio || 50) / 10),
          level: result.compression_ratio > 70 ? 'High' : result.compression_ratio > 40 ? 'Medium' : 'Low',
          complexity: result.sentiment_analysis?.objectivity === 'Mixed' ? 'Complex' : 'Simple'
        },
        entities: result.keywords ? result.keywords.map((keyword, index) => ({
          entity: keyword,
          type: 'KEYWORD',
          frequency: Math.floor(Math.random() * 5) + 1
        })) : [],
        statistics: {
          original_length: result.original_length || inputText.length,
          summary_length: result.summary_length || result.summary.length,
          compression_ratio: result.compression_ratio || 50
        }
      };
      
      setResults(transformedResult);
    } catch (err) {
      setError('Failed to generate summary. Please try again later.');
      console.error('Summarization error:', err);
    } finally {
      setLoading(false);
    }
  };



  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'success';
      case 'negative': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="page-section">
      <div className="container">
        <h1 className="section-title">AI News Summarizer</h1>
        <p className="text-center text-white opacity-75 mb-5">
          Transform lengthy articles into concise, informative summaries using advanced AI technology
        </p>

        {/* Input Form */}
        <div className="form-container">
          <div className="row">
            <div className="col-12">
              {/* Tab Navigation */}
              <ul className="nav nav-pills mb-4 justify-content-center" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'text' ? 'active' : ''}`}
                    onClick={() => setActiveTab('text')}
                    type="button"
                  >
                    <i className="fas fa-edit me-2"></i>
                    Text Input
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'url' ? 'active' : ''}`}
                    onClick={() => setActiveTab('url')}
                    type="button"
                  >
                    <i className="fas fa-link me-2"></i>
                    URL Input
                  </button>
                </li>
              </ul>

              <form onSubmit={handleSubmit}>
                {/* Text Input Tab */}
                {activeTab === 'text' && (
                  <div className="mb-4">
                    <label htmlFor="textInput" className="form-label">
                      <i className="fas fa-file-text me-2"></i>
                      Enter text to summarize
                    </label>
                    <textarea
                      className="form-control"
                      id="textInput"
                      rows="8"
                      placeholder="Paste the article, document, or long text you want to summarize..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    ></textarea>
                    <div className="form-text">
                      Enter any long-form content like news articles, research papers, or documents.
                    </div>
                  </div>
                )}

                {/* URL Input Tab */}
                {activeTab === 'url' && (
                  <div className="mb-4">
                    <label htmlFor="urlInput" className="form-label">
                      <i className="fas fa-globe me-2"></i>
                      Enter article URL to summarize
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="urlInput"
                      placeholder="https://example.com/article"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                    />
                    <div className="form-text">
                      Provide a URL to automatically extract and summarize the content.
                    </div>
                  </div>
                )}



                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Generating Summary...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-compress-alt me-2"></i>
                        Generate Summary
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="results-container fade-in">
            <h2 className="mb-4">
              <i className="fas fa-file-alt me-2"></i>
              Summary Results
            </h2>



            {/* Summary Content */}
            <div className="mb-4">
              <h3 className="mb-3">
                <i className="fas fa-paragraph me-2"></i>
                Generated Summary
              </h3>
              <div className="result-item">
                <p className="result-content mb-0 lead">{results.summary.extractive}</p>
              </div>
            </div>

            {/* Sentiment */}
            <div className="mb-4">
              <h3 className="mb-3">
                <i className="fas fa-smile me-2"></i>
                Sentiment Analysis
              </h3>
              <div className="result-item">
                <p className="mb-0">
                  <span className={`badge bg-${getSentimentColor(results.sentiment.label)} fs-6`}>
                    {results.sentiment.label}
                  </span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center">
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  setResults(null);
                  setInputText('');
                  setInputUrl('');
                }}
              >
                <i className="fas fa-redo me-2"></i>
                Summarize Another
              </button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default Summarizer;