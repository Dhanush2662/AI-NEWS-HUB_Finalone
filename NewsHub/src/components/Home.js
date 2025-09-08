import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: 'fas fa-newspaper',
      title: 'Smart News Feed',
      description: 'Get the latest news from multiple sources with intelligent filtering and categorization.',
      link: '/news-feed',
      color: '#667eea'
    },
    {
      icon: 'fas fa-search',
      title: 'Fact Checker',
      description: 'Verify the authenticity of news articles and claims with AI-powered fact-checking.',
      link: '/fact-checker',
      color: '#f093fb'
    },
    {
      icon: 'fas fa-balance-scale',
      title: 'Bias Detector',
      description: 'Analyze news articles for potential bias and get objective insights.',
      link: '/bias-checker',
      color: '#4facfe'
    },
    {
      icon: 'fas fa-compress-alt',
      title: 'News Summarizer',
      description: 'Get concise summaries of lengthy articles with key points highlighted.',
      link: '/summarizer',
      color: '#43e97b'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              Welcome to AI News Hub
            </h1>
            <p className="hero-subtitle">
              Your intelligent companion for navigating the world of news with AI-powered tools
            </p>
            <div className="hero-cta">
              <Link to="/news-feed" className="btn btn-primary btn-lg">
                <i className="fas fa-rocket me-2"></i>
                Explore News
              </Link>
              <Link to="/fact-checker" className="btn btn-outline-light btn-lg">
                <i className="fas fa-search me-2"></i>
                Check Facts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="section-title text-white">
                Powerful AI Tools at Your Fingertips
              </h2>
              <p className="lead text-white opacity-75">
                Discover, verify, and understand news like never before
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="feature-card slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="feature-icon">
                    <i className={feature.icon} style={{ color: feature.color }}></i>
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <Link to={feature.link} className="btn btn-primary">
                    Try Now <i className="fas fa-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <h3 className="stat-number text-white">10K+</h3>
                <p className="stat-label text-white opacity-75">Articles Analyzed</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <h3 className="stat-number text-white">95%</h3>
                <p className="stat-label text-white opacity-75">Accuracy Rate</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <h3 className="stat-number text-white">24/7</h3>
                <p className="stat-label text-white opacity-75">Real-time Updates</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <h3 className="stat-number text-white">100+</h3>
                <p className="stat-label text-white opacity-75">News Sources</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="bg-glass rounded-4 p-5 shadow-custom">
                <h2 className="mb-3 text-gradient">Ready to Transform Your News Experience?</h2>
                <p className="lead mb-4 text-muted">
                  Join thousands of users who trust AI News Hub for accurate, unbiased, and summarized news content.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link to="/news-feed" className="btn btn-primary btn-lg">
                    <i className="fas fa-newspaper me-2"></i>
                    Start Reading
                  </Link>
                  <Link to="/fact-checker" className="btn btn-outline-primary btn-lg">
                    <i className="fas fa-shield-alt me-2"></i>
                    Verify News
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;