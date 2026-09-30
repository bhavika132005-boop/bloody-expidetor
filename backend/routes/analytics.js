import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadCases() {
  return JSON.parse(readFileSync(join(__dirname, '..', 'data', 'cases.json'), 'utf-8'));
}

function loadPopulation() {
  return JSON.parse(readFileSync(join(__dirname, '..', 'data', 'population_freq.json'), 'utf-8'));
}

// GET /api/analytics/stats
router.get('/stats', (_req, res) => {
  try {
    const cases = loadCases();
    const stats = {
      casesAnalyzed: cases.length * 356 + 3,
      matchAccuracy: 98.7,
      activeInvestigations: cases.filter(c => c.status === 'active').length * 78,
      fluidTypesTracked: 12
    };
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/blood-distribution
router.get('/blood-distribution', (_req, res) => {
  try {
    const pop = loadPopulation();
    const distribution = pop.bloodTypes.map(bt => ({
      type: bt.type,
      percentage: bt.frequency,
      color: getBloodColor(bt.type)
    }));
    res.json({ success: true, distribution });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/crime-types
router.get('/crime-types', (_req, res) => {
  try {
    const cases = loadCases();
    const counts = {};
    cases.forEach(c => {
      const cat = c.category || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const crimeTypes = Object.entries(counts).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
      count,
      percentage: Math.round((count / cases.length) * 100)
    }));

    res.json({ success: true, crimeTypes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/match-rates
router.get('/match-rates', (_req, res) => {
  res.json({
    success: true,
    matchRates: {
      totalSamples: 4218,
      matched: 3847,
      mismatched: 289,
      inconclusive: 82,
      matchPercentage: 91.2,
      mismatchPercentage: 6.9,
      inconclusivePercentage: 1.9
    }
  });
});

// GET /api/analytics/processing-rate
router.get('/processing-rate', (_req, res) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = months.map(month => ({
    month,
    processed: Math.floor(Math.random() * 120) + 180,
    pending: Math.floor(Math.random() * 40) + 10
  }));

  res.json({ success: true, processingRate: data });
});

// GET /api/analytics/metrics
router.get('/metrics', (_req, res) => {
  res.json({
    success: true,
    metrics: {
      dnaExtraction: 94.2,
      sampleIntegrity: 87.5,
      caseResolution: 78.3,
      labEfficiency: 91.8
    }
  });
});

// GET /api/analytics/historical-timeline
router.get('/historical-timeline', (_req, res) => {
  res.json({
    success: true,
    data: [
      { year: 2018, cases: 1240, accuracy: 89 },
      { year: 2019, cases: 1580, accuracy: 91 },
      { year: 2020, cases: 1320, accuracy: 92 },
      { year: 2021, cases: 1890, accuracy: 94 },
      { year: 2022, cases: 2210, accuracy: 96 },
      { year: 2023, cases: 2640, accuracy: 97 },
      { year: 2024, cases: 2847, accuracy: 98 }
    ]
  });
});

function getBloodColor(type) {
  const colors = {
    'O+': '#dc2626', 'O-': '#ef4444',
    'A+': '#b91c1c', 'A-': '#f87171',
    'B+': '#991b1b', 'B-': '#fca5a5',
    'AB+': '#7f1d1d', 'AB-': '#450a0a'
  };
  return colors[type] || '#dc2626';
}

export default router;
