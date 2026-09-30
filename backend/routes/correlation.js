import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadCorrelation() {
  return JSON.parse(readFileSync(join(__dirname, '..', 'data', 'correlation_data.json'), 'utf-8'));
}

// GET /api/correlation/matrix
router.get('/matrix', (_req, res) => {
  try {
    const data = loadCorrelation();
    res.json({
      success: true,
      fluids: data.fluids,
      matrix: data.matrix,
      fluidDetails: data.fluidDetails
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/correlation/cooccurrence
router.get('/cooccurrence', (_req, res) => {
  try {
    const data = loadCorrelation();
    res.json({
      success: true,
      cooccurrenceData: data.cooccurrenceData
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
