import React, { useState, useEffect } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [timeStr, setTimeStr] = useState('00:00:00');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['hero', 'case-studies', 'analytics', 'probability', 'timeline', 'correlation'];
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toUTCString().split(' ')[4] || now.toISOString().substring(11, 19));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Home', section: 'hero' },
    { label: 'Case Studies', section: 'case-studies' },
    { label: 'Analytics', section: 'analytics' },
    { label: 'Probability', section: 'probability' },
    { label: 'Historical', section: 'timeline' },
    { label: 'Correlation', section: 'correlation' },
  ];

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }} className="logo">
            <svg className="logo-icon" viewBox="0 0 40 40" width="40" height="40">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#dc2626" strokeWidth="2"/>
              <path d="M20 8 C20 8, 12 18, 12 24 C12 28.4 15.6 32 20 32 C24.4 32 28 28.4 28 24 C28 18 20 8 20 8Z" fill="#dc2626" opacity="0.8"/>
              <circle cx="18" cy="22" r="2" fill="#fff" opacity="0.4"/>
            </svg>
            <span className="logo-text">BLOODY <span className="logo-accent">EXPEDITOR</span></span>
          </a>

          <nav className="nav">
            {navItems.map((item) => (
              <a
                key={item.section}
                href={`#${item.section}`}
                onClick={(e) => { e.preventDefault(); scrollTo(item.section); }}
                className={`nav-link ${activeSection === item.section ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <div className="live-clock">
              <span className="clock-dot"></span>
              <span className="clock-time">{timeStr}</span>
              <span className="clock-label">UTC</span>
            </div>
            <button
              className="hamburger"
              aria-label="Toggle Menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-overlay ${mobileOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          {navItems.map((item) => (
            <a
              key={item.section}
              href={`#${item.section}`}
              onClick={(e) => { e.preventDefault(); scrollTo(item.section); }}
              className="mobile-nav-link"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
