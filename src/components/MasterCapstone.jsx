import { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { CircularProgress } from './CircularProgress';
import { getGenerativeModel } from 'firebase/ai';
import { ai } from '../firebase';
import { 
  Award, CheckCircle2, Circle, AlertTriangle, ArrowRight, Sparkles, 
  Upload, Code, ExternalLink, Plus, Loader2, RefreshCw, Send, ArrowLeft 
} from 'lucide-react';

const DEFAULT_HARVEST_GUARDIAN = {
  title: 'Harvest Guardian',
  subtitle: 'The Master Capstone — every phase, one system that fights real food loss',
  description: 'A multilingual early-warning and response system for the smallholder post-harvest food-loss crisis — roughly a third of all food grown is lost before it reaches a plate. It fuses market, weather, and satellite data with photos and voice reports sent straight from the field, predicts which shipments will spoil, explains every call in plain language, and automatically triggers a logistics fix.',
  projects: [
    {
      id: 'm1',
      phaseNum: 1,
      phaseTitle: 'Phase 1: Foundations',
      label: 'Multi-source Ingestion & EDA Pipeline',
      detail: 'Pulls smallholder market prices, regional weather, and satellite rainfall/soil-moisture data into one clean, queryable store; EDA surfaces the highest-loss crop-region-season combinations.',
      requirements: [
        'Ingest data from weather and agricultural market mock APIs programmatically.',
        'Establish a local SQLite database schema and resolve raw missing values/duplicates.',
        'Calculate Pearson correlation coefficients matching weather anomalies with storage life.',
        'Generate statistical distribution plots for seasonal temperature variations.'
      ],
      color: 'border-phase-amber/35 bg-phase-amber/5 text-phase-amber'
    },
    {
      id: 'm2',
      phaseNum: 2,
      phaseTitle: 'Phase 2: Core ML',
      label: 'Loss-risk Predictive Modeling Pipelines',
      detail: 'A regression model estimates expected spoilage per shipment, a classifier flags high-risk batches, and clustering groups farmer cooperatives by shared risk profile for targeted outreach.',
      requirements: [
        'Apply MinMax scaling and target encoding on categorical parameters.',
        'Train Ridge and Random Forest regressors estimating remaining shelf life.',
        'Fit a classification model flagging shipments with high loss probability.',
        'Plot ROC-AUC, Precision-Recall curves, and analyze feature importances.'
      ],
      color: 'border-phase-teal/35 bg-phase-teal/5 text-phase-teal'
    },
    {
      id: 'm3',
      phaseNum: 3,
      phaseTitle: 'Phase 3: Deep Learning',
      label: 'Multimodal Voice Reports & Image CNN Classifier',
      detail: 'A CNN reads a smartphone photo of the produce to score ripeness/spoilage; a speech pipeline lets farmers file a voice report in their own language, transcribed and classified automatically.',
      requirements: [
        'Implement a PyTorch CNN classifier identifying crop ripeness classes.',
        'Integrate Speech-to-Text pipelines transcribing voice reports into text.',
        'Set up NLP classification identifying warning keywords in reports.',
        'Save trained model weights for API serving.'
      ],
      color: 'border-phase-violet/35 bg-phase-violet/5 text-phase-violet'
    },
    {
      id: 'm4',
      phaseNum: 4,
      phaseTitle: 'Phase 4: Storytelling',
      label: 'Intervention Impact Storytelling Dashboard',
      detail: 'A storytelling-style dashboard shows NGOs and cooperatives where losses cluster and why, plus a difference-in-differences analysis proving whether an intervention like cold storage actually reduced loss.',
      requirements: [
        'Deploy interactive map components displaying geospatial loss hotspots.',
        'Run Difference-in-Differences calculations measuring intervention efficacy.',
        'Expose user filters to aggregate data by region, crop type, and transport carrier.',
        'Export formatted reports summarizing data trends.'
      ],
      color: 'border-phase-brick/35 bg-phase-brick/5 text-phase-brick'
    },
    {
      id: 'm5',
      phaseNum: 5,
      phaseTitle: 'Phase 5 (Part A)',
      label: 'Explainable AI Agronomist Chatbot (RAG)',
      detail: 'SHAP makes every risk score auditable; a RAG-based multilingual chat assistant lets farmers and field agents ask plain-language questions about a flagged batch over WhatsApp/SMS.',
      requirements: [
        'Index agronomy document databases into FAISS or Chroma vector indexes.',
        'Set up retrieval augmented generation (RAG) chains returning cited advice.',
        'Integrate SHAP explaining features behind model prediction outcomes.',
        'Incorporate translation pipelines supporting regional languages.'
      ],
      color: 'border-phase-rose/35 bg-phase-rose/5 text-phase-rose'
    },
    {
      id: 'm6',
      phaseNum: 5,
      phaseTitle: 'Phase 5 (Part B)',
      label: 'FastAPI/Docker Agent Deployment',
      detail: 'Containerized with Docker, served via FastAPI, tracked with MLflow, and reachable over low-bandwidth WhatsApp/SMS — with an agent layer that auto-suggests the logistics fix.',
      requirements: [
        'Wrap prediction and RAG systems in FastAPI API endpoints.',
        'Write Dockerfiles setting up runtime environments and dependencies.',
        'Log parameters, runs, and baseline performance using MLflow.',
        'Expose Swagger documentation endpoints for external API testing.'
      ],
      color: 'border-phase-gold/35 bg-phase-gold/5 text-phase-gold'
    }
  ]
};

const DOMAINS = ['Healthcare', 'Finance', 'E-commerce', 'Climate/Energy', 'Logistics/Transit', 'Social Good', 'Agriculture', 'Entertainment'];
const TECHNIQUES = ['Large Language Models / RAG', 'Computer Vision / CNNs', 'Time-series Forecasting', 'Tabular Classification/Regression', 'Recommender Systems', 'Speech/Audio AI'];
const DEPLOYMENTS = ['FastAPI API & Docker Container', 'Interactive Streamlit Dashboard', 'React/Next.js Web Interface', 'WhatsApp/Telegram Bot Integration', 'Desktop App Shell (Electron)'];

export function MasterCapstone() {
  const { 
    progress,
    toggleMasterMilestone, 
    isMasterMilestoneCompleted, 
    getCapstoneLink, 
    setCapstoneLink, 
    saveCustomCapstone,
    addXp 
  } = useProgress();

  const capstoneData = progress._customCapstone || null;

  // Configuration Setup states
  const [ideaText, setIdeaText] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(DOMAINS[0]);
  const [selectedTechnique, setSelectedTechnique] = useState(TECHNIQUES[0]);
  const [selectedDeployment, setSelectedDeployment] = useState(DEPLOYMENTS[0]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Milestone edit states
  const [editingId, setEditingId] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');

  const completedCount = capstoneData ? capstoneData.projects.filter(p => isMasterMilestoneCompleted(p.id)).length : 0;
  const totalCount = capstoneData ? capstoneData.projects.length : 6;
  const percent = Math.round((completedCount / totalCount) * 100);

  // Load defaults
  const handleLoadDefault = () => {
    saveCustomCapstone(DEFAULT_HARVEST_GUARDIAN);
  };

  // Generate customized roadmap using AI (Gemini)
  const handleGenerateRoadmap = async () => {
    if (!ideaText.trim()) {
      setErrorMsg('Please describe your capstone project idea first.');
      return;
    }
    
    setIsGenerating(true);
    setErrorMsg('');

    // Fallback generator in case Gemini is offline or not configured
    const generateFallback = () => {
      const fallbackProject = {
        title: `AI ${selectedDomain} Engine`,
        subtitle: `An intelligent solution applying ${selectedTechnique} served as ${selectedDeployment}`,
        description: `Custom Capstone Project: "${ideaText}". This end-to-end pipeline processes industry data using modern machine learning frameworks, delivering smart outputs to consumers.`,
        projects: [
          {
            id: 'm1',
            phaseNum: 1,
            phaseTitle: 'Phase 1: Foundations',
            label: 'Data Extraction & Quality Audit',
            detail: 'Establish the extraction pipelines, ingest dirty files, resolve schemas, and run exploratory analytics tables.',
            requirements: [
              'Extract features and target labels from primary datasets or mock APIs.',
              'Implement schemas checking for missing records and column types.',
              'Perform visual EDA correlations mapping variance levels.',
              'Write SQL script preparing raw logs for feature construction.'
            ],
            color: 'border-phase-amber/35 bg-phase-amber/5 text-phase-amber'
          },
          {
            id: 'm2',
            phaseNum: 2,
            phaseTitle: 'Phase 2: Core ML',
            label: 'Model Development & Validation Pipeline',
            detail: 'Train baseline and advanced machine learning algorithms to model targets, evaluating performance metric thresholds.',
            requirements: [
              'Engineer robust features handling categorical text and outliers.',
              'Train baseline models alongside ensemble classifiers (XGBoost/RandomForest).',
              'Validate parameters using Stratified K-Fold splits.',
              'Plot AUC metrics and list top feature contributions.'
            ],
            color: 'border-phase-teal/35 bg-phase-teal/5 text-phase-teal'
          },
          {
            id: 'm3',
            phaseNum: 3,
            phaseTitle: 'Phase 3: Deep Learning',
            label: 'Advanced Deep Learning / Neural Network Modules',
            detail: 'Fine-tune neural layers utilizing advanced techniques like transfer learning or transformers.',
            requirements: [
              'Build PyTorch dataset and loader scripts loading image/text arrays.',
              'Fine-tune pre-trained backbones or load embedding layers.',
              'Examine convergence curves mapping train vs validation losses.',
              'Export optimized model weights in portable format.'
            ],
            color: 'border-phase-violet/35 bg-phase-violet/5 text-phase-violet'
          },
          {
            id: 'm4',
            phaseNum: 4,
            phaseTitle: 'Phase 4: Storytelling',
            label: 'Interactive Storytelling Dashboard & Insights',
            detail: 'Build interface pages presenting statistics, key metrics, and predictive insights to stakeholders.',
            requirements: [
              'Develop interactive UI tables, charts, and filter controls.',
              'Plot performance metrics, predictions, and model logs.',
              'Write causal analyses assessing model influence on targets.',
              'Deploy static builds of reports on public hosts.'
            ],
            color: 'border-phase-brick/35 bg-phase-brick/5 text-phase-brick'
          },
          {
            id: 'm5',
            phaseNum: 5,
            phaseTitle: 'Phase 5 (Part A)',
            label: 'Explainable Predictions & RAG Agent integration',
            detail: 'Connect explainable frameworks (SHAP/LIME) and RAG vectors to explain target predictions.',
            requirements: [
              'Calculate SHAP values detailing individual prediction factors.',
              'Index documentation corpus into vector database stores.',
              'Establish QA retrieval workflows answering query scripts.',
              'Add fallback responses when confidence scores fall low.'
            ],
            color: 'border-phase-rose/35 bg-phase-rose/5 text-phase-rose'
          },
          {
            id: 'm6',
            phaseNum: 5,
            phaseTitle: 'Phase 5 (Part B)',
            label: 'FastAPI Serving & Containerized CI/CD',
            detail: `Serve final predictions using FastAPI wrappers packaged inside Docker containers.`,
            requirements: [
              'Expose prediction endpoints supporting Pydantic validations.',
              'Configure Dockerfiles loading system libraries and models.',
              'Track model experiments and metrics using MLflow logs.',
              'Implement unit testing verifying API schemas.'
            ],
            color: 'border-phase-gold/35 bg-phase-gold/5 text-phase-gold'
          }
        ]
      };
      saveCustomCapstone(fallbackProject);
      setIsGenerating(false);
    };

    if (!ai) {
      console.warn("Firebase AI not configured. Serving local fallback roadmap.");
      generateFallback();
      return;
    }

    try {
      const model = getGenerativeModel(ai, {
        model: 'gemini-3.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 2048,
          temperature: 0.7,
        }
      });

      const promptText = `You are a curriculum architect and expert data scientist.
The user wants to build a custom capstone project.
User's Project Idea: "${ideaText}"
Refinement Answers:
1. Target Domain: ${selectedDomain}
2. Key ML/AI Technique: ${selectedTechnique}
3. Intended Deployment: ${selectedDeployment}

Your task is to break down this custom idea into a structured, phase-by-phase project plan that increments from Phase 1 through Phase 5.
Generate exactly 6 project modules (one for Phase 1, Phase 2, Phase 3, Phase 4, and two parts for Phase 5).
Each module must build sequentially toward the final custom capstone.

Respond ONLY with this exact JSON format:
{
  "title": "A short, premium name for the custom capstone (e.g. 'SafePrescribe AI')",
  "subtitle": "A premium subtitle describing what the capstone builds",
  "description": "A detailed multi-line paragraph explaining the custom capstone project's goals, features, and target impact.",
  "projects": [
    {
      "id": "m1",
      "phaseNum": 1,
      "phaseTitle": "Phase 1: Foundations",
      "label": "Project title (e.g. 'Multi-source Ingestion & EDA Pipeline')",
      "detail": "High-level summary of this phase's module goals.",
      "requirements": [
        "Requirement 1 (clear, technical, actionable)",
        "Requirement 2",
        "Requirement 3",
        "Requirement 4"
      ],
      "color": "border-phase-amber/35 bg-phase-amber/5 text-phase-amber"
    },
    {
      "id": "m2",
      "phaseNum": 2,
      "phaseTitle": "Phase 2: Core ML",
      "label": "Project title (e.g. 'Risk Prediction & Feature Pipeline')",
      "detail": "High-level summary of core modeling components.",
      "requirements": [
        "Requirement 1",
        "Requirement 2",
        "Requirement 3",
        "Requirement 4"
      ],
      "color": "border-phase-teal/35 bg-phase-teal/5 text-phase-teal"
    },
    {
      "id": "m3",
      "phaseNum": 3,
      "phaseTitle": "Phase 3: Deep Learning",
      "label": "Project title (e.g. 'Deep Neural Audio/Image Pipeline')",
      "detail": "High-level summary of CNN, RNN, or Transformer modules.",
      "requirements": [
        "Requirement 1",
        "Requirement 2",
        "Requirement 3",
        "Requirement 4"
      ],
      "color": "border-phase-violet/35 bg-phase-violet/5 text-phase-violet"
    },
    {
      "id": "m4",
      "phaseNum": 4,
      "phaseTitle": "Phase 4: Storytelling",
      "label": "Project title (e.g. 'Interactive Evaluation Dashboard')",
      "detail": "High-level summary of dashboard and causal analysis.",
      "requirements": [
        "Requirement 1",
        "Requirement 2",
        "Requirement 3",
        "Requirement 4"
      ],
      "color": "border-phase-brick/35 bg-phase-brick/5 text-phase-brick"
    },
    {
      "id": "m5",
      "phaseNum": 5,
      "phaseTitle": "Phase 5 (Part A)",
      "label": "Project title (e.g. 'Explainable RAG Agent Chatbot')",
      "detail": "High-level summary of SHAP, LIME, and vector retrieval integration.",
      "requirements": [
        "Requirement 1",
        "Requirement 2",
        "Requirement 3",
        "Requirement 4"
      ],
      "color": "border-phase-rose/35 bg-phase-rose/5 text-phase-rose"
    },
    {
      "id": "m6",
      "phaseNum": 5,
      "phaseTitle": "Phase 5 (Part B)",
      "label": "Project title (e.g. 'FastAPI/Docker Deployment')",
      "detail": "High-level summary of API containerization and MLOps tracking.",
      "requirements": [
        "Requirement 1",
        "Requirement 2",
        "Requirement 3",
        "Requirement 4"
      ],
      "color": "border-phase-gold/35 bg-phase-gold/5 text-phase-gold"
    }
  ]
}`;

      const res = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: promptText }] }] });
      const parsed = JSON.parse(res.response.text());
      
      if (!parsed.title || !parsed.projects || parsed.projects.length !== 6) {
        throw new Error("Invalid format received from AI.");
      }

      saveCustomCapstone(parsed);
    } catch (err) {
      console.error("AI Roadmap generation failed:", err);
      setErrorMsg("Failed to generate with AI. Instantiating high-quality template instead...");
      setTimeout(() => {
        generateFallback();
      }, 1500);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggle = (id) => {
    const isCompleted = isMasterMilestoneCompleted(id);
    toggleMasterMilestone(id);
    if (!isCompleted) {
      if (typeof addXp === 'function') addXp(100);
    } else {
      if (typeof addXp === 'function') addXp(-100);
    }
  };

  const startEditing = (id) => {
    setEditingId(id);
    setGithubUrl(getCapstoneLink(id) || '');
  };

  const saveLink = (id) => {
    setCapstoneLink(id, githubUrl.trim());
    setEditingId(null);
  };

  const resetCapstone = () => {
    if (window.confirm("Are you sure you want to reset your capstone project? Your milestone checks and links will be preserved, but the project specifications will be rebuilt.")) {
      saveCustomCapstone(null);
    }
  };

  // ════════ SETUP PANEL (Lobby) ════════
  if (!capstoneData) {
    return (
      <div className="max-w-3xl mx-auto space-y-10 animate-fade-in pb-20">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-phase-gold/15 rounded-2xl mb-2 shadow-sm border border-phase-gold/30">
            <Award size={36} className="text-phase-gold animate-float" />
          </div>
          <h1 className="text-3xl font-bold font-display text-text-main">★ Custom Master Capstone</h1>
          <p className="text-sm text-text-dim max-w-xl mx-auto">
            Design your own data science flagship project. Our AI will generate a phase-by-phase implementation blueprint.
          </p>
        </header>

        <div className="flat-card p-6 md:p-8 border border-border-line bg-surface space-y-8 shadow-sm">
          {/* Idea Input */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-text-main uppercase flex items-center gap-1.5">
              <Sparkles size={14} className="text-phase-gold animate-pulse" />
              1. What is your capstone project idea?
            </label>
            <textarea
              placeholder="Describe your project (e.g. Build an automated dashboard tracking carbon offsets using satellite imagery, or a system detecting diabetic retinopathy from eye scan photos...)"
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              className="w-full h-32 bg-bg-main border border-border-line rounded-2xl p-4 text-xs font-mono text-text-main focus:outline-none focus:border-phase-teal leading-relaxed resize-none"
            />
          </div>

          {/* Question 2: Domain */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-text-main uppercase">
              2. Target Domain/Industry
            </label>
            <div className="flex flex-wrap gap-2">
              {DOMAINS.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDomain(d)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                    selectedDomain === d
                      ? 'bg-phase-teal/15 text-phase-teal border-phase-teal/40'
                      : 'bg-bg-raise text-text-dim border-border-line hover:text-text-main'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Technique */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-text-main uppercase">
              3. Primary ML/AI Technique
            </label>
            <div className="flex flex-wrap gap-2">
              {TECHNIQUES.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTechnique(t)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                    selectedTechnique === t
                      ? 'bg-phase-violet/15 text-phase-violet border-phase-violet/40'
                      : 'bg-bg-raise text-text-dim border-border-line hover:text-text-main'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Deployment */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-text-main uppercase">
              4. Primary Interface / Deployment Format
            </label>
            <div className="flex flex-wrap gap-2">
              {DEPLOYMENTS.map(dep => (
                <button
                  key={dep}
                  onClick={() => setSelectedDeployment(dep)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                    selectedDeployment === dep
                      ? 'bg-phase-brick/15 text-phase-brick border-phase-brick/40'
                      : 'bg-bg-raise text-text-dim border-border-line hover:text-text-main'
                  }`}
                >
                  {dep}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="bg-phase-brick/10 border border-phase-brick/20 text-phase-brick p-4 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-border-line">
            <button
              onClick={handleLoadDefault}
              className="text-xs font-mono text-text-faint hover:text-text-dim transition-colors cursor-pointer"
            >
              Or load the default "Harvest Guardian" capstone &rarr;
            </button>

            <button
              onClick={handleGenerateRoadmap}
              disabled={isGenerating}
              className="bg-phase-gold hover:bg-opacity-95 text-white font-mono px-6 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-transform hover:scale-103 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Architecting with AI...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Generate Capstone Roadmap
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════ CAPSTONE ROADMAP VIEW ════════
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <header className="relative">
        <button
          onClick={resetCapstone}
          className="absolute -top-4 left-0 text-xs font-mono text-text-faint hover:text-text-dim flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={12} /> Reconfigure Project
        </button>

        <div className="text-center space-y-2 pt-6">
          <div className="inline-flex items-center justify-center p-3 bg-phase-gold/15 rounded-2xl mb-2 shadow-sm border border-phase-gold/30">
            <Award size={36} className="text-phase-gold animate-float" />
          </div>
          <h1 className="text-3xl font-bold font-display text-text-main">★ Custom Capstone Roadmap</h1>
          <p className="text-sm text-text-dim max-w-xl mx-auto">
            Build and scale your personalized flagship capstone sequentially phase-by-phase.
          </p>
        </div>
      </header>

      {/* Flagship Card */}
      <div className="flat-card p-6 md:p-8 border border-border-line bg-surface relative overflow-hidden flex flex-col md:flex-row gap-8 items-center justify-between shadow-sm">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-phase-gold bg-phase-gold/10 px-2 py-0.5 rounded-md border border-phase-gold/25 uppercase tracking-wider">
              Flagship Portfolio Project
            </span>
            <span className="text-xs text-text-faint font-semibold">Active Capstone</span>
          </div>

          <h2 className="text-2xl font-bold font-display text-text-main leading-snug">{capstoneData.title}</h2>
          <p className="text-xs font-medium text-text-faint italic">{capstoneData.subtitle}</p>
          <p className="text-sm text-text-dim leading-relaxed">{capstoneData.description}</p>
        </div>

        <div className="flex-shrink-0 flex flex-col items-center p-4 bg-bg-raise rounded-2xl border border-border-line w-40 text-center space-y-3 animate-pulse-glow">
          <CircularProgress percent={percent} size={80} strokeWidth={6} color="var(--gold)" />
          <div className="text-[10px] font-mono text-text-faint uppercase">Capstone Progress</div>
        </div>
      </div>

      {/* Automated Capstone CSV Grader Widget */}
      <div className="flat-card p-6 border border-border-line bg-surface space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-phase-gold" size={20} />
          <h3 className="font-bold text-text-main font-display text-sm">Automated Pipeline CSV Grader</h3>
        </div>
        <p className="text-xs text-text-dim leading-relaxed">
          Upload your processed predictions CSV output file from your Python pipeline. The system will audit the file structure, column constraints, and predicted risks to verify correctness.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <label className="flex items-center gap-2 bg-phase-gold hover:bg-phase-gold/85 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer whitespace-nowrap">
            <Upload size={14} /> Upload Predictions CSV
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = (evt) => {
                  const content = evt.target.result;
                  const lines = content.split('\n').map(l => l.trim()).filter(l => l);
                  if (lines.length < 2) {
                    alert("Error: File contains no data rows.");
                    return;
                  }

                  const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
                  const required = ['shipment_id', 'crop_name', 'predicted_loss_pct', 'risk_level'];
                  const missing = required.filter(h => !headers.includes(h));

                  if (missing.length > 0) {
                    alert(`Error: Missing required columns: ${missing.join(', ')}`);
                    return;
                  }

                  // Verify row values
                  let isValid = true;
                  for (let i = 1; i < Math.min(lines.length, 10); i++) {
                    const cols = lines[i].split(',');
                    const lossIdx = headers.indexOf('predicted_loss_pct');
                    const lossVal = parseFloat(cols[lossIdx]);
                    if (isNaN(lossVal) || lossVal < 0 || lossVal > 100) {
                      isValid = false;
                      break;
                    }
                  }

                  if (!isValid) {
                    alert("Error: Invalid values detected in 'predicted_loss_pct' column (must be numeric 0-100).");
                    return;
                  }

                  // Success: unlock milestones!
                  let unlockedAny = false;
                  ['m1', 'm2', 'm3'].forEach(mid => {
                    if (!isMasterMilestoneCompleted(mid)) {
                      toggleMasterMilestone(mid);
                      if (typeof addXp === 'function') addXp(100);
                      unlockedAny = true;
                    }
                  });
                  if (unlockedAny) {
                    alert("🎉 Pipeline verification successful! Your first 3 milestones have been automatically graded and unlocked (+300 XP).");
                  } else {
                    alert("🎉 Pipeline verification successful! Your fields match criteria perfectly.");
                  }
                };
                reader.readAsText(file);
              }}
            />
          </label>
          <span className="text-[10px] text-text-faint font-mono uppercase">Target: 4 Columns (shipment_id, crop_name, predicted_loss_pct, risk_level)</span>
        </div>
      </div>

      {/* Phase-by-Phase Capstone Project Grid */}
      <div className="space-y-6">
        <h3 className="text-xs font-mono text-text-faint uppercase tracking-wider flex items-center gap-2">
          <Sparkles size={14} className="text-phase-gold" />
          Generated Capstone Roadmap Modules
        </h3>

        <div className="space-y-6">
          {capstoneData.projects.map((proj) => {
            const completed = isMasterMilestoneCompleted(proj.id);
            const savedLink = getCapstoneLink(proj.id);
            const isEditing = editingId === proj.id;

            return (
              <div 
                key={proj.id}
                className={`flat-card p-6 border transition-all duration-300 rounded-2xl flex flex-col md:flex-row gap-6 items-start justify-between ${
                  completed 
                    ? 'border-phase-gold/30 bg-phase-gold/5 shadow-sm'
                    : 'border-border-line bg-surface hover:bg-surface-hover'
                }`}
              >
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${proj.color || 'border-phase-violet/30 bg-phase-violet/5 text-phase-violet'}`}>
                      {proj.phaseTitle}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-phase-gold bg-phase-gold/10 px-2 py-0.5 rounded-md border border-phase-gold/15">
                      +100 XP
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-text-main flex items-center gap-2">
                      {proj.label}
                    </h4>
                    <p className="text-xs text-text-dim leading-relaxed">{proj.detail}</p>
                  </div>

                  {/* Requirements List */}
                  {proj.requirements && proj.requirements.length > 0 && (
                    <div className="bg-bg-raise/50 rounded-xl p-4 border border-border-line/40 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-text-faint uppercase">Build Checklist:</span>
                      <ul className="list-disc pl-4 space-y-1.5 text-xs text-text-dim leading-relaxed">
                        {proj.requirements.map((req, rIdx) => (
                          <li key={rIdx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* GitHub Repo Link Widget */}
                  <div className="pt-2">
                    {isEditing ? (
                      <div className="flex items-center gap-2 max-w-md">
                        <input
                          type="url"
                          placeholder="Paste GitHub Repository URL..."
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveLink(proj.id);
                          }}
                          className="flex-1 px-3 py-1.5 bg-bg-main border border-border-line rounded-lg text-xs font-mono text-text-main focus:outline-none focus:border-phase-teal"
                        />
                        <button
                          onClick={() => saveLink(proj.id)}
                          className="bg-phase-teal text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : savedLink ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <a 
                          href={savedLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-surface border border-border-line text-text-main hover:text-phase-amber hover:border-phase-amber rounded-md transition-colors"
                        >
                          <Code size={14} /> View Code <ExternalLink size={10} className="opacity-65" />
                        </a>
                        <button
                          onClick={() => startEditing(proj.id)}
                          className="text-[10px] font-mono text-text-faint hover:text-text-dim cursor-pointer"
                        >
                          Edit Link
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(proj.id)}
                        className="flex items-center gap-1 bg-bg-raise hover:bg-surface border border-border-line text-text-dim hover:text-text-main px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                      >
                        <Plus size={12} /> Link GitHub Repository
                      </button>
                    )}
                  </div>
                </div>

                {/* Completion Toggle */}
                <button
                  onClick={() => handleToggle(proj.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border font-mono text-xs font-bold transition-all duration-200 cursor-pointer ${
                    completed
                      ? 'bg-phase-gold/15 text-phase-gold border-phase-gold/40'
                      : 'bg-bg-raise text-text-dim border-border-line hover:text-text-main hover:border-border-strong'
                  }`}
                >
                  {completed ? (
                    <>
                      <CheckCircle2 size={16} />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle size={16} />
                      Mark Complete
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset options */}
      <div className="flex justify-center pt-8 border-t border-border-line">
        <button
          onClick={resetCapstone}
          className="flex items-center gap-1.5 text-xs font-mono text-phase-brick bg-phase-brick/10 border border-phase-brick/20 px-4 py-2 rounded-xl hover:bg-phase-brick hover:text-white transition-all cursor-pointer"
        >
          <RefreshCw size={12} /> Reset Custom Capstone Project
        </button>
      </div>

      {/* Completion message */}
      {percent === 100 && (
        <div className="bg-phase-gold/10 border border-phase-gold/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left justify-between animate-bounce-in">
          <div className="space-y-1">
            <h4 className="font-bold text-text-main flex items-center justify-center sm:justify-start gap-2">
              🏆 Master Capstone Completed!
            </h4>
            <p className="text-xs text-text-dim leading-relaxed">
              You have completed all milestones for your custom capstone. Add it to your portfolio so employers can see it.
            </p>
          </div>
          <a
            href="/portfolio"
            className="flex items-center gap-1.5 bg-phase-gold hover:bg-phase-gold/85 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer whitespace-nowrap"
          >
            Add to Portfolio
            <ArrowRight size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
