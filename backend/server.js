import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import casesRouter from './routes/cases.js';
import analyticsRouter from './routes/analytics.js';
import probabilityRouter from './routes/probability.js';
import correlationRouter from './routes/correlation.js';
import timelineRouter from './routes/timeline.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'Bloody Expeditor API is running', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/cases', casesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/probability', probabilityRouter);
app.use('/api/correlation', correlationRouter);
app.use('/api/timeline', timelineRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🩸 Bloody Expeditor API running on http://localhost:${PORT}`);
});
