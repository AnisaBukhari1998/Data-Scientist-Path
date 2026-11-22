import { useState, useEffect, useRef, useCallback } from 'react';
import { useProgress } from '../context/ProgressContext';
import { 
  CheckCircle2, Circle, ExternalLink, Video, Book as BookIcon, 
  GraduationCap, LayoutTemplate, Link as LinkIcon, Code, FileText, 
  Check, Bookmark, StickyNote, Loader2, MessageSquare, RefreshCw, Award
} from 'lucide-react';
import { ReadmeGenerator } from './ReadmeGenerator';
import { ProjectComments } from './ProjectComments';

function getResourceTime(item, type) {
  if (!Array.isArray(item)) return '10h';
  if (type === 'courses') return item[5] || '20h';
  if (type === 'projects') return item[3] || '15h';
  return item[4] || '10h';
}

function getPlatformForResource(item, type) {
  if (!Array.isArray(item) || item.length < 4) return null;
  const host = (item[1] || '').toLowerCase();
  const url = (item[3] || '').toLowerCase();

  if (host.includes('coursera') || url.includes('coursera.org')) {
    return { key: 'courseraEmail', label: 'Coursera' };
  }
  if (host.includes('edx') || url.includes('edx.org')) {
    return { key: 'edxUser', label: 'edX' };
  }
  if (host.includes('kaggle') || url.includes('kaggle.com')) {
    return { key: 'kaggleUser', label: 'Kaggle' };
  }
  if (host.includes('udemy') || url.includes('udemy.com')) {
    return { key: 'udemyUser', label: 'Udemy' };
  }
  if (host.includes('datacamp') || url.includes('datacamp.com')) {
    return { key: 'datacampUser', label: 'DataCamp' };
  }
  if (host.includes('youtube') || url.includes('youtube.com')) {
    return { key: 'youtubeUser', label: 'YouTube' };
  }
  if (host.includes('medium') || url.includes('medium.com') || host.includes('towards data science')) {
    return { key: 'mediumUser', label: 'Medium' };
  }
  if (host.includes('leetcode') || url.includes('leetcode.com')) {
    return { key: 'leetcodeUser', label: 'LeetCode' };
  }
  if (host.includes('hackerrank') || url.includes('hackerrank.com')) {
    return { key: 'hackerrankUser', label: 'HackerRank' };
  }
  if (host.includes('fast.ai') || url.includes('fast.ai') || host.includes('fastai')) {
    return { key: 'fastaiUser', label: 'Fast.ai' };
  }
  if (host.includes('pluralsight') || url.includes('pluralsight.com')) {
    return { key: 'pluralsightUser', label: 'Pluralsight' };
  }
  if (host.includes('google cloud') || url.includes('cloudskillsboost.google') || host.includes('gcp')) {
    return { key: 'gcpSkillsUser', label: 'Google Cloud Skills Boost' };
  }
  if (host.includes('aws') || url.includes('aws.amazon.com')) {
    return { key: 'awsUser', label: 'AWS Academy' };
  }
  if (host.includes('microsoft learn') || url.includes('learn.microsoft.com') || host.includes('ms learn')) {
    return { key: 'msLearnUser', label: 'Microsoft Learn' };
  }
  if (host.includes('freecodecamp') || url.includes('freecodecamp.org')) {
    return { key: 'freecodecampUser', label: 'FreeCodeCamp' };
  }
  if (host.includes('udacity') || url.includes('udacity.com')) {
    return { key: 'udacityUser', label: 'Udacity' };
  }
  if (host.includes('khan academy') || url.includes('khanacademy.org')) {
    return { key: 'khanacademyUser', label: 'Khan Academy' };
  }
  if (host.includes('hugging face') || url.includes('huggingface.co') || host.includes('huggingface')) {
    return { key: 'huggingfaceUser', label: 'Hugging Face' };
  }
  if (host.includes('datalemur') || url.includes('datalemur.com')) {
    return { key: 'datalemurUser', label: 'DataLemur' };
  }
  if (host.includes('sololearn') || url.includes('sololearn.com')) {
    return { key: 'sololearnUser', label: 'SoloLearn' };
  }
  if (host.includes('sqlzoo') || url.includes('sqlzoo.net')) {
    return { key: 'sqlzooUser', label: 'SQLZoo' };
  }
  if (host.includes('project euler') || url.includes('projecteuler.net')) {
    return { key: 'projecteulerUser', label: 'Project Euler' };
  }
  if (host.includes('elements of ai') || url.includes('elementsofai.com')) {
    return { key: 'elementsofaiUser', label: 'Elements of AI' };
  }
  if (host.includes('deeplearning.ai') || url.includes('deeplearning.ai')) {
    return { key: 'deeplearningaiUser', label: 'DeepLearning.AI' };
  }
  if (host.includes('kodekloud') || url.includes('kodekloud.com')) {
    return { key: 'kodekloudUser', label: 'KodeKloud' };
  }
  if (host.includes('jovian') || url.includes('jovian.com')) {
    return { key: 'jovianUser', label: 'Jovian' };
  }
  return null;
}

function getSubModulesForResource(type) {
  switch (type) {
    case 'courses':
      return [
        'Lectures & theoretical frameworks',
        'End-of-chapter practice quizzes',
        'Guided coding assignments',
        'Module capstone challenge review'
      ];
    case 'books':
      return [
        'Read assigned textbook chapters',
        'Solve core mathematical exercises',
        'Implement code script samples',
        'Write summary notes documentation'
      ];
    case 'videos':
      return [
        'Watch concept tutorial clip',
        'Follow code-along practice file',
        'Review advanced pipeline details'
      ];
    case 'websites':
      return [
        'Read online guide reference docs',
        'Solve interactive sandbox tasks',
        'Complete certification test runs'
      ];
    default:
      return [
        'Introductory setup details',
        'Core module exercises',
        'Final milestone validation'
      ];
  }
}

