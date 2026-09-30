import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { createCase } from '../services/api';

export default function AddCaseModal({ onClose, onCaseAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'homicide',
    status: 'active',
    bloodType: 'O+',
    location: '',
    excerpt: '',
    findings: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.bloodType) {
      setError('Please provide at least a title and blood type.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        tags: ['Serology', formData.bloodType, formData.category],
        findings: formData.findings ? formData.findings.split('\n').filter(Boolean) : ['Initial report logged into system.']
      };

      const res = await createCase(payload);
      if (res.success) {
        onCaseAdded(res.case);
        onClose();
      } else {
        setError(res.message || 'Failed to create case');
      }
    } catch (err) {
      setError('Network error while saving case record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-content">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
            <PlusCircle size={22} /> Add New Serology Case
          </h2>
          <span className="modal-case-id">Register a new blood evidence investigation into Express backend</span>

          {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Case Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Harbor Precinct Homicide Evidence"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="homicide">Homicide</option>
                  <option value="assault">Assault</option>
                  <option value="cold-case">Cold Case</option>
                  <option value="dna">DNA Match</option>
                </select>
              </div>

              <div className="form-group">
                <label>Blood Type *</label>
                <select name="bloodType" value={formData.bloodType} onChange={handleChange}>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">ACTIVE</option>
                  <option value="closed">CLOSED</option>
                  <option value="review">REVIEW</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., Sector 7 Docklands"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Summary / Excerpt</label>
              <textarea
                name="excerpt"
                rows="2"
                placeholder="Brief summary of blood evidence found..."
                value={formData.excerpt}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Key Findings (one per line)</label>
              <textarea
                name="findings"
                rows="3"
                placeholder="Blood spatter matched blunt impact&#10;Luminol positive reaction&#10;DNA profile match 14/16 loci"
                value={formData.findings}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving Case Record...' : 'Submit New Case'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
