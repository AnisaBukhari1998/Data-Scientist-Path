import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, Square, SkipForward, TreePine, Bell, Calendar, Volume2, VolumeX, Keyboard, RefreshCw, Users, Send } from 'lucide-react';
import { getCalendarUrl } from '../utils/calendar';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { playClick, playSuccess, startAmbientSound, stopAmbientSound, setAmbientVolume } from '../utils/audioEngine';

/* ─── Session Presets ─── */
const SESSIONS = [
  { label: 'Pomodoro', minutes: 25, tree: '🌱 Bonsai' },
  { label: 'Deep Work', minutes: 50, tree: '🌿 Sturdy Oak' },
  { label: 'Flow State', minutes: 90, tree: '🌸 Sakura' },
];

/* ─── Ambient Audio Sound Tracks (local files in /public/audio/) ─── */
const AUDIO_TRACKS = {
  lofi: {
    label: '☕ Lofi Beats',
    url: '/audio/lofi.ogg'
  },
  rain: {
    label: '🌧 Forest Rain',
    url: '/audio/rain.mp3'
  },
  waves: {
    label: '🌊 Ocean Waves',
    url: '/audio/waves.mp3'
  }
};

/* ─── Tree SVG Stages ─── */
function GrowingTree({ stage, species = 'bonsai' }) {
  const stageClamp = Math.max(0, Math.min(4, stage));

  // Determine leaf color based on species
  let leafColor = 'var(--teal)'; // default bonsai
  let fruitColor = 'var(--rose)';

  if (species === 'oak') {
    leafColor = 'var(--amber)';
    fruitColor = 'var(--gold)';
  } else if (species === 'sakura') {
    leafColor = 'var(--rose)';
    fruitColor = 'var(--violet)';
  }

  return (
    <svg viewBox="0 0 200 280" className="w-48 h-56 md:w-56 md:h-64 mx-auto transition-all duration-1000" aria-hidden="true">
      {/* Ground */}
      <ellipse cx="100" cy="265" rx="60" ry="8" fill={leafColor} opacity="0.15" />

      {/* Trunk — grows taller with stage */}
      <rect
        x="94" y={240 - stageClamp * 25} width="12"
        height={25 + stageClamp * 25}
        rx="3"
        fill="#a0845c"
        className="transition-all duration-1000"
      />

      {/* Stage 1+: First branches */}
      {stageClamp >= 1 && (
        <g className="animate-scale-in" style={{ transformOrigin: '100px 200px' }}>
          <line x1="100" y1="200" x2="75" y2="180" stroke="#8b7355" strokeWidth="4" strokeLinecap="round" />
          <line x1="100" y1="200" x2="125" y2="185" stroke="#8b7355" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {/* Stage 2+: More branches */}
      {stageClamp >= 2 && (
        <g className="animate-scale-in" style={{ transformOrigin: '100px 180px' }}>
          <line x1="100" y1="175" x2="65" y2="155" stroke="#8b7355" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="170" x2="140" y2="150" stroke="#8b7355" strokeWidth="3" strokeLinecap="round" />
          {/* Small leaf clusters */}
          <circle cx="70" cy="175" r="12" fill={leafColor} opacity="0.5" />
          <circle cx="130" cy="180" r="10" fill={leafColor} opacity="0.45" />
        </g>
      )}

      {/* Stage 3+: Fuller canopy */}
      {stageClamp >= 3 && (
        <g className="animate-scale-in" style={{ transformOrigin: '100px 150px' }}>
          <circle cx="80" cy="150" r="22" fill={leafColor} opacity="0.55" />
          <circle cx="120" cy="145" r="20" fill={leafColor} opacity="0.5" />
          <circle cx="100" cy="140" r="25" fill={leafColor} opacity="0.6" />
          <circle cx="60" cy="160" r="15" fill={leafColor} opacity="0.4" />
          <circle cx="140" cy="155" r="14" fill={leafColor} opacity="0.4" />
        </g>
      )}

      {/* Stage 4: Full lush canopy with flowers */}
      {stageClamp >= 4 && (
        <g className="animate-bounce-in" style={{ transformOrigin: '100px 130px' }}>
          <circle cx="100" cy="115" r="35" fill={leafColor} opacity="0.65" />
          <circle cx="65" cy="135" r="25" fill={leafColor} opacity="0.55" />
          <circle cx="135" cy="130" r="23" fill={leafColor} opacity="0.55" />
          <circle cx="50" cy="150" r="18" fill={leafColor} opacity="0.4" />
          <circle cx="150" cy="145" r="16" fill={leafColor} opacity="0.4" />
          {/* Flowers/fruits */}
          <circle cx="85" cy="108" r="4" fill={fruitColor} opacity="0.8" />
          <circle cx="115" cy="112" r="3.5" fill="var(--amber)" opacity="0.8" />
          <circle cx="72" cy="128" r="3" fill={fruitColor} opacity="0.7" />
          <circle cx="130" cy="123" r="3.5" fill="var(--amber)" opacity="0.7" />
          <circle cx="100" cy="100" r="4" fill="var(--gold)" opacity="0.8" />
        </g>
      )}
    </svg>
  );
}

/* ─── Circular Timer Ring ─── */
function TimerRing({ timeLeft, totalTime, isWork, size = 200 }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const offset = circumference - progress * circumference;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative inline-flex items-center justify-center animate-fade-in" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--line)" strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={isWork ? 'var(--teal)' : 'var(--amber)'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-display font-bold text-text-main tabular-nums">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        <span className={`text-xs font-mono uppercase tracking-wider mt-1 ${isWork ? 'text-phase-teal' : 'text-phase-amber'}`}>
          {isWork ? 'Focus' : 'Break'}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FOCUS TIMER — Forest-style with growing tree
   ═══════════════════════════════════════════════════════════════════ */
export function FocusTimer() {
  const [selectedSession, setSelectedSession] = useState(0);
  const workTime = SESSIONS[selectedSession].minutes * 60;
  const BREAK_TIME = 5 * 60;

  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [treesPlanted, setTreesPlanted] = useState(() => {
    return parseInt(localStorage.getItem('focus-trees') || '0', 10);
  });
  const [totalFocusToday, setTotalFocusToday] = useState(0);
  const [streak, setStreak] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [ambientSound, setAmbientSound] = useState('none'); // 'none' | 'lofi' | 'rain' | 'waves'
  const [volume, setVolume] = useState(0.5);

  const { currentUser } = useAuth();
  const [inRoom, setInRoom] = useState(false);
  const [activePeers, setActivePeers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Handle room listener registration
  useEffect(() => {
    if (!inRoom || !db || !currentUser) {
      if (!inRoom) {
        setActivePeers([]);
        setChatMessages([]);
      }
      return;
    }

    const docRef = doc(db, 'study_rooms', 'general_focus');
    
    // Set initial template room doc if not exists
    const initRoom = async () => {
      try {
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          await setDoc(docRef, {
            active_users: [],
            messages: []
          });
        }
        
        // Add ourselves to the active users list
        const userObj = {
          email: currentUser.email || 'Anonymous Student',
          joinedAt: Date.now()
        };
        await updateDoc(docRef, {
          active_users: arrayUnion(userObj)
        });
      } catch (err) {
        console.error("Room init failed:", err);
      }
    };
    initRoom();

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setActivePeers(data.active_users || []);
        setChatMessages(data.messages || []);
      }
    }, (err) => {
      console.warn("Firestore listener error, using local peer room fallback.", err);
    });

    return () => {
      unsubscribe();
      // Remove ourselves from room
      const leaveRoom = async () => {
        try {
          const userObj = {
            email: currentUser.email || 'Anonymous Student',
            joinedAt: Date.now()
          };
          // Find and filter ourselves out
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const currentUsers = snap.data().active_users || [];
            const updated = currentUsers.filter(u => u.email !== currentUser.email);
            await updateDoc(docRef, {
              active_users: updated
            });
          }
        } catch (err) {
          console.error("Failed to leave room clean:", err);
        }
      };
      leaveRoom();
    };
  }, [inRoom, currentUser]);

  const sendRoomMessage = async (e) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text || !currentUser || !db) return;

    try {
      const docRef = doc(db, 'study_rooms', 'general_focus');
      await updateDoc(docRef, {
        messages: arrayUnion({
          text,
          sender: currentUser.email || 'Anonymous Student',
          timestamp: Date.now()
        })
      });
      setChatInput('');
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Garden Grid state (16 slots)
  const [garden, setGarden] = useState(() => {
    const saved = localStorage.getItem('focus-garden');
    return saved ? JSON.parse(saved) : Array(16).fill(null);
  });

  const timerRef = useRef(null);

  /* Sync trees count */
  useEffect(() => {
    localStorage.setItem('focus-trees', String(treesPlanted));
  }, [treesPlanted]);

  /* Sync Garden state */
  useEffect(() => {
    localStorage.setItem('focus-garden', JSON.stringify(garden));
  }, [garden]);

  /* Ambient Sound Player logic */
  useEffect(() => {
    if (ambientSound !== 'none' && isActive) {
      startAmbientSound(ambientSound, volume);
    } else {
      stopAmbientSound();
    }

    return () => {
      stopAmbientSound();
    };
  }, [ambientSound, isActive]); // Depend on both sound choice and timer active state

  /* Volume slider sync */
  useEffect(() => {
    setAmbientVolume(volume);
  }, [volume]);

  /* Update timer on session change (only when not active) */
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(workTime);
      setIsWorkPhase(true);
    }
  }, [selectedSession]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Keyboard shortcut: Space to toggle */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleTimer();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }); // intentionally no deps

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    if (permission === "granted") setNotificationsEnabled(true);
  };

  const sendNotification = useCallback((title, body) => {
    if (notificationsEnabled && "Notification" in window) {
      new Notification(title, { body, icon: '/vite.svg' });
    }
  }, [notificationsEnabled]);

  const toggleTimer = () => {
    playClick();
    if (!notificationsEnabled && "Notification" in window && Notification.permission !== "granted") {
      requestNotificationPermission();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    playClick();
    setIsActive(false);
    setTimeLeft(isWorkPhase ? workTime : BREAK_TIME);
  };

  const skipPhase = useCallback(() => {
    playClick();
    setIsActive(false);
    if (isWorkPhase) {
      setIsWorkPhase(false);
      setTimeLeft(BREAK_TIME);
      sendNotification('🌿 Break Time', 'Great focus session! Take a short break.');
    } else {
      setIsWorkPhase(true);
      setTimeLeft(workTime);
      sendNotification('🌱 Focus Time', 'Break over! Time to grow another tree.');
    }
  }, [isWorkPhase, workTime, BREAK_TIME, sendNotification]);

  // Complete session and grow tree
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        if (isWorkPhase) setTotalFocusToday(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      if (isWorkPhase) {
        // Grow tree inside virtual garden
        const currentSpec = treesPlanted < 3 ? 'bonsai' : treesPlanted < 7 ? 'oak' : 'sakura';
        setGarden(prev => {
          const next = [...prev];
          const emptySlot = next.indexOf(null);
          if (emptySlot !== -1) {
            next[emptySlot] = currentSpec;
          } else {
            // Shift elements and append to end if full
            next.shift();
            next.push(currentSpec);
          }
          return next;
        });

        setTreesPlanted(prev => prev + 1);
        setStreak(prev => prev + 1);
        playSuccess(); // Play tree completed audio cue
        sendNotification('🌳 Tree Planted!', `You've successfully grown a ${currentSpec}! Take a break.`);
      } else {
        playSuccess(); // Play break finished alert chime
        sendNotification('🌱 Focus Time', 'Break is over! Time to grow another tree.');
      }
      skipPhase();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  // Determine active species level
  const activeSpecies = treesPlanted < 3 ? 'bonsai' : treesPlanted < 7 ? 'oak' : 'sakura';

  const totalTime = isWorkPhase ? workTime : BREAK_TIME;
  const elapsed = totalTime - timeLeft;
  const elapsedPercent = totalTime > 0 ? (elapsed / totalTime) * 100 : 0;
  const treeStage = elapsedPercent < 20 ? 0 : elapsedPercent < 40 ? 1 : elapsedPercent < 60 ? 2 : elapsedPercent < 80 ? 3 : 4;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
  };

  const handleClearGarden = () => {
    if (confirm("Are you sure you want to clear your garden forest map?")) {
      setGarden(Array(16).fill(null));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-phase-teal/15 rounded-xl text-phase-teal">
            <TreePine size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-display text-text-main">Focus Forest Timer</h2>
            <p className="text-text-dim text-sm">Stay focused to grow your tree. If you leave or cancel, your tree dies! 🌳</p>
          </div>
        </div>
      </header>

      {/* Main Grid Layout: left side is Timer, right side is Garden Map */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Timer & Presets */}
        <div className="md:col-span-7 space-y-6">
          {/* Session Presets */}
          <div className="flex justify-center md:justify-start gap-3">
            {SESSIONS.map((session, i) => (
              <button
                key={session.label}
                onClick={() => { if (!isActive) setSelectedSession(i); }}
                disabled={isActive}
                className={`px-4 py-3 rounded-xl text-xs font-semibold transition-all border flex-1 md:flex-none cursor-pointer ${
                  selectedSession === i
                    ? 'bg-phase-teal/15 text-phase-teal border-phase-teal/30 font-bold'
                    : 'bg-surface text-text-faint border-border-line hover:text-text-dim disabled:opacity-50'
                }`}
              >
                <div className="font-mono text-sm">{session.minutes}m</div>
                <div className="text-[10px] uppercase tracking-wide mt-0.5">{session.label}</div>
              </button>
            ))}
          </div>

          {/* Main Card */}
          <div className="glass rounded-2xl p-6 md:p-8 text-center space-y-6">
            {/* Growing Tree Visualizer */}
            <div className={`${isActive && isWorkPhase ? '' : 'opacity-60'} transition-opacity duration-500`}>
              <GrowingTree stage={isWorkPhase ? treeStage : 4} species={activeSpecies} />
            </div>

            {/* Circular Progress Ring */}
            <TimerRing
              timeLeft={timeLeft}
              totalTime={totalTime}
              isWork={isWorkPhase}
              size={200}
            />

            {/* Ambient Player Controls */}
            <div className="p-4 bg-bg-raise rounded-xl border border-border-line space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-dim flex items-center gap-1.5">
                  <Volume2 size={14} className="text-phase-teal" /> Ambient Soundscapes
                </span>
                {ambientSound !== 'none' && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20 accent-phase-teal cursor-pointer"
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'none', label: '🔇 None' },
                  { key: 'lofi', label: '☕ Lofi' },
                  { key: 'rain', label: '🌧 Rain' },
                  { key: 'waves', label: '🌊 Waves' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setAmbientSound(opt.key)}
                    className={`flex-1 text-center py-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                      ambientSound === opt.key
                        ? 'border-phase-teal bg-phase-teal/10 text-phase-teal'
                        : 'border-border-line bg-surface text-text-faint hover:text-text-dim'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={toggleTimer}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer
                  ${isActive
                    ? 'bg-phase-amber/15 text-phase-amber hover:bg-phase-amber/25'
                    : 'bg-phase-teal text-white hover:bg-phase-teal/80 shadow-md'
                  }
                `}
                aria-label={isActive ? 'Pause timer' : 'Start timer'}
              >
                {isActive ? <Pause size={18} /> : <Play size={18} />}
                {isActive ? 'Pause Session' : 'Grow Tree'}
              </button>

              <button
                onClick={resetTimer}
                className="p-3.5 rounded-xl bg-bg-raise text-text-dim hover:text-text-main border border-border-line transition-colors cursor-pointer"
                title="Reset timer"
                aria-label="Reset timer"
              >
                <Square size={16} />
              </button>

              <button
                onClick={skipPhase}
                className="p-3.5 rounded-xl bg-bg-raise text-text-dim hover:text-text-main border border-border-line transition-colors cursor-pointer"
                title="Skip phase"
                aria-label="Skip phase"
              >
                <SkipForward size={16} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-1 text-text-faint text-[10px] font-mono uppercase tracking-wider pt-2 border-t border-border-line">
              <Keyboard size={12} /> Press <span className="font-bold bg-bg-raise px-1.5 py-0.5 rounded">Space</span> to start/pause
            </div>
          </div>
        </div>

        {/* Right Side: Stats & Forest Garden Map */}
        <div className="md:col-span-5 space-y-6 animate-slide-up">
          
          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flat-card p-4 text-center border border-border-line space-y-1">
              <div className="text-xl font-extrabold font-display text-phase-teal">{treesPlanted}</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-text-faint">Trees Grown</div>
            </div>
            
            <div className="flat-card p-4 text-center border border-border-line space-y-1">
              <div className="text-xl font-extrabold font-display text-phase-amber">{formatTime(totalFocusToday)}</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-text-faint">Focus Time</div>
            </div>

            <div className="flat-card p-4 text-center border border-border-line space-y-1">
              <div className="text-xl font-extrabold font-display text-phase-violet">{streak}</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-text-faint">Active Streak</div>
            </div>

            <div className="flat-card p-4 text-center border border-border-line space-y-1">
              <div className="text-xs font-bold font-display text-phase-rose truncate">{SESSIONS[selectedSession].tree}</div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-text-faint">Species Focus</div>
            </div>
          </div>

          {/* Virtual Forest Garden Canvas */}
          <div className="flat-card p-6 border border-border-line space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border-line">
              <div>
                <h3 className="font-bold text-text-main text-sm">Virtual Forest Garden</h3>
                <p className="text-[10px] text-text-faint">Your completed sessions rendered in a 16-slot grid</p>
              </div>
              <button
                onClick={handleClearGarden}
                className="text-[10px] font-bold text-phase-brick hover:underline flex items-center gap-1.5"
              >
                <RefreshCw size={11} /> Reset Garden
              </button>
            </div>

            {/* 4x4 Grid representation */}
            <div className="grid grid-cols-4 gap-3 bg-bg-main p-4 rounded-xl border border-border-line justify-items-center">
              {garden.map((tree, idx) => (
                <div
                  key={idx}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border ${
                    tree === 'bonsai'
                      ? 'bg-phase-teal/10 border-phase-teal/20 text-phase-teal animate-bounce-in'
                      : tree === 'oak'
                      ? 'bg-phase-amber/10 border-phase-amber/20 text-phase-amber animate-bounce-in'
                      : tree === 'sakura'
                      ? 'bg-phase-rose/10 border-phase-rose/20 text-phase-rose animate-bounce-in'
                      : 'bg-surface/50 border-dashed border-border-line text-text-faint'
                  }`}
                  title={tree ? `${tree} tree` : 'Empty slot'}
                >
                  {tree === 'bonsai' && <TreePine size={20} />}
                  {tree === 'oak' && <TreePine size={22} className="stroke-[2.5]" />}
                  {tree === 'sakura' && <TreePine size={24} className="stroke-[1.5]" />}
                  {!tree && <span className="text-[9px] font-mono">•</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Scheduler Integration */}
          <div className="flex flex-col gap-3">
            <button
              onClick={requestNotificationPermission}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                notificationsEnabled
                  ? 'bg-phase-teal/10 text-phase-teal border-phase-teal/20'
                  : 'bg-surface text-text-dim border-border-line hover:border-border-strong'
              }`}
            >
              <Bell size={14} />
              {notificationsEnabled ? 'System Alerts Active' : 'Allow Push Reminders'}
            </button>

            <a
              href={getCalendarUrl('Focus Session', `${SESSIONS[selectedSession].minutes}-minute deep focus study session.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-surface text-text-dim border border-border-line hover:border-border-strong transition-colors text-center"
            >
              <Calendar size={14} />
              Add Study block to Calendar ↗
            </a>
          </div>

          {/* Collaborative Peer Study Rooms */}
          <div className="flat-card p-6 border border-border-line space-y-4">
            <div className="flex items-center justify-between border-b border-border-line pb-2">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-phase-teal" />
                <h3 className="font-bold text-text-main text-sm">Peer Study Lounge</h3>
              </div>
              {inRoom && (
                <span className="text-[10px] bg-phase-teal/10 text-phase-teal px-2 py-0.5 rounded font-mono font-bold">
                  {activePeers.length} online
                </span>
              )}
            </div>

            {!currentUser ? (
              <p className="text-xs text-text-faint italic text-center py-2">
                Please log in to join the collaborative study rooms and chat with other students.
              </p>
            ) : !inRoom ? (
              <button
                onClick={() => setInRoom(true)}
                className="w-full bg-phase-teal hover:bg-phase-teal/90 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                Join General Study Room
              </button>
            ) : (
              <div className="space-y-4">
                {/* Active Members */}
                <div className="space-y-1">
                  <div className="text-[9px] uppercase font-mono font-bold text-text-faint">Active Students:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activePeers.map((p, i) => (
                      <span key={i} className="text-[10px] bg-bg-raise border border-border-line px-2 py-0.5 rounded text-text-dim font-mono">
                        👤 {p.email.split('@')[0]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Chat Log */}
                <div className="border border-border-line rounded-xl bg-bg-main p-3 h-32 overflow-y-auto space-y-2 text-[11px] font-mono scrollbar-thin">
                  {chatMessages.length === 0 ? (
                    <div className="text-text-faint italic text-center pt-8">No messages. Say hello to your peers!</div>
                  ) : (
                    chatMessages.map((msg, i) => (
                      <div key={i} className="space-y-0.5">
                        <div className="flex justify-between text-[9px] text-text-faint">
                          <span className="font-bold text-phase-teal">{msg.sender.split('@')[0]}</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-text-main bg-surface p-1.5 rounded border border-border-line/40">{msg.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Text Form */}
                <form onSubmit={sendRoomMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-bg-main border border-border-line rounded-xl px-3 py-2 text-xs focus:outline-none text-text-main"
                  />
                  <button
                    type="submit"
                    className="bg-phase-teal text-white p-2 rounded-xl hover:bg-phase-teal/80 transition-colors cursor-pointer"
                  >
                    <Send size={14} />
                  </button>
                </form>

                <button
                  onClick={() => setInRoom(false)}
                  className="w-full bg-bg-raise hover:bg-surface border border-border-line text-text-dim hover:text-text-main py-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                >
                  Leave Study Room
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