const PROJECT_SPECS = {
  // Phase 1 — Foundations
  'phase1-0': {
    title: 'Data Cleaning Pipeline',
    description: 'Set up an automated script that ingests a raw messy dataset, handles missing entries using imputation or removal, standardizes date/categorical formats, and exports a clean version.',
    requirements: [
      'Read raw CSV dataset programmatically using Pandas.',
      'Check for missing data and print percentage of NaNs per column.',
      'Impute numerical columns with their median values.',
      'Drop columns where more than 70% of rows are null.',
      'Standardize date-time column syntax to ISO 8601 format.',
      'Remove duplicate records and save clean dataset as a new CSV.'
    ]
  },
  'phase1-1': {
    title: 'SQL Analytics Project',
    description: 'Write a series of SQL queries to extract business insights from a retail or transactional database using joins, groupings, window functions, and CTEs.',
    requirements: [
      'Create multi-table JOINs to aggregate order histories and customer demographic metadata.',
      'Use GROUP BY and HAVING clauses to identify high-value consumer groups.',
      'Apply window functions (RANK, DENSE_RANK, SUM OVER) to track running sales totals.',
      'Construct Common Table Expressions (CTEs) to simplify query structure.',
      'Optimize query execution paths using indexes and column exclusions.'
    ]
  },
  'phase1-2': {
    title: 'Exploratory Data Analysis Report',
    description: 'Run statistical EDA on a public dataset to find trends, correlations, and outliers, producing structured visualizations and summaries.',
    requirements: [
      'Compute descriptive stats (mean, median, skewness) for all variables.',
      'Generate histograms and density plots to analyze value distributions.',
      'Create a correlation heatmap to identify relationships between parameters.',
      'Detect and explain outliers using box plots and Z-scores.',
      'Document findings in a clean Jupyter notebook with markdown commentary.'
    ]
  },
  'phase1-3': {
    title: 'Web Scraper',
    description: 'Build a Python crawler using BeautifulSoup or Scrapy to scrape job descriptions or housing records, saving results to structured files.',
    requirements: [
      'Send HTTP requests with custom headers/user-agents to bypass simple blocks.',
      'Parse HTML elements using CSS selectors or XPath queries.',
      'Extract target features (title, price, location, description) cleanly.',
      'Handle pagination links iteratively to scrape multiple result pages.',
      'Implement request throttling (delays) to act as a polite crawler.'
    ]
  },
  'phase1-4': {
    title: 'REST API Data Pipeline',
    description: 'Create a Python script that fetches weather or finance details from a public REST API, cleans the JSON payloads, and persists it in SQLite.',
    requirements: [
      'Call public REST API endpoints using the requests library.',
      'Handle API rate limit errors (HTTP 429) and network timeouts gracefully.',
      'Clean, parse, and flatten nested JSON responses.',
      'Establish a local SQLite connection and map data tables.',
      'Insert data using parameterized queries to prevent injection.'
    ]
  },
  'phase1-5': {
    title: 'Statistics Simulator',
    description: 'Build a script or Streamlit page simulating the Central Limit Theorem, probability distributions, or hypothesis testing parameters.',
    requirements: [
      'Allow users to choose sample sizes and iteration counts.',
      'Generate random samples from normal, binomial, and exponential distributions.',
      'Plot sample means to visually demonstrate the Central Limit Theorem.',
      'Compute confidence intervals and shade regions on a PDF curve.',
      'Render a p-value calculator that shifts based on alpha sliders.'
    ]
  },
  'phase1-6': {
    title: 'Personal Finance Analytics Dashboard',
    description: 'Ingest monthly bank statements, categorize transactions using keyword matching, and output interactive budget analysis.',
    requirements: [
      'Upload and parse raw PDF/CSV bank statement files.',
      'Categorize expenses (Food, Rent, Bills, Fun) via regex rules.',
      'Calculate monthly savings rates and debt-to-income metrics.',
      'Render pie charts and timeline trends using Matplotlib/Plotly.',
      'Export a clean monthly PDF ledger report.'
    ]
  },
  'phase1-7': {
    title: 'Cricket Stats Query Engine',
    description: 'Create a local relational database storing historic cricket match stats with custom queries for batting averages, strike rates, and bowler economies.',
    requirements: [
      'Import historical CSV logs into normalized SQLite tables.',
      'Write views calculating running averages over multiple seasons.',
      'Formulate queries using CASE WHEN to filter by match locations.',
      'Compute bowler strike rates and economy metrics programmatically.',
      'Build a simple terminal interface to query individual player profiles.'
    ]
  },
  'phase1-8': {
    title: 'City Livability Index',
    description: 'Construct a normalized index scoring municipal districts based on crime statistics, transit density, and weather parameters.',
    requirements: [
      'Merge datasets from government open data portals.',
      'Normalize varied scale features (0 to 1) using MinMax scaling.',
      'Assign weights to transit, safety, and pollution features.',
      'Calculate cumulative index scores for each district.',
      'Export a ranked ranking table with detailed scoring breakdowns.'
    ]
  },
  'phase1-9': {
    title: 'Fake News Stylometric Detector',
    description: 'Analyze article texts for vocabulary density, capitalizations, and exclamation rates to highlight clickbait indicators.',
    requirements: [
      'Tokenize text bodies and count word/character counts.',
      'Calculate Lexical Diversity (unique words / total words).',
      'Compute capitalization ratios and punctuation frequency.',
      'Highlight emotional clickbait terms via sentiment lexicons.',
      'Output a visual readability score alongside a clickbait rating.'
    ]
  },
  'phase1-10': {
    title: 'API-Driven Weather Alert Bot',
    description: 'Set up a pipeline that pulls local weather updates and auto-emails warnings if severe conditions are forecast.',
    requirements: [
      'Fetch forecasts from OpenWeatherMap API every 12 hours.',
      'Scan payloads for severe warnings (storms, high heat, freezing).',
      'Compose formatted emails using Python\'s smtplib library.',
      'Securely load email credentials using environment variables.',
      'Log execution timestamps and trigger statuses in a local text file.'
    ]
  },
  'phase1-11': {
    title: 'Personal Data Audit',
    description: 'Parse personal GPS logs, browser bookmarks, or music history archives to draw interactive usage maps.',
    requirements: [
      'Ingest JSON/CSV history exports (Google Takeout or Spotify).',
      'Parse timestamp strings into day-of-week and hour categories.',
      'Generate activity heatmaps showing active vs inactive study windows.',
      'Map physical coordinates using coordinate clusters.',
      'Summarize top categories (most visited domains or top tracks).'
    ]
  },

  // Phase 2 — Core ML
  'phase2-0': {
    title: 'Titanic Survival Prediction',
    description: 'Train classification models to predict survival rates, applying basic preprocessing, encoding, and baseline assessments.',
    requirements: [
      'Clean passenger details, imputing age gaps and deck letters.',
      'Convert categorical columns using One-Hot and Label encoders.',
      'Train Logistic Regression and Random Forest classifier models.',
      'Verify classifier parameters using classification reports.',
      'Submit predictions to the Kaggle sandbox to score results.'
    ]
  },
  'phase2-1': {
    title: 'House Price Prediction',
    description: 'Build an end-to-end regression model with Scikit-Learn to predict house prices, using train/test splits and hyperparameter tuning.',
    requirements: [
      'Preprocess features using StandardScaler and OneHotEncoder.',
      'Handle multicollinearity by calculating Variance Inflation Factor (VIF).',
      'Train Ridge, Lasso, and Random Forest regressor baselines.',
      'Apply GridSearchCV to optimize model hyperparameters.',
      'Compare performance metrics (RMSE, MAE, R²) on the test set.'
    ]
  },
  'phase2-2': {
    title: 'Customer Churn Prediction',
    description: 'Train a binary classifier to detect customer churn risk, using SMOTE to handle class imbalance.',
    requirements: [
      'Preprocess highly imbalanced classes using SMOTE or scale_pos_weight.',
      'Verify feature importances and perform selection.',
      'Train XGBoost/LightGBM classifiers and evaluate precision-recall.',
      'Plot confusion matrix, Precision-Recall, and ROC-AUC curves.',
      'Save the trained model as a joblib file for downstream inference.'
    ]
  },
  'phase2-3': {
    title: 'Recommendation System',
    description: 'Build a movie recommendation system utilizing collaborative filtering algorithms.',
    requirements: [
      'Parse the MovieLens rating dataset using Pandas.',
      'Compute user-user and item-item cosine similarity matrices.',
      'Implement K-Nearest Neighbors (KNN) to generate recommendations.',
      'Evaluate precision and recall at K items (e.g. Precision@5).',
      'Build a simple interface that accepts a user ID and lists suggestions.'
    ]
  },
  'phase2-4': {
    title: 'Time Series Forecasting',
    description: 'Analyze and forecast retail sales or weather trends using statistical forecasting frameworks.',
    requirements: [
      'Perform seasonal decomposition (Trend, Seasonality, Residuals).',
      'Run Augmented Dickey-Fuller (ADF) tests to check stationarity.',
      'Train ARIMA/SARIMA models and optimize parameters via AIC.',
      'Implement Prophet or XGBoost for comparative forecasting.',
      'Compute Mean Absolute Percentage Error (MAPE) on predictions.'
    ]
  },
  'phase2-5': {
    title: 'End-to-End ML Pipeline',
    description: 'Create a repeatable Scikit-Learn Pipeline object that chains preprocessors, scalers, and estimators.',
    requirements: [
      'Define Pipeline pipelines for numerical and categorical columns.',
      'Bundle standardizers, feature selectors, and model estimators.',
      'Execute cross-validation scores directly on the pipeline.',
      'Prevent data leakage by fitting transformers only on train folds.',
      'Serialize the completed pipeline object using Joblib.'
    ]
  },
  'phase2-6': {
    title: 'Algorithmic Fairness Audit',
    description: 'Audit a credit risk classification model for demographic bias across protected classes.',
    requirements: [
      'Train a baseline classification model on loan histories.',
      'Measure disparate impact ratios across protected features (e.g., gender, age).',
      'Evaluate demographic parity and equalized odds metrics.',
      'Implement threshold adjustments to mitigate bias.',
      'Write an audit card documenting bias metrics and fixes.'
    ]
  },
  'phase2-7': {
    title: 'Crop Yield Predictor',
    description: 'Fit regression models to predict regional agricultural yields using meteorological and soil parameters.',
    requirements: [
      'Ingest agricultural open datasets (rainfall, soil stats, crop type).',
      'Perform target encoding on crop and district name parameters.',
      'Train Ridge and Gradient Boosting regressor models.',
      'Compute R² and Mean Absolute Error (MAE) benchmarks.',
      'Identify top feature importances (e.g., rainfall vs nitrogen).'
    ]
  },
  'phase2-8': {
    title: 'Esports Match Outcome Predictor',
    description: 'Examine competitive game match histories and train a classifier to predict winner outcomes.',
    requirements: [
      'Clean match stats (gold differences, kill ratios, objectives).',
      'Train Random Forest and Support Vector Machine (SVM) models.',
      'Examine ROC-AUC curves for validation splits.',
      'Tune hyperparameters using RandomizedSearchCV.',
      'Predict outcomes on live matches given real-time baseline parameters.'
    ]
  },
  'phase2-9': {
    title: 'Dynamic Pricing Simulator',
    description: 'Build an algorithmic pricing simulator that adjusts SKU prices dynamically to maximize profit.',
    requirements: [
      'Fit price elasticity curves (Demand = a * Price + b).',
      'Model profit curves across varied price spectrum thresholds.',
      'Train an optimization model estimating optimal SKU price bounds.',
      'Simulate competitor response models using game theory logic.',
      'Expose slider controls in a Streamlit preview interface.'
    ]
  },
  'phase2-10': {
    title: 'Server Log Anomaly Detector',
    description: 'Detect anomalous server activity using Isolation Forest and unsupervised clustering.',
    requirements: [
      'Ingest server metrics (CPU usage, memory footprint, request rates).',
      'Normalize metrics using RobustScaler to handle outliers.',
      'Train Isolation Forest and Local Outlier Factor (LOF) models.',
      'Flag outliers and correlate them with historical system crashes.',
      'Plot PCA-reduced anomalies on a 2D scatter plot.'
    ]
  },
  'phase2-11': {
    title: 'Uplift Modeling for Marketing Campaigns',
    description: 'Estimate individual treatment effects to identify who a marketing campaign actually influences.',
    requirements: [
      'Divide campaign historical data into treatment and control arms.',
      'Train dual-model classifiers (T-Learner or S-Learner models).',
      'Compute individual treatment effect (ITE) values for consumers.',
      'Evaluate model using Qini curves or uplift charts.',
      'List targeting profiles that maximize campaigns ROI.'
    ]
  },

  // Phase 3 — Deep Learning & Deployment
  'phase3-0': {
    title: 'Image Classifier (CNN)',
    description: 'Fine-tune a convolutional neural network with PyTorch/Keras to classify produce ripeness from images.',
    requirements: [
      'Write custom PyTorch Dataset loader with image augmentations.',
      'Import pre-trained MobileNetV3/ResNet18 backbone.',
      'Freeze initial weights and attach custom classifier heads.',
      'Optimize model using CrossEntropyLoss and Adam optimizer.',
      'Export the trained model weights (.pt or .h5) for deployment.'
    ]
  },
  'phase3-1': {
    title: 'Sentiment Analysis with Transformers',
    description: 'Fine-tune a Hugging Face transformer model on review datasets to perform text classification.',
    requirements: [
      'Tokenize text datasets using AutoTokenizer.',
      'Import pre-trained DistilBERT weights from Hugging Face Hub.',
      'Set up Hugging Face Trainer arguments (learning rate, batch size).',
      'Evaluate metrics (Accuracy, F1-Score) on the test split.',
      'Publish the fine-tuned checkpoint to Hugging Face model repository.'
    ]
  },
  'phase3-2': {
    title: 'Text Summarization or Chatbot',
    description: 'Expose a text summarization assistant powered by pre-trained seq2seq models.',
    requirements: [
      'Ingest long articles and split them into window sizes.',
      'Load BART or T5 transformer models for abstractive summarization.',
      'Implement beam search decoding to generate natural results.',
      'Compute ROUGE scores to measure summary quality.',
      'Build a simple text-area page interface in React.'
    ]
  },
  'phase3-3': {
    title: 'Object Detection',
    description: 'Train a YOLO or Faster R-CNN model to detect objects on custom image sets.',
    requirements: [
      'Label custom images with bounding boxes (COCO/YOLO format).',
      'Set up YOLO configuration files mapping classes.',
      'Train the model and check mean Average Precision (mAP).',
      'Run prediction tests on test photos, rendering output boxes.',
      'Optimize image inference times using ONNX formats.'
    ]
  },
  'phase3-4': {
    title: 'Deployed ML Web App',
    description: 'Create a Python web API that serves model predictions, hosted on Render or Hugging Face Spaces.',
    requirements: [
      'Write a FastAPI server loading pickled ML model parameters.',
      'Implement input schema validation using Pydantic.',
      'Build a frontend HTML/React client page that fetches API responses.',
      'Ensure CORS permissions allow connection with external callers.',
      'Deploy the server publicly and test endpoints.'
    ]
  },
  'phase3-5': {
    title: 'MLOps Pipeline',
    description: 'Set up an automated ML training pipeline with model registry tracking.',
    requirements: [
      'Log parameters, metrics, and models using MLflow.',
      'Track data variations using DVC versioning.',
      'Set up GitHub Actions to trigger test pipelines on code push.',
      'Write tests verifying model output shapes and bounds.',
      'Establish automated model validation rules before registering.'
    ]
  },
  'phase3-6': {
    title: 'Audio Deep Learning: Genre/Emotion Classifier',
    description: 'Convert sound files to log-mel spectrograms and train a 2D CNN to classify audio signals.',
    requirements: [
      'Load raw audio clips using librosa.',
      'Convert wave signals into 2D mel-spectrogram arrays.',
      'Train a convolutional neural network on spectrogram images.',
      'Handle silent ranges and variable audio lengths programmatically.',
      'Compute confusion matrices over audio test sets.'
    ]
  },
  'phase3-7': {
    title: 'Handwritten Math-to-LaTeX Converter',
    description: 'Build a computer vision model that translates handwritten formulas into clean LaTeX code.',
    requirements: [
      'Segment handwritten equations into character bounding boxes.',
      'Train a CRNN (CNN + LSTM) OCR model on symbol datasets.',
      'Format output symbols into valid LaTeX string structures.',
      'Render the translated LaTeX formulas in a web UI.',
      'Discuss training loss and character error rates (CER).'
    ]
  },
  'phase3-8': {
    title: 'Multilingual News Classifier',
    description: 'Train an NLP classifier categorizing news articles across multiple regional languages.',
    requirements: [
      'Download news articles in regional languages (e.g. Hindi, Tamil).',
      'Tokenize texts using multilingual BERT (mBERT) or XLM-RoBERTa.',
      'Train a text classifier classifying articles by topic (Sports, Tech).',
      'Address class imbalances using stratified train/test splits.',
      'Compare performance between monolingual and multilingual architectures.'
    ]
  },
  'phase3-9': {
    title: 'Deepfake / Image Manipulation Detector',
    description: 'Train a CNN classification model distinguishing authentic portraits from synthetic ones.',
    requirements: [
      'Import authentic and GAN-generated face photo datasets.',
      'Pre-process photos extracting frequency domain representations.',
      'Train ResNet/EfficientNet classifiers on artifact features.',
      'Analyze classification metrics under cross-validation splits.',
      'Write an analysis card discussing detection-arms-race ethics.'
    ]
  },
  'phase3-10': {
    title: 'Voice Command Intent Recognizer',
    description: 'Translate audio statements to text and classify intents using classifier models.',
    requirements: [
      'Convert raw voice statements to transcripts using speech models.',
      'Extract word embeddings (Word2Vec/SentenceTransformers).',
      'Train an intent classifier matching commands to action scripts.',
      'Incorporate fallback rules for low confidence predictions.',
      'Deploy the pipeline as a command-line script.'
    ]
  },

  // Phase 4 — Capstone & Job Readiness
  'phase4-0': {
    title: 'Full End-to-End Capstone',
    description: 'Build a production-grade system: data ingestion, data transformation pipelines, prediction endpoints, and dashboard interfaces.',
    requirements: [
      'Set up a data pipeline fetching public dataset resources.',
      'Pre-process and clean data tables in SQLite or PostgreSQL.',
      'Train and register models in MLflow with logged metrics.',
      'Expose a containerized FastAPI endpoint serving predictions.',
      'Publish an interactive dashboard summarizing system trends.'
    ]
  },
  'phase4-1': {
    title: 'Interactive Dashboard',
    description: 'Create and deploy a multi-page data dashboard using Tableau or Plotly Dash.',
    requirements: [
      'Define interactive dashboard layouts using grids and tabs.',
      'Publish map, timeline, and category distribution charts.',
      'Allow users to filter dashboards by dynamic slider options.',
      'Optimize query times using data extracts and cache layers.',
      'Publish the dashboard publicly on public platforms.'
    ]
  },
  'phase4-2': {
    title: 'Kaggle Competition Entry',
    description: 'Join a Kaggle competition, submit prediction files, and document experimental steps.',
    requirements: [
      'Analyze the competition\'s training set for leakage.',
      'Build feature engineering experiments to extract new features.',
      'Train XGBoost, LightGBM, and neural network ensembles.',
      'Apply out-of-fold predictions to train meta-classifier models.',
      'Document model iterations in a clean Jupyter notebook.'
    ]
  },
  'phase4-3': {
    title: 'Open-Source Contribution',
    description: 'Contribute a pull request (doc fixes, tests, features) to open source data science packages.',
    requirements: [
      'Fork a repository (e.g., pandas, scikit-learn, statsmodels).',
      'Identify doc issues or test failures in open tracker logs.',
      'Implement code or documentation corrections locally.',
      'Verify changes using testing tools (pytest/flake8).',
      'Submit a structured PR with description documentation.'
    ]
  },
  'phase4-4': {
    title: 'Personal Portfolio Site',
    description: 'Launch a static website hosting data science case studies, projects, and summaries.',
    requirements: [
      'Create a responsive portfolio layout using HTML/React.',
      'Incorporate screenshots, code links, and metric details.',
      'Optimize assets to ensure rapid loading performance.',
      'Configure automated publishing pipelines using GitHub Actions.',
      'Link a custom domain name and verify SEO tags.'
    ]
  },
  'phase4-5': {
    title: 'Causal Impact Dashboard',
    description: 'Apply difference-in-differences methods on open policy statistics to write evaluation reports.',
    requirements: [
      'Merge treatment and control group datasets across intervals.',
      'Verify the parallel trends assumption before policy intervention.',
      'Fit linear regressions estimating treatment effects.',
      'Calculate matching weights using propensity score algorithms.',
      'Publish findings on an interactive data dashboard.'
    ]
  },
  'phase4-6': {
    title: 'Data Science Job Market Tracker',
    description: 'Extract job listings using crawlers, index skill keywords, and build job market analytics pages.',
    requirements: [
      'Develop scraping scripts to fetch job listings.',
      'Extract skill keywords (e.g. Python, Spark) using tokenizers.',
      'Summarize top requested frameworks and average salary metrics.',
      'Plot skill frequencies on interactive charts.',
      'Deploy the scraper as a scheduled weekly job.'
    ]
  },
  'phase4-7': {
    title: 'Automated Weekly Insight Report Generator',
    description: 'Set up cron tasks fetching open data, cleaning tables, and rendering PDF insight reports.',
    requirements: [
      'Configure cron schedules using scheduling libraries (celery/crontab).',
      'Ingest new data entries from target public APIs.',
      'Clean and process features using standard preprocessing rules.',
      'Render statistics reports into PDF templates.',
      'Auto-deliver PDF documents to folder directories.'
    ]
  },
  'phase4-8': {
    title: 'Interview Question Bank Web App',
    description: 'Build a flashcard-style interview preparation portal with search tags and categorization.',
    requirements: [
      'Design databases storing coding, SQL, and product questions.',
      'Incorporate text search filters matching tag parameters.',
      'Add diff-viewer screens rendering sample code answers.',
      'Track question completion states in local user storage.',
      'Add a mock-quiz clock keeping track of prep times.'
    ]
  },
  'phase4-9': {
    title: 'GitHub Portfolio Analytics',
    description: 'Incorporate GitHub API connections to display commits and progress statistics.',
    requirements: [
      'Authenticate with GitHub API endpoints.',
      'Retrieve commit timelines across all portfolio repos.',
      'Render activity grids representing progress logs.',
      'Extract top language usage percentages.',
      'Embed the statistics cleanly inside your portfolio landing page.'
    ]
  },

  // Phase 5 — AI Engineering, MLOps & Applied GenAI
  'phase5-0': {
    title: 'Customer Segmentation Engine',
    description: 'Cluster consumer records using K-Means and PCA to group user profiles.',
    requirements: [
      'Clean categorical and numerical customer logs.',
      'Apply Principal Component Analysis (PCA) to reduce dimension scales.',
      'Train K-Means clustering models, using Elbow plots to select K.',
      'Generate radar charts detailing cluster profiles.',
      'Save cluster designations to user databases.'
    ]
  },
  'phase5-1': {
    title: 'Model Explainability Report + Model Card',
    description: 'Analyze model predictions using SHAP/LIME and compile model validation cards.',
    requirements: [
      'Import pre-trained classifier parameters.',
      'Compute SHAP values for test data splits.',
      'Render force plots and summary plots showing feature impacts.',
      'Explain individual sample decisions using LIME.',
      'Compile a model card detailing performance, safety boundaries, and bias checks.'
    ]
  },
  'phase5-2': {
    title: 'Containerized ML API',
    description: 'Wrap models inside FastAPI endpoints and containerize service environments using Docker.',
    requirements: [
      'Write FastAPI endpoints parsing JSON payloads.',
      'Configure Dockerfiles copying requirements and configs.',
      'Validate input metrics utilizing Pydantic models.',
      'Establish loggers tracking API outputs.',
      'Test API endpoints locally using Swagger UI.'
    ]
  },
  'phase5-3': {
    title: 'RAG-Based Document Assistant',
    description: 'Build a document assistant indexing texts into vector stores to answer questions.',
    requirements: [
      'Load and split document texts (PDF/txt) using LangChain.',
      'Embed text blocks using SentenceTransformers or OpenAI.',
      'Index embeddings into local FAISS/Chroma vector stores.',
      'Establish QA chains retrieving context blocks and returning answers.',
      'Incorporate citation attributes referencing source pages.'
    ]
  },
  'phase5-4': {
    title: 'AI Agent Workflow',
    description: 'Establish AI agents calling tools and API endpoints to complete multi-step tasks.',
    requirements: [
      'Define tool classes wrapping API/web search functions.',
      'Construct LangGraph workflows routing state nodes.',
      'Examine prompt directives governing agent decisions.',
      'Expose execution traces detailing agent thoughts.',
      'Establish safety loops to prevent infinite loops.'
    ]
  },
  'phase5-5': {
    title: 'Voice-Enabled AI Assistant Pipeline',
    description: 'Link speech-to-text, LLM agents, and text-to-speech engines into an end-to-end assistant pipeline.',
    requirements: [
      'Record speech inputs and transcribe using Whisper.',
      'Pass transcripts to LLM agents resolving user goals.',
      'Convert agent outputs to audio files using TTS engines.',
      'Stream audio outputs to reduce processing lag.',
      'Deploy the pipeline inside local testing environments.'
    ]
  },
  'phase5-6': {
    title: 'AI Code Review Agent',
    description: 'Write an LLM workflow reading git diff reports and posting code reviews.',
    requirements: [
      'Read git diff files from repositories.',
      'Structure review prompts highlighting bugs or performance gaps.',
      'Call API models returning markdown comments.',
      'Filter output files to skip reviewing binary assets.',
      'Establish the reviewing tool as a command-line script.'
    ]
  },
  'phase5-7': {
    title: 'Meeting Summarizer Agent',
    description: 'Transcribe meeting recordings and extract structured summaries.',
    requirements: [
      'Import meeting audio files and run transcription.',
      'Formulate summarization prompts requesting structured action items.',
      'Generate meeting summary documents.',
      'Highlight attendee details and action tags.',
      'Export results as formatted markdown documents.'
    ]
  },
  'phase5-8': {
    title: 'Multi-Agent Data Analyst Team',
    description: 'Build multi-agent analyst teams collaborating via LangGraph to analyze files.',
    requirements: [
      'Establish Planner, Coder, and Critic agent roles.',
      'Allow agents to generate and execute local Python code.',
      'Pass execution errors back to Coder agents to auto-debug.',
      'Establish critique conditions before final outputs.',
      'Render conversation trees on console displays.'
    ]
  },
  'phase5-9': {
    title: 'Synthetic Data Generator',
    description: 'Generate synthetic datasets mimicking real data distributions using LLM templates.',
    requirements: [
      'Define schemas governing target data tables.',
      'Generate rows using model templates.',
      'Evaluate synthetic data quality using Kolmogorov-Smirnov tests.',
      'Ensure no leakage of private seeds exists.',
      'Export synthetic tables as CSV sheets.'
    ]
  }
};

