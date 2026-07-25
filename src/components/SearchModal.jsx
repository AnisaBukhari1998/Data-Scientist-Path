import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Search, X, ArrowRight, BookOpen, Clock, BrainCircuit, Sparkles, Target } from 'lucide-react';
import { PHASES } from '../data/roadmap';
import { Link } from 'react-router-dom';

/* ─── Synonym Map for fuzzy matching ─── */
const SYNONYMS = {
  'neural net': 'deep learning',
  'neural network': 'deep learning',
  'nn': 'deep learning',
  'cnn': 'convolutional neural network',
  'rnn': 'recurrent neural network',
  'lstm': 'recurrent neural network',
  'ml': 'machine learning',
  'dl': 'deep learning',
  'ai': 'artificial intelligence',
  'nlp': 'natural language processing',
  'cv': 'computer vision',
  'rl': 'reinforcement learning',
  'gan': 'generative adversarial',
  'svm': 'support vector',
  'rf': 'random forest',
  'xgb': 'xgboost',
  'lr': 'logistic regression',
  'eda': 'exploratory data analysis',
  'etl': 'extract transform load',
  'api': 'application programming interface',
  'sql': 'structured query language',
  'stats': 'statistics',
  'viz': 'visualization',
  'pandas': 'pandas',
  'numpy': 'numpy',
  'sklearn': 'scikit-learn',
  'tf': 'tensorflow',
  'pytorch': 'pytorch',
  'keras': 'keras',
};

/* ─── Build searchable index from PHASES ─── */
function buildSearchIndex() {
  const items = [];
  const categoryLabels = {
    courses: 'Course', books: 'Book', videos: 'Video',
    websites: 'Website', projects: 'Project', certs: 'Certification',
  };
  const categoryIcons = {
    courses: BookOpen, books: BookOpen, videos: BookOpen,
    projects: Sparkles, certs: Target,
  };

  PHASES.forEach(phase => {
    // Add phase itself
    items.push({
      type: 'phase',
      title: phase.title,
      subtitle: phase.focus,
      link: `/phase/${phase.key}`,
      phaseTitle: phase.title,
      searchText: `${phase.title} ${phase.focus}`.toLowerCase(),
    });

    // Add resources
    ['courses', 'books', 'videos', 'websites', 'projects', 'certs'].forEach(catKey => {
      if (phase[catKey]) {
        phase[catKey].forEach((item, idx) => {
          const title = item[0] || '';
          const source = item[1] || '';
          items.push({
            type: 'resource',
            title,
            subtitle: `${categoryLabels[catKey] || catKey} · ${source}`,
            link: `/phase/${phase.key}`,
            phaseTitle: phase.title,
            categoryLabel: categoryLabels[catKey] || catKey,
            searchText: `${title} ${source} ${item[2] || ''}`.toLowerCase(),
          });
        });
      }
    });
  });

  // Add static pages
  items.push(
    { type: 'page', title: 'Focus Timer', subtitle: 'Forest-style pomodoro timer', link: '/focus', searchText: 'focus timer pomodoro forest tree study' },
    { type: 'page', title: 'Flashcards', subtitle: '500+ data science terms', link: '/flashcards', searchText: 'flashcards terms vocabulary study cards' },
    { type: 'page', title: 'Skill Tree', subtitle: 'RPG-style learning tree', link: '/skills', searchText: 'skill tree rpg levels badges' },
    { type: 'page', title: 'Mock Interview', subtitle: 'Practice interview questions', link: '/interview', searchText: 'mock interview questions practice' },
  );

  return items;
}

export function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchIndex = useMemo(() => buildSearchIndex(), []);

  /* Focus input on open */
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  /* Expand query with synonyms */
  const expandQuery = useCallback((q) => {
    const lower = q.toLowerCase().trim();
    const expanded = [lower];
    Object.entries(SYNONYMS).forEach(([abbr, full]) => {
      if (lower.includes(abbr)) expanded.push(full);
      if (lower.includes(full)) expanded.push(abbr);
    });
    return expanded;
  }, []);

  /* Filter results */
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const queries = expandQuery(query);
    return searchIndex
      .filter(item => queries.some(q => item.searchText.includes(q)))
      .slice(0, 12);
  }, [query, searchIndex, expandQuery]);

  /* Keyboard navigation */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [results.length, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl w-full max-w-xl border border-border-line shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border-line">
          <Search size={20} className="text-text-faint flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search resources, phases, tools..."
            className="flex-1 bg-transparent text-text-main placeholder-text-faint text-lg outline-none font-sans"
            aria-label="Search"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-text-faint bg-bg-raise rounded border border-border-line">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
          {query.trim() && results.length === 0 && (
            <div className="p-8 text-center animate-fade-in">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-text-dim font-medium">No results for "{query}"</p>
              <p className="text-text-faint text-sm mt-1">Try a different term or abbreviation</p>
            </div>
          )}

          {results.map((item, idx) => (
            <Link
              key={`${item.link}-${idx}`}
              to={item.link}
              onClick={onClose}
              className={`
                flex items-center gap-4 px-5 py-3.5 transition-colors
                ${idx === selectedIndex ? 'bg-phase-violet/10' : 'hover:bg-bg-raise'}
                ${idx !== results.length - 1 ? 'border-b border-border-line/50' : ''}
              `}
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold
                ${item.type === 'phase' ? 'bg-phase-violet/15 text-phase-violet' :
                  item.type === 'page' ? 'bg-phase-teal/15 text-phase-teal' :
                  'bg-phase-amber/15 text-phase-amber'}
              `}>
                {item.type === 'phase' ? 'P' : item.type === 'page' ? '⚡' : '📄'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-main truncate">{item.title}</div>
                <div className="text-xs text-text-faint truncate">{item.subtitle}</div>
              </div>
              {item.phaseTitle && item.type !== 'phase' && (
                <span className="text-[10px] font-mono text-text-faint bg-bg-raise px-2 py-0.5 rounded flex-shrink-0">
                  {item.phaseTitle.split('—')[0].trim()}
                </span>
              )}
              <ArrowRight size={14} className="text-text-faint flex-shrink-0" />
            </Link>
          ))}
        </div>

        {/* Footer */}
        {!query.trim() && (
          <div className="px-5 py-3 border-t border-border-line flex items-center gap-4 text-[11px] text-text-faint">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-bg-raise rounded border border-border-line font-mono">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-bg-raise rounded border border-border-line font-mono">↵</kbd> Open</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-bg-raise rounded border border-border-line font-mono">esc</kbd> Close</span>
          </div>
        )}
      </div>
    </div>
  );
}
