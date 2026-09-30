import React, { useState, useEffect } from 'react';
import BackgroundCanvas from './components/BackgroundCanvas';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import CaseStudies from './components/CaseStudies';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ProbabilityCalculator from './components/ProbabilityCalculator';
import Timeline from './components/Timeline';
import CorrelationMatrix from './components/CorrelationMatrix';
import Footer from './components/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Preloader */}
      <div className={`preloader ${!loading ? 'hidden' : ''}`}>
        <div className="preloader-content">
          <svg className="dna-helix" width="60" height="80" viewBox="0 0 60 80">
            <path className="dna-strand-1" d="M15 5 Q30 20 45 5 Q30 35 15 20 Q30 50 45 35 Q30 65 15 50 Q30 80 45 65" fill="none" stroke="#dc2626" strokeWidth="2.5" />
            <path className="dna-strand-2" d="M45 5 Q30 20 15 5 Q30 35 45 20 Q30 50 15 35 Q30 65 45 50 Q30 80 15 65" fill="none" stroke="#7f1d1d" strokeWidth="2.5" />
            <circle cx="30" cy="12" r="3" fill="#dc2626" opacity="0.6" />
            <circle cx="30" cy="27" r="3" fill="#dc2626" opacity="0.6" />
            <circle cx="30" cy="42" r="3" fill="#dc2626" opacity="0.6" />
            <circle cx="30" cy="57" r="3" fill="#dc2626" opacity="0.6" />
            <circle cx="30" cy="72" r="3" fill="#dc2626" opacity="0.6" />
          </svg>
          <div className="preloader-title">BLOODY EXPEDITOR</div>
          <div className="preloader-bar">
            <div className="preloader-progress"></div>
          </div>
          <div className="preloader-text">INITIALIZING FORENSIC SYSTEMS...</div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="bg-grain"></div>
      <BackgroundCanvas />

      {/* Main App */}
      <Navigation />
      <Hero />
      <CaseStudies />
      <AnalyticsDashboard />
      <ProbabilityCalculator />
      <Timeline />
      <CorrelationMatrix />
      <Footer />
    </>
  );
}
