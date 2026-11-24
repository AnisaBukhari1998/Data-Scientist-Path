// Skill tree content. One entry per roadmap phase, in the same order and with the
// same titles as src/data/roadmap.js, so the Skill Tree and the Roadmap always agree.
export const SKILLS_DATA = [
  {
    phaseId: 'phase1',
    title: 'Phase 1 — Foundations',
    color: 'phase-teal',
    skills: [
      { id: 's1', name: 'Python & pandas', description: 'Core Python, NumPy and pandas for working with tables of data' },
      { id: 's2', name: 'SQL', description: 'Joins, aggregations, window functions and CTEs' },
      { id: 's3', name: 'Statistics & Probability', description: 'Distributions, hypothesis tests, confidence intervals' },
      { id: 's4', name: 'Maths for ML', description: 'Linear algebra and calculus basics behind the models' }
    ]
  },
  {
    phaseId: 'phase2',
    title: 'Phase 2 — Core ML',
    color: 'phase-amber',
    skills: [
      { id: 's5', name: 'Regression', description: 'Predicting numbers: linear models, regularisation' },
      { id: 's6', name: 'Classification', description: 'Predicting categories: trees, ensembles, imbalanced data' },
      { id: 's7', name: 'Feature Engineering', description: 'Turning raw columns into useful model inputs' },
      { id: 's8', name: 'Model Pipelines & Evaluation', description: 'scikit-learn pipelines, cross-validation, metrics' }
    ]
  },
  {
    phaseId: 'phase3',
    title: 'Phase 3 — Deep Learning & Deployment',
    color: 'phase-violet',
    skills: [
      { id: 's9', name: 'Neural Networks', description: 'Backpropagation, PyTorch / TensorFlow' },
      { id: 's10', name: 'Computer Vision', description: 'CNNs, image classification and object detection' },
      { id: 's11', name: 'NLP & Transformers', description: 'Text models and fine-tuning with Hugging Face' },
      { id: 's12', name: 'Shipping Models', description: 'Serving a model as a web app or API' }
    ]
  },
  {
    phaseId: 'phase4',
    title: 'Phase 4 — Capstone & Job Readiness',
    color: 'phase-brick',
    skills: [
      { id: 's13', name: 'Data Visualization & Storytelling', description: 'Tableau / Power BI dashboards and clear charts' },
      { id: 's14', name: 'A/B Testing & Product Analytics', description: 'Experiments and business metrics' },
      { id: 's15', name: 'Capstone & Portfolio', description: 'An end-to-end project and a portfolio that shows it' },
      { id: 's16', name: 'Interview Prep', description: 'SQL, statistics and case-study interview practice' }
    ]
  },
  {
    phaseId: 'phase5',
    title: 'Phase 5 — AI Engineering, MLOps & Applied GenAI',
    color: 'phase-rose',
    skills: [
      { id: 's17', name: 'Docker & APIs', description: 'Containerised FastAPI services and real API use' },
      { id: 's18', name: 'MLOps', description: 'Experiment tracking, CI/CD and monitoring' },
      { id: 's19', name: 'Explainability & Unsupervised Learning', description: 'SHAP/LIME, clustering and segmentation' },
      { id: 's20', name: 'GenAI: RAG & Agents', description: 'Prompting, embeddings, retrieval and LLM agents' }
    ]
  }
];
