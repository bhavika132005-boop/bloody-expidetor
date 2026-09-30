import React, { useState, useEffect } from 'react';
import { Calculator, FlaskConical, ArrowRight } from 'lucide-react';
import { calculateProbability, fetchProbabilityReference } from '../services/api';

const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export default function ProbabilityCalculator() {
  const [evidenceType, setEvidenceType] = useState('O+');
  const [suspectType, setSuspectType] = useState('O+');
  const [secretor, setSecretor] = useState('secretor');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState(null);

  useEffect(() => {
    fetchProbabilityReference()
      .then(r => r.success && setReference(r))
      .catch(() => {});
  }, []);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await calculateProbability({
        evidenceBloodType: evidenceType,
        suspectBloodType: suspectType,
        secretorStatus: secretor
      });
      if (res.success) {
        setResult(res.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" id="probability">
      <div className="section-header">
        <span className="section-tag">PROBABILITY ENGINE</span>
        <h2 className="section-title">Blood Match Probability Calculator</h2>
        <p className="section-desc">
          Calculate forensic blood type match probabilities, likelihood ratios, and random match statistics using population frequency data.
        </p>
      </div>

      <div className="probability-container">
        {/* Calculator Form */}
        <div className="prob-calculator">
          <div className="calc-title">
            <Calculator size={20} color="#dc2626" />
            Calculate Match Probability
          </div>

          <form className="calc-form" onSubmit={handleCalculate}>
            <div className="calc-row">
              <div className="calc-field">
                <label>EVIDENCE BLOOD TYPE</label>
                <select value={evidenceType} onChange={e => setEvidenceType(e.target.value)}>
                  {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                </select>
              </div>
              <div className="calc-vs">
                <ArrowRight size={20} color="#dc2626" />
              </div>
              <div className="calc-field">
                <label>SUSPECT BLOOD TYPE</label>
                <select value={suspectType} onChange={e => setSuspectType(e.target.value)}>
                  {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                </select>
              </div>
            </div>

            <div className="calc-field full">
              <label>SECRETOR STATUS</label>
              <select value={secretor} onChange={e => setSecretor(e.target.value)}>
                <option value="secretor">Secretor (80% of population)</option>
                <option value="non-secretor">Non-Secretor (20% of population)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Computing...' : 'Calculate Probability'}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="prob-results">
          {!result ? (
            <div className="results-placeholder">
              <FlaskConical size={48} color="#333" />
              <p>Configure blood type parameters and run the calculation to see forensic probability results.</p>
            </div>
          ) : (
            <div className="result-content">
              <div className="result-header">
                <div className={`result-status ${result.isMatch ? 'match' : 'mismatch'}`}>
                  {result.isMatch ? '✓ MATCH' : '✗ MISMATCH'}
                </div>
                <div className="result-title">
                  {result.evidenceBloodType} → {result.suspectBloodType}
                </div>
                <div className="result-subtitle">{result.strength}</div>
              </div>

              <div className="result-grid">
                <div className="result-item">
                  <span className="ri-label">Population Frequency</span>
                  <span className="ri-value">{result.evidenceFrequency}%</span>
                </div>
                <div className="result-item">
                  <span className="ri-label">Random Match Probability</span>
                  <span className="ri-value">1 in {Math.round(100 / parseFloat(result.randomMatchProbability))}</span>
                </div>
                <div className="result-item">
                  <span className="ri-label">Likelihood Ratio</span>
                  <span className="ri-value">{result.likelihoodRatio > 0 ? `${result.likelihoodRatio}:1` : 'N/A (Exclusion)'}</span>
                </div>
                <div className="result-item">
                  <span className="ri-label">Secretor Status</span>
                  <span className="ri-value">{result.secretorStatus}</span>
                </div>
                <div className="result-item">
                  <span className="ri-label">Adjusted LR (with Secretor)</span>
                  <span className="ri-value">{result.adjustedLikelihoodRatio > 0 ? `${result.adjustedLikelihoodRatio}:1` : 'N/A'}</span>
                </div>
                <div className="result-item">
                  <span className="ri-label">Posterior Probability</span>
                  <span className="ri-value">{result.posteriorProbability}%</span>
                </div>
              </div>

              <div className="result-bar">
                <div className="rb-header">
                  <span>Match Confidence</span>
                  <span>{result.isMatch ? result.evidenceFrequency + '%' : '0%'}</span>
                </div>
                <div className="rb-track">
                  <div
                    className="rb-fill"
                    style={{
                      width: result.isMatch ? `${Math.min(parseFloat(result.evidenceFrequency) * 2.5, 100)}%` : '0%',
                      background: result.isMatch
                        ? 'linear-gradient(90deg, #dc2626, #10b981)'
                        : 'linear-gradient(90deg, #dc2626, #7f1d1d)'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Population Reference Table */}
      {reference && reference.bloodTypes && (
        <div className="pop-reference">
          <div className="ref-title">Population Blood Type Frequency Reference</div>
          <div className="ref-table-wrapper">
            <table className="ref-table">
              <thead>
                <tr>
                  <th>TYPE</th>
                  <th>FREQUENCY</th>
                  <th>RARITY</th>
                  <th>ANTIGEN</th>
                  <th>ANTIBODIES</th>
                  <th>DONATE TO</th>
                </tr>
              </thead>
              <tbody>
                {reference.bloodTypes.map((bt) => (
                  <tr key={bt.type}>
                    <td><span className="bt-badge">{bt.type}</span></td>
                    <td>{bt.frequency}%</td>
                    <td><span className={`rarity ${bt.rarity}`}>{bt.rarity}</span></td>
                    <td>{bt.antigen}</td>
                    <td>{bt.antibodies}</td>
                    <td style={{ fontSize: '0.8rem', color: '#a1a1b5' }}>{bt.canDonateTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
