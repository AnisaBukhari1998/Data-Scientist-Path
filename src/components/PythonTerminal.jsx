import { useState, useEffect, useRef } from 'react';
import { Terminal, Play, CheckCircle2, RotateCcw, AlertTriangle, Loader2, Award, Database, Upload, Sparkles, BookOpen, ChevronRight, X, Table } from 'lucide-react';
import { getGenerativeModel } from 'firebase/ai';
import { ai } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { SANDBOX_DATASETS } from '../data/sandboxDatasets';
import { playClick, playSuccess } from '../utils/audioEngine';

const PYTHON_CHALLENGES = [
  {
    id: 1,
    title: '1. Basic Statistics with NumPy',
    desc: 'Write a Python function `get_stats(data)` that takes a list of numbers, converts it to a NumPy array, and returns a tuple of `(mean, median)`.',
    startingCode: `import numpy as np

def get_stats(data):
    # Your code here
    pass
`,
    testCode: `
# Verification test case
test_data = [10, 20, 30, 40, 50]
res = get_stats(test_data)
assert res == (30.0, 30.0), f"Expected (30.0, 30.0), got {res}"
print("✓ NumPy test case passed!")
`
  },
  {
    id: 2,
    title: '2. Filtering Pandas DataFrames',
    desc: 'Write a Python function `filter_df(df, column, threshold)` that filters a Pandas DataFrame, returning only rows where the specified column value is strictly greater than the threshold.',
    startingCode: `import pandas as pd

def filter_df(df, column, threshold):
    # Your code here
    pass
`,
    testCode: `
# Verification test case
df_test = pd.DataFrame({'age': [22, 28, 35, 18, 42]})
res_df = filter_df(df_test, 'age', 25)
assert list(res_df['age']) == [28, 35, 42], f"Expected ages [28, 35, 42], got {list(res_df['age'])}"
print("✓ Pandas filtering test case passed!")
`
  },
  {
    id: 3,
    title: '3. Train a Scikit-Learn Model',
    desc: 'Write a Python function `fit_regression(X, y)` that trains a LinearRegression model from scikit-learn on inputs X and y, and returns the models intercept coefficient.',
    startingCode: `from sklearn.linear_model import LinearRegression
import numpy as np

def fit_regression(X, y):
    # Your code here
    pass
`,
    testCode: `
# Verification test case
X_test = np.array([[1], [2], [3]])
y_test = np.array([2, 4, 6])
intercept = fit_regression(X_test, y_test)
assert abs(intercept) < 1e-5, f"Expected intercept close to 0, got {intercept}"
print("✓ Scikit-Learn model fit test case passed!")
`
  }
];

const SQL_CHALLENGES = [
  {
    id: 1,
    title: '1. Filter Crop Spoilage',
    desc: "Query the `shipments` table to select the crop, region, and loss_pct for all records where the crop is 'Maize' and loss_pct is greater than 5%.",
    startingCode: "SELECT crop, region, loss_pct FROM shipments WHERE crop = 'Maize' AND loss_pct > 5;",
    verify: (results) => {
      if (!Array.isArray(results) || results.length !== 2) return false;
      return results.every(r => r.crop === 'Maize' && parseFloat(r.loss_pct) > 5);
    }
  },
  {
    id: 2,
    title: '2. Spoilage Temperature Aggregations',
    desc: "Calculate the average temperature (AVG(temp) as avg_temp) and average humidity (AVG(humidity) as avg_hum) for shipments grouped by status.",
    startingCode: "SELECT status, AVG(temp) AS avg_temp, AVG(humidity) AS avg_hum FROM shipments GROUP BY status;",
    verify: (results) => {
      if (!Array.isArray(results) || results.length !== 2) return false;
      const completed = results.find(r => r.status === 'Completed');
      const spoiled = results.find(r => r.status === 'Spoiled');
      return completed && spoiled && completed.avg_temp !== undefined && spoiled.avg_hum !== undefined;
    }
  },
  {
    id: 3,
    title: '3. Hotspot Loss Analysis',
    desc: "Select the region, cooperative, and loss_pct for shipments with a loss_pct greater than 30%, sorted by loss_pct descending.",
    startingCode: "SELECT region, cooperative, loss_pct FROM shipments WHERE loss_pct > 30 ORDER BY loss_pct DESC;",
    verify: (results) => {
      if (!Array.isArray(results) || results.length !== 3) return false;
      return results[0].loss_pct > results[1].loss_pct && results[1].loss_pct > results[2].loss_pct;
    }
  }
];

