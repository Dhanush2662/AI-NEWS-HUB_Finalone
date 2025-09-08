import React, { useState, useEffect, useCallback } from 'react';
import { newsAPI, summarizerAPI } from '../services/api';



const NewsFeed = () => {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('general');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [summaries, setSummaries] = useState({});
  const [loadingSummaries, setLoadingSummaries] = useState({});
  const [expandedSummaries, setExpandedSummaries] = useState({});

  const categories = [
    { value: 'general', label: 'General', icon: 'fas fa-globe' },
    { value: 'business', label: 'Business', icon: 'fas fa-briefcase' },
    { value: 'technology', label: 'Technology', icon: 'fas fa-microchip' },
    { value: 'health', label: 'Health', icon: 'fas fa-heartbeat' },
    { value: 'science', label: 'Science', icon: 'fas fa-flask' },
    { value: 'sports', label: 'Sports', icon: 'fas fa-football-ball' },
    { value: 'entertainment', label: 'Entertainment', icon: 'fas fa-film' }
  ];

  const fetchNews = useCallback(async (page = 1, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    
    try {
      const params = {
        category: category === 'general' ? undefined : category,
        country: 'us',
        pageSize: 20,
        page: page
      };
      
      // Add search query if provided
      if (searchTerm && searchTerm.trim()) {
        params.q = searchTerm.trim();
      }
      
      const result = await newsAPI.getNews(params);
      
      if (result.status === 'error') {
        throw new Error(result.message || 'Failed to fetch news');
      }
      
      if (reset) {
        setArticles(result.articles || []);
      } else {
        setArticles(prevArticles => [...prevArticles, ...(result.articles || [])]);
      }
      
      setTotalResults(result.totalResults || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message || 'Failed to fetch news. Please try again later.');
      if (reset) {
        setArticles([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
    fetchNews(1, true);
  }, [category, fetchNews]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNews(1, true);
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    fetchNews(nextPage, false);
  };

  const generateSummary = async (article) => {
    const articleKey = article.url || article.title;
    
    if (summaries[articleKey]) {
      setExpandedSummaries(prev => ({
        ...prev,
        [articleKey]: !prev[articleKey]
      }));
      return;
    }

    setLoadingSummaries(prev => ({ ...prev, [articleKey]: true }));
    
    try {
      let result;
      
      // Try to summarize using URL first if available
      if (article.url) {
        try {
          result = await summarizerAPI.summarizeUrl(article.url, 3);
        } catch (urlError) {
          console.warn('URL summarization failed, falling back to text:', urlError);
          // Fallback to text summarization
          const content = `${article.title}. ${article.description || ''}`;
          result = await summarizerAPI.summarizeText(content, 3);
        }
      } else {
        // Use text summarization if no URL
        const content = `${article.title}. ${article.description || ''}`;
        result = await summarizerAPI.summarizeText(content, 3);
      }
      
      // Transform the result to match the expected format
      const transformedSummary = {
        summary: result.summary || 'No summary available',
        keyPoints: result.keywords ? result.keywords.slice(0, 5).map(keyword => `• ${keyword}`) : [],
        entities: result.keywords || [],
        sentiment: result.sentiment_analysis || null,
        readability: result.readability || null,
        processingTime: result.processing_time || 0,
        compressionRatio: result.compression_ratio || 0
      };
      
      setSummaries(prev => ({
        ...prev,
        [articleKey]: transformedSummary
      }));
      
      setExpandedSummaries(prev => ({
        ...prev,
        [articleKey]: true
      }));
    } catch (error) {
      console.error('Error generating summary:', error);
      
      setSummaries(prev => ({
        ...prev,
        [articleKey]: {
          summary: 'Unable to generate summary. Please try again later.',
          keyPoints: [],
          entities: [],
          sentiment: null
        }
      }));
    } finally {
      setLoadingSummaries(prev => ({ ...prev, [articleKey]: false }));
    }
  };



  const handleShare = async (article, event) => {
    const shareData = {
      title: article.title,
      text: article.summary || article.description,
      url: article.url
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        const shareText = `${article.title}\n\n${article.summary || article.description}\n\nRead more: ${article.url}`;
        await navigator.clipboard.writeText(shareText);
        
        // Show a temporary notification
        const button = event.target.closest('button');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
        button.classList.add('btn-success');
        button.classList.remove('btn-outline-secondary');
        
        setTimeout(() => {
          button.innerHTML = originalText;
          button.classList.remove('btn-success');
          button.classList.add('btn-outline-secondary');
        }, 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: Open in new window for manual sharing
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(article.url)}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="page-section">
      <div className="container">
        <h1 className="section-title">Latest News Feed</h1>
        

        
        {/* Search and Filter Section */}
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <div className="row g-3 align-items-end">
              <div className="col-md-6">
                <label htmlFor="search" className="form-label">
                  <i className="fas fa-search me-2"></i>
                  Search News
                </label>
                <input
                  type="text"
                  className="form-control search-input"
                  id="search"
                  placeholder="Enter keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="category" className="form-label">
                  <i className="fas fa-filter me-2"></i>
                  Category
                </label>
                <select
                  className="form-select"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100 search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Category Pills */}
        <div className="category-pills mb-4">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {categories.map(cat => (
              <button
                key={cat.value}
                className={`btn btn-sm ${category === cat.value ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => setCategory(cat.value)}
              >
                <i className={`${cat.icon} me-1`}></i>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-white">Fetching latest news...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* News Articles */}
        {!loading && !error && (
          <div className="row">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <div key={article.url || index} className="col-lg-6 col-xl-4 mb-4">
                  <div className="news-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <img
                      src={article.urlToImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY3ZWVhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5ld3M8L3RleHQ+PC9zdmc+'}
                      className="card-img-top"
                      alt={article.title}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY3ZWVhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5ld3M8L3RleHQ+PC9zdmc+';
                      }}
                    />
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="source-badge">{article.source?.name || 'Unknown Source'}</span>
                        <small className="text-muted">
                          <i className="fas fa-clock me-1"></i>
                          {formatDate(article.publishedAt)}
                        </small>
                      </div>
                      <h5 className="card-title">{article.title}</h5>
                      <p className="card-text">{article.description}</p>
                      <div className="news-meta">
                        <i className="fas fa-user me-1"></i>
                        By {article.author || 'Unknown Author'}
                      </div>
                      
                      {/* Summary Section */}
                      {(() => {
                        const articleKey = article.url || article.title;
                        const summary = summaries[articleKey];
                        const isExpanded = expandedSummaries[articleKey];
                        
                        return (
                          <div className="summary-section mt-3">
                            {summary && isExpanded && (
                              <div className="summary-content fade-in">
                                <div className="summary-header">
                                  <h6 className="summary-title">
                                    <i className="fas fa-brain me-2"></i>
                                    AI Summary
                                  </h6>
                                </div>
                                
                                <div className="summary-text mb-3">
                                  <p className="mb-2">{summary.summary}</p>
                                </div>
                                
                                {summary.keyPoints && summary.keyPoints.length > 0 && (
                                  <div className="key-points mb-3">
                                    <h6 className="key-points-title">
                                      <i className="fas fa-list-ul me-2"></i>
                                      Key Points
                                    </h6>
                                    <ul className="key-points-list">
                                      {summary.keyPoints.map((point, idx) => (
                                        <li key={idx} className="key-point-item">
                                          {point}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {summary.entities && summary.entities.length > 0 && (
                                  <div className="entities">
                                    <h6 className="entities-title">
                                      <i className="fas fa-tags me-2"></i>
                                      Key Entities
                                    </h6>
                                    <div className="entities-list">
                                      {summary.entities.map((entity, idx) => (
                                        <span key={idx} className="entity-tag">
                                          {entity}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      
                      <div className="d-flex gap-2 mt-3">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          <i className="fas fa-external-link-alt me-1"></i>
                          Read More
                        </a>
                        
                        <button 
                          className="btn btn-outline-info btn-sm"
                          onClick={() => generateSummary(article)}
                          disabled={loadingSummaries[article.url || article.title]}
                        >
                          {loadingSummaries[article.url || article.title] ? (
                            <>
                              <div className="spinner-border spinner-border-sm me-1" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              Summarizing...
                            </>
                          ) : summaries[article.url || article.title] ? (
                            expandedSummaries[article.url || article.title] ? (
                              <>
                                <i className="fas fa-chevron-up me-1"></i>
                                Hide Summary
                              </>
                            ) : (
                              <>
                                <i className="fas fa-chevron-down me-1"></i>
                                Show Summary
                              </>
                            )
                          ) : (
                            <>
                              <i className="fas fa-brain me-1"></i>
                              AI Summary
                            </>
                          )}
                        </button>
                        
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={(e) => handleShare(article, e)}
                        >
                          <i className="fas fa-share me-1"></i>
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="text-center py-5">
                  <i className="fas fa-newspaper fa-3x text-muted mb-3"></i>
                  <h3 className="text-white">No articles found</h3>
                  <p className="text-white opacity-75">Try adjusting your search terms or category filter.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Load More Button */}
        {!loading && articles.length > 0 && articles.length < totalResults && (
          <div className="text-center mt-4">
            <button 
              className="btn btn-outline-light btn-lg"
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Loading More...
                </>
              ) : (
                <>
                  <i className="fas fa-plus me-2"></i>
                  Load More Articles
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;