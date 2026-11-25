# Bloody Expeditor

**Bloody Expeditor** is a forensic serology analysis platform for blood evidence analysis, body fluid correlation, probabilistic matching, historical timeline exploration, and case management.

> **Disclaimer:** This platform is designed for educational and research purposes in forensic serology.

---

## Features

- **Case Studies Management:** Browse, search, filter by category, inspect detailed forensic findings, and submit new serology cases (`CaseStudies`, `CaseModal`, `AddCaseModal`).
- **Analytics Dashboard:** Visualize blood type distribution, crime-type breakdowns, sample match rates, monthly processing rates, laboratory efficiency metrics, and multi-year historical case accuracy.
- **Probabilistic Matching Calculator:** Compute random match probability, likelihood ratio, secretor-status-adjusted likelihood ratio, Bayesian posterior probability, and qualitative strength interpretation from evidence vs. suspect blood types, alongside a population frequency reference table.
- **Forensic Serology Timeline:** Interactive historical milestones from Landsteiner's 1901 ABO discovery through AI-powered forensic analysis.
- **Body Fluid Correlation Matrix:** Explore correlation scores and co-occurrence data across forensic body fluids.

---

## Tech Stack

- **Frontend (`frontend-react/`):** React 18, Vite 5, Lucide React (`lucide-react`), deployed-ready with `vercel.json` SPA rewrites.
- **Backend (`backend/`):** Node.js (ES Modules), Express 4, CORS, dotenv, JSON file persistence (`backend/data/`).
- **Static Prototype (`frontend/`):** Vanilla HTML, CSS, and JavaScript version in `frontend/Bloody-Expidator-main/Bloody-Expidator-main/`.

---

## Project Structure

```text
.
├── backend/
│   ├── data/
│   │   ├── cases.json
│   │   ├── correlation_data.json
│   │   └── population_freq.json
│   ├── routes/
│   │   ├── analytics.js
│   │   ├── cases.js
│   │   ├── correlation.js
│   │   ├── probability.js
│   │   └── timeline.js
│   ├── package.json
│   └── server.js
├── frontend-react/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddCaseModal.jsx
│   │   │   ├── AnalyticsDashboard.jsx
│   │   │   ├── BackgroundCanvas.jsx
│   │   │   ├── CaseModal.jsx
│   │   │   ├── CaseStudies.jsx
│   │   │   ├── CorrelationMatrix.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── ProbabilityCalculator.jsx
│   │   │   └── Timeline.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
└── frontend/
    └── Bloody-Expidator-main/Bloody-Expidator-main/
        ├── index.html
        ├── script.js
        └── styles.css
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### 1. Start the Backend API

```bash
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:5000` by default (configurable via `PORT` in `backend/.env`). Use `npm start` for production.

### 2. Start the React Frontend

Open a second terminal:

```bash
cd frontend-react
npm install
npm run dev
```

The Vite dev server starts on `http://localhost:3000` and automatically proxies `/api` requests to `http://localhost:5000` (configured in `frontend-react/vite.config.js`).

### Environment Variables

- **Backend (`backend/.env`):**
  - `PORT` — API server port (default: `5000`)
- **Frontend (`frontend-react/.env`):**
  - `VITE_API_URL` — Base API URL for production deployments (defaults to `/api` in development)

### Production Build

```bash
cd frontend-react
npm run build
npm run preview
```

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | API health check |
| `GET` | `/api/cases` | List cases (supports `category` and `search` query parameters) |
| `GET` | `/api/cases/:id` | Get single case details |
| `POST` | `/api/cases` | Create a new case (`title` and `bloodType` required) |
| `GET` | `/api/analytics/stats` | Summary dashboard statistics |
| `GET` | `/api/analytics/blood-distribution` | Population blood type distribution |
| `GET` | `/api/analytics/crime-types` | Case breakdown by category |
| `GET` | `/api/analytics/match-rates` | Sample match/mismatch/inconclusive rates |
| `GET` | `/api/analytics/processing-rate` | Monthly sample processing metrics |
| `GET` | `/api/analytics/metrics` | Laboratory performance metrics |
| `GET` | `/api/analytics/historical-timeline` | Multi-year case count and accuracy trends |
| `GET` | `/api/probability/reference` | Population frequency reference data |
| `POST` | `/api/probability/calculate` | Calculate match likelihood ratio and Bayesian posterior probability |
| `GET` | `/api/correlation/matrix` | Body fluid correlation matrix and fluid details |
| `GET` | `/api/correlation/cooccurrence` | Body fluid co-occurrence statistics |
| `GET` | `/api/timeline` | Historical forensic serology milestones |
