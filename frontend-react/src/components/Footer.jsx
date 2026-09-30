import React from 'react';

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">
            <svg viewBox="0 0 40 40" width="32" height="32">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#dc2626" strokeWidth="2" />
              <path d="M20 8 C20 8, 12 18, 12 24 C12 28.4 15.6 32 20 32 C24.4 32 28 28.4 28 24 C28 18 20 8 20 8Z" fill="#dc2626" opacity="0.8" />
              <circle cx="18" cy="22" r="2" fill="#fff" opacity="0.4" />
            </svg>
            BLOODY <span style={{ color: '#dc2626' }}>EXPEDITOR</span>
          </div>
          <p className="footer-desc">
            Advanced forensic serology analysis platform for blood evidence analysis, body fluid correlation, probabilistic matching, and comprehensive case management. Built with React + Node.js.
          </p>
        </div>

        <div className="footer-links">
          <h4>Platform</h4>
          <a href="#hero" onClick={e => { e.preventDefault(); scrollTo('hero'); }}>Home</a>
          <a href="#case-studies" onClick={e => { e.preventDefault(); scrollTo('case-studies'); }}>Case Studies</a>
          <a href="#analytics" onClick={e => { e.preventDefault(); scrollTo('analytics'); }}>Analytics</a>
          <a href="#probability" onClick={e => { e.preventDefault(); scrollTo('probability'); }}>Probability</a>
        </div>

        <div className="footer-links">
          <h4>Analysis</h4>
          <a href="#timeline" onClick={e => { e.preventDefault(); scrollTo('timeline'); }}>Historical Timeline</a>
          <a href="#correlation" onClick={e => { e.preventDefault(); scrollTo('correlation'); }}>Correlation Matrix</a>
          <a href="#probability" onClick={e => { e.preventDefault(); scrollTo('probability'); }}>Blood Type Reference</a>
        </div>

        <div className="footer-links">
          <h4>Technology</h4>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">React 18</a>
          <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">Vite</a>
          <a href="https://expressjs.com" target="_blank" rel="noopener noreferrer">Express.js</a>
          <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">Node.js</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bloody Expeditor — Forensic Serology Analysis Platform. All rights reserved.</p>
        <p className="footer-disclaimer">
          This platform is designed for educational and research purposes in forensic serology.
        </p>
      </div>
    </footer>
  );
}
