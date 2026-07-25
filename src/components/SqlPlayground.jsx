import { useState } from 'react';
import { Play, Database, CheckCircle2, AlertTriangle, RotateCcw, Award } from 'lucide-react';

const MOCK_DB = {
  harvest_logistics: [
    { shipment_id: 1, crop_name: 'Harvest Guardian Corn', temp_c: 4.2, loss_pct: 1.2, route_duration_hr: 12 },
    { shipment_id: 2, crop_name: 'Golden Soybeans', temp_c: 6.8, loss_pct: 3.5, route_duration_hr: 24 },
    { shipment_id: 3, crop_name: 'Harvest Guardian Corn', temp_c: 8.1, loss_pct: 5.2, route_duration_hr: 36 },
    { shipment_id: 4, crop_name: 'Organic Wheat', temp_c: 5.0, loss_pct: 0.8, route_duration_hr: 8 },
    { shipment_id: 5, crop_name: 'Sweet Barley', temp_c: 7.2, loss_pct: 2.1, route_duration_hr: 18 },
    { shipment_id: 6, crop_name: 'Golden Soybeans', temp_c: 9.5, loss_pct: 7.8, route_duration_hr: 48 },
    { shipment_id: 7, crop_name: 'Organic Wheat', temp_c: 4.6, loss_pct: 1.1, route_duration_hr: 15 },
    { shipment_id: 8, crop_name: 'Sweet Barley', temp_c: 5.9, loss_pct: 1.4, route_duration_hr: 10 },
    { shipment_id: 9, crop_name: 'Harvest Guardian Corn', temp_c: 3.8, loss_pct: 0.5, route_duration_hr: 6 },
    { shipment_id: 10, crop_name: 'Golden Soybeans', temp_c: 8.7, loss_pct: 4.9, route_duration_hr: 30 }
  ]
};

const SQL_CHALLENGES = [
  {
    id: 1,
    title: '1. Select Corn Shipments',
    desc: 'Write a query to SELECT all columns from `harvest_logistics` where the `crop_name` is exactly "Harvest Guardian Corn".',
    targetQuery: `SELECT * FROM harvest_logistics WHERE crop_name = 'Harvest Guardian Corn'`,
    validate: (res) => res.length === 3 && res.every(r => r.crop_name === 'Harvest Guardian Corn')
  },
  {
    id: 2,
    title: '2. High-Loss Shipments',
    desc: 'Filter the shipments in `harvest_logistics` where the `loss_pct` is strictly greater than 3.0, ordered by `loss_pct` descending.',
    targetQuery: `SELECT * FROM harvest_logistics WHERE loss_pct > 3.0 ORDER BY loss_pct DESC`,
    validate: (res) => res.length === 4 && res[0].loss_pct === 7.8 && res[1].loss_pct === 5.2
  },
  {
    id: 3,
    title: '3. Calculate Average Temperature',
    desc: 'Write a query to calculate the average temperature (`AVG(temp_c)`) of "Golden Soybeans" shipments.',
    targetQuery: `SELECT AVG(temp_c) FROM harvest_logistics WHERE crop_name = 'Golden Soybeans'`,
    validate: (res) => res.length === 1 && Math.abs(parseFloat(Object.values(res[0])[0]) - 8.33) < 0.1
  }
];

