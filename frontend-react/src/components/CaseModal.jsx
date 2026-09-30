import React from 'react';
import { X } from 'lucide-react';

export default function CaseModal({ caseData, onClose }) {
  if (!caseData) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-content">
          <h2>{caseData.title}</h2>
          <span className="modal-case-id">
            {caseData.id} | Blood Type: {caseData.bloodType} | Status: {caseData.status?.toUpperCase()}
          </span>

          <div className="modal-section">
            <h4>Case Summary</h4>
            <p>{caseData.summary || caseData.excerpt}</p>
          </div>

          {caseData.evidence && caseData.evidence.length > 0 && (
            <div className="modal-section">
              <h4>Evidence Analysis</h4>
              <div className="modal-evidence-grid">
                {caseData.evidence.map((ev, idx) => (
                  <div key={idx} className="modal-ev-item">
                    <strong>{ev.label}</strong>
                    <span>{ev.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {caseData.findings && caseData.findings.length > 0 && (
            <div className="modal-section">
              <h4>Key Findings</h4>
              <ul>
                {caseData.findings.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {caseData.resolution && (
            <div className="modal-section">
              <h4>Resolution / Current Status</h4>
              <p>{caseData.resolution}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
