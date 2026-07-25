import { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { PHASES } from '../data/roadmap';
import { CheckCircle2, Circle, Clock, Award, Star, Flame, ChevronRight, Check } from 'lucide-react';

export function ProjectProgressTracker() {
  const { progress, toggleItem } = useProgress();
  const [activeTab, setActiveTab] = useState('phase1');

  // Find active phase details
  const activePhase = PHASES.find(p => p.key === activeTab) || PHASES[0];

  // Helper to calculate total items and completed items in a phase
  const getPhaseStats = (phase) => {
    let completed = 0;
    let total = 0;

    // Categories to track
    const categories = ['courses', 'books', 'videos', 'websites', 'projects', 'certs'];
    
    categories.forEach(catKey => {
      if (phase[catKey]) {
        total += phase[catKey].length;
        if (progress[phase.key] && progress[phase.key][catKey]) {
          // Only count items within valid range
          const validChecked = progress[phase.key][catKey].filter(idx => idx < phase[catKey].length);
          completed += validChecked.length;
        }
      }
    });

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percent };
  };

  // Helper to check if a specific item is completed
  const isItemCompleted = (phaseKey, category, index) => {
    return progress[phaseKey]?.[category]?.includes(index) || false;
  };

  // Phase color styling helper
  const getPhaseColorClass = (color) => {
    const mappings = {
      'phase-teal': { text: 'text-phase-teal', bg: 'bg-phase-teal/10', border: 'border-phase-teal/20', accent: 'bg-phase-teal' },
      'phase-amber': { text: 'text-phase-amber', bg: 'bg-phase-amber/10', border: 'border-phase-amber/20', accent: 'bg-phase-amber' },
      'phase-violet': { text: 'text-phase-violet', bg: 'bg-phase-violet/10', border: 'border-phase-violet/20', accent: 'bg-phase-violet' },
      'phase-brick': { text: 'text-phase-brick', bg: 'bg-phase-brick/10', border: 'border-phase-brick/20', accent: 'bg-phase-brick' },
      'phase-rose': { text: 'text-phase-rose', bg: 'bg-phase-rose/10', border: 'border-phase-rose/20', accent: 'bg-phase-rose' },
    };
    return mappings[color] || mappings['phase-violet'];
  };

  // Difficulty badge coloring helper
  const getDifficultyColor = (diff) => {
    const d = String(diff).toLowerCase();
    if (d.includes('begin')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (d.includes('inter')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
  };

  return (
    <div className="flat-card p-6 md:p-8 border border-border-line space-y-8 animate-fade-in">
      
      {/* Title block */}
      <div className="space-y-1">
        <h3 className="text-xl font-bold font-display text-text-main flex items-center gap-2">
          <Award className="text-phase-violet" /> Curriculum Progress & Projects Hub
        </h3>
        <p className="text-xs text-text-dim">
          Track course completions and guided projects across all 5 structured roadmap phases
        </p>
      </div>

      {/* Phase overall progress tracker grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {PHASES.map((phase) => {
          const stats = getPhaseStats(phase);
          const colors = getPhaseColorClass(phase.color);
          const isActive = phase.key === activeTab;

          return (
            <button
              key={phase.key}
              onClick={() => setActiveTab(phase.key)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all duration-300 ${
                isActive 
                  ? `bg-surface border-border-strong ring-2 ring-offset-2 ring-offset-bg-main ring-phase-violet shadow-md` 
                  : 'bg-bg-raise border-border-line hover:border-border-strong opacity-85 hover:opacity-100'
              }`}
            >
              <div className="space-y-1">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${colors.text}`}>
                  {phase.months}
                </span>
                <h4 className="text-xs font-bold text-text-main line-clamp-1">
                  {phase.title.replace(/Phase \d — /, '')}
                </h4>
              </div>

              <div className="space-y-1.5 w-full">
                <div className="flex justify-between items-center text-[10px] font-mono text-text-faint">
                  <span>{stats.completed}/{stats.total} Done</span>
                  <span className="font-bold text-text-main">{stats.percent}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-bg-main overflow-hidden border border-border-line">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${colors.accent}`}
                    style={{ width: `${stats.percent}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-border-line my-6" />

      {/* Project selection header details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-8 rounded-full ${getPhaseColorClass(activePhase.color).accent}`} />
          <div>
            <h4 className="text-sm font-bold text-text-main font-display">
              {activePhase.title} Projects
            </h4>
            <p className="text-xs text-text-faint">
              Check off Capstone and Guided projects for hands-on portfolio experience
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Projects for the active phase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activePhase.projects && activePhase.projects.length > 0 ? (
          activePhase.projects.map((project, idx) => {
            const isCompleted = isItemCompleted(activePhase.key, 'projects', idx);
            const title = project[0];
            const desc = project[1];
            const difficulty = project[2] || 'Intermediate';
            const duration = project[3] || '5h';
            const xpReward = project[4] || 10;
            const colors = getPhaseColorClass(activePhase.color);

            return (
              <div
                key={idx}
                onClick={() => toggleItem(activePhase.key, 'projects', idx)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-4 select-none ${
                  isCompleted 
                    ? 'bg-phase-teal/5 border-phase-teal/30 shadow-sm'
                    : 'bg-surface border-border-line hover:border-border-strong hover:bg-surface-hover'
                }`}
              >
                {/* Custom animated checkbox */}
                <div className="mt-1 flex-shrink-0">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-md bg-phase-teal text-white flex items-center justify-center animate-scale-in">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-md border-2 border-border-strong flex items-center justify-center hover:border-phase-violet transition-colors">
                      <div className="w-2.5 h-2.5 rounded-sm bg-transparent" />
                    </div>
                  )}
                </div>

                {/* Project information */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="space-y-0.5">
                    <h5 className={`text-xs font-bold font-display truncate ${isCompleted ? 'text-text-main line-through opacity-70' : 'text-text-main'}`}>
                      {title}
                    </h5>
                    <p className={`text-[11px] leading-relaxed text-text-dim line-clamp-2 ${isCompleted ? 'opacity-60' : ''}`}>
                      {desc}
                    </p>
                  </div>

                  {/* Metadata tags */}
                  <div className="flex flex-wrap gap-2 pt-1 items-center">
                    <span className={`text-[9px] px-2 py-0.5 border rounded-full font-semibold ${getDifficultyColor(difficulty)}`}>
                      {difficulty}
                    </span>
                    <span className="text-[9px] font-mono text-text-faint flex items-center gap-0.5">
                      <Clock size={10} /> {duration}
                    </span>
                    <span className={`text-[9px] font-mono font-bold ${isCompleted ? 'text-phase-teal' : 'text-phase-violet'}`}>
                      +{xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="md:col-span-2 text-center py-8 text-xs text-text-faint border border-dashed border-border-line rounded-xl">
            No projects defined for this phase. Check other milestones!
          </div>
        )}
      </div>

    </div>
  );
}