const SAMPLE_SHIPMENTS = [
  { id: 1, crop: 'Maize', region: 'Kakamega', cooperative: 'Sunga Co-op', temp: 24.5, humidity: 65.2, status: 'Completed', loss_pct: 5.2 },
  { id: 2, crop: 'Beans', region: 'Meru', cooperative: 'Kilimambogo Co-op', temp: 21.0, humidity: 58.0, status: 'Spoiled', loss_pct: 34.0 },
  { id: 3, crop: 'Maize', region: 'Kitale', cooperative: 'Trans-Nzoia Group', temp: 25.8, humidity: 70.1, status: 'Completed', loss_pct: 8.5 },
  { id: 4, crop: 'Rice', region: 'Mwea', cooperative: 'Tebere Society', temp: 28.2, humidity: 78.4, status: 'Spoiled', loss_pct: 42.1 },
  { id: 5, crop: 'Sorghum', region: 'Machakos', cooperative: 'Yatta Farmers', temp: 27.0, humidity: 45.0, status: 'Completed', loss_pct: 3.1 },
  { id: 6, crop: 'Beans', region: 'Eldoret', cooperative: 'Uasin Gishu Union', temp: 20.5, humidity: 62.5, status: 'Completed', loss_pct: 6.8 },
  { id: 7, crop: 'Maize', region: 'Njoro', cooperative: 'Mau Farmers', temp: 22.1, humidity: 59.8, status: 'Completed', loss_pct: 4.5 },
  { id: 8, crop: 'Rice', region: 'Kisumu', cooperative: 'Kano Plains Co-op', temp: 29.5, humidity: 82.0, status: 'Spoiled', loss_pct: 39.8 }
];

