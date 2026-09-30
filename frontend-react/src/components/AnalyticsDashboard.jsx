import React, { useState, useEffect, useRef } from 'react';
import { BarChart2, Activity, Target, Zap } from 'lucide-react';
import {
  fetchBloodDistribution,
  fetchCrimeTypes,
  fetchMatchRates,
  fetchProcessingRate,
  fetchMetrics
} from '../services/api';

export default function AnalyticsDashboard() {
  const [bloodDist, setBloodDist] = useState([]);
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [matchRates, setMatchRates] = useState(null);
  const [processingRate, setProcessingRate] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const donutRef = useRef(null);
  const lineChartRef = useRef(null);

  useEffect(() => {
    fetchBloodDistribution().then(r => r.success && setBloodDist(r.distribution)).catch(() => {});
    fetchCrimeTypes().then(r => r.success && setCrimeTypes(r.crimeTypes)).catch(() => {});
    fetchMatchRates().then(r => r.success && setMatchRates(r.matchRates)).catch(() => {});
    fetchProcessingRate().then(r => r.success && setProcessingRate(r.processingRate)).catch(() => {});
    fetchMetrics().then(r => r.success && setMetrics(r.metrics)).catch(() => {});
  }, []);

  // Draw donut chart
  useEffect(() => {
    if (!matchRates || !donutRef.current) return;
    const canvas = donutRef.current;
    const ctx = canvas.getContext('2d');
    const size = 180;
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2);

    const cx = size / 2, cy = size / 2, r = 65, lineWidth = 18;
    const data = [
      { value: matchRates.matchPercentage, color: '#dc2626' },
      { value: matchRates.mismatchPercentage, color: '#7f1d1d' },
      { value: matchRates.inconclusivePercentage, color: '#4b5563' }
    ];

    let startAngle = -Math.PI / 2;
    data.forEach(segment => {
      const sliceAngle = (segment.value / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, startAngle + sliceAngle);
      ctx.strokeStyle = segment.color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
      startAngle += sliceAngle;
    });
  }, [matchRates]);

  // Draw line chart for processing rate
  useEffect(() => {
    if (processingRate.length === 0 || !lineChartRef.current) return;
    const canvas = lineChartRef.current;
    const ctx = canvas.getContext('2d');
    const w = 600, h = 200;
    canvas.width = w * 2;
    canvas.height = h * 2;
    canvas.style.width = '100%';
    canvas.style.height = `${h}px`;
    ctx.scale(2, 2);

    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const maxVal = Math.max(...processingRate.map(d => d.processed)) * 1.1;

    // Grid lines
    ctx.strokeStyle = '#1e1e30';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
    }

    // Area fill
    ctx.beginPath();
    processingRate.forEach((d, i) => {
      const x = padding.left + (chartW / (processingRate.length - 1)) * i;
      const y = padding.top + chartH - (d.processed / maxVal) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    const lastX = padding.left + chartW;
    ctx.lineTo(lastX, padding.top + chartH);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, padding.top, 0, h);
    gradient.addColorStop(0, 'rgba(220, 38, 38, 0.3)');
    gradient.addColorStop(1, 'rgba(220, 38, 38, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    processingRate.forEach((d, i) => {
      const x = padding.left + (chartW / (processingRate.length - 1)) * i;
      const y = padding.top + chartH - (d.processed / maxVal) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Data points
    processingRate.forEach((d, i) => {
      const x = padding.left + (chartW / (processingRate.length - 1)) * i;
      const y = padding.top + chartH - (d.processed / maxVal) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      ctx.fill();
    });

    // Month labels
    ctx.fillStyle = '#6b6b80';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    processingRate.forEach((d, i) => {
      const x = padding.left + (chartW / (processingRate.length - 1)) * i;
      ctx.fillText(d.month, x, h - 8);
    });
  }, [processingRate]);

  const maxCrime = Math.max(...crimeTypes.map(c => c.percentage), 1);

  return (
    <section className="section section-dark" id="analytics">
      <div className="section-header">
        <span className="section-tag">ANALYTICS ENGINE</span>
        <h2 className="section-title">Forensic Data Analytics</h2>
        <p className="section-desc">
          Real-time analytical dashboards powered by backend data. Blood type distributions, case breakdowns, match rates, and laboratory performance metrics.
        </p>
      </div>

      <div className="analytics-grid">
        {/* Blood Type Distribution */}
        <div className="analytics-card card-lg">
          <div className="card-title">
            <BarChart2 size={18} color="#dc2626" />
            Blood Type Distribution
          </div>
          <div className="bar-chart">
            {bloodDist.map((item) => (
              <div key={item.type} className="bar-item">
                <span className="bar-label">{item.type}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(item.percentage / 40) * 100}%`,
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`
                    }}
                  />
                </div>
                <span className="bar-value">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Match Rate Donut */}
        <div className="analytics-card card-lg">
          <div className="card-title">
            <Target size={18} color="#dc2626" />
            Evidence Match Rates
          </div>
          {matchRates && (
            <>
              <div className="donut-container">
                <canvas ref={donutRef} style={{ width: '180px', height: '180px' }} />
                <div className="donut-center">
                  <span className="donut-value">{matchRates.matchPercentage}%</span>
                  <span className="donut-label">Match Rate</span>
                </div>
              </div>
              <div className="match-stats">
                <div className="match-stat">
                  <span className="ms-dot match"></span>
                  <span className="ms-label">Positive Match</span>
                  <span className="ms-value">{matchRates.matched.toLocaleString()}</span>
                </div>
                <div className="match-stat">
                  <span className="ms-dot mismatch"></span>
                  <span className="ms-label">Mismatch</span>
                  <span className="ms-value">{matchRates.mismatched}</span>
                </div>
                <div className="match-stat">
                  <span className="ms-dot inconclusive"></span>
                  <span className="ms-label">Inconclusive</span>
                  <span className="ms-value">{matchRates.inconclusive}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Lab Performance Metrics */}
        <div className="analytics-card card-metrics">
          <div className="card-title">
            <Zap size={18} color="#dc2626" />
            Lab Performance
          </div>
          {metrics && (
            <div className="metrics-grid">
              {Object.entries(metrics).map(([key, value]) => {
                const circumference = 2 * Math.PI * 36;
                const offset = circumference - (value / 100) * circumference;
                const label = key.replace(/([A-Z])/g, ' $1').trim();
                return (
                  <div key={key} className="metric">
                    <div className="metric-ring">
                      <svg viewBox="0 0 90 90">
                        <circle cx="45" cy="45" r="36" fill="none" stroke="#1e1e30" strokeWidth="6" />
                        <circle
                          className="metric-circle"
                          cx="45" cy="45" r="36"
                          fill="none" stroke="#dc2626" strokeWidth="6"
                          strokeDasharray={circumference}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="metric-percent">{value}%</span>
                    </div>
                    <div className="metric-label">{label}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Crime Type Breakdown */}
        <div className="analytics-card card-wide">
          <div className="card-title">
            <Activity size={18} color="#dc2626" />
            Case Category Breakdown
          </div>
          <div className="bar-chart">
            {crimeTypes.map((item) => (
              <div key={item.type} className="bar-item">
                <span className="bar-label">{item.type}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(item.percentage / maxCrime) * 100}%`,
                      background: 'linear-gradient(90deg, #991b1b, #dc2626)'
                    }}
                  />
                </div>
                <span className="bar-value">{item.count} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Rate Line Chart */}
        <div className="analytics-card card-wide">
          <div className="card-title">
            <BarChart2 size={18} color="#dc2626" />
            Monthly Processing Rate
          </div>
          <div className="line-chart-container">
            <canvas ref={lineChartRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