export function SqlPlayground() {
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [query, setQuery] = useState('SELECT * FROM harvest_logistics;');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const challenge = SQL_CHALLENGES[currentChallengeIdx];

  const resetCode = () => {
    setQuery('SELECT * FROM harvest_logistics;');
    setResults([]);
    setError(null);
    setSuccess(false);
  };

  // Advanced client-side SQL parser & execution simulator
  const executeSQL = (sqlText) => {
    setError(null);
    setSuccess(false);
    
    // Normalize query
    const cleanSql = sqlText.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/;$/, '');
    
    if (!cleanSql.toLowerCase().startsWith('select')) {
      setError('Only SELECT queries are supported in this sandbox.');
      return;
    }

    try {
      let data = [...MOCK_DB.harvest_logistics];

      // Parse WHERE clause
      const whereMatch = cleanSql.match(/where\s+(.+?)(?:\s+order\s+by|\s+group\s+by|\s+limit|$)/i);
      if (whereMatch) {
        const expression = whereMatch[1].trim();
        
        // Handle basic filters (e.g. crop_name = 'Harvest Guardian Corn', loss_pct > 3.0)
        if (expression.toLowerCase().includes('crop_name')) {
          const valMatch = expression.match(/crop_name\s*=\s*['"](.+?)['"]/i);
          if (valMatch) {
            const cropVal = valMatch[1];
            data = data.filter(r => r.crop_name.toLowerCase() === cropVal.toLowerCase());
          }
        } else if (expression.toLowerCase().includes('loss_pct')) {
          const valMatch = expression.match(/loss_pct\s*([><=]+)\s*([\d.]+)/i);
          if (valMatch) {
            const op = valMatch[1];
            const val = parseFloat(valMatch[2]);
            if (op === '>') data = data.filter(r => r.loss_pct > val);
            if (op === '<') data = data.filter(r => r.loss_pct < val);
            if (op === '=') data = data.filter(r => r.loss_pct === val);
          }
        }
      }

      // Parse ORDER BY
      const orderMatch = cleanSql.match(/order\s+by\s+(\w+)(?:\s+(desc|asc))?/i);
      if (orderMatch) {
        const field = orderMatch[1].trim();
        const dir = orderMatch[2] ? orderMatch[2].toLowerCase() : 'asc';
        
        data.sort((a, b) => {
          if (dir === 'desc') {
            return b[field] - a[field];
          } else {
            return a[field] - b[field];
          }
        });
      }

      // Parse aggregate functions (e.g. AVG(temp_c))
      if (cleanSql.toLowerCase().includes('avg(temp_c)')) {
        const sum = data.reduce((acc, row) => acc + row.temp_c, 0);
        const avg = data.length > 0 ? (sum / data.length) : 0;
        data = [{ 'AVG(temp_c)': avg.toFixed(2) }];
      }

      setResults(data);

      // Validate query against challenge targets
      if (challenge.validate(data)) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    } catch (err) {
      setError(`SQL Execution Error: ${err.message}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
      {/* Sidebar Challenge instructions */}
      <div className="lg:col-span-4 space-y-4">
        <div className="flat-card p-6 border border-border-line">
          <div className="flex items-center gap-2 mb-4">
            <Database className="text-phase-teal" size={20} />
            <h3 className="font-bold text-text-main font-display">SQL Sandbox Challenges</h3>
          </div>
          
          <div className="flex flex-col gap-2 mb-6">
            {SQL_CHALLENGES.map((ch, i) => (
              <button
                key={ch.id}
                onClick={() => { setCurrentChallengeIdx(i); resetCode(); }}
                className={`text-left p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  currentChallengeIdx === i
                    ? 'border-phase-teal bg-phase-teal/10 text-phase-teal font-bold'
                    : 'border-border-line text-text-dim hover:text-text-main hover:bg-surface'
                }`}
              >
                {ch.title}
              </button>
            ))}
          </div>

          <div className="bg-bg-raise p-4 rounded-xl border border-border-line space-y-3">
            <h4 className="text-xs font-bold text-text-main font-mono">Current Task:</h4>
            <p className="text-xs text-text-dim leading-relaxed">{challenge.desc}</p>
          </div>
        </div>

        {/* Database Schema Information */}
        <div className="flat-card p-6 border border-border-line space-y-3">
          <h4 className="font-bold text-text-main text-xs font-mono uppercase tracking-wider">Table: harvest_logistics</h4>
          <div className="space-y-1.5 font-mono text-[10px] text-text-dim">
            <div className="flex justify-between border-b border-border-line/60 pb-1">
              <span className="font-bold text-text-main">shipment_id</span>
              <span>INTEGER (PK)</span>
            </div>
            <div className="flex justify-between border-b border-border-line/60 pb-1">
              <span className="font-bold text-text-main">crop_name</span>
              <span>VARCHAR(50)</span>
            </div>
            <div className="flex justify-between border-b border-border-line/60 pb-1">
              <span className="font-bold text-text-main">temp_c</span>
              <span>DECIMAL(4,2)</span>
            </div>
            <div className="flex justify-between border-b border-border-line/60 pb-1">
              <span className="font-bold text-text-main">loss_pct</span>
              <span>DECIMAL(4,2)</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="font-bold text-text-main">route_duration_hr</span>
              <span>INTEGER</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Terminal Editor */}
      <div className="lg:col-span-8 space-y-4">
        <div className="border border-border-line rounded-2xl overflow-hidden shadow-lg bg-surface">
          <div className="px-5 py-3 border-b border-border-line bg-surface flex items-center justify-between">
            <span className="text-xs font-mono text-text-faint">sql_sandbox.sql</span>
            <div className="flex gap-2">
              <button
                onClick={resetCode}
                className="p-1.5 text-text-faint hover:text-text-main hover:bg-bg-raise rounded-lg transition-colors cursor-pointer"
                title="Reset Query"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => executeSQL(query)}
                className="bg-phase-teal hover:bg-phase-teal/90 text-white font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play size={10} fill="white" /> Run SQL
              </button>
            </div>
          </div>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-44 bg-slate-950 font-mono text-xs text-teal-400 p-5 focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Validation Toast */}
        {success && (
          <div className="bg-phase-teal/15 border border-phase-teal/30 p-4 rounded-xl flex items-center gap-3 animate-scale-in">
            <CheckCircle2 className="text-phase-teal flex-shrink-0" size={20} />
            <div>
              <h5 className="text-xs font-bold text-phase-teal font-mono">Challenge Completed!</h5>
              <p className="text-[10px] text-text-dim mt-0.5">Your query successfully returned the target database output rows.</p>
            </div>
          </div>
        )}

        {/* Error Toast */}
        {error && (
          <div className="bg-phase-brick/10 border border-phase-brick/20 p-4 rounded-xl flex items-center gap-3 animate-scale-in">
            <AlertTriangle className="text-phase-brick flex-shrink-0" size={20} />
            <span className="text-xs font-semibold text-phase-brick font-mono">{error}</span>
          </div>
        )}

        {/* Query Output Results Table */}
        <div className="flat-card p-6 border border-border-line space-y-4">
          <h4 className="font-bold text-text-main text-xs font-mono uppercase tracking-wider flex items-center gap-2">
            <Database size={14} className="text-phase-teal" /> Query Output Table
          </h4>
          
          {results.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-border-line">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-raise border-b border-border-line">
                    {Object.keys(results[0]).map(key => (
                      <th key={key} className="p-3 text-[10px] font-bold text-text-dim uppercase tracking-wider font-mono">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => (
                    <tr key={i} className="border-b last:border-0 border-border-line hover:bg-bg-raise/30">
                      {Object.values(row).map((val, idx) => (
                        <td key={idx} className="p-3 text-xs text-text-main font-mono">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-text-faint text-xs font-mono bg-bg-raise/20 rounded-xl border border-dashed border-border-line">
              No results. Run a valid SELECT query to fetch mock data rows.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
