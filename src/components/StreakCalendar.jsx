import { useState, useEffect } from 'react';
import { Flame, Check } from 'lucide-react';

export function StreakCalendar() {
  const [streak, setStreak] = useState(0);
  
  // Streak = number of days in a row you opened the app (stored in this browser).
  useEffect(() => {
    const lastLogin = localStorage.getItem('dsp_last_login');
    const currentStreak = parseInt(localStorage.getItem('dsp_streak') || '0', 10);
    const today = new Date().toDateString();
    
    if (lastLogin !== today) {
      if (lastLogin === new Date(Date.now() - 86400000).toDateString()) {
        // Logged in yesterday, increment streak
        localStorage.setItem('dsp_streak', (currentStreak + 1).toString());
        setStreak(currentStreak + 1);
      } else {
        // Broke streak
        localStorage.setItem('dsp_streak', '1');
        setStreak(1);
      }
      localStorage.setItem('dsp_last_login', today);
    } else {
      setStreak(currentStreak || 1);
    }
  }, []);

  // Generate the last 7 days (ending with today)
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const getDayLabel = (date) => {
    const daysStr = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
    return daysStr[date.getDay()];
  };

  return (
    <div className="bg-surface border border-border-line rounded-2xl p-6 mb-8 flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center justify-center gap-3">
          <Flame size={40} className="text-phase-amber drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" fill="currentColor" />
          <h3 className="text-4xl font-display font-bold text-text-main">{streak}</h3>
        </div>
        <p className="text-base font-bold text-text-dim">Day Streak</p>
      </div>
      
      <div className="flex items-center justify-between w-full max-w-sm px-4">
        {days.map((day, i) => {
          // Determine if the day is part of the streak
          const isActive = (6 - i) < streak;
          const isToday = i === 6;
          
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className={`text-xs font-bold ${isToday ? 'text-phase-amber' : 'text-text-faint'}`}>
                {getDayLabel(day)}
              </span>
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-phase-amber text-white ring-4 ring-phase-amber/20 shadow-lg shadow-phase-amber/30' 
                    : 'bg-bg-raise text-text-faint'
                }`}
                title={day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              >
                {isActive ? <Check size={20} strokeWidth={3} /> : <span className="text-sm font-bold opacity-50">{day.getDate()}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
