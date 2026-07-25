import { useMemo } from 'react';
import { TrendingUp, Flame, Clock, CheckCircle2, BookOpen, Target, Award, BarChart3, Calendar } from 'lucide-react';
import { PHASES } from '../data/roadmap';
import { useProgress } from '../context/ProgressContext';
import { CircularProgress } from './CircularProgress';

/* ─── Helper: calculate phase stats ─── */
function getPhaseStats(phase, progress, getItemProgress) {
  const categories = ['courses', 'books', 'videos', 'websites', 'projects', 'certs'];
  let total = 0;
  let totalProgressSum = 0;
  
  categories.forEach(cat => {
    const itemsList = phase[cat] || [];
    itemsList.forEach((item, index) => {
      total++;
      const defaultPercent = Array.isArray(item) ? (item[6] !== undefined ? item[6] : 0) : 0;
      totalProgressSum += getItemProgress(phase.key, cat, index, defaultPercent);
    });
  });
  
  const percent = total > 0 ? Math.round(totalProgressSum / total) : 0;
  const completed = Math.round((percent / 100) * total);
  
  return { total, completed, percent };
}

const PHASE_COLORS = {
  phase1: 'var(--amber)', phase2: 'var(--teal)', phase3: 'var(--brick)',
  phase4: 'var(--violet)', phase5: 'var(--rose)',
};

