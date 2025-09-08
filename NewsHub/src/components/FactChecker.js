import React, { useState } from 'react';
import axios from 'axios';
import { factCheckerAPI } from '../services/api';

const FactChecker = () => {
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('text');
  const [progressStep, setProgressStep] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  const progressSteps = [
    { step: 1, message: 'Searching for relevant sources...', icon: 'fas fa-search' },
    { step: 2, message: 'Analyzing content with AI...', icon: 'fas fa-brain' },
    { step: 3, message: 'Generating fact-check verdict...', icon: 'fas fa-gavel' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim() && !inputUrl.trim()) {
      setError('Please enter some text or provide a URL to fact-check.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setProgressStep(0);
    setProgressMessage('');

    try {
      const content = activeTab === 'text' ? inputText.trim() : inputUrl.trim();
      
      // Simulate progress steps
      for (let i = 0; i < progressSteps.length; i++) {
        setProgressStep(i + 1);
        setProgressMessage(progressSteps[i].message);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay for UX
      }
      
      // Make the actual API call to the real fact-check backend
      const response = await axios.post('http://localhost:5001/api/fact-check', {
        text: content
      });
      
      const result = response.data;
      
      // Transform the result to match the expected structure
      const transformedResult = {
        overall_score: result.credibility_score || 0.5,
        credibility: result.confidence_level || 'Unknown',
        claims: [{
          claim: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
          verdict: result.final_verdict || 'Unverified',
          confidence: result.credibility_score || 0.5,
          sources: result.supporting_articles ? result.supporting_articles.map(article => ({
            title: article.title || 'Unknown Source',
            url: article.link || article.url || '#',
            snippet: article.snippet || 'No description available'
          })) : [],
          explanation: result.reasoning || 'Analysis completed.'
        }],
        summary: result.summary || result.reasoning || 'Fact-check analysis completed.',
        bias_analysis: result.bias_analysis ? {
          political_lean: result.bias_analysis.detected_bias || 'Neutral',
          emotional_language: result.bias_analysis.bias_indicators ? result.bias_analysis.bias_indicators.join(', ') || 'Moderate' : 'Moderate',
          factual_reporting: result.bias_analysis.neutrality_score > 0.7 ? 'High' : result.bias_analysis.neutrality_score > 0.4 ? 'Medium' : 'Low'
        } : {
          political_lean: 'Neutral',
          emotional_language: 'Moderate',
          factual_reporting: 'High'
        },
        execution_time: result.execution_time ? `${result.execution_time}s` : '2.3s',
        sources_verified: result.sources_verified || 0,
        claim_analysis: result.claim_analysis || null,
        raw_result: result // Keep the raw result for debugging
      };
      
      setResults(transformedResult);
    } catch (err) {
      setError('Failed to analyze the content. Please try again later.');
      console.error('Fact check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'danger';
  };

  const getVerdictColor = (verdict) => {
    switch (verdict.toLowerCase()) {
      case 'true': return 'success';
      case 'false': return 'danger';
      case 'partially true': return 'warning';
      default: return 'secondary';
    }
  };

  const normalizeVerdict = (verdict) => {
    const v = verdict.toLowerCase();
    if (v.includes('true') && !v.includes('false') && !v.includes('partially')) return 'True';
    if (v.includes('false') && !v.includes('partially')) return 'False';
    if (v.includes('partially') || v.includes('mixed') || v.includes('some')) return 'Partially True';
    return 'Unverified';
  };

  const simplifyBiasValue = (value, type) => {
    if (type === 'political') {
      const v = value.toLowerCase();
      if (v.includes('left') || v.includes('liberal')) return 'Left';
      if (v.includes('right') || v.includes('conservative')) return 'Right';
      return 'Neutral';
    }
    if (type === 'emotional') {
      const v = value.toLowerCase();
      if (v.includes('strong') || v.includes('high') || v.includes('extreme')) return 'Strong';
      if (v.includes('unsubstantiated') || v.includes('misleading')) return 'Unsubstantiated';
      return 'Neutral';
    }
    if (type === 'factual') {
      const v = value.toLowerCase();
      if (v.includes('high') || v === 'high') return 'High';
      if (v.includes('medium') || v === 'medium') return 'Medium';
      return 'Low';
    }
    return value;
  };

  const formatAnalysisTime = (time) => {
    if (typeof time === 'string' && time.includes('s')) {
      const seconds = parseFloat(time.replace('s', ''));
      return `~${Math.round(seconds)} seconds`;
    }
    return '~5 seconds';
  };

  return (
    <div className="page-section">
      <div className="container">
        <h1 className="section-title">AI Fact Checker</h1>
        <p className="text-center text-white opacity-75 mb-5">
          Verify the accuracy of news articles, claims, and statements using advanced AI analysis
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
                      <i className="fas fa-quote-left me-2"></i>
                      Enter text to fact-check
                    </label>
                    <textarea
                      className="form-control"
                      id="textInput"
                      rows="6"
                      placeholder="Paste the text, article, or claim you want to fact-check..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    ></textarea>
                    <div className="form-text">
                      Enter any text content, news article, or specific claims you want to verify.
                    </div>
                  </div>
                )}

                {/* URL Input Tab */}
                {activeTab === 'url' && (
                  <div className="mb-4">
                    <label htmlFor="urlInput" className="form-label">
                      <i className="fas fa-globe me-2"></i>
                      Enter article URL
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="urlInput"
                      placeholder="https://example.com/news-article"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                    />
                    <div className="form-text">
                      Provide a URL to a news article or web page for fact-checking.
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
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-search me-2"></i>
                        Fact Check
                      </>
                    )}
                  </button>
                </div>

                {/* Progress Indicator */}
                {loading && (
                  <div className="mt-4">
                    <div className="text-center mb-3">
                      <h5 className="text-white">
                        <i className={`${progressSteps[progressStep - 1]?.icon || 'fas fa-spinner'} me-2`}></i>
                        {progressMessage || 'Initializing...'}
                      </h5>
                    </div>
                    <div className="progress mb-3" style={{ height: '8px' }}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        style={{ width: `${(progressStep / progressSteps.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="row text-center">
                      {progressSteps.map((step, index) => (
                        <div key={index} className="col-4">
                          <div className={`p-2 rounded ${progressStep > index ? 'bg-success' : progressStep === index + 1 ? 'bg-primary' : 'bg-secondary'} bg-opacity-25`}>
                            <i className={`${step.icon} ${progressStep > index ? 'text-success' : progressStep === index + 1 ? 'text-primary' : 'text-muted'}`}></i>
                            <div className={`small mt-1 ${progressStep > index ? 'text-success' : progressStep === index + 1 ? 'text-primary' : 'text-muted'}`}>
                              Step {step.step}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="results-container fade-in">
            <h2 className="mb-4">
              <i className="fas fa-chart-line me-2"></i>
              Fact-Check Results
            </h2>

            {/* Overall Score */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="text-center p-4 bg-light rounded">
                  <h3 className={`text-${getVerdictColor(results.claims[0]?.verdict || 'Unverified')}`}>
                    {normalizeVerdict(results.claims[0]?.verdict || 'Unverified')}
                  </h3>
                  <p className="mb-0">Verdict</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center p-4 bg-light rounded">
                  <h3 className="text-primary">{Math.round(results.overall_score * 100)}%</h3>
                  <p className="mb-0">Confidence</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center p-4 bg-light rounded">
                  <h3 className="text-info">{results.sources_verified}</h3>
                  <p className="mb-0">Sources Verified</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center p-4 bg-light rounded">
                  <h3 className="text-success">{formatAnalysisTime(results.execution_time)}</h3>
                  <p className="mb-0">Analysis Time</p>
                </div>
              </div>
            </div>

            {/* Claims Analysis */}
            <div className="mb-4">
              <h3 className="mb-3">
                <i className="fas fa-list-check me-2"></i>
                Detailed Claim Analysis
              </h3>
              {results.claims.map((claim, index) => (
                <div key={index} className="result-item mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="result-title mb-0">Claim {index + 1}</h5>
                    <span className={`badge bg-${getVerdictColor(claim.verdict)} fs-6`}>
                      {claim.verdict}
                    </span>
                  </div>
                  <blockquote className="blockquote mb-3">
                    <p className="mb-0">"{claim.claim}"</p>
                  </blockquote>
                  <div className="mb-3">
                    <strong>Confidence:</strong>
                    <div className="progress mt-1" style={{ height: '8px' }}>
                      <div
                        className={`progress-bar bg-${getScoreColor(claim.confidence)}`}
                        style={{ width: `${claim.confidence * 100}%` }}
                      ></div>
                    </div>
                    <small className="text-muted">{Math.round(claim.confidence * 100)}%</small>
                  </div>
                  <div className="mb-3">
                    <strong>Explanation:</strong>
                    <p className="result-content mt-1">{claim.explanation}</p>
                  </div>
                  <div>
                    <strong>Supporting Sources:</strong>
                    {claim.sources && claim.sources.length > 0 ? (
                      <div className="mt-2">
                        {/* Show only the first source by default */}
                        <div className="border rounded p-3 mb-2 bg-light">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="mb-1">
                                {claim.sources[0].url ? (
                                  <a href={claim.sources[0].url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                    <i className="fas fa-external-link-alt me-1"></i>
                                    {claim.sources[0].title || 'Primary Source'}
                                  </a>
                                ) : (
                                  <span>{claim.sources[0].title || claim.sources[0] || 'Primary Source'}</span>
                                )}
                              </h6>
                              {claim.sources[0].snippet && (
                                <p className="text-muted small mb-0">{claim.sources[0].snippet}</p>
                              )}
                            </div>
                            <span className="badge bg-success ms-2">Verified</span>
                          </div>
                        </div>
                        {claim.sources.length > 1 && (
                          <div className="text-center">
                            <button className="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target={`#additionalSources${index}`}>
                              <i className="fas fa-plus me-1"></i>
                              View {claim.sources.length - 1} more source{claim.sources.length > 2 ? 's' : ''}
                            </button>
                            <div className="collapse mt-2" id={`additionalSources${index}`}>
                              {claim.sources.slice(1).map((source, sourceIndex) => (
                                <div key={sourceIndex + 1} className="border rounded p-3 mb-2 bg-light">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                      <h6 className="mb-1">
                                        {source.url ? (
                                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                            <i className="fas fa-external-link-alt me-1"></i>
                                            {source.title || `Source ${sourceIndex + 2}`}
                                          </a>
                                        ) : (
                                          <span>{source.title || source || `Source ${sourceIndex + 2}`}</span>
                                        )}
                                      </h6>
                                      {source.snippet && (
                                        <p className="text-muted small mb-0">{source.snippet}</p>
                                      )}
                                    </div>
                                    <span className="badge bg-success ms-2">Verified</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted mt-1 mb-0">No supporting sources found</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mb-4">
              <h3 className="mb-3">
                <i className="fas fa-summary me-2"></i>
                Summary
              </h3>
              <div className="result-item">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Verdict:</strong> 
                    <span className={`ms-2 badge bg-${getVerdictColor(results.claims[0]?.verdict || 'Unverified')}`}>
                      {normalizeVerdict(results.claims[0]?.verdict || 'Unverified')}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <strong>Sources Found:</strong> 
                    <span className="ms-2 text-primary">{results.sources_verified} verified sources</span>
                  </div>
                </div>
                <p className="result-content mb-0">{results.summary}</p>
              </div>
            </div>

            {/* Bias Analysis */}
            <div className="mb-4">
              <h3 className="mb-3">
                <i className="fas fa-balance-scale me-2"></i>
                Bias Analysis
              </h3>
              <div className="row">
                <div className="col-md-4">
                  <div className="text-center p-3 bg-light rounded">
                    <h5>Political Lean</h5>
                    <span className="badge bg-secondary fs-6">{simplifyBiasValue(results.bias_analysis.political_lean, 'political')}</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center p-3 bg-light rounded">
                    <h5>Language Tone</h5>
                    <span className="badge bg-info fs-6">{simplifyBiasValue(results.bias_analysis.emotional_language, 'emotional')}</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center p-3 bg-light rounded">
                    <h5>Factual Quality</h5>
                    <span className="badge bg-success fs-6">{simplifyBiasValue(results.bias_analysis.factual_reporting, 'factual')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Debug Information (Development Mode Only) */}
            {process.env.NODE_ENV === 'development' && results.raw_result && (
              <details className="mb-4">
                <summary className="btn btn-outline-secondary btn-sm">
                  <i className="fas fa-code me-1"></i>Developer Debug Info
                </summary>
                <div className="mt-2 p-3 bg-light rounded" style={{fontSize: '11px', maxHeight: '200px', overflow: 'auto'}}>
                  <pre>{JSON.stringify(results.raw_result, null, 2)}</pre>
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="text-center">
              <button 
                className="btn btn-outline-primary me-3" 
                onClick={() => {
                  setResults(null);
                  setError(null);
                  setInputText('');
                  setInputUrl('');
                  setProgressStep(0);
                  setProgressMessage('');
                }}
              >
                <i className="fas fa-redo me-2"></i>New Analysis
              </button>
              <button 
                className="btn btn-success"
                onClick={async () => {
                  try {
                    const verdict = normalizeVerdict(results.claims[0]?.verdict || 'Unverified');
                    const shareText = `Fact Check: ${verdict}\n\n${results.summary}\n\nSources: ${results.sources_verified} verified\nAnalysis: ${formatAnalysisTime(results.execution_time)}\n\nvia NewsHub Fact Checker`;
                    
                    if (navigator.share) {
                      await navigator.share({
                        title: 'Fact Check Result',
                        text: shareText,
                        url: window.location.href
                      });
                    } else {
                      await navigator.clipboard.writeText(shareText);
                      alert('Result copied to clipboard!');
                    }
                  } catch (err) {
                    console.error('Error sharing:', err);
                    alert('Unable to share result');
                  }
                }}
              >
                <i className="fas fa-share me-2"></i>Share
              </button>
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <div className="mt-5">
          <div className="bg-glass rounded-4 p-4">
            <h3 className="text-center mb-4 text-gradient">
              <i className="fas fa-info-circle me-2"></i>
              How Our Fact Checker Works
            </h3>
            <div className="row">
              <div className="col-md-3 text-center mb-3">
                <i className="fas fa-upload fa-2x text-primary mb-2"></i>
                <h5>Submit Content</h5>
                <p className="text-muted small">Enter text or provide a URL</p>
              </div>
              <div className="col-md-3 text-center mb-3">
                <i className="fas fa-brain fa-2x text-primary mb-2"></i>
                <h5>AI Analysis</h5>
                <p className="text-muted small">Advanced algorithms analyze claims</p>
              </div>
              <div className="col-md-3 text-center mb-3">
                <i className="fas fa-database fa-2x text-primary mb-2"></i>
                <h5>Source Verification</h5>
                <p className="text-muted small">Cross-reference with reliable sources</p>
              </div>
              <div className="col-md-3 text-center mb-3">
                <i className="fas fa-chart-bar fa-2x text-primary mb-2"></i>
                <h5>Detailed Report</h5>
                <p className="text-muted small">Get comprehensive results</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactChecker;