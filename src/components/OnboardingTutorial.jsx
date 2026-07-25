import { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Clock, BrainCircuit, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    icon: BookOpen,
    color: 'phase-amber',
    title: 'Your Roadmap',
    description: 'Follow a structured path from Python basics to production ML. Track every course, book, and project.',
    action: { label: 'View Roadmap', to: '/' },
  },
  {
    icon: Clock,
    color: 'phase-teal',
    title: 'Focus Forest',
    description: 'Stay focused with our Forest-style timer. Grow trees while you study — if you leave, the tree dies!',
    action: { label: 'Try Timer', to: '/focus' },
  },
  {
    icon: BrainCircuit,
    color: 'phase-violet',
    title: 'Flashcards & Quizzes',
    description: '500+ terms and tough quizzes for each phase. Master the vocabulary and prove your knowledge.',
    action: { label: 'Start Learning', to: '/flashcards' },
  },
];

const COLOR_CLASSES = {
  'phase-amber': {
    bg: 'bg-phase-amber',
    bgLight: 'bg-phase-amber/15',
    text: 'text-phase-amber',
    border: 'border-phase-amber/30',
    dotActive: 'w-8 bg-phase-amber',
    dotPassed: 'w-4 bg-phase-amber/40'
  },
  'phase-teal': {
    bg: 'bg-phase-teal',
    bgLight: 'bg-phase-teal/15',
    text: 'text-phase-teal',
    border: 'border-phase-teal/30',
    dotActive: 'w-8 bg-phase-teal',
    dotPassed: 'w-4 bg-phase-teal/40'
  },
  'phase-violet': {
    bg: 'bg-phase-violet',
    bgLight: 'bg-phase-violet/15',
    text: 'text-phase-violet',
    border: 'border-phase-violet/30',
    dotActive: 'w-8 bg-phase-violet',
    dotPassed: 'w-4 bg-phase-violet/40'
  }
};

export function OnboardingTutorial({ onComplete }) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding-completed', 'true');
    setIsVisible(false);
    setTimeout(() => onComplete?.(), 300);
  };

  const current = STEPS[step];
  const Icon = current.icon;
  const colors = COLOR_CLASSES[current.color] || COLOR_CLASSES['phase-amber'];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface rounded-2xl p-8 md:p-10 max-w-lg w-full border border-border-line shadow-2xl animate-scale-in relative overflow-hidden">
        {/* Skip button */}
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 text-text-faint hover:text-text-main transition-colors p-1"
          aria-label="Skip tutorial"
        >
          <X size={20} />
        </button>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((stepItem, i) => {
            const stepColors = COLOR_CLASSES[stepItem.color] || COLOR_CLASSES['phase-amber'];
            return (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? stepColors.dotActive : i < step ? stepColors.dotPassed : 'w-4 bg-bg-raise'
                }`}
              />
            );
          })}
        </div>

        {/* Icon */}
        <div className={`w-20 h-20 rounded-2xl ${colors.bgLight} flex items-center justify-center mx-auto mb-6 animate-bounce-in`} key={step}>
          <Icon size={40} className={colors.text} />
        </div>

        {/* Content */}
        <div className="text-center mb-8 animate-fade-in" key={`content-${step}`}>
          <h2 className="text-2xl font-display font-bold text-text-main mb-3">{current.title}</h2>
          <p className="text-text-dim leading-relaxed">{current.description}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-text-faint font-mono">
            {step + 1} of {STEPS.length}
          </span>
          <div className="flex gap-3">
            <Link
              to={current.action.to}
              onClick={handleComplete}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-border-line text-text-dim hover:text-text-main hover:bg-surface transition-colors"
            >
              {current.action.label}
            </Link>
            <button
              onClick={handleNext}
              className={`px-6 py-2 rounded-xl text-sm font-bold ${colors.bg} text-white hover:opacity-80 transition-all flex items-center gap-2 cursor-pointer`}
            >
              {step < STEPS.length - 1 ? 'Next' : 'Get Started'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Warmup & Revive Suggestion (shows if inactive > 7 or 15 days) ─── */
export function WarmupSuggestion({ onDismiss, onStartReviveQuiz, daysInactive = 0 }) {
  const isRevive = daysInactive >= 15;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface rounded-2xl p-8 max-w-md w-full border border-border-line shadow-2xl animate-scale-in text-center relative">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-text-faint hover:text-text-main p-1"
          aria-label="Dismiss"
        >
          <X size={20} />
        </button>

        {isRevive ? (
          <>
            <div className="text-5xl mb-4">⚡️</div>
            <h2 className="text-2xl font-display font-bold text-text-main mb-2">Revive Your Knowledge!</h2>
            <p className="text-text-dim mb-6 leading-relaxed">
              It's been <span className="font-bold text-phase-amber">{daysInactive} days</span> since your last session. Let's run a quick 10-question refresher quiz to revive your memory!
            </p>

            <div className="space-y-3">
              <button
                onClick={onStartReviveQuiz}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-phase-amber hover:bg-phase-amber/90 text-white font-bold transition-all shadow-md cursor-pointer"
              >
                <Sparkles size={18} />
                Start Revive Quiz
              </button>
              <button
                onClick={onDismiss}
                className="text-sm text-text-faint hover:text-text-dim transition-colors mt-2"
              >
                Skip quiz and continue
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">👋</div>
            <h2 className="text-2xl font-display font-bold text-text-main mb-2">Welcome Back!</h2>
            <p className="text-text-dim mb-6">
              It's been a week! How about a quick warm-up to get back into the groove?
            </p>

            <div className="space-y-3">
              <Link
                to="/flashcards"
                onClick={onDismiss}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-phase-violet/10 text-phase-violet font-semibold hover:bg-phase-violet/20 transition-colors"
              >
                <BrainCircuit size={18} />
                Quick Flashcard Review
              </Link>
              <Link
                to="/focus"
                onClick={onDismiss}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-phase-teal/10 text-phase-teal font-semibold hover:bg-phase-teal/20 transition-colors"
              >
                <Clock size={18} />
                15-min Focus Session
              </Link>
              <button
                onClick={onDismiss}
                className="text-sm text-text-faint hover:text-text-dim transition-colors"
              >
                Skip for now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