export function PythonTerminal() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('python'); // 'python' | 'sql'

  // Python Sandbox States
  const [pyChallengeIdx, setPyChallengeIdx] = useState(0);
  const [pyCode, setPyCode] = useState(PYTHON_CHALLENGES[0].startingCode);
  const [pyOutput, setPyOutput] = useState('');
  const [pyStatus, setPyStatus] = useState('idle'); // idle, loading, ready, running, success, error
  const [pyodideInstance, setPyodideInstance] = useState(null);
  const pyConsoleLogRef = useRef([]);

  // Sandbox Dataset States
  const [selectedDatasetKey, setSelectedDatasetKey] = useState('iris');
  const [showDatasetPreview, setShowDatasetPreview] = useState(false);

  // SQL Sandbox States
  const [sqlChallengeIdx, setSqlChallengeIdx] = useState(0);
  const [sqlCode, setSqlCode] = useState(SQL_CHALLENGES[0].startingCode);
  const [sqlOutput, setSqlOutput] = useState([]);
  const [sqlError, setSqlError] = useState('');
  const [sqlStatus, setSqlStatus] = useState('idle'); // idle, success, error

  // AI Review & Syntax Cheat Sheet states
  const [codeReviewText, setCodeReviewText] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [activeCheatTab, setActiveCheatTab] = useState('pandas');

  // ---------- Ingest Standard Dataset into Pyodide ----------
  const handleLoadDataset = () => {
    playClick();
    if (!pyodideInstance) {
      setPyOutput(prev => prev + '\n⚠️ Please wait for Pyodide WebAssembly to finish loading before loading a dataset.\n');
      return;
    }
    const ds = SANDBOX_DATASETS[selectedDatasetKey];
    try {
      pyodideInstance.FS.writeFile(ds.filename, ds.csv);
      playSuccess();
      setPyOutput(prev => prev + `\n📂 Loaded standard dataset: '${ds.filename}' into Pyodide workspace!\nYou can load it in pandas with:\n\nimport pandas as pd\ndf = pd.read_csv('${ds.filename}')\nprint(df.head())\n`);
    } catch (err) {
      setPyOutput(prev => prev + `\n❌ Failed to load dataset: ${err.message}\n`);
    }
  };

  // Helper to parse mock CSV string for visual preview table
  const getDatasetPreviewRows = () => {
    const ds = SANDBOX_DATASETS[selectedDatasetKey];
    if (!ds) return { headers: [], rows: [] };
    const lines = ds.csv.trim().split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1, 6).map(line => {
      const values = line.split(',');
      const rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });
      return rowObj;
    });
    return { headers, rows };
  };

  // ---------- CSV Upload into Pyodide FS ----------
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!pyodideInstance) {
      setPyOutput(prev => prev + '\n⚠️ Please wait for Pyodide to finish loading before uploading a CSV file.\n');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target.result;
      try {
        pyodideInstance.FS.writeFile('uploaded_data.csv', content);
        setPyOutput(prev => prev + `\n📂 Loaded custom CSV: '${file.name}' into Pyodide filesystem!\nYou can now query it as follows:\n\nimport pandas as pd\ndf = pd.read_csv('uploaded_data.csv')\nprint(df.head())\n`);
      } catch (err) {
        setPyOutput(prev => prev + `\n❌ Failed to save CSV to Pyodide FS: ${err.message}\n`);
      }
    };
    reader.readAsText(file);
  };

  // ---------- Pyodide WebAssembly Setup ----------
  useEffect(() => {
    if (activeTab !== 'python') return;
    if (window.loadPyodide) {
      setPyStatus('ready');
      return;
    }

    setPyStatus('loading');
    setPyOutput('Loading Pyodide WebAssembly runtime from CDN (approx. 10MB)...\n');

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js';
    script.async = true;
    script.onload = async () => {
      try {
        setPyOutput(prev => prev + 'Pyodide loaded. Initializing runtime...\n');
        const py = await window.loadPyodide({
          stdout: (text) => { pyConsoleLogRef.current.push(text); },
          stderr: (text) => { pyConsoleLogRef.current.push(text); }
        });
        
        setPyOutput(prev => prev + 'Loading NumPy and Pandas packages...\n');
        await py.loadPackage(['numpy', 'pandas', 'scikit-learn']);
        
        setPyodideInstance(py);
        setPyStatus('ready');
        setPyOutput(prev => prev + '✅ Python environment ready! numpy, pandas, and scikit-learn preloaded.\n');
      } catch (err) {
        setPyStatus('error');
        setPyOutput(prev => prev + `❌ Failed to initialize Pyodide: ${err.message}\n`);
      }
    };
    script.onerror = () => {
      setPyStatus('error');
      setPyOutput(prev => prev + '❌ Failed to fetch Pyodide scripts from CDN.\n');
    };
    document.body.appendChild(script);
  }, [activeTab]);

  // ---------- AI Code Review ----------
  const runAiCodeReview = async () => {
    const codeToReview = activeTab === 'python' ? pyCode : sqlCode;
    if (!codeToReview.trim()) return;
    setIsReviewing(true);
    setShowReviewPanel(true);
    setCodeReviewText('Analyzing code cleanliness, computational complexity, and best practices...');
    
    if (!currentUser || !ai) {
      setTimeout(() => {
        setCodeReviewText("Please log in with email to enable live AI Code reviews from Gemini!");
        setIsReviewing(false);
      }, 800);
      return;
    }
    
    try {
      const model = getGenerativeModel(ai, {
        model: 'gemini-3.5-flash',
        generationConfig: {
          maxOutputTokens: 512,
          temperature: 0.2,
        }
      });
      
      const prompt = `Review the following ${activeTab === 'python' ? 'Python' : 'SQL'} code for cleanliness, time complexity, and data science best practices. Keep recommendations under 120 words in clean markdown:
\`\`\`${activeTab === 'python' ? 'python' : 'sql'}
${codeToReview}
\`\`\``;

      const res = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
      setCodeReviewText(res.response.text());
    } catch (err) {
      console.error("AI review failed:", err);
      setCodeReviewText("Failed to compile AI code review. Please try again.");
    } finally {
      setIsReviewing(false);
    }
  };

  // ---------- Run Python Script ----------
  const runPythonCode = async (isTesting = false) => {
    if (!pyodideInstance) return;
    setPyStatus('running');
    pyConsoleLogRef.current = [];
    setPyOutput('Executing code...\n');

    const challenge = PYTHON_CHALLENGES[pyChallengeIdx];
    const codeToRun = isTesting ? `${pyCode}\n${challenge.testCode}` : pyCode;

    try {
      await pyodideInstance.runPythonAsync(codeToRun);
      const logOutput = pyConsoleLogRef.current.join('\n');
      setPyOutput(logOutput || 'Code executed successfully with no output.');
      setPyStatus(isTesting ? 'success' : 'ready');
    } catch (err) {
      setPyOutput(pyConsoleLogRef.current.join('\n') + `\nTraceback:\n${err.message}`);
      setPyStatus('error');
    }
  };

  // ---------- Run SQL Script ----------
  const runSqlCode = (isTesting = false) => {
    setSqlError('');
    setSqlOutput([]);
    setSqlStatus('running');

    try {
      const q = sqlCode.trim().replace(/;$/, '').replace(/\s+/g, ' ');
      
      // Simple custom SQL execution engine for local Shipments shipments query
      // Matches SELECT ... FROM shipments [WHERE ...] [GROUP BY ...] [ORDER BY ...]
      const match = q.match(/SELECT\s+(.*?)\s+FROM\s+shipments(?:\s+WHERE\s+(.*?))?(?:\s+GROUP\s+BY\s+(.*?))?(?:\s+ORDER\s+BY\s+(.*?))?$/i);
      
      if (!match) {
        throw new Error("Syntax Error: Only simple queries matching 'SELECT ... FROM shipments [WHERE ...] [GROUP BY ...] [ORDER BY ...]' are supported in this sandbox.");
      }

      const selectFields = match[1].split(',').map(f => f.trim());
      const whereClause = match[2];
      const groupByFields = match[3];
      const orderByClause = match[4];

      let filteredData = [...SAMPLE_SHIPMENTS];

      // Evaluate WHERE conditions
      if (whereClause) {
        // e.g. crop = 'Maize' AND loss_pct > 5
        filteredData = filteredData.filter(row => {
          const conditions = whereClause.split(/\s+AND\s+/i);
          return conditions.every(cond => {
            const condMatch = cond.match(/(\w+)\s*(=|>|<|>=|<=)\s*(.*)/);
            if (!condMatch) return false;
            
            const field = condMatch[1].trim();
            const operator = condMatch[2].trim();
            let val = condMatch[3].trim().replace(/['"]/g, '');

            const rowVal = row[field];
            if (operator === '=') return String(rowVal).toLowerCase() === val.toLowerCase();
            if (operator === '>') return parseFloat(rowVal) > parseFloat(val);
            if (operator === '<') return parseFloat(rowVal) < parseFloat(val);
            if (operator === '>=') return parseFloat(rowVal) >= parseFloat(val);
            if (operator === '<=') return parseFloat(rowVal) <= parseFloat(val);
            return false;
          });
        });
      }

      let results = [];

      // Evaluate GROUP BY
      if (groupByFields) {
        const groupField = groupByFields.trim();
        const groups = {};

        filteredData.forEach(row => {
          const key = row[groupField];
          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push(row);
        });

        Object.keys(groups).forEach(key => {
          const groupRows = groups[key];
          const resultRow = { [groupField]: key };

          selectFields.forEach(fieldExpr => {
            const avgMatch = fieldExpr.match(/AVG\((\w+)\)/i);
            const sumMatch = fieldExpr.match(/SUM\((\w+)\)/i);
            const countMatch = fieldExpr.match(/COUNT\((\w+)\)/i);

            if (avgMatch) {
              const col = avgMatch[1];
              const avgVal = groupRows.reduce((sum, r) => sum + r[col], 0) / groupRows.length;
              const alias = fieldExpr.match(/AS\s+(\w+)/i)?.[1] || fieldExpr;
              resultRow[alias] = parseFloat(avgVal.toFixed(2));
            } else if (sumMatch) {
              const col = sumMatch[1];
              const sumVal = groupRows.reduce((sum, r) => sum + r[col], 0);
              const alias = fieldExpr.match(/AS\s+(\w+)/i)?.[1] || fieldExpr;
              resultRow[alias] = parseFloat(sumVal.toFixed(2));
            } else if (countMatch) {
              const alias = fieldExpr.match(/AS\s+(\w+)/i)?.[1] || fieldExpr;
              resultRow[alias] = groupRows.length;
            }
          });
          results.push(resultRow);
        });
      } else {
        // Plain SELECT
        results = filteredData.map(row => {
          const resultRow = {};
          selectFields.forEach(field => {
            if (field === '*') {
              Object.assign(resultRow, row);
            } else {
              resultRow[field] = row[field];
            }
          });
          return resultRow;
        });
      }

      // Evaluate ORDER BY
      if (orderByClause) {
        const [orderCol, direction] = orderByClause.trim().split(/\s+/);
        const isDesc = direction && direction.toUpperCase() === 'DESC';

        results.sort((a, b) => {
          const valA = a[orderCol];
          const valB = b[orderCol];
          if (valA < valB) return isDesc ? 1 : -1;
          if (valA > valB) return isDesc ? -1 : 1;
          return 0;
        });
      }

      setSqlOutput(results);
      
      if (isTesting) {
        const activeChallenge = SQL_CHALLENGES[sqlChallengeIdx];
        const passed = activeChallenge.verify(results);
        if (passed) {
          setSqlStatus('success');
        } else {
          setSqlStatus('error');
          setSqlError("Verification failed: The returned table columns or values do not match challenge assertions.");
        }
      } else {
        setSqlStatus('idle');
      }
    } catch (err) {
      setSqlError(err.message);
      setSqlStatus('error');
    }
  };

  const handlePyChallengeChange = (idx) => {
    setPyChallengeIdx(idx);
    setPyCode(PYTHON_CHALLENGES[idx].startingCode);
    setPyOutput('');
  };

  const handleSqlChallengeChange = (idx) => {
    setSqlChallengeIdx(idx);
    setSqlCode(SQL_CHALLENGES[idx].startingCode);
    setSqlOutput([]);
    setSqlError('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-phase-violet/15 rounded-xl text-phase-violet">
            <Terminal size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-display text-text-main">Developer Coding Sandbox</h2>
            <p className="text-text-dim text-sm">Write, execute, and verify code locally in your browser using Python or SQL runtimes.</p>
          </div>
        </div>
      </header>

      {/* Tab Selectors with Cheat Sheet toggle */}
      <div className="flex border-b border-border-line justify-between items-center">
        <div className="flex">
          <button
            onClick={() => {
              setActiveTab('python');
              setShowReviewPanel(false);
            }}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'python'
                ? 'border-phase-violet text-phase-violet font-bold'
                : 'border-transparent text-text-faint hover:text-text-dim'
            }`}
          >
            <Terminal size={15} /> Python & WASM ML Environment
          </button>
          <button
            onClick={() => {
              setActiveTab('sql');
              setShowReviewPanel(false);
            }}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'sql'
                ? 'border-phase-violet text-phase-violet font-bold'
                : 'border-transparent text-text-faint hover:text-text-dim'
            }`}
          >
            <Database size={15} /> SQL Database Playground
          </button>
        </div>

        <button
          onClick={() => setShowCheatSheet(!showCheatSheet)}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-phase-violet hover:underline px-4 cursor-pointer"
        >
          <BookOpen size={14} />
          {showCheatSheet ? 'Hide Cheat Sheet' : 'Show Cheat Sheet'}
        </button>
      </div>

      {/* Flex container wrapping compiler and cheat sheet panel */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Sandbox workspace */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Tab 1: Python Compiler */}
          {activeTab === 'python' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <div className="flat-card p-5 border border-border-line space-y-4">
                  <h3 className="text-sm font-mono text-text-faint uppercase tracking-wider">Coding Challenges</h3>
                  <div className="space-y-2">
                    {PYTHON_CHALLENGES.map((c, idx) => (
                      <button
                        key={c.id}
                        onClick={() => handlePyChallengeChange(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          pyChallengeIdx === idx
                            ? 'bg-phase-violet/10 border-phase-violet/30 text-phase-violet font-bold'
                            : 'bg-surface border-border-line hover:bg-bg-raise hover:text-text-main'
                        }`}
                      >
                        {c.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 10 Standard Datasets Explorer */}
                <div className="flat-card p-5 border border-border-line space-y-4">
                  <h3 className="text-sm font-mono text-text-faint uppercase tracking-wider flex items-center gap-1.5">
                    <Table size={14} className="text-phase-teal" />
                    Standard Datasets
                  </h3>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono text-text-faint uppercase">Select dataset to query</label>
                    <select
                      value={selectedDatasetKey}
                      onChange={(e) => {
                        playClick();
                        setSelectedDatasetKey(e.target.value);
                        setShowDatasetPreview(false);
                      }}
                      className="w-full bg-bg-main border border-border-line rounded-xl p-2.5 text-xs text-text-main focus:outline-none focus:border-phase-teal cursor-pointer font-semibold"
                    >
                      {Object.keys(SANDBOX_DATASETS).map(key => (
                        <option key={key} value={key}>{SANDBOX_DATASETS[key].name}</option>
                      ))}
                    </select>

                    <div className="flex gap-2">
                      <button
                        onClick={handleLoadDataset}
                        className="flex-1 py-2 bg-phase-teal/10 hover:bg-phase-teal/20 text-phase-teal rounded-xl text-xs font-mono font-bold transition-all border border-phase-teal/20 cursor-pointer"
                      >
                        Load Workspace
                      </button>
                      <button
                        onClick={() => {
                          playClick();
                          setShowDatasetPreview(!showDatasetPreview);
                        }}
                        className="flex-1 py-2 bg-bg-raise hover:bg-surface text-text-dim rounded-xl text-xs font-mono font-bold transition-all border border-border-line cursor-pointer"
                      >
                        {showDatasetPreview ? 'Hide Preview' : 'Preview Table'}
                      </button>
                    </div>

                    {showDatasetPreview && (() => {
                      const { headers, rows } = getDatasetPreviewRows();
                      return (
                        <div className="pt-3 border-t border-border-line space-y-2 animate-scale-in">
                          <span className="text-[9px] font-mono text-text-faint uppercase block">Preview (First 5 Rows)</span>
                          <div className="overflow-x-auto border border-border-line rounded-lg custom-scrollbar">
                            <table className="w-full text-[9px] font-mono text-text-dim border-collapse text-left">
                              <thead>
                                <tr className="bg-bg-raise border-b border-border-line">
                                  {headers.map(h => <th key={h} className="p-1.5 border-r border-border-line last:border-0">{h}</th>)}
                                </tr>
                              </thead>
                              <tbody>
                                {rows.map((r, i) => (
                                  <tr key={i} className="border-b last:border-0 border-border-line bg-surface hover:bg-bg-raise/30">
                                    {headers.map(h => <td key={h} className="p-1.5 border-r border-border-line last:border-0 truncate max-w-[80px]">{r[h]}</td>)}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="flat-card p-5 border border-border-line space-y-2 text-xs text-text-dim">
                  <h4 className="font-bold text-text-main flex items-center gap-1">
                    <AlertTriangle size={14} className="text-phase-amber" />
                    WebAssembly Notice
                  </h4>
                  <p className="leading-relaxed">
                    Pyodide runs Python in a secure client-side sandbox. The first loading cycle fetches libraries (about 10MB), which requires a stable internet connection.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="flat-card p-6 border border-border-line space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-text-main font-display">{PYTHON_CHALLENGES[pyChallengeIdx].title}</h3>
                    <p className="text-sm text-text-dim mt-1 leading-relaxed">{PYTHON_CHALLENGES[pyChallengeIdx].desc}</p>
                  </div>

                  {/* Codearea */}
                  <div className="relative border border-border-line rounded-xl overflow-hidden bg-[#1e1e2e]">
                    <div className="bg-[#181825] px-4 py-2 border-b border-border-line flex items-center justify-between text-[11px] font-mono text-text-faint">
                      <span>sandbox.py</span>
                      <span>Python 3.11</span>
                    </div>
                    <textarea
                      value={pyCode}
                      onChange={(e) => setPyCode(e.target.value)}
                      rows={10}
                      className="w-full bg-transparent font-mono text-xs text-[#cdd6f4] p-4 focus:outline-none resize-none leading-relaxed"
                      spellCheck="false"
                    />
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setPyCode(PYTHON_CHALLENGES[pyChallengeIdx].startingCode);
                          setPyOutput('');
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-bg-raise text-text-dim hover:text-text-main border border-border-line transition-colors cursor-pointer"
                      >
                        <RotateCcw size={14} /> Reset Code
                      </button>
                      
                      <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-bg-raise text-text-dim hover:text-text-main border border-border-line transition-colors cursor-pointer">
                        <Upload size={14} /> Ingest CSV
                        <input type="file" accept=".csv" className="hidden" onChange={handleCSVUpload} />
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <button
                        disabled={pyStatus === 'loading' || pyStatus === 'running'}
                        onClick={() => runPythonCode(false)}
                        className="flex items-center gap-2 bg-bg-raise hover:bg-surface text-text-main px-5 py-2.5 rounded-xl font-bold font-mono text-xs transition-colors border border-border-line disabled:opacity-50 cursor-pointer"
                      >
                        {pyStatus === 'running' ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                        Run Script
                      </button>
                      <button
                        disabled={isReviewing}
                        onClick={runAiCodeReview}
                        className="flex items-center gap-1.5 bg-bg-raise hover:bg-surface text-phase-violet border border-phase-violet/30 px-5 py-2.5 rounded-xl font-bold font-mono text-xs transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isReviewing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        AI Code Review
                      </button>
                      <button
                        disabled={pyStatus === 'loading' || pyStatus === 'running'}
                        onClick={() => runPythonCode(true)}
                        className="flex items-center gap-2 bg-phase-violet hover:bg-phase-violet/85 text-white px-5 py-2.5 rounded-xl font-bold font-mono text-xs transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                      >
                        {pyStatus === 'running' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                        Verify Solution
                      </button>
                    </div>
                  </div>
                </div>

                {/* Output console */}
                <div className="flat-card p-5 border border-border-line space-y-3 bg-[#1e1e2e]">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <h4 className="text-xs font-mono font-bold text-slate-400">Terminal Output</h4>
                    {pyStatus === 'success' && <span className="text-[10px] text-teal-400 font-bold">✓ TEST SUCCESS</span>}
                  </div>
                  <pre className="font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-48 min-h-[80px]">
                    {pyOutput}
                  </pre>
                </div>

                {/* AI Review Panel */}
                {showReviewPanel && (
                  <div className="flat-card p-5 border border-phase-violet/30 space-y-3 bg-phase-violet/5 animate-slide-up">
                    <div className="flex justify-between items-center border-b border-phase-violet/20 pb-2">
                      <h4 className="text-xs font-mono font-bold text-phase-violet">AI Code Review Feedback</h4>
                      <button onClick={() => setShowReviewPanel(false)} className="text-text-faint hover:text-text-main"><X size={14}/></button>
                    </div>
                    <div className="text-xs leading-relaxed text-text-main whitespace-pre-wrap font-mono">
                      {codeReviewText}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: SQL Sandbox */}
          {activeTab === 'sql' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <div className="flat-card p-5 border border-border-line space-y-4">
                  <h3 className="text-sm font-mono text-text-faint uppercase tracking-wider">SQL Challenges</h3>
                  <div className="space-y-2">
                    {SQL_CHALLENGES.map((c, idx) => (
                      <button
                        key={c.id}
                        onClick={() => handleSqlChallengeChange(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          sqlChallengeIdx === idx
                            ? 'bg-phase-violet/10 border-phase-violet/30 text-phase-violet font-bold'
                            : 'bg-surface border-border-line hover:bg-bg-raise hover:text-text-main'
                        }`}
                      >
                        {c.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flat-card p-5 border border-border-line space-y-3 text-xs text-text-dim">
                  <h4 className="font-bold text-text-main flex items-center gap-1.5">
                    <Database size={15} className="text-phase-teal" /> Shipments Schema
                  </h4>
                  <p>The `shipments` table is pre-populated in memory with the following fields:</p>
                  <ul className="list-disc list-inside space-y-1 font-mono text-[10px]">
                    <li><span className="font-bold">id</span> (INTEGER)</li>
                    <li><span className="font-bold">crop</span> (TEXT)</li>
                    <li><span className="font-bold">region</span> (TEXT)</li>
                    <li><span className="font-bold">cooperative</span> (TEXT)</li>
                    <li><span className="font-bold">temp</span> (REAL)</li>
                    <li><span className="font-bold">humidity</span> (REAL)</li>
                    <li><span className="font-bold">status</span> (TEXT)</li>
                    <li><span className="font-bold">loss_pct</span> (REAL)</li>
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="flat-card p-6 border border-border-line space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-text-main font-display">{SQL_CHALLENGES[sqlChallengeIdx].title}</h3>
                    <p className="text-sm text-text-dim mt-1 leading-relaxed">{SQL_CHALLENGES[sqlChallengeIdx].desc}</p>
                  </div>

                  {/* Codearea */}
                  <div className="relative border border-border-line rounded-xl overflow-hidden bg-[#1e1e2e]">
                    <div className="bg-[#181825] px-4 py-2 border-b border-border-line flex items-center justify-between text-[11px] font-mono text-text-faint">
                      <span>query.sql</span>
                      <span>SQLite</span>
                    </div>
                    <textarea
                      value={sqlCode}
                      onChange={(e) => setSqlCode(e.target.value)}
                      rows={6}
                      className="w-full bg-transparent font-mono text-xs text-[#cdd6f4] p-4 focus:outline-none resize-none leading-relaxed"
                      spellCheck="false"
                    />
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => {
                        setSqlCode(SQL_CHALLENGES[sqlChallengeIdx].startingCode);
                        setSqlOutput([]);
                        setSqlError('');
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-bg-raise text-text-dim hover:text-text-main border border-border-line transition-colors cursor-pointer"
                    >
                      <RotateCcw size={14} /> Reset Code
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => runSqlCode(false)}
                        className="flex items-center gap-2 bg-bg-raise hover:bg-surface text-text-main px-5 py-2.5 rounded-xl font-bold font-mono text-xs transition-colors border border-border-line cursor-pointer"
                      >
                        <Play size={14} /> Run Query
                      </button>
                      <button
                        disabled={isReviewing}
                        onClick={runAiCodeReview}
                        className="flex items-center gap-1.5 bg-bg-raise hover:bg-surface text-phase-violet border border-phase-violet/30 px-5 py-2.5 rounded-xl font-bold font-mono text-xs transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isReviewing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        AI Code Review
                      </button>
                      <button
                        onClick={() => runSqlCode(true)}
                        className="flex items-center gap-2 bg-phase-violet hover:bg-phase-violet/85 text-white px-5 py-2.5 rounded-xl font-bold font-mono text-xs transition-colors shadow-md cursor-pointer"
                      >
                        <CheckCircle2 size={14} /> Verify Solution
                      </button>
                    </div>
                  </div>
                </div>

                {/* SQL Table Output */}
                <div className="flat-card p-5 border border-border-line space-y-3 bg-[#1e1e2e] min-h-[120px]">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <h4 className="text-xs font-mono font-bold text-slate-400">Query Results</h4>
                    {sqlStatus === 'success' && <span className="text-[10px] text-teal-400 font-bold">✓ TEST SUCCESS</span>}
                  </div>

                  {sqlError ? (
                    <div className="text-xs font-mono text-red-400 whitespace-pre-wrap">{sqlError}</div>
                  ) : sqlOutput.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px] font-mono text-slate-300 border-collapse">
                        <thead>
                          <tr className="border-b border-slate-700 text-left bg-slate-800">
                            {Object.keys(sqlOutput[0]).map(key => (
                              <th key={key} className="p-2 border-r border-slate-700 last:border-0">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sqlOutput.map((row, idx) => (
                            <tr key={idx} className="border-b last:border-0 border-slate-800 hover:bg-slate-800/40">
                              {Object.values(row).map((val, i) => (
                                <td key={i} className="p-2 border-r border-slate-800 last:border-0">{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-slate-500 italic">No output. Type your query and click Run Query.</div>
                  )}
                </div>

                {/* AI Review Panel (SQL) */}
                {showReviewPanel && (
                  <div className="flat-card p-5 border border-phase-violet/30 space-y-3 bg-phase-violet/5 animate-slide-up">
                    <div className="flex justify-between items-center border-b border-phase-violet/20 pb-2">
                      <h4 className="text-xs font-mono font-bold text-phase-violet">AI Query Review Feedback</h4>
                      <button onClick={() => setShowReviewPanel(false)} className="text-text-faint hover:text-text-main"><X size={14}/></button>
                    </div>
                    <div className="text-xs leading-relaxed text-text-main whitespace-pre-wrap font-mono">
                      {codeReviewText}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Collapsible Cheat Sheet Panel */}
        {showCheatSheet && (
          <div className="w-full lg:w-80 bg-surface border border-border-line rounded-2xl p-5 shadow-sm space-y-4 animate-slide-in-right flex-shrink-0">
            <div className="flex justify-between items-center border-b border-border-line pb-3">
              <h4 className="font-bold font-display text-sm text-text-main flex items-center gap-1.5">
                <BookOpen size={16} className="text-phase-violet" />
                Syntax Cheat Sheet
              </h4>
              <button onClick={() => setShowCheatSheet(false)} className="text-text-faint hover:text-text-main"><X size={16} /></button>
            </div>
            
            {/* Cheat Sheet Tabs */}
            <div className="flex gap-2 border-b border-border-line pb-2 text-[10px] font-mono">
              {['pandas', 'numpy', 'sql'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveCheatTab(t)}
                  className={`px-2 py-1 rounded cursor-pointer uppercase ${
                    activeCheatTab === t ? 'bg-phase-violet/15 text-phase-violet font-bold' : 'text-text-faint'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Cheat Sheet Content */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar text-[11px] font-mono leading-relaxed">
              {activeCheatTab === 'pandas' && (
                <div className="space-y-2.5">
                  <div className="bg-bg-raise p-2 rounded border border-border-line">
                    <p className="font-bold text-text-main">Ingest CSV</p>
                    <code className="text-phase-violet">df = pd.read_csv('file.csv')</code>
                  </div>
                  <div className="bg-bg-raise p-2 rounded border border-border-line">
                    <p className="font-bold text-text-main">Filter Rows</p>
                    <code className="text-phase-violet">df.query('loss_pct &gt; 10')</code>
                  </div>
                  <div className="bg-bg-raise p-2 rounded border border-border-line">
                    <p className="font-bold text-text-main">Aggregation</p>
                    <code className="text-phase-violet">df.groupby('crop').mean()</code>
                  </div>
                </div>
              )}
              {activeCheatTab === 'numpy' && (
                <div className="space-y-2.5">
                  <div className="bg-bg-raise p-2 rounded border border-border-line">
                    <p className="font-bold text-text-main">Array Creation</p>
                    <code className="text-phase-violet">arr = np.array(data)</code>
                  </div>
                  <div className="bg-bg-raise p-2 rounded border border-border-line">
                    <p className="font-bold text-text-main">Mean / Median</p>
                    <code className="text-phase-violet">np.mean(arr) | np.median(arr)</code>
                  </div>
                  <div className="bg-bg-raise p-2 rounded border border-border-line">
                    <p className="font-bold text-text-main">Standard Deviation</p>
                    <code className="text-phase-violet">np.std(arr)</code>
                  </div>
                </div>
              )}
              {activeCheatTab === 'sql' && (
                <div className="space-y-2.5">
                  <div className="bg-bg-raise p-2 rounded border border-border-line">
                    <p className="font-bold text-text-main">Basic Select</p>
                    <code className="text-phase-violet">SELECT * FROM shipments LIMIT 5;</code>
                  </div>
                  <div className="bg-bg-raise p-2 rounded border border-border-line">
                    <p className="font-bold text-text-main">Group By Count</p>
                    <code className="text-phase-violet">SELECT crop, COUNT(*) FROM shipments GROUP BY crop;</code>
                  </div>
                  <div className="bg-bg-raise p-2 rounded border border-border-line">
                    <p className="font-bold text-text-main">Conditional Filter</p>
                    <code className="text-phase-violet">WHERE temp &gt; 25 AND humidity &lt; 60</code>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
