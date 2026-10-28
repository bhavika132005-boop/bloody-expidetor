const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE_URL}/analytics/stats`);
  return res.json();
}

export async function fetchCases(category = 'all', search = '') {
  const query = new URLSearchParams();
  if (category && category !== 'all') query.append('category', category);
  if (search) query.append('search', search);

  const res = await fetch(`${API_BASE_URL}/cases?${query.toString()}`);
  return res.json();
}

export async function fetchCaseDetail(id) {
  const res = await fetch(`${API_BASE_URL}/cases/${id}`);
  return res.json();
}

export async function createCase(caseData) {
  const res = await fetch(`${API_BASE_URL}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(caseData)
  });
  return res.json();
}

export async function fetchBloodDistribution() {
  const res = await fetch(`${API_BASE_URL}/analytics/blood-distribution`);
  return res.json();
}

export async function fetchCrimeTypes() {
  const res = await fetch(`${API_BASE_URL}/analytics/crime-types`);
  return res.json();
}

export async function fetchMatchRates() {
  const res = await fetch(`${API_BASE_URL}/analytics/match-rates`);
  return res.json();
}

export async function fetchProcessingRate() {
  const res = await fetch(`${API_BASE_URL}/analytics/processing-rate`);
  return res.json();
}

export async function fetchMetrics() {
  const res = await fetch(`${API_BASE_URL}/analytics/metrics`);
  return res.json();
}

export async function fetchHistoricalTimeline() {
  const res = await fetch(`${API_BASE_URL}/analytics/historical-timeline`);
  return res.json();
}

export async function fetchProbabilityReference() {
  const res = await fetch(`${API_BASE_URL}/probability/reference`);
  return res.json();
}

export async function calculateProbability(payload) {
  const res = await fetch(`${API_BASE_URL}/probability/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function fetchCorrelationMatrix() {
  const res = await fetch(`${API_BASE_URL}/correlation/matrix`);
  return res.json();
}

export async function fetchCooccurrence() {
  const res = await fetch(`${API_BASE_URL}/correlation/cooccurrence`);
  return res.json();
}

export async function fetchTimelineMilestones() {
  const res = await fetch(`${API_BASE_URL}/timeline`);
  return res.json();
}