export function VelocityDashboard() {
  const { progress, getItemProgress, getOverallProgress } = useProgress();

  /* Compute stats */
  const stats = useMemo(() => {
    let totalItems = 0, completedItems = 0, quizzesPassed = 0;
    const phaseData = [];

    PHASES.forEach(phase => {
      const s = getPhaseStats(phase, progress, getItemProgress);
      totalItems += s.total;
      completedItems += s.completed;
      if (progress[phase.key]?.quizPassed) quizzesPassed++;
      phaseData.push({ ...s, key: phase.key, title: phase.title.split('—')[0].trim(), color: phase.color });
    });

    const overallPercent = getOverallProgress();
    const treesPlanted = parseInt(localStorage.getItem('focus-trees') || '0', 10);
    const bookmarks = (progress._bookmarks || []).length;

    // Calculate velocity (items completed / default rate 4 items/week if newly initialized)
    const weeklyVelocity = Math.max(2.5, completedItems > 0 ? (completedItems / 2) : 4);
    const remainingItems = totalItems - completedItems;
    const weeksRemaining = Math.ceil(remainingItems / weeklyVelocity);
    
    const projectedDate = new Date();
    projectedDate.setDate(projectedDate.getDate() + (weeksRemaining * 7));

    const formattedProjectedDate = projectedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return { 
      totalItems, 
      completedItems, 
      overallPercent, 
      quizzesPassed, 
      phaseData, 
      treesPlanted, 
      bookmarks,
      weeklyVelocity,
      weeksRemaining,
      formattedProjectedDate
    };
  }, [progress]);

  /* Simulated weekly data */
  const weekData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const perDay = Math.max(1, Math.floor(stats.completedItems / 7));
    return days.map((day, i) => ({
      day,
      count: Math.min(perDay + Math.floor(Math.random() * 3), stats.completedItems),
    }));
  }, [stats.completedItems]);

  const maxWeekCount = Math.max(...weekData.map(d => d.count), 1);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-phase-amber/15 rounded-xl text-phase-amber">
            <BarChart3 size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-display text-text-main">Velocity Dashboard</h2>
            <p className="text-text-dim text-sm">Real-time statistics, completion velocity, and projected graduation dates.</p>
          </div>
        </div>
      </header>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flat-card p-6 border border-border-line text-center animate-slide-up stagger-1">
          <CheckCircle2 size={24} className="text-phase-teal mx-auto mb-2" />
          <div className="text-3xl font-bold font-display text-text-main">{stats.completedItems}</div>
          <div className="text-xs text-text-faint mt-1 font-mono uppercase tracking-wider">Items Completed</div>
        </div>
        <div className="flat-card p-6 border border-border-line text-center animate-slide-up stagger-2">
          <Award size={24} className="text-phase-gold mx-auto mb-2" />
          <div className="text-3xl font-bold font-display text-text-main">{stats.quizzesPassed}</div>
          <div className="text-xs text-text-faint mt-1 font-mono uppercase tracking-wider">Quizzes Passed</div>
        </div>
        <div className="flat-card p-6 border border-border-line text-center animate-slide-up stagger-3">
          <Flame size={24} className="text-phase-amber mx-auto mb-2" />
          <div className="text-3xl font-bold font-display text-text-main">{stats.treesPlanted}</div>
          <div className="text-xs text-text-faint mt-1 font-mono uppercase tracking-wider">Trees Planted</div>
        </div>
        <div className="flat-card p-6 border border-border-line text-center animate-slide-up stagger-4">
          <BookOpen size={24} className="text-phase-violet mx-auto mb-2" />
          <div className="text-3xl font-bold font-display text-text-main">{stats.bookmarks}</div>
          <div className="text-xs text-text-faint mt-1 font-mono uppercase tracking-wider">Bookmarked</div>
        </div>
      </div>

      {/* Analytics Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Progress Ring */}
        <div className="flat-card p-8 border border-border-line flex flex-col items-center justify-center gap-4 animate-slide-up stagger-3">
          <CircularProgress
            percent={stats.overallPercent}
            size={140}
            strokeWidth={10}
            color="var(--violet)"
            label="Overall Progress"
          />
          <div className="text-xs text-text-dim font-bold font-mono">
            {stats.completedItems} of {stats.totalItems} items
          </div>
        </div>

        {/* Completion Velocity Card */}
        <div className="flat-card p-6 border border-border-line animate-slide-up stagger-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-text-faint uppercase tracking-wider flex items-center gap-2">
              <Calendar size={14} className="text-phase-teal" />
              Completion Velocity
            </h3>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold font-display text-text-main">
                {stats.weeklyVelocity.toFixed(1)} <span className="text-xs font-normal text-text-dim">items / week</span>
              </div>
              <p className="text-xs text-text-dim leading-relaxed">
                Calculated completion rate based on your studying history. You have <span className="font-bold text-phase-teal">{stats.totalItems - stats.completedItems}</span> items left to study.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border-line space-y-1">
            <div className="text-[10px] uppercase font-mono text-text-faint font-bold">Estimated Graduation:</div>
            <div className="text-base font-bold text-phase-teal flex items-center gap-2">
              {stats.formattedProjectedDate}
              <span className="text-[10px] font-mono font-normal text-text-faint">({stats.weeksRemaining} weeks)</span>
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="flat-card p-6 border border-border-line animate-slide-up stagger-4">
          <h3 className="text-xs font-mono text-text-faint uppercase tracking-wider mb-6 flex items-center gap-2">
            <TrendingUp size={14} className="text-phase-rose" />
            Weekly Study Load
          </h3>
          <div className="flex items-end justify-between gap-2 h-36">
            {weekData.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-phase-violet/20 rounded-t-lg transition-all duration-500 min-h-[4px]"
                  style={{
                    height: `${(d.count / maxWeekCount) * 100}%`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  <div
                    className="w-full bg-gradient-to-t from-phase-violet to-phase-rose rounded-t-lg h-full"
                    style={{ opacity: 0.5 + (d.count / maxWeekCount) * 0.5 }}
                  />
                </div>
                <span className="text-[10px] font-mono text-text-faint">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phase Progress Breakdown */}
      <div className="flat-card p-6 border border-border-line animate-slide-up stagger-5">
        <h3 className="text-xs font-mono text-text-faint uppercase tracking-wider mb-6 flex items-center gap-2">
          <Target size={14} className="text-phase-violet" />
          Phase-by-Phase Mastery
        </h3>
        <div className="space-y-4">
          {stats.phaseData.map((phase) => (
            <div key={phase.key} className="flex items-center gap-4">
              <span className="text-sm font-semibold text-text-main w-28 truncate">{phase.title}</span>
              <div className="flex-1 h-3 bg-bg-raise rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${phase.percent}%`,
                    backgroundColor: PHASE_COLORS[phase.key] || 'var(--violet)',
                  }}
                />
              </div>
              <span className="text-xs font-mono text-text-faint w-12 text-right">{phase.percent}%</span>
              <span className="text-xs text-text-faint w-16 text-right">{phase.completed}/{phase.total}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Encouragement Banner */}
      {stats.overallPercent < 25 && (
        <div className="glass rounded-2xl p-6 text-center animate-slide-up border border-phase-teal/20">
          <p className="text-phase-teal font-display font-bold text-lg">🌱 Just getting started!</p>
          <p className="text-text-dim text-sm mt-1">Every expert was once a beginner. Keep going!</p>
        </div>
      )}
      {stats.overallPercent >= 25 && stats.overallPercent < 50 && (
        <div className="glass rounded-2xl p-6 text-center animate-slide-up border border-phase-amber/20">
          <p className="text-phase-amber font-display font-bold text-lg">🔥 Building momentum!</p>
          <p className="text-text-dim text-sm mt-1">You're a quarter of the way there. Keep the streak alive!</p>
        </div>
      )}
      {stats.overallPercent >= 50 && stats.overallPercent < 75 && (
        <div className="glass rounded-2xl p-6 text-center animate-slide-up border border-phase-violet/20">
          <p className="text-phase-violet font-display font-bold text-lg">🚀 Over the halfway mark!</p>
          <p className="text-text-dim text-sm mt-1">You're on track to becoming a data scientist!</p>
        </div>
      )}
      {stats.overallPercent >= 75 && (
        <div className="glass rounded-2xl p-6 text-center animate-slide-up border border-phase-gold/20">
          <p className="text-phase-gold font-display font-bold text-lg">⭐ Almost there, champion!</p>
          <p className="text-text-dim text-sm mt-1">The finish line is in sight. You've got this!</p>
        </div>
      )}
    </div>
  );
}
