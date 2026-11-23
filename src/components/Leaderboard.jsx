import { useEffect, useState } from 'react';
import { Medal, Sparkles, Target, UserPlus, UserMinus, RefreshCw, AlertCircle } from 'lucide-react';
import { collection, doc, onSnapshot, setDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { PHASES } from '../data/roadmap';

const CATEGORIES = ['courses', 'books', 'videos', 'websites', 'certs', 'projects'];

// Level N needs N x 100 XP to reach level N+1, so the XP spent on earlier
// levels is 100 + 200 + ... + (level-1) x 100.
function totalXpOf(level, xp) {
  return (100 * (level - 1) * level) / 2 + xp;
}

export function Leaderboard() {
  const { progress, isCompleted } = useProgress();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('xp'); // 'xp' or 'completed'
  const [entries, setEntries] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);

  const userLevel = progress._level || 1;
  const userXp = progress._xp || 0;
  const totalUserXp = totalXpOf(userLevel, userXp);

  // Count real completed roadmap items.
  let completedCount = 0;
  for (const phase of PHASES) {
    for (const category of CATEGORIES) {
      (phase[category] || []).forEach((_, index) => {
        if (isCompleted(phase.key, category, index)) completedCount += 1;
      });
    }
  }

  // Real people who chose to appear on the leaderboard (Firestore "leaderboards").
  useEffect(() => {
    if (!db || !currentUser) return;
    const q = query(collection(db, 'leaderboards'), orderBy('xp', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snap) => {
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoadError('');
    }, (err) => {
      console.warn('Leaderboard error:', err);
      setLoadError('Could not load the leaderboard right now.');
    });
    return () => unsubscribe();
  }, [currentUser]);

  const myEntry = currentUser ? entries.find(e => e.id === currentUser.uid) : null;

  const publishMyScore = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      const name = (currentUser.displayName || currentUser.email?.split('@')[0] || 'Learner').slice(0, 40);
      await setDoc(doc(db, 'leaderboards', currentUser.uid), {
        name,
        level: userLevel,
        xp: totalUserXp,
        completed: completedCount,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.error('Could not save leaderboard entry:', err);
      setLoadError('Could not save your entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const removeMe = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, 'leaderboards', currentUser.uid));
    } catch (err) {
      console.error('Could not remove leaderboard entry:', err);
    } finally {
      setSaving(false);
    }
  };

  const sorted = [...entries].sort((a, b) =>
    activeTab === 'xp' ? b.xp - a.xp : (b.completed || 0) - (a.completed || 0)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">

      {/* Header Profile Summary */}
      <div className="bg-surface border border-border-line p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-phase-violet/15 flex items-center justify-center text-phase-violet font-display font-bold text-xl relative">
            LVL {userLevel}
            <Sparkles size={16} className="absolute -top-1 -right-1 text-phase-amber" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-text-main">Rankings</h2>
            <p className="text-sm text-text-dim mt-0.5">Real learners who chose to share their progress.</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-xs font-mono w-full md:w-auto">
          <div className="bg-bg-raise border border-border-line px-4 py-3 rounded-xl text-center">
            You: <span className="text-phase-violet font-bold">{totalUserXp} XP</span> · {completedCount} items done
          </div>
          {currentUser && (
            <div className="flex gap-2">
              <button
                onClick={publishMyScore}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-phase-violet text-white font-bold disabled:opacity-50 cursor-pointer"
              >
                {myEntry ? <RefreshCw size={14} /> : <UserPlus size={14} />}
                {myEntry ? 'Update my score' : 'Join the leaderboard'}
              </button>
              {myEntry && (
                <button
                  onClick={removeMe}
                  disabled={saving}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border-strong text-text-dim font-bold disabled:opacity-50 cursor-pointer"
                  title="Remove me from the leaderboard"
                >
                  <UserMinus size={14} /> Leave
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {loadError && (
        <div className="flex items-center gap-2 text-phase-brick text-sm"><AlertCircle size={16} /> {loadError}</div>
      )}

      {!currentUser ? (
        <div className="flat-card p-10 border border-dashed border-border-strong text-center space-y-2">
          <div className="text-4xl">🏆</div>
          <h3 className="font-display font-bold text-lg text-text-main">Sign in to see the rankings</h3>
          <p className="text-sm text-text-dim">The leaderboard shows real learners only, so you need an account to view or join it.</p>
        </div>
      ) : (
        <>
          {/* Tabs Menu */}
          <div className="flex gap-2 border-b border-border-line pb-px">
            {[
              { id: 'xp', label: 'By Total XP', icon: Sparkles },
              { id: 'completed', label: 'By Items Completed', icon: Target },
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

          {sorted.length === 0 ? (
            <div className="flat-card p-10 border border-dashed border-border-strong text-center space-y-2">
              <div className="text-4xl">🌱</div>
              <h3 className="font-display font-bold text-lg text-text-main">Nobody has joined yet</h3>
              <p className="text-sm text-text-dim">Click "Join the leaderboard" to be the first.</p>
            </div>
          ) : (
            <div className="bg-surface border border-border-line rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border-line bg-bg-raise/50 text-text-faint font-mono text-[10px] uppercase tracking-wider">
                      <th className="py-4 px-6 text-center w-16">Rank</th>
                      <th className="py-4 px-6">Learner</th>
                      <th className="py-4 px-6 text-center w-24">Level</th>
                      <th className="py-4 px-6 text-right w-36">{activeTab === 'xp' ? 'Total XP' : 'Items done'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-line font-medium text-text-dim">
                    {sorted.map((item, idx) => {
                      const rank = idx + 1;
                      const isMe = item.id === currentUser.uid;
                      return (
                        <tr
                          key={item.id}
                          className={`transition-colors ${isMe ? 'bg-phase-violet/5 text-text-main border-l-4 border-l-phase-violet' : 'hover:bg-bg-raise/30'}`}
                        >
                          <td className="py-4 px-6 text-center">
                            {rank <= 3 ? (
                              <Medal size={18} className={`inline ${rank === 1 ? 'text-phase-gold' : rank === 2 ? 'text-text-faint' : 'text-phase-amber'}`} />
                            ) : (
                              <span className="font-mono text-text-faint font-bold">{rank}</span>
                            )}
                          </td>
                          <td className="py-4 px-6 font-semibold text-text-main">{item.name}{isMe ? ' (You)' : ''}</td>
                          <td className="py-4 px-6 text-center font-mono">LVL {item.level}</td>
                          <td className="py-4 px-6 text-right font-mono font-bold text-text-main">
                            {activeTab === 'xp' ? `${item.xp} XP` : `${item.completed || 0}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
