import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadPopulation() {
  return JSON.parse(readFileSync(join(__dirname, '..', 'data', 'population_freq.json'), 'utf-8'));
}

// GET /api/probability/reference — population frequency table
router.get('/reference', (_req, res) => {
  try {
    const pop = loadPopulation();
    res.json({ success: true, ...pop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/probability/calculate
router.post('/calculate', (req, res) => {
  try {
    const { evidenceBloodType, suspectBloodType, secretorStatus, populationGroup } = req.body;

    if (!evidenceBloodType || !suspectBloodType) {
      return res.status(400).json({ success: false, message: 'evidenceBloodType and suspectBloodType are required' });
    }

    const pop = loadPopulation();
    const evidenceData = pop.bloodTypes.find(bt => bt.type === evidenceBloodType);
    const suspectData = pop.bloodTypes.find(bt => bt.type === suspectBloodType);

    if (!evidenceData || !suspectData) {
      return res.status(400).json({ success: false, message: 'Invalid blood type specified' });
    }

    const isMatch = evidenceBloodType === suspectBloodType;
    const evidenceFrequency = evidenceData.frequency / 100;

    // Random match probability
    const randomMatchProbability = evidenceFrequency;

    // Likelihood ratio (1 / frequency for match, scaled down for mismatch)
    const likelihoodRatio = isMatch
      ? (1 / evidenceFrequency).toFixed(1)
      : 0;

    // Secretor adjustment
    const isSecretor = secretorStatus === 'secretor';
    const secretorFreq = isSecretor ? 0.80 : 0.20;
    const combinedProbability = evidenceFrequency * secretorFreq;
    const adjustedLR = isMatch
      ? (1 / combinedProbability).toFixed(1)
      : 0;

    // Bayesian posterior (with uniform prior)
    const priorOdds = 1 / 1000; // 1 in 1000 prior
    const posteriorOdds = isMatch ? priorOdds * parseFloat(likelihoodRatio) : 0;
    const posteriorProbability = posteriorOdds / (1 + posteriorOdds);

    const result = {
      isMatch,
      evidenceBloodType,
      suspectBloodType,
      evidenceFrequency: (evidenceFrequency * 100).toFixed(1),
      randomMatchProbability: (randomMatchProbability * 100).toFixed(2),
      likelihoodRatio: parseFloat(likelihoodRatio),
      secretorStatus: isSecretor ? 'Secretor (80%)' : 'Non-Secretor (20%)',
      combinedProbability: (combinedProbability * 100).toFixed(3),
      adjustedLikelihoodRatio: parseFloat(adjustedLR),
      posteriorProbability: (posteriorProbability * 100).toFixed(4),
      interpretation: isMatch
        ? `Blood type match (${evidenceBloodType}). The evidence blood type occurs in ${(evidenceFrequency * 100).toFixed(1)}% of the population. The likelihood ratio is ${likelihoodRatio}:1, meaning the evidence is ${likelihoodRatio} times more likely if the suspect is the source.`
        : `Blood type mismatch: evidence is ${evidenceBloodType}, suspect is ${suspectBloodType}. This is an exclusionary result — the suspect cannot be the source of this blood evidence.`,
      strength: isMatch
        ? (parseFloat(likelihoodRatio) > 100 ? 'Very Strong' : parseFloat(likelihoodRatio) > 10 ? 'Strong' : 'Moderate')
        : 'Exclusion'
    };

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