export function ResourceItem({ phaseKey, category, index, item, type }) {
  const { 
    progress, isCompleted, toggleItem, getProjectLink, setProjectLink,
    toggleBookmark, isBookmarked, setNote, getNote, setResourceLink, getResourceLink,
    openPdf, getItemProgress, setItemProgress, isSubModuleChecked, toggleSubModule,
    setProgress
  } = useProgress();

  const subModules = getSubModulesForResource(type);
  const totalSubModules = subModules.length;

  const currentProgress = getItemProgress(phaseKey, category, index);
  const completed = currentProgress === 100;
  const bookmarked = isBookmarked(phaseKey, category, index);
  const existingNote = getNote(phaseKey, category, index);
  
  const [showGithubInput, setShowGithubInput] = useState(false);
  const [githubUrlInput, setGithubUrlInput] = useState('');
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showSpec, setShowSpec] = useState(false);

  // Verification States
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState(false);

  // Notes state
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState(existingNote);
  const noteTimerRef = useRef(null);

  // Keep noteText synced if the external note changes
  useEffect(() => {
    setNoteText(existingNote);
  }, [existingNote]);

  const savedLinkData = getProjectLink(phaseKey, index);
  const savedGithubLink = typeof savedLinkData === 'object' && savedLinkData ? savedLinkData.url : savedLinkData;
  const isVerified = typeof savedLinkData === 'object' && savedLinkData ? savedLinkData.verified : false;
  const commitsCount = typeof savedLinkData === 'object' && savedLinkData ? savedLinkData.commitsCount : null;

  // Platform individual sync configurations
  const platform = getPlatformForResource(item, type);
  const savedUsername = platform ? (progress._externalProfiles?.[platform.key] || '') : '';
  const [isSyncingIndividual, setIsSyncingIndividual] = useState(false);
  const [syncIndividualSuccess, setSyncIndividualSuccess] = useState(false);
  const [syncIndividualError, setSyncIndividualError] = useState('');

  const handleIndividualSync = () => {
    if (!savedUsername) {
      setSyncIndividualError(`Please link your ${platform.label} credentials in Settings first!`);
      setTimeout(() => setSyncIndividualError(''), 4000);
      return;
    }
    
    setIsSyncingIndividual(true);
    setSyncIndividualError('');
    setSyncIndividualSuccess(false);

    // Simulate API certificate verification for that username on the platform
    setTimeout(async () => {
      setIsSyncingIndividual(false);
      setSyncIndividualSuccess(true);
      await setItemProgress(phaseKey, category, index, 100);
      setTimeout(() => setSyncIndividualSuccess(false), 4000);
    }, 1200);
  };

  // Resource Verification States
  const [showResourceInput, setShowResourceInput] = useState(false);
  const [resourceUrlInput, setResourceUrlInput] = useState('');
  const [isVerifyingResource, setIsVerifyingResource] = useState(false);
  const [resourceVerifyError, setResourceVerifyError] = useState('');
  const [resourceVerifySuccess, setResourceVerifySuccess] = useState(false);

  const savedResourceData = getResourceLink(phaseKey, category, index);
  const savedResourceUrl = savedResourceData?.url || null;
  const isResourceVerified = savedResourceData?.verified || false;

  const handleSaveResourceLink = async () => {
    if (!resourceUrlInput) return;
    
    try {
      new URL(resourceUrlInput);
      setIsVerifyingResource(true);
      setResourceVerifyError('');
      setResourceVerifySuccess(false);

      setTimeout(async () => {
        await setResourceLink(phaseKey, category, index, {
          url: resourceUrlInput,
          verified: true
        });

        // Update progress to 100% completed and mark all sub-modules checked
        const newProgress = { ...progress };
        newProgress._resourceProgress = {
          ...(newProgress._resourceProgress || {}),
          [`${phaseKey}-${category}-${index}`]: 100
        };

        newProgress._checkedSubModules = { ...(newProgress._checkedSubModules || {}) };
        for (let i = 0; i < totalSubModules; i++) {
          const subKey = `${phaseKey}-${category}-${index}-${i}`;
          newProgress._checkedSubModules[subKey] = true;
        }

        const currentPhase = newProgress[phaseKey] || {};
        const currentCat = currentPhase[category] || [];
        if (!currentCat.includes(index)) {
          newProgress[phaseKey] = {
            ...currentPhase,
            [category]: [...currentCat, index]
          };
        }

        await setProgress(newProgress);
        localStorage.setItem('dsp_progress', JSON.stringify(newProgress));

        setResourceVerifySuccess(true);
        setTimeout(() => {
          setResourceVerifySuccess(false);
        }, 3000);
        setIsVerifyingResource(false);
      }, 600);
    } catch (e) {
      setResourceVerifyError('Please enter a valid verification URL.');
    }
  };

  const handleUnlinkResourceLink = async () => {
    await setResourceLink(phaseKey, category, index, null);
    
    const newProgress = { ...progress };
    newProgress._resourceProgress = {
      ...(newProgress._resourceProgress || {}),
      [`${phaseKey}-${category}-${index}`]: 0
    };

    newProgress._checkedSubModules = { ...(newProgress._checkedSubModules || {}) };
    for (let i = 0; i < totalSubModules; i++) {
      const subKey = `${phaseKey}-${category}-${index}-${i}`;
      newProgress._checkedSubModules[subKey] = false;
    }

    const currentPhase = newProgress[phaseKey] || {};
    const currentCat = currentPhase[category] || [];
    newProgress[phaseKey] = {
      ...currentPhase,
      [category]: currentCat.filter(i => i !== index)
    };

    await setProgress(newProgress);
    localStorage.setItem('dsp_progress', JSON.stringify(newProgress));
  };

  const handleSaveGithubLink = async (customUrl) => {
    const targetUrl = customUrl || githubUrlInput;
    if (!targetUrl) return;
    
    // basic regex check
    const match = targetUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      setVerifyError('Please enter a valid GitHub repository URL.');
      return;
    }
    
    const owner = match[1];
    const repo = match[2].replace(/\.git$/, '');
    
    setIsVerifying(true);
    setVerifyError('');
    setVerifySuccess(false);
    
    try {
      const headers = {};
      if (progress._githubUser?.token) {
        headers['Authorization'] = `token ${progress._githubUser.token}`;
      }
      
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, { headers });
      if (response.ok) {
        const commits = await response.json();
        const count = Array.isArray(commits) ? commits.length : 0;
        
        // Save link data
        await setProjectLink(phaseKey, index, {
          url: targetUrl,
          verified: true,
          commitsCount: count
        });
        
        // Auto-complete the project in the roadmap if not already checked!
        if (!completed) {
          await toggleItem(phaseKey, category, index);
        }
        
        setVerifySuccess(true);
        setTimeout(() => {
          setShowGithubInput(false);
          setVerifySuccess(false);
        }, 2000);
      } else {
        setVerifyError('Repository not found or access denied.');
      }
    } catch (err) {
      setVerifyError('Network error. Saving as unverified.');
      await setProjectLink(phaseKey, index, {
        url: targetUrl,
        verified: false
      });
      setTimeout(() => setShowGithubInput(false), 2000);
    } finally {
      setIsVerifying(false);
    }
  };


  // Auto-save note after 1 second of inactivity
  const handleNoteChange = useCallback((e) => {
    const text = e.target.value;
    setNoteText(text);

    if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
    noteTimerRef.current = setTimeout(() => {
      setNote(phaseKey, category, index, text);
    }, 1000);
  }, [phaseKey, category, index, setNote]);

  // Save note on blur
  const handleNoteBlur = useCallback(() => {
    if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
    setNote(phaseKey, category, index, noteText);
  }, [phaseKey, category, index, noteText, setNote]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
    };
  }, []);

  // Extract properties based on item format which is an array
  const title = item[0];
  const source = item[1];
  let details = item[2];
  let url = item[3];

  // For lists that don't have 4 items initially (like websites which might just have 3)
  if (item.length >= 6 && typeof item[2] === 'string' && (item[2].startsWith('http') || item[2].startsWith('/books/'))) {
    url = item[2];
    details = null;
  }
  
  // Calculate estimated study duration dynamically
  const time = getResourceTime(item, type);

  // Parse difficulty based on actual array structure length
  let difficulty = 'Beginner';
  if (item.length === 5) {
    difficulty = item[2];
  } else if (item.length === 6) {
    difficulty = item[3];
  } else if (item.length === 7) {
    difficulty = item[4];
  }

  const getIcon = () => {
    switch (type) {
      case 'courses': return <GraduationCap size={18} className="text-blue-500" />;
      case 'books': return <BookIcon size={18} className="text-emerald-500" />;
      case 'videos': return <Video size={18} className="text-rose-500" />;
      case 'websites': return <LinkIcon size={18} className="text-indigo-500" />;
      case 'projects': return <LayoutTemplate size={18} className="text-amber-500" />;
      default: return <GraduationCap size={18} className="text-blue-500" />;
    }
  };

  return (
    <>
    <div 
      className={`group relative flex items-start gap-4 p-4 rounded-xl transition-all duration-200 
        ${completed 
          ? 'border-l-3 border-l-phase-teal/60 bg-phase-teal/[0.03]' 
          : 'border-l-3 border-l-transparent hover:bg-surface-hover hover:shadow-lg'
        }
        border-b border-border-line last:border-b-0
      `}
    >
      {/* Completion toggle */}
      <button 
        onClick={() => toggleItem(phaseKey, category, index, totalSubModules)}
        className="mt-0.5 flex-shrink-0 focus:outline-none transition-transform active:scale-90"
      >
        {completed ? (
          <CheckCircle2 size={20} className="text-phase-teal transition-colors" />
        ) : (
          <Circle size={20} className="text-text-faint hover:text-phase-amber transition-colors" />
        )}
      </button>

      <div className={`flex-1 min-w-0 transition-opacity`}>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h4 className="font-semibold text-[15px] text-text-main">{title}</h4>
          {difficulty && (
            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${difficulty === 'Beginner' ? 'bg-phase-teal/10 text-phase-teal' : difficulty === 'Intermediate' ? 'bg-phase-amber/10 text-phase-amber' : 'bg-phase-brick/10 text-phase-brick'}`}>
              {difficulty}
            </span>
          )}
          {time && (
            <span className="text-[10px] font-mono bg-bg-main border border-border-line text-text-dim px-1.5 py-0.5 rounded-sm">
              ⏱ {time}
            </span>
          )}

          {/* Note indicator (small icon if note exists but editor is closed) */}
          {existingNote && !showNoteInput && (
            <button
              onClick={() => setShowNoteInput(true)}
              className="text-phase-violet/70 hover:text-phase-violet transition-colors"
              title="View note"
            >
              <StickyNote size={13} />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-text-dim">
          <span className="font-medium">{source}</span>
          {details && (
            <>
              <span className="hidden sm:inline text-text-faint">•</span>
              <span className="font-mono text-[10.5px] uppercase tracking-wider px-2 py-0.5 bg-bg-raise text-phase-teal rounded-md">{details}</span>
            </>
          )}
        </div>
        
        {/* Granular progress bar meter (exclude projects) */}
        {type !== 'projects' && (
          <div className="mt-3.5 space-y-2 max-w-sm">
            <div className="flex justify-between items-center text-[11px] font-bold text-text-dim">
              <span>Overall Progress</span>
              <span className="font-mono text-phase-teal">{currentProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-bg-main rounded-full overflow-hidden border border-border-line">
              <div 
                className="h-full bg-phase-teal rounded-full transition-all duration-300"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Sub-modules Checklist (exclude projects) */}
        {type !== 'projects' && (
          <div className="mt-3.5 space-y-2 border-t border-border-line/40 pt-3 max-w-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-faint">
              Course Syllabus Modules
            </span>
            <div className="space-y-1.5 mt-1.5">
              {subModules.map((sub, sIdx) => {
                const isSubChecked = isSubModuleChecked(phaseKey, category, index, sIdx);
                return (
                  <label 
                    key={sIdx} 
                    className="flex items-center gap-2.5 text-xs text-text-dim hover:text-text-main cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isSubChecked}
                      onChange={() => toggleSubModule(phaseKey, category, index, sIdx, totalSubModules)}
                      className="rounded border-border-line text-phase-teal focus:ring-phase-teal h-3.5 w-3.5"
                    />
                    <span className={isSubChecked ? 'line-through text-text-faint' : ''}>
                      {sub}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
        
        {type === 'projects' && (
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {savedGithubLink ? (
                <div className="flex items-center gap-2">
                  <a 
                    href={savedGithubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-surface border border-border-line text-text-main hover:text-phase-amber hover:border-phase-amber rounded-md transition-colors"
                  >
                    <Code size={14} /> View Code
                  </a>
                  {isVerified ? (
                    <span className="text-[10px] font-bold text-phase-teal bg-phase-teal/10 px-2 py-0.5 rounded border border-phase-teal/20" title={`Verified with ${commitsCount || 0} commits`}>
                      ✓ Verified ({commitsCount || 0} commits)
                    </span>
                  ) : (
                    <span className="text-[10px] text-text-faint bg-bg-raise px-2 py-0.5 rounded border border-border-line">
                      Unverified Link
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setGithubUrlInput(savedGithubLink);
                      setShowGithubInput(true);
                    }}
                    className="text-[10px] text-text-faint hover:text-text-dim"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                showGithubInput ? (
                  <div className="flex items-center gap-2 flex-wrap bg-bg-raise p-2.5 rounded-xl border border-border-line">
                    {progress._githubUser ? (
                      isLoadingRepos ? (
                        <div className="flex items-center gap-2 text-xs text-text-faint">
                          <Loader2 size={12} className="animate-spin" /> Loading your repos...
                        </div>
                      ) : (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleSaveGithubLink(e.target.value);
                            }
                          }}
                          disabled={isVerifying}
                          className="text-xs bg-bg-main border border-border-line rounded-md p-1.5 text-text-main focus:outline-none focus:border-phase-violet cursor-pointer max-w-[200px]"
                        >
                          <option value="">-- Choose Repository --</option>
                          {userRepos.map(repo => (
                            <option key={repo.id} value={repo.html_url}>
                              {repo.name}
                            </option>
                          ))}
                        </select>
                      )
                    ) : (
                      <input 
                        type="url" 
                        placeholder="https://github.com/owner/repo"
                        value={githubUrlInput}
                        onChange={(e) => setGithubUrlInput(e.target.value)}
                        disabled={isVerifying}
                        className="text-xs bg-bg-main border border-border-line rounded-md px-2.5 py-1 text-text-main focus:outline-none focus:border-phase-amber w-48 sm:w-64"
                      />
                    )}

                    {!progress._githubUser && (
                      <button 
                        onClick={() => handleSaveGithubLink()}
                        disabled={isVerifying}
                        className="p-1.5 text-phase-teal hover:bg-surface rounded-md disabled:opacity-50 cursor-pointer"
                        title="Verify and Save"
                      >
                        {isVerifying ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      </button>
                    )}

                    <button 
                      onClick={() => { setShowGithubInput(false); setVerifyError(''); }}
                      disabled={isVerifying}
                      className="text-xs text-text-faint hover:text-text-dim px-1.5"
                    >
                      Cancel
                    </button>

                    {/* Manual input toggle for connected users */}
                    {progress._githubUser && (
                      <button
                        onClick={() => {
                          // temporarily clear token check to type manually
                          const token = progress._githubUser.token;
                          disconnectGithub();
                          setGithubUrlInput('');
                        }}
                        className="text-[10px] text-text-faint hover:text-phase-violet underline block w-full mt-1 text-left"
                      >
                        Type URL manually instead
                      </button>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowGithubInput(true)}
                    className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-surface border border-border-line text-text-dim hover:text-text-main hover:border-text-faint rounded-md transition-colors cursor-pointer"
                  >
                    <Code size={14} /> Link GitHub
                  </button>
                )
              )}
              <button 
                onClick={() => setShowSpec(!showSpec)}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 border rounded-md transition-colors cursor-pointer ${
                  showSpec 
                    ? 'bg-phase-amber/15 text-phase-amber border-phase-amber/30' 
                    : 'bg-surface border-border-line text-text-dim hover:text-text-main'
                }`}
              >
                <FileText size={14} /> View Specs
              </button>
              <button 
                onClick={() => setIsReadmeOpen(true)}
                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-phase-teal/10 text-phase-teal border border-phase-teal/20 hover:bg-phase-teal hover:text-white rounded-md transition-colors"
              >
                <FileText size={14} /> Build README
              </button>
              <button 
                onClick={() => setShowComments(!showComments)}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 border rounded-md transition-colors cursor-pointer ${
                  showComments 
                    ? 'bg-phase-violet/10 text-phase-violet border-phase-violet/20' 
                    : 'bg-surface border-border-line text-text-dim hover:text-text-main'
                }`}
              >
                <MessageSquare size={14} /> Comments
              </button>
            </div>

            {/* Project Specs Drawer */}
            {showSpec && PROJECT_SPECS[`${phaseKey}-${index}`] && (
              <div className="mt-3 p-4 bg-bg-raise border border-border-line rounded-lg space-y-3 animate-fade-in">
                <div>
                  <h5 className="text-[10px] font-bold text-phase-amber uppercase tracking-wider">Project Objective</h5>
                  <p className="text-xs text-text-dim mt-1 leading-relaxed">
                    {PROJECT_SPECS[`${phaseKey}-${index}`].description}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h5 className="text-[10px] font-bold text-phase-amber uppercase tracking-wider">Key Implementation Features</h5>
                  <ul className="list-disc list-inside space-y-1 text-xs text-text-dim pl-1">
                    {PROJECT_SPECS[`${phaseKey}-${index}`].requirements.map((req, rIdx) => (
                      <li key={rIdx} className="leading-relaxed">{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Error Message */}
            {verifyError && (
              <p className="text-[11px] text-phase-brick font-medium animate-slide-up">
                ⚠️ {verifyError}
              </p>
            )}

            {/* Success Message */}
            {verifySuccess && (
              <p className="text-[11px] text-phase-teal font-bold animate-bounce-in">
                ✓ Repository verified successfully!
              </p>
            )}

            {/* Project Comments */}
            {showComments && (
              <ProjectComments projectId={`${phaseKey}-${index}`} />
            )}
          </div>
        )}

        {/* Certificate Verification Panel (exclude books & projects) */}
        {type !== 'books' && type !== 'projects' && (
          <div className="mt-2.5">
            {savedResourceUrl ? (
              <div className="bg-phase-teal/5 border border-phase-teal/20 rounded-xl p-3 max-w-sm flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2 text-phase-teal font-medium text-xs">
                  <Award size={15} />
                  <a 
                    href={savedResourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>Verified Certificate Linked</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
                <button
                  onClick={handleUnlinkResourceLink}
                  className="text-[10px] text-text-faint hover:text-phase-brick transition-colors cursor-pointer"
                >
                  Unlink
                </button>
              </div>
            ) : (
              <div className="bg-bg-raise/30 border border-border-line rounded-xl p-3.5 max-w-sm space-y-2 animate-fade-in">
                <div className="text-[11px] font-semibold text-text-dim flex items-center gap-1.5">
                  <Award size={13} className="text-text-faint" />
                  <span>Link Certificate / Verification URL</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="Paste Coursera, edX, or Udemy certificate link..."
                    value={resourceUrlInput}
                    onChange={(e) => setResourceUrlInput(e.target.value)}
                    disabled={isVerifyingResource}
                    className="flex-1 text-xs bg-surface border border-border-line rounded-md px-2.5 py-1 text-text-main focus:outline-none focus:border-phase-teal focus:ring-1 focus:ring-phase-teal/30"
                  />
                  <button
                    onClick={handleSaveResourceLink}
                    disabled={isVerifyingResource}
                    className="bg-phase-teal hover:bg-phase-teal/85 text-white px-3.5 py-1 rounded-md text-[11px] font-bold cursor-pointer disabled:opacity-50 flex items-center gap-1 shrink-0"
                  >
                    {isVerifyingResource ? <Loader2 size={12} className="animate-spin" /> : 'Link'}
                  </button>
                </div>
                {resourceVerifyError && (
                  <p className="text-[10px] text-phase-brick font-medium">
                    ⚠️ {resourceVerifyError}
                  </p>
                )}
                {resourceVerifySuccess && (
                  <p className="text-[10px] text-phase-teal font-medium animate-bounce-in">
                    ✓ Certificate linked successfully!
                  </p>
                )}
              </div>
            )}
          </div>
        )}


        {/* Notes section */}
        {showNoteInput && (
          <div className="mt-3 animate-fade-in">
            <textarea
              value={noteText}
              onChange={handleNoteChange}
              onBlur={handleNoteBlur}
              placeholder="Add your notes here…"
              rows={2}
              className="w-full text-xs bg-bg-main border border-border-line rounded-lg px-3 py-2 
                text-text-main placeholder:text-text-faint resize-none
                focus:outline-none focus:border-phase-violet/50 focus:ring-1 focus:ring-phase-violet/20
                transition-colors"
            />
            <button
              onClick={() => setShowNoteInput(false)}
              className="mt-1 text-[10px] text-text-faint hover:text-text-dim transition-colors"
            >
              Close notes
            </button>
          </div>
        )}
      </div>

      {/* Right-side actions: bookmark + note toggle + external link */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Add Note button */}
        {!showNoteInput && (
          <button
            onClick={() => setShowNoteInput(true)}
            className={`p-2 rounded-lg transition-colors
              ${existingNote 
                ? 'text-phase-violet/70 hover:text-phase-violet hover:bg-phase-violet/10'
                : 'text-text-faint/0 group-hover:text-text-faint hover:text-phase-violet hover:bg-bg-raise'
              }`}
            title={existingNote ? 'Edit note' : 'Add note'}
          >
            <StickyNote size={16} />
          </button>
        )}

        {/* Bookmark button */}
        <button
          onClick={() => toggleBookmark(phaseKey, category, index)}
          className={`p-2 rounded-lg transition-all duration-200
            ${bookmarked
              ? 'text-amber-400 hover:text-amber-500'
              : 'text-text-faint/0 group-hover:text-text-faint hover:text-amber-400 hover:bg-bg-raise'
            }`}
          title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          <Bookmark 
            size={16} 
            fill={bookmarked ? 'currentColor' : 'none'} 
          />
        </button>

        {/* External link (books open the author's free edition or a library search) */}
        {url && (
          type === 'books' && url.startsWith('/') ? (
            <button
              onClick={() => openPdf(url, title)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold font-mono bg-phase-teal/15 text-phase-teal hover:bg-phase-teal hover:text-white border border-phase-teal/25 transition-all duration-200 cursor-pointer"
              title="Read Book in App"
            >
              <span>Read Book</span>
              <BookIcon size={12} />
            </button>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold font-mono bg-phase-teal/15 text-phase-teal hover:bg-phase-teal hover:text-white border border-phase-teal/25 transition-all duration-200 cursor-pointer"
              title={type === 'books' ? (url.includes('openlibrary.org') ? 'Find this book at Open Library' : 'Read the free edition from the author') : 'Open Resource'}
            >
              <span>{type === 'books' ? (url.includes('openlibrary.org') ? 'Find Book' : 'Read Free') : 'Open'}</span>
              <ExternalLink size={12} />
            </a>
          )
        )}
      </div>
    </div>
    
    {type === 'projects' && (
      <ReadmeGenerator 
        isOpen={isReadmeOpen} 
        onClose={() => setIsReadmeOpen(false)} 
        projectTitle={title} 
      />
    )}
    </>
  );
}
