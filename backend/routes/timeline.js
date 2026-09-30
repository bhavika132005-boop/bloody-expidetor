import express from 'express';

const router = express.Router();

const milestones = [
  {
    year: '1901',
    title: 'ABO Blood Group Discovery',
    description: 'Karl Landsteiner discovers the ABO blood group system, revolutionizing transfusion medicine and laying the foundation for forensic serology.',
    tags: ['ABO System', 'Karl Landsteiner', 'Nobel Prize 1930'],
    side: 'left'
  },
  {
    year: '1915',
    title: 'First Forensic Blood Typing',
    description: 'Leone Lattes develops a method to determine blood type from dried bloodstains, enabling forensic identification of blood evidence at crime scenes.',
    tags: ['Dried Stains', 'Leone Lattes', 'Forensic Application'],
    side: 'right'
  },
  {
    year: '1937',
    title: 'Rh Factor Identification',
    description: 'Landsteiner and Wiener discover the Rh blood group system, adding another layer of specificity to blood identification for forensic use.',
    tags: ['Rh System', 'Landsteiner & Wiener', 'Antigen Discovery'],
    side: 'left'
  },
  {
    year: '1950',
    title: 'Secretor Status in Forensics',
    description: 'Research establishes that 80% of people secrete ABO antigens into body fluids (saliva, semen), enabling blood type determination from non-blood evidence.',
    tags: ['Secretor Status', 'Body Fluids', 'ABO Antigens'],
    side: 'right'
  },
  {
    year: '1966',
    title: 'Luminol for Blood Detection',
    description: 'Luminol chemiluminescence becomes widely adopted for detecting trace and cleaned blood evidence at crime scenes, even after extensive cleaning.',
    tags: ['Luminol', 'Chemiluminescence', 'Trace Detection'],
    side: 'left'
  },
  {
    year: '1984',
    title: 'DNA Fingerprinting Invented',
    description: 'Sir Alec Jeffreys develops DNA fingerprinting at the University of Leicester, transforming forensic science with individual-level identification power.',
    tags: ['DNA Fingerprinting', 'Alec Jeffreys', 'Genetic Identification'],
    side: 'right'
  },
  {
    year: '1987',
    title: 'First DNA Conviction',
    description: 'Colin Pitchfork becomes the first person convicted using DNA evidence in the UK, establishing DNA as admissible and powerful courtroom evidence.',
    tags: ['First Conviction', 'Colin Pitchfork', 'UK Landmark Case'],
    side: 'left'
  },
  {
    year: '1998',
    title: 'CODIS Database Launch',
    description: 'The FBI launches the Combined DNA Index System (CODIS), creating a national DNA database linking forensic profiles across jurisdictions.',
    tags: ['CODIS', 'FBI', 'National Database'],
    side: 'right'
  },
  {
    year: '2005',
    title: 'Touch DNA Analysis',
    description: 'Advances in DNA sensitivity allow profiling from skin cells left by touch (touch DNA), expanding evidence sources beyond traditional body fluids.',
    tags: ['Touch DNA', 'Trace Evidence', 'Sensitivity Advances'],
    side: 'left'
  },
  {
    year: '2015',
    title: 'Rapid DNA Technology',
    description: 'Rapid DNA instruments can generate DNA profiles in under 2 hours, enabling real-time forensic identification during active investigations.',
    tags: ['Rapid DNA', 'Real-time ID', 'Field Technology'],
    side: 'right'
  },
  {
    year: '2024',
    title: 'AI-Powered Forensic Analysis',
    description: 'Machine learning and AI systems begin automated blood pattern analysis, evidence correlation, and probabilistic matching — the era of Bloody Expeditor.',
    tags: ['AI/ML', 'Automation', 'Bloody Expeditor'],
    side: 'left'
  }
];

// GET /api/timeline
router.get('/', (_req, res) => {
  res.json({ success: true, milestones });
});

export default router;
