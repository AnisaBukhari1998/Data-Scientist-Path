import { useState } from 'react';
import { Trophy, Shield, Medal, Users, ArrowUpRight, Sparkles, Clock, Target } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';

const LEADERBOARD_PEERS = [
  { id: '1', name: "Aisha Diallo", level: 14, xp: 1340, mins: 420, courses: 18, active: true },
  { id: '2', name: "Hiroshi Tanaka", level: 12, xp: 1180, mins: 390, courses: 14, active: false },
  { id: '3', name: "Elena Rostova", level: 10, xp: 980, mins: 320, courses: 12, active: true },
  { id: '4', name: "Carlos Gomez", level: 9, xp: 850, mins: 280, courses: 10, active: false },
  { id: '5', name: "Sarah Jenkins", level: 7, xp: 620, mins: 190, courses: 8, active: true }
];

export function Leaderboard() {
  const { progress } = useProgress();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('xp'); // xp, time, courses

  const userLevel = progress._level || 1;
  const userXp = progress._xp || 0;
  const totalUserXp = (userLevel - 1) * 100 + userXp;
  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "Guest Student";

  // Build ranking items including the current user
  const userItem = {
    id: 'user',
    name: `${userName} (You)`,
    level: userLevel,
    xp: totalUserXp,
    mins: progress.totalFocusMins || 25, // Fallback if 0
    courses: 4, // Mock calculated count
    isUser: true,
    active: true
  };

  const allItems = [...LEADERBOARD_PEERS, userItem];

  // Sort items based on active tab
  const sortedItems = [...allItems].sort((a, b) => {
    if (activeTab === 'xp') return b.xp - a.xp;
    if (activeTab === 'time') return b.mins - a.mins;
    return b.courses - a.courses;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header Profile Summary */}
      <div className="bg-surface border border-border-line p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-phase-violet/15 flex items-center justify-center text-phase-violet font-display font-bold text-xl relative">
            LVL {userLevel}
            <Sparkles size={16} className="absolute -top-1 -right-1 text-phase-amber animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-text-main flex items-center gap-2">
              Weekly Rankings
            </h2>
            <p className="text-sm text-text-dim mt-0.5">Compete and keep each other motivated on the leaderboard.</p>
          </div>
        </div>

        <div className="flex gap-3 text-xs font-mono w-full md:w-auto">
          <div className="bg-bg-raise border border-border-line px-4 py-3 rounded-xl flex-1 text-center md:flex-none">
            Your Ranking Score: <span className="text-phase-violet font-bold font-mono">{totalUserXp} XP</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 border-b border-border-line pb-px">
        {[
          { id: 'xp', label: 'By Total XP', icon: Sparkles },
          { id: 'time', label: 'By Focus Time', icon: Clock },
          { id: 'courses', label: 'By Checked Courses', icon: Target }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold transition-all border-b-2 cursor-pointer ${
                active 
                  ? 'border-phase-violet text-phase-violet' 
                  : 'border-transparent text-text-faint hover:text-text-dim'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Rankings Table */}
      <div className="bg-surface border border-border-line rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border-line bg-bg-raise/50 text-text-faint font-mono text-[10px] uppercase tracking-wider">
                <th className="py-4 px-6 text-center w-16">Rank</th>
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-6 text-center w-24">Level</th>
                <th className="py-4 px-6 text-right w-36">
                  {activeTab === 'xp' ? 'Total XP' : activeTab === 'time' ? 'Focus Mins' : 'Courses Complete'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-line font-medium text-text-dim">
              {sortedItems.map((item, idx) => {
                const rank = idx + 1;
                const isTop3 = rank <= 3;
                return (
                  <tr 
                    key={item.id} 
                    className={`transition-colors ${
                      item.isUser ? 'bg-phase-violet/5 text-text-main border-l-4 border-l-phase-violet' : 'hover:bg-bg-raise/30'
                    }`}
                  >
                    <td className="py-4 px-6 text-center">
                      {isTop3 ? (
                        <span className="inline-flex items-center justify-center">
                          {rank === 1 && <Medal className="text-phase-gold" size={18} />}
                          {rank === 2 && <Medal className="text-text-faint" size={18} />}
                          {rank === 3 && <Medal className="text-phase-amber" size={18} />}
                        </span>
                      ) : (
                        <span className="font-mono text-text-faint font-bold">{rank}</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-main">{item.name}</span>
                        {item.active && (
                          <span className="w-1.5 h-1.5 rounded-full bg-phase-teal animate-pulse" title="Studying now" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-mono">
                      LVL {item.level}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-text-main">
                      {activeTab === 'xp' && `${item.xp} XP`}
                      {activeTab === 'time' && `${item.mins} mins`}
                      {activeTab === 'courses' && `${item.courses} modules`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
