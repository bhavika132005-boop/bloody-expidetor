import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '..', 'data', 'cases.json');

function loadCases() {
  const raw = readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveCases(cases) {
  writeFileSync(DATA_PATH, JSON.stringify(cases, null, 2), 'utf-8');
}

// GET /api/cases — list & filter
router.get('/', (req, res) => {
  try {
    let cases = loadCases();
    const { category, search } = req.query;

    if (category && category !== 'all') {
      cases = cases.filter(c => c.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      cases = cases.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.excerpt.toLowerCase().includes(q) ||
        c.bloodType.toLowerCase().includes(q) ||
        (c.tags && c.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    res.json({ success: true, cases, total: cases.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/cases/:id — single case detail
router.get('/:id', (req, res) => {
  try {
    const cases = loadCases();
    const found = cases.find(c => c.id === req.params.id);
    if (!found) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }
    res.json({ success: true, case: found });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/cases — create new case
router.post('/', (req, res) => {
  try {
    const cases = loadCases();
    const { title, category, status, bloodType, location, excerpt, tags, findings } = req.body;

    if (!title || !bloodType) {
      return res.status(400).json({ success: false, message: 'Title and bloodType are required' });
    }

    const newId = `BX-${new Date().getFullYear()}-${String(cases.length + 1).padStart(3, '0')}`;
    const newCase = {
      id: newId,
      title,
      category: category || 'homicide',
      status: status || 'active',
      bloodType,
      date: new Date().toISOString().split('T')[0],
      location: location || 'Unspecified',
      excerpt: excerpt || '',
      tags: tags || ['Serology'],
      evidence: [],
      findings: findings || [],
      summary: excerpt || '',
      resolution: null
    };

    cases.unshift(newCase);
    saveCases(cases);

    res.status(201).json({ success: true, case: newCase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
