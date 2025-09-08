import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-brain"></i>
          AI News Hub
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                <i className="fas fa-home me-1"></i>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/news-feed')}`} to="/news-feed">
                <i className="fas fa-newspaper me-1"></i>
                News Feed
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/fact-checker')}`} to="/fact-checker">
                <i className="fas fa-search me-1"></i>
                Fact Checker
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/bias-checker')}`} to="/bias-checker">
                <i className="fas fa-balance-scale me-1"></i>
                Bias Checker
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/summarizer')}`} to="/summarizer">
                <i className="fas fa-compress-alt me-1"></i>
                Summarizer
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;