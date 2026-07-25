import { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, Heart, Shield, Award, Zap } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

const COACH_QUOTES = [
  "Get back to work! Clean code doesn't write itself! 🏋️‍♂️",
  "No excuses, review that next math question now!",
  "Your streak is looking clean, but we can easily double it!",
  "A true Data Scientist solves complexity for breakfast! Let's go!",
  "Stop scrolling and start compiling. Focus time!"
];

const MENTOR_QUOTES = [
  "You are doing wonderful, take it one step at a time! ☕️",
  "Need a quick break? Your brain has worked so hard today!",
  "Wow! Look at that progress. I'm incredibly proud of you!",
  "It's okay to get errors, that's just learning in disguise!",
  "Take a deep breath. We will solve this capstone together."
];

const ACADEMIC_QUOTES = [
  "Let us evaluate the asymptotic bounds of your current module. 🎓",
  "Recall that Mercer's theorem guarantees our kernel convergence.",
  "Fascinating. Your daily study patterns resemble a Poisson process!",
  "Is the loss curve decaying exponentially or sub-linearly?",
  "Let's consult the literature before scaling our parameters."
];

export function MascotWidget() {
  const { progress, buyStreakFreeze } = useProgress();
  const [bubbleText, setBubbleText] = useState("Hello! Ready to study today?");
  const [mood, setMood] = useState("happy"); // happy, thinking, proud, sleeping

  const xp = progress._xp || 0;
  const level = progress._level || 1;
  const freezes = progress._streakFreezes || 0;
  const streak = progress.streakCount || 0;
  const tutor = progress._aiTutorPersonality || 'mentor';

  useEffect(() => {
    // Determine initial bubble text based on tutor personality
    const quotes = tutor === 'coach' ? COACH_QUOTES : tutor === 'academic' ? ACADEMIC_QUOTES : MENTOR_QUOTES;
    setBubbleText(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [tutor, streak]);

  const interact = () => {
    setMood("thinking");
    const quotes = tutor === 'coach' ? COACH_QUOTES : tutor === 'academic' ? ACADEMIC_QUOTES : MENTOR_QUOTES;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    setTimeout(() => {
      setBubbleText(randomQuote);
      setMood(Math.random() > 0.5 ? "proud" : "happy");
    }, 600);
  };

  return (
    <div className="glass rounded-2xl p-5 border border-border-line text-text-main space-y-4 animate-slide-up relative">
      
      {/* Level / XP display */}
      <div className="flex justify-between items-center text-xs font-mono border-b border-border-line pb-3">
        <span className="flex items-center gap-1 font-bold text-phase-violet">
          <Award size={14} /> LVL {level}
        </span>
        <span className="text-text-faint font-medium">XP: {xp} / {level * 100}</span>
      </div>

      {/* XP Progress Bar */}
      <div className="h-2 bg-bg-raise rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-phase-violet to-phase-rose rounded-full transition-all duration-500"
          style={{ width: `${(xp / (level * 100)) * 100}%` }}
        />
      </div>

      {/* Mascot Graphic & Bubble */}
      <div className="flex items-start gap-4">
        
        {/* Animated Robot SVG */}
        <button 
          onClick={interact}
          className="flex-shrink-0 cursor-pointer focus:outline-none hover:scale-105 transition-transform"
          title="Click to interact"
        >
          <svg width="60" height="60" viewBox="0 0 100 100" className="animate-float">
            {/* Body / CRT Outer */}
            <rect x="10" y="20" width="80" height="70" rx="15" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="3" />
            <rect x="18" y="28" width="64" height="46" rx="8" fill="var(--bg-main)" stroke="var(--border-line)" strokeWidth="2" />
            
            {/* Neck & Feet */}
            <rect x="42" y="90" width="16" height="6" fill="var(--border-strong)" />
            
            {/* Antennas */}
            <line x1="50" y1="20" x2="50" y2="8" stroke="var(--border-strong)" strokeWidth="3" />
            <circle cx="50" cy="8" r="4" fill="var(--phase-violet)" />

            {/* Face details based on Mood */}
            {mood === 'thinking' && (
              <>
                <ellipse cx="36" cy="48" rx="5" ry="2" fill="var(--phase-violet)" />
                <ellipse cx="64" cy="48" rx="5" ry="2" fill="var(--phase-violet)" />
                <path d="M 45 62 Q 50 56 55 62" stroke="var(--phase-violet)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </>
            )}
            {mood === 'proud' && (
              <>
                <path d="M 28 46 L 40 44" stroke="var(--phase-violet)" strokeWidth="3" strokeLinecap="round" />
                <path d="M 60 44 L 72 46" stroke="var(--phase-violet)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="34" cy="52" r="4" fill="var(--phase-violet)" />
                <circle cx="66" cy="52" r="4" fill="var(--phase-violet)" />
                <path d="M 42 60 Q 50 68 58 60" stroke="var(--phase-violet)" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            )}
            {mood === 'happy' && (
              <>
                <circle cx="34" cy="48" r="5" fill="var(--phase-violet)" />
                <circle cx="66" cy="48" r="5" fill="var(--phase-violet)" />
                <path d="M 40 60 Q 50 68 60 60" stroke="var(--phase-violet)" strokeWidth="3" fill="none" strokeLinecap="round" />
              </>
            )}
            
            {/* Blushing cheeks */}
            <circle cx="26" cy="54" r="3" fill="var(--phase-rose)" opacity="0.4" />
            <circle cx="74" cy="54" r="3" fill="var(--phase-rose)" opacity="0.4" />
          </svg>
        </button>

        {/* Speech Bubble */}
        <div className="flex-1 bg-bg-raise border border-border-line rounded-xl p-3 text-xs relative leading-relaxed shadow-sm">
          <p className="font-medium text-text-main">{bubbleText}</p>
          {/* Arrow */}
          <div className="absolute top-4 -left-2 w-0 h-0 border-t-4 border-t-transparent border-r-8 border-r-border-line border-b-4 border-b-transparent" />
          <div className="absolute top-4 -left-1.5 w-0 h-0 border-t-4 border-t-transparent border-r-8 border-r-bg-raise border-b-4 border-b-transparent" />
        </div>

      </div>

      {/* Streak Freeze purchases */}
      <div className="flex justify-between items-center pt-3 border-t border-border-line text-xs font-mono">
        <span className="text-text-dim flex items-center gap-1">
          ❄️ Freezes: <span className="font-bold text-text-main">{freezes}</span>
        </span>
        <button
          onClick={buyStreakFreeze}
          className="text-[10px] font-bold text-phase-violet hover:underline flex items-center gap-1 cursor-pointer"
          title="Buy streak freeze for 200 XP"
        >
          Buy Freeze (-200 XP)
        </button>
      </div>

    </div>
  );
}
