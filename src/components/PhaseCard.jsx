import { useState } from 'react';
import { Award, Lock, Play, Calendar, Filter } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { ResourceItem } from './ResourceItem';
import { QuizModal } from './QuizModal';
import { CircularProgress } from './CircularProgress';
import { getCalendarUrl } from '../utils/calendar';

function getItemDifficulty(item) {
  let difficulty = 'Beginner';
  if (item.length === 5) {
    difficulty = item[2];
  } else if (item.length === 6) {
    difficulty = item[3];
  } else if (item.length === 7) {
    difficulty = item[4];
  }
  return difficulty;
}

const PHASE_BG_COLORS = {
  'phase-teal': 'var(--teal)',
  'phase-amber': 'var(--amber)',
  'phase-violet': 'var(--violet)',
  'phase-brick': 'var(--brick)',
  'phase-rose': 'var(--rose)',
  'phase-gold': 'var(--gold)',
};

const CATEGORY_LABELS = {
  courses: '📚 Courses',
  books: '📖 Books',
  videos: '🎬 Videos',
  websites: '🌐 Websites',
  projects: '🔨 Projects',
  certs: '🏆 Certifications',
};

export function PhaseCard({ phase }) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const { progress, getPhaseProgress } = useProgress();

  const resourceCategories = [
    { key: 'courses', label: 'Courses', items: phase.courses || [] },
    { key: 'books', label: 'Books', items: phase.books || [] },
    { key: 'videos', label: 'Videos', items: phase.videos || [] },
    { key: 'websites', label: 'Websites', items: phase.websites || [] },
    { key: 'projects', label: 'Projects', items: phase.projects || [] },
    { key: 'certs', label: 'Certifications', items: phase.certs || [] },
  ].filter(category => category.items.length > 0);

  const filteredCategories = filterType === 'all'
    ? resourceCategories
    : resourceCategories.filter(c => c.key === filterType);

  const totalItems = resourceCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  const progressPercent = getPhaseProgress(phase.key);
  const completedItems = Math.round((progressPercent / 100) * totalItems);
  const allCompleted = (progressPercent === 100) && (totalItems > 0);
  const quizPassed = progress[phase.key]?.quizPassed;
  const phaseColor = PHASE_BG_COLORS[phase.color] || 'var(--violet)';

  return (
    <>
      <div className="bg-surface rounded-2xl overflow-hidden border border-border-line animate-slide-up">
        {/* Header section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-line">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-mono font-bold bg-bg-raise text-text-dim uppercase tracking-wider">
                {phase.months}
              </span>
              <div
                className="h-2.5 w-2.5 rounded-full shadow-sm"
                style={{ backgroundColor: phaseColor }}
              />
            </div>
            <h2 className="text-3xl font-display font-bold text-text-main flex items-center gap-3">
              {phase.title}
              {quizPassed && <Award className="text-phase-gold animate-float" size={28} title="Phase Mastered" />}
            </h2>
            <p className="mt-4 text-lg text-text-dim leading-relaxed">{phase.focus}</p>
          </div>

          {/* Progress Ring */}
          <div className="flex-shrink-0">
            <CircularProgress
              percent={progressPercent}
              size={80}
              strokeWidth={6}
              color={phaseColor}
              label={`${completedItems}/${totalItems}`}
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 md:px-8 pt-4 flex flex-wrap gap-2 items-center">
          <Filter size={14} className="text-text-faint" />
          <button
            onClick={() => setFilterType('all')}
            className={`text-xs px-3 py-1 rounded-lg border transition-all ${
              filterType === 'all'
                ? 'bg-phase-violet/15 text-phase-violet border-phase-violet/30 font-bold'
                : 'text-text-faint border-border-line hover:text-text-dim'
            }`}
          >
            All
          </button>
          {resourceCategories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setFilterType(cat.key)}
              className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                filterType === cat.key
                  ? 'bg-phase-violet/15 text-phase-violet border-phase-violet/30 font-bold'
                  : 'text-text-faint border-border-line hover:text-text-dim'
              }`}
            >
              {CATEGORY_LABELS[cat.key] || cat.label} ({cat.items.length})
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-10">
          {filteredCategories.map((category, catIdx) => (
            <div key={category.key} className="animate-fade-in" style={{ animationDelay: `${catIdx * 0.05}s` }}>
              <h3 className="text-xs font-mono font-bold uppercase tracking-[0.09em] text-text-faint mb-4 flex items-center gap-3">
                {CATEGORY_LABELS[category.key] || category.label}
                <div className="h-px bg-border-line flex-1"></div>
                <span className="text-[10px] font-normal">
                  {(progress[phase.key]?.[category.key] || []).filter(idx => idx < category.items.length).length}/{category.items.length}
                </span>
              </h3>
              <div className="space-y-1 bg-bg-raise rounded-xl border border-border-line overflow-hidden p-1">
                {(() => {
                  const mappedItems = category.items.map((item, idx) => ({ item, originalIndex: idx }));
                  const sortedItems = [...mappedItems].sort((a, b) => {
                    const diffA = getItemDifficulty(a.item);
                    const diffB = getItemDifficulty(b.item);
                    const map = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
                    return (map[diffA] || 1) - (map[diffB] || 1);
                  });

                  return sortedItems.map(({ item, originalIndex }) => (
                    <ResourceItem
                      key={originalIndex}
                      item={item}
                      type={category.key}
                      category={category.key}
                      phaseKey={phase.key}
                      index={originalIndex}
                    />
                  ));
                })()}
              </div>
            </div>
          ))}

          {/* Quiz Section */}
          <div className="mt-10 pt-8 border-t border-border-line flex flex-col items-center text-center">
            {quizPassed ? (
              <div className="bg-phase-gold/10 text-phase-gold p-8 rounded-2xl w-full flex flex-col items-center gap-3 border border-phase-gold/30 animate-bounce-in">
                <Award size={48} className="text-phase-gold mb-2 animate-float" />
                <h4 className="text-xl font-display font-bold">Phase Mastered 🎉</h4>
                <p className="text-sm">You have completed all items and passed the final quiz!</p>
              </div>
            ) : allCompleted ? (
              <div className="bg-phase-teal/10 text-phase-teal p-8 rounded-2xl w-full flex flex-col items-center gap-4 border border-phase-teal/30 animate-scale-in">
                <h4 className="text-xl font-display font-bold">Ready for the Test!</h4>
                <p className="text-sm">You've completed all {totalItems} items. Prove your knowledge to earn the mastery badge.</p>
                <button
                  onClick={() => setIsQuizOpen(true)}
                  className="flex items-center gap-2 bg-phase-teal hover:bg-phase-teal/80 text-white px-6 py-3 rounded-xl font-bold font-mono text-sm transition-colors shadow-lg"
                >
                  <Play size={18} />
                  Take Phase Quiz
                </button>
              </div>
            ) : (
              <div className="bg-bg-raise text-text-dim p-8 rounded-2xl w-full flex flex-col items-center gap-4 border border-border-line">
                <Lock size={32} className="opacity-50 text-text-faint" />
                <h4 className="text-lg font-display font-bold">Quiz Locked</h4>
                <p className="text-sm">Complete all {totalItems} items to unlock the phase quiz.</p>
                <CircularProgress
                  percent={progressPercent}
                  size={64}
                  strokeWidth={5}
                  color={phaseColor}
                  label={`${completedItems} / ${totalItems}`}
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center border-t border-border-line pt-6">
            <a
              href={getCalendarUrl(`Study: ${phase.title}`, `Work on items for ${phase.title} in the Data Scientist Path.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-text-dim hover:text-phase-amber transition-colors font-medium"
            >
              <Calendar size={16} />
              Schedule Study Block
            </a>
          </div>
        </div>
      </div>

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        phaseKey={phase.key}
        phaseTitle={phase.title}
      />
    </>
  );
}
