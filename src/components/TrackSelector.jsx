import { useState } from 'react';
import { Target, CheckCircle2, ChevronRight } from 'lucide-react';

export const TRACKS = [
  { id: 'ds', name: 'Data Scientist', desc: 'Full-stack curriculum covering stats, ML, deep learning, and deployment.', phases: ['phase1', 'phase2', 'phase3', 'phase4', 'phase5'] },
  { id: 'da', name: 'Data Analyst', desc: 'Focuses on foundations, SQL, visualization, and exploratory analysis.', phases: ['phase1', 'phase2'] },
  { id: 'mle', name: 'ML Engineer', desc: 'Focuses on modeling, software engineering, and basic deployment.', phases: ['phase1', 'phase2', 'phase3', 'phase4'] },
  { id: 'aie', name: 'AI Engineer', desc: 'Deep focus on deep learning, NLP, computer vision, and LLMs.', phases: ['phase1', 'phase3', 'phase4'] },
  { id: 'de', name: 'Data Engineer', desc: 'Focuses on databases, ETL pipelines, and system architectures.', phases: ['phase1', 'phase4', 'phase5'] },
  { id: 'nlp', name: 'NLP Specialist', desc: 'Text analytics, embeddings, transformer models, and sequence learning.', phases: ['phase1', 'phase3'] },
  { id: 'cv', name: 'CV Engineer', desc: 'Image processing, CNNs, object detection, and generative vision models.', phases: ['phase1', 'phase3'] },
  { id: 'mlops', name: 'MLOps Engineer', desc: 'Focuses on model monitoring, CI/CD pipelines, and cloud scaling.', phases: ['phase1', 'phase4'] },
  { id: 'rs', name: 'Research Scientist', desc: 'Deep academic statistical foundations and advanced modeling theory.', phases: ['phase1', 'phase2', 'phase3'] },
  { id: 'bi', name: 'BI Analyst', desc: 'Business metrics, dashboarding, KPI analysis, and database queries.', phases: ['phase1'] },
];

export function TrackSelector({ currentTrack, onSelect, onNext }) {
  const [selected, setSelected] = useState(currentTrack || 'ds');

  const handleSelect = (id) => {
    setSelected(id);
    onSelect?.(id);
  };

  return (
    <div className="space-y-6 animate-scale-in">
      <div className="text-center space-y-1">
        <h3 className="text-2xl font-bold font-display text-text-main">Choose Your Specialization</h3>
        <p className="text-sm text-text-dim">Select one of our 10 tailored learning tracks to focus your roadmap.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto custom-scrollbar p-1">
        {TRACKS.map(t => {
          const active = selected === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className={`text-left p-4 rounded-xl border transition-all flex justify-between items-start gap-3 cursor-pointer ${
                active
                  ? 'bg-phase-violet/10 border-phase-violet/40 shadow-md scale-[1.01]'
                  : 'bg-surface border-border-line hover:bg-bg-raise hover:border-border-strong'
              }`}
            >
              <div className="space-y-1">
                <div className="font-bold text-sm text-text-main flex items-center gap-1.5">
                  <Target size={14} className={active ? 'text-phase-violet' : 'text-text-faint'} />
                  {t.name}
                </div>
                <p className="text-xs text-text-dim leading-relaxed">{t.desc}</p>
                <div className="text-[10px] text-text-faint font-mono mt-1">
                  Active: {t.phases.length} phases
                </div>
              </div>
              {active && <CheckCircle2 size={16} className="text-phase-violet flex-shrink-0 mt-0.5" />}
            </button>
          );
        })}
      </div>

      {onNext && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onNext}
            className="flex items-center gap-2 bg-phase-violet hover:bg-phase-violet/85 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg cursor-pointer"
          >
            Continue
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
