import React, { useState, useEffect, useRef } from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { fetchTimelineMilestones, fetchHistoricalTimeline } from '../services/api';

export default function Timeline() {
  const [milestones, setMilestones] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchTimelineMilestones()
      .then(r => r.success && setMilestones(r.milestones))
      .catch(() => {});

    fetchHistoricalTimeline()
      .then(r => r.success && setHistoricalData(r.data))
      .catch(() => {});
  }, []);

  // Draw historical analysis chart
  useEffect(() => {
    if (historicalData.length === 0 || !chartRef.current) return;
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    const w = 700, h = 250;
    canvas.width = w * 2;
    canvas.height = h * 2;
    canvas.style.width = '100%';
    canvas.style.height = `${h}px`;
    ctx.scale(2, 2);

    const padding = { top: 30, right: 30, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const maxCases = Math.max(...historicalData.map(d => d.cases)) * 1.15;

    // Grid
    ctx.strokeStyle = '#1e1e30';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = '#6b6b80';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxCases - (maxCases / 4) * i).toString(), padding.left - 8, y + 3);
    }

    // Cases - area + line (red)
    ctx.beginPath();
    historicalData.forEach((d, i) => {
      const x = padding.left + (chartW / (historicalData.length - 1)) * i;
      const y = padding.top + chartH - (d.cases / maxCases) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    const lastX = padding.left + chartW;
    ctx.lineTo(lastX, padding.top + chartH);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.closePath();
    const grad1 = ctx.createLinearGradient(0, padding.top, 0, h);
    grad1.addColorStop(0, 'rgba(220, 38, 38, 0.25)');
    grad1.addColorStop(1, 'rgba(220, 38, 38, 0)');
    ctx.fillStyle = grad1;
    ctx.fill();

    // Line
    ctx.beginPath();
    historicalData.forEach((d, i) => {
      const x = padding.left + (chartW / (historicalData.length - 1)) * i;
      const y = padding.top + chartH - (d.cases / maxCases) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Accuracy line (green)
    ctx.beginPath();
    historicalData.forEach((d, i) => {
      const x = padding.left + (chartW / (historicalData.length - 1)) * i;
      const y = padding.top + chartH - (d.accuracy / 100) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Points & year labels
    historicalData.forEach((d, i) => {
      const x = padding.left + (chartW / (historicalData.length - 1)) * i;
      const yCases = padding.top + chartH - (d.cases / maxCases) * chartH;

      ctx.beginPath();
      ctx.arc(x, yCases, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      ctx.fill();
      ctx.strokeStyle = '#0a0a0f';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#6b6b80';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.year.toString(), x, h - 12);
    });
  }, [historicalData]);

  return (
    <section className="section section-dark" id="timeline">
      <div className="section-header">
        <span className="section-tag">HISTORICAL ARCHIVE</span>
        <h2 className="section-title">Forensic Serology Timeline</h2>
        <p className="section-desc">
          Key milestones in the evolution of forensic blood analysis, from Landsteiner's ABO discovery to modern AI-driven serology platforms.
        </p>
      </div>

      {/* Timeline */}
      <div className="timeline-container">
        <div className="timeline-line"></div>
        {milestones.map((m, idx) => (
          <div key={idx} className={`timeline-item ${m.side}`}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-year">{m.year}</span>
              <h3>{m.title}</h3>
              <p>{m.description}</p>
              {m.tags && (
                <div className="timeline-tags">
                  {m.tags.map((tag, ti) => <span key={ti}>{tag}</span>)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Past Analysis Chart */}
      <div className="past-analysis">
        <div className="card-title">
          <TrendingUp size={18} color="#dc2626" />
          Historical Case Volume & Accuracy Trends
        </div>
        <div className="area-chart-container">
          <canvas ref={chartRef} />
        </div>
        <div className="past-legend">
          <span><i style={{ background: '#dc2626' }}></i> Cases Analyzed</span>
          <span><i style={{ background: '#10b981' }}></i> Match Accuracy (%)</span>
        </div>
      </div>
    </section>
  );
}
