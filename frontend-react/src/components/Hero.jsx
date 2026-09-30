import React, { useEffect, useState } from 'react';
import { ArrowRight, BarChart2 } from 'lucide-react';
import { fetchStats } from '../services/api';

export default function Hero() {
  const [stats, setStats] = useState({
    casesAnalyzed: 2847,
    matchAccuracy: 98,
    activeInvestigations: 156,
    fluidTypesTracked: 12
  });

  useEffect(() => {
    fetchStats()
      .then((res) => {
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      })
      .catch(() => {});
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="hero-gradient"></div>
        <div className="blood-drip drip-1"></div>
        <div className="blood-drip drip-2"></div>
        <div className="blood-drip drip-3"></div>
        <div className="scanner-line"></div>
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          FORENSIC SEROLOGY ANALYSIS PLATFORM
        </div>

        <h1 className="hero-title">
          <span className="title-line">BLOODY</span>
          <span className="title-line title-accent">EXPEDITOR</span>
        </h1>

        <p className="hero-subtitle">
          Advanced forensic serology platform for blood evidence analysis, body fluid correlation, probabilistic matching, and comprehensive case management.
        </p>

        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.casesAnalyzed.toLocaleString()}</div>
            <div className="stat-label">Cases Analyzed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.matchAccuracy}%</div>
            <div className="stat-label">Match Accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.activeInvestigations}</div>
            <div className="stat-label">Active Investigations</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.fluidTypesTracked}</div>
            <div className="stat-label">Fluid Types Tracked</div>
          </div>
        </div>

        <div className="hero-actions">
          <button onClick={() => scrollTo('case-studies')} className="btn btn-primary">
            <span>Explore Cases</span>
            <ArrowRight size={18} />
          </button>
          <button onClick={() => scrollTo('analytics')} className="btn btn-secondary">
            <BarChart2 size={18} />
            <span>View Analytics</span>
          </button>
        </div>
      </div>

      <div className="hero-visual">
        <div className="microscope-graphic">
          <svg viewBox="0 0 300 350" className="microscope-svg">
            <rect x="120" y="60" width="60" height="180" rx="8" fill="#1a1a2e" stroke="#dc2626" strokeWidth="1.5"/>
            <rect x="130" y="30" width="40" height="40" rx="6" fill="#1a1a2e" stroke="#dc2626" strokeWidth="1.5"/>
            <circle cx="150" cy="50" r="12" fill="none" stroke="#dc2626" strokeWidth="2" className="lens-glow"/>
            <circle cx="150" cy="50" r="6" fill="#dc2626" opacity="0.3"/>
            <rect x="90" y="240" width="120" height="10" rx="3" fill="#1a1a2e" stroke="#991b1b" strokeWidth="1"/>
            <ellipse cx="150" cy="310" rx="80" ry="15" fill="#1a1a2e" stroke="#dc2626" strokeWidth="1.5"/>
            <rect x="135" y="250" width="30" height="60" rx="4" fill="#1a1a2e" stroke="#991b1b" strokeWidth="1"/>
            <path d="M180 80 Q220 80 220 120 L220 240 L180 240" fill="none" stroke="#dc2626" strokeWidth="1.5"/>
            <circle cx="220" cy="160" r="8" fill="#7f1d1d" stroke="#dc2626" strokeWidth="1"/>
            <circle cx="220" cy="190" r="6" fill="#7f1d1d" stroke="#dc2626" strokeWidth="1"/>
            <circle cx="150" cy="235" r="4" fill="#dc2626" className="blood-pulse">
              <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
            </circle>
            <line x1="150" y1="62" x2="150" y2="235" stroke="#dc2626" strokeWidth="0.5" opacity="0.3" strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" values="0;8" dur="1s" repeatCount="indefinite"/>
            </line>
          </svg>
          <div className="blood-cell cell-1"></div>
          <div className="blood-cell cell-2"></div>
          <div className="blood-cell cell-3"></div>
          <div className="blood-cell cell-4"></div>
          <div className="blood-cell cell-5"></div>
        </div>
      </div>
    </section>
  );
}
