import React, { useState, useEffect } from 'react';
import { Grid3X3, Droplet, Droplets, FlaskConical, Thermometer, Beaker, Eye } from 'lucide-react';
import { fetchCorrelationMatrix, fetchCooccurrence } from '../services/api';

const FLUID_ICONS = {
  Blood: Droplet,
  Saliva: Droplets,
  Semen: FlaskConical,
  Sweat: Thermometer,
  Urine: Beaker,
  Tears: Eye
};

function getCellColor(value) {
  if (value >= 0.9) return { bg: '#dc2626', text: '#fff' };
  if (value >= 0.7) return { bg: '#b91c1c', text: '#fff' };
  if (value >= 0.5) return { bg: '#991b1b', text: '#fecaca' };
  if (value >= 0.35) return { bg: '#7f1d1d', text: '#fca5a5' };
  if (value >= 0.2) return { bg: '#450a0a', text: '#f87171' };
  return { bg: '#1a1a2e', text: '#6b6b80' };
}

export default function CorrelationMatrix() {
  const [matrixData, setMatrixData] = useState(null);
  const [cooccurrence, setCooccurrence] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    fetchCorrelationMatrix()
      .then(r => {
        if (r.success) {
          setMatrixData({
            fluids: r.fluids,
            matrix: r.matrix,
            fluidDetails: r.fluidDetails
          });
        }
      })
      .catch(() => {});

    fetchCooccurrence()
      .then(r => r.success && setCooccurrence(r.cooccurrenceData))
      .catch(() => {});
  }, []);

  const gridSize = matrixData ? matrixData.fluids.length + 1 : 0;

  return (
    <section className="section" id="correlation">
      <div className="section-header">
        <span className="section-tag">CORRELATION ANALYSIS</span>
        <h2 className="section-title">Body Fluid Correlation Matrix</h2>
        <p className="section-desc">
          Interactive heatmap showing statistical correlations between different body fluids found at forensic crime scenes.
        </p>
      </div>

      {/* Heatmap Matrix */}
      {matrixData && (
        <div className="correlation-matrix-wrapper">
          <div
            className="correlation-matrix"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {/* Empty top-left corner */}
            <div className="matrix-cell header-cell"></div>

            {/* Column headers */}
            {matrixData.fluids.map((f, i) => (
              <div key={`col-${i}`} className="matrix-cell header-cell">{f}</div>
            ))}

            {/* Rows */}
            {matrixData.fluids.map((rowFluid, ri) => (
              <React.Fragment key={`row-${ri}`}>
                <div className="matrix-cell header-cell">{rowFluid}</div>
                {matrixData.matrix[ri].map((value, ci) => {
                  const { bg, text } = getCellColor(value);
                  const isHovered = hoveredCell?.row === ri && hoveredCell?.col === ci;
                  return (
                    <div
                      key={`cell-${ri}-${ci}`}
                      className="matrix-cell data-cell"
                      style={{
                        backgroundColor: bg,
                        color: text,
                        transform: isHovered ? 'scale(1.15)' : undefined,
                        zIndex: isHovered ? 2 : undefined,
                        boxShadow: isHovered ? '0 0 16px rgba(220,38,38,0.5)' : undefined
                      }}
                      onMouseEnter={() => setHoveredCell({ row: ri, col: ci })}
                      onMouseLeave={() => setHoveredCell(null)}
                      title={`${rowFluid} × ${matrixData.fluids[ci]}: ${value.toFixed(2)}`}
                    >
                      {value.toFixed(2)}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          <div className="matrix-scale">
            <span>Low</span>
            <div className="scale-gradient"></div>
            <span>High</span>
          </div>
        </div>
      )}

      {/* Fluid Detail Cards */}
      {matrixData && matrixData.fluidDetails && (
        <div className="fluid-grid">
          {matrixData.fluidDetails.map((fluid) => {
            const IconComponent = FLUID_ICONS[fluid.name] || Droplet;
            return (
              <div key={fluid.name} className="fluid-card">
                <div className="fluid-icon" style={{ '--fluid-color': fluid.color }}>
                  <IconComponent size={24} />
                </div>
                <h4>{fluid.name}</h4>
                <p>{fluid.description}</p>
                <div className="fluid-stats">
                  <span>Detection: <strong>{fluid.detection}</strong></span>
                </div>
                <div className="fluid-stats" style={{ marginTop: '0.5rem' }}>
                  <span>Co-occurrence: <strong>{fluid.cooccurrence}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Co-occurrence Data */}
      {cooccurrence.length > 0 && (
        <div className="cooccurrence">
          <div className="card-title">
            <Grid3X3 size={18} color="#dc2626" />
            Fluid Co-occurrence Analysis
          </div>
          <div className="bar-chart">
            {cooccurrence.map((item) => (
              <div key={item.pair} className="bar-item">
                <span className="bar-label" style={{ minWidth: '140px' }}>{item.pair}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${item.percentage}%`,
                      background: `linear-gradient(90deg, #7f1d1d, #dc2626)`
                    }}
                  />
                </div>
                <span className="bar-value">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
