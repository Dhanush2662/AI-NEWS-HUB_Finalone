import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-5 mt-5">
      <div className="container">
        <div className="row">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="text-gradient mb-3">
              <i className="fas fa-newspaper me-2"></i>
              NewsHub AI
            </h5>
            <p className="text-light opacity-75 mb-3">
              Your intelligent news companion powered by advanced AI technology. 
              Get verified facts, unbiased analysis, and concise summaries all in one place.
            </p>
            <div className="social-links">
              <a href="#" className="text-white me-3" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white me-3" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white me-3" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-white me-3" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Features</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/news-feed" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="fas fa-rss me-2"></i>
                  News Feed
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/fact-checker" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="fas fa-shield-alt me-2"></i>
                  Fact Checker
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/bias-checker" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="fas fa-balance-scale me-2"></i>
                  Bias Detector
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/summarizer" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="fas fa-compress-alt me-2"></i>
                  Summarizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="fas fa-info-circle me-2"></i>
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="fas fa-briefcase me-2"></i>
                  Careers
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="fas fa-newspaper me-2"></i>
                  Press
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="fas fa-handshake me-2"></i>
                  Partners
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="fas fa-question-circle me-2"></i>
                  Help Center
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="fas fa-envelope me-2"></i>
                  Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="fas fa-bug me-2"></i>
                  Report Bug
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light opacity-75 text-decoration-none hover-primary">
                  <i className="fas fa-lightbulb me-2"></i>
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="col-lg-2 col-md-12 mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Stay Updated</h6>
            <p className="text-light opacity-75 small mb-3">
              Subscribe to our newsletter for the latest AI news insights.
            </p>
            <form className="newsletter-form">
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control form-control-sm"
                  placeholder="Your email"
                  aria-label="Email address"
                />
                <button className="btn btn-primary btn-sm" type="submit">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
            <div className="app-badges mt-3">
              <a href="#" className="d-inline-block me-2 mb-2">
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiByeD0iNSIgZmlsbD0iIzAwMCIvPgo8dGV4dCB4PSI2MCIgeT0iMjUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BcHAgU3RvcmU8L3RleHQ+Cjwvc3ZnPgo="
                  alt="Download on App Store"
                  style={{ height: '30px' }}
                />
              </a>
              <a href="#" className="d-inline-block mb-2">
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiByeD0iNSIgZmlsbD0iIzAwMCIvPgo8dGV4dCB4PSI2MCIgeT0iMjUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Hb29nbGUgUGxheTwvdGV4dD4KPHN2Zz4K"
                  alt="Get it on Google Play"
                  style={{ height: '30px' }}
                />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-4 opacity-25" />

        {/* Bottom Section */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-light opacity-50 mb-0 small">
              © 2024 NewsHub AI. All rights reserved. Powered by advanced artificial intelligence.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="footer-links">
              <a href="#" className="text-light opacity-50 text-decoration-none me-3 small hover-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-light opacity-50 text-decoration-none me-3 small hover-primary">
                Terms of Service
              </a>
              <a href="#" className="text-light opacity-50 text-decoration-none me-3 small hover-primary">
                Cookie Policy
              </a>
              <a href="#" className="text-light opacity-50 text-decoration-none small hover-primary">
                Accessibility
              </a>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <div className="trust-indicators">
              <span className="badge bg-success me-2 mb-2">
                <i className="fas fa-shield-alt me-1"></i>
                SSL Secured
              </span>
              <span className="badge bg-primary me-2 mb-2">
                <i className="fas fa-user-shield me-1"></i>
                Privacy Protected
              </span>
              <span className="badge bg-info me-2 mb-2">
                <i className="fas fa-check-circle me-1"></i>
                AI Verified
              </span>
              <span className="badge bg-warning mb-2">
                <i className="fas fa-award me-1"></i>
                Trusted Source
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;