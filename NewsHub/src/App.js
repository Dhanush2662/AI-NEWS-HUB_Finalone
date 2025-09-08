import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import NewsFeed from './components/NewsFeed';
import FactChecker from './components/FactChecker';
import BiasChecker from './components/BiasChecker';
import Summarizer from './components/Summarizer';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news-feed" element={<NewsFeed />} />
            <Route path="/fact-checker" element={<FactChecker />} />
            <Route path="/bias-checker" element={<BiasChecker />} />
            <Route path="/summarizer" element={<Summarizer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;