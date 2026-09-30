import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Plus, ArrowRight } from 'lucide-react';
import { fetchCases } from '../services/api';
import CaseModal from './CaseModal';
import AddCaseModal from './AddCaseModal';

export default function CaseStudies() {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCases = () => {
    setLoading(true);
    fetchCases(filter, searchQuery)
      .then((res) => {
        if (res.success) {
          setCases(res.cases);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCases();
    }, 200);
    return () => clearTimeout(timer);
  }, [filter, searchQuery]);

  const handleCaseAdded = (newCase) => {
    setCases((prev) => [newCase, ...prev]);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'closed': return 'status-closed';
      case 'active': return 'status-active';
      case 'review': return 'status-review';
      default: return 'status-active';
    }
  };

  return (
    <section className="section" id="case-studies">
      <div className="section-header">
        <span className="section-tag">CASE REPOSITORY</span>
        <h2 className="section-title">Forensic Case Studies</h2>
        <p className="section-desc">
          Explore documented serology cases with detailed blood evidence analysis, forensic findings, and resolution outcomes.
        </p>
      </div>

      <div className="case-controls">
        {/* Filters */}
        <div className="case-filters">
          {['all', 'homicide', 'assault', 'cold-case', 'dna'].map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'All Cases' : cat === 'cold-case' ? 'Cold Case' : cat === 'dna' ? 'DNA Match' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Search & Add button */}
        <div className="case-search-row">
          <div className="case-search">
            <Search size={18} color="#888" />
            <input
              type="text"
              placeholder="Search cases by ID, type, blood evidence, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="add-case-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            <span>Add Case</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="cases-grid">
        {loading ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
            Loading forensic case records...
          </p>
        ) : cases.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
            No case studies matching criteria.
          </p>
        ) : (
          cases.map((item) => (
            <div key={item.id || item.key} className="case-card">
              <div>
                <div className="case-header">
                  <span className="case-id">{item.id}</span>
                  <span className={`case-status ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                <div className="case-blood-type">
                  <div className="blood-badge">{item.bloodType}</div>
                </div>

                <h3 className="case-title">{item.title}</h3>
                <p className="case-excerpt">{item.excerpt}</p>

                {item.tags && item.tags.length > 0 && (
                  <div className="case-evidence">
                    {item.tags.map((t, idx) => (
                      <div key={idx} className="evidence-tag">
                        <span className="ev-dot"></span>
                        {t}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="case-meta">
                  <span className="meta-item">
                    <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
                    {item.date || '2024'}
                  </span>
                  <span className="meta-item">
                    <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                    {item.location || 'Metro'}
                  </span>
                </div>

                <button
                  className="case-detail-btn"
                  onClick={() => setSelectedCase(item)}
                >
                  View Full Analysis <ArrowRight size={14} style={{ display: 'inline', marginLeft: '4px' }} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedCase && (
        <CaseModal caseData={selectedCase} onClose={() => setSelectedCase(null)} />
      )}

      {/* Add Case Modal */}
      {showAddModal && (
        <AddCaseModal onClose={() => setShowAddModal(false)} onCaseAdded={handleCaseAdded} />
      )}
    </section>
  );
}
