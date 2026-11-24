// Portfolio verdict for each of the 55 roadmap projects.
// Keys match schedule.js and saved progress: 'phaseKey.projects.index'. roadmap.js is not changed.
//   strong   = great portfolio piece
//   good     = solid portfolio piece
//   practice = for learning only, not for the portfolio
//   rework   = worth doing with the change in `tip`
//   skip     = not worth the time

export const VERDICTS = {
  strong:   { label: 'Strong',   hint: 'Great portfolio piece' },
  good:     { label: 'Good',     hint: 'Solid portfolio piece' },
  practice: { label: 'Practice', hint: 'For learning only, not for your portfolio' },
  rework:   { label: 'Rework',   hint: 'Worth doing with a change' },
  skip:     { label: 'Skip',     hint: 'Not worth the time' },
};

export const PROJECT_VERDICTS = {
  'phase1.projects.0': { v: 'practice' }, // Data Cleaning Pipeline
  'phase1.projects.1': { v: 'strong' }, // SQL Analytics Project
  'phase1.projects.2': { v: 'good' }, // Exploratory Data Analysis Report
  'phase1.projects.3': { v: 'good' }, // Web Scraper
  'phase1.projects.4': { v: 'good' }, // REST API Data Pipeline
  'phase1.projects.5': { v: 'practice' }, // Statistics Simulator
  'phase1.projects.6': { v: 'good' }, // Personal Finance Analytics Dashboard
  'phase1.projects.7': { v: 'strong' }, // Cricket Stats Query Engine
  'phase1.projects.8': { v: 'good' }, // City Livability Index
  'phase1.projects.9': { v: 'rework', tip: "Make it a clickbait-headline classifier." }, // Fake News Stylometric Detector
  'phase1.projects.10': { v: 'skip' }, // API-Driven Weather Alert Bot
  'phase1.projects.11': { v: 'good' }, // Personal Data Audit
  'phase2.projects.0': { v: 'practice' }, // Titanic Survival Prediction
  'phase2.projects.1': { v: 'rework', tip: "Use Indian city property data." }, // House Price Prediction
  'phase2.projects.2': { v: 'strong' }, // Customer Churn Prediction
  'phase2.projects.3': { v: 'rework', tip: "Use books, recipes or products, not MovieLens." }, // Recommendation System
  'phase2.projects.4': { v: 'rework', tip: "Sales only; drop stock prediction." }, // Time Series Forecasting
  'phase2.projects.5': { v: 'practice' }, // End-to-End ML Pipeline
  'phase2.projects.6': { v: 'strong' }, // Algorithmic Fairness Audit
  'phase2.projects.7': { v: 'strong' }, // Crop Yield Predictor
  'phase2.projects.8': { v: 'practice' }, // Esports Match Outcome Predictor
  'phase2.projects.9': { v: 'strong' }, // Dynamic Pricing Simulator
  'phase2.projects.10': { v: 'good' }, // Server Log Anomaly Detector
  'phase2.projects.11': { v: 'strong' }, // Uplift Modeling for Marketing Campaigns
  'phase3.projects.0': { v: 'practice' }, // Image Classifier (CNN)
  'phase3.projects.1': { v: 'rework', tip: "Use Hindi or Gujarati reviews." }, // Sentiment Analysis with Transformers
  'phase3.projects.2': { v: 'rework', tip: "Pick one specific use, e.g. government schemes." }, // Text Summarization or Chatbot
  'phase3.projects.3': { v: 'good' }, // Object Detection
  'phase3.projects.4': { v: 'practice' }, // Deployed ML Web App
  'phase3.projects.5': { v: 'good' }, // MLOps Pipeline
  'phase3.projects.6': { v: 'good' }, // Audio Deep Learning: Genre/Emotion Classifier
  'phase3.projects.7': { v: 'good' }, // Handwritten Math-to-LaTeX Converter
  'phase3.projects.8': { v: 'strong' }, // Multilingual News Classifier
  'phase3.projects.9': { v: 'skip' }, // Deepfake / Image Manipulation Detector
  'phase3.projects.10': { v: 'rework', tip: "Make it work in Hindi/Gujarati." }, // Voice Command Intent Recognizer
  'phase4.projects.0': { v: 'strong' }, // Full End-to-End Capstone
  'phase4.projects.1': { v: 'strong' }, // Interactive Dashboard
  'phase4.projects.2': { v: 'good' }, // Kaggle Competition Entry
  'phase4.projects.3': { v: 'strong' }, // Open-Source Contribution
  'phase4.projects.4': { v: 'practice' }, // Personal Portfolio Site
  'phase4.projects.5': { v: 'strong' }, // Causal Impact Dashboard
  'phase4.projects.6': { v: 'good' }, // Data Science Job Market Tracker
  'phase4.projects.7': { v: 'strong' }, // Automated Weekly Insight Report Generator
  'phase4.projects.8': { v: 'skip' }, // Interview Question Bank Web App
  'phase4.projects.9': { v: 'skip' }, // GitHub Portfolio Analytics
  'phase5.projects.0': { v: 'good' }, // Customer Segmentation Engine
  'phase5.projects.1': { v: 'good' }, // Model Explainability Report + Model Card
  'phase5.projects.2': { v: 'practice' }, // Containerized ML API
  'phase5.projects.3': { v: 'rework', tip: "Pick one domain and measure answer quality." }, // RAG-Based Document Assistant
  'phase5.projects.4': { v: 'rework', tip: "Define one real task." }, // AI Agent Workflow
  'phase5.projects.5': { v: 'good' }, // Voice-Enabled AI Assistant Pipeline
  'phase5.projects.6': { v: 'skip' }, // AI Code Review Agent
  'phase5.projects.7': { v: 'skip' }, // Meeting Summarizer Agent
  'phase5.projects.8': { v: 'strong' }, // Multi-Agent Data Analyst Team
  'phase5.projects.9': { v: 'good' }, // Synthetic Data Generator
};
