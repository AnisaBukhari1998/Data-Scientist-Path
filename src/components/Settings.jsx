import { useState, useEffect } from 'react';
import { Bell, Shield, Trash2, Sliders, Volume2, Save, Sparkles, CheckCircle, Loader2, Globe, Check, Palette, Type } from 'lucide-react';
import { TrackSelector } from './TrackSelector';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { playClick, playSuccess } from '../utils/audioEngine';

const DEFAULT_TIMES = ['09:00', '13:00', '17:00', '21:00'];

const GithubIcon = ({ size = 24, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

// 12 Premium Color Themes
const THEMES = [
  { id: 'default', label: 'Default Theme', colors: ['#f8f7ff', '#2d2645', '#9b8ec4'], isDark: false },
  { id: 'cyberpunk', label: 'Cyberpunk Neon', colors: ['#0b0813', '#e0f2fe', '#f43f5e'], isDark: true },
  { id: 'dracula', label: 'Dracula Classic', colors: ['#282a36', '#f8f8f2', '#bd93f9'], isDark: true },
  { id: 'nord', label: 'Nord Ice', colors: ['#2e3440', '#eceff4', '#88c0d0'], isDark: true },
  { id: 'tokyo-night', label: 'Tokyo Night', colors: ['#1a1b26', '#a9b1d6', '#bb9af7'], isDark: true },
  { id: 'sunset', label: 'Sunset Glow', colors: ['#fff8f5', '#451b0f', '#e76f51'], isDark: false },
  { id: 'forest', label: 'Forest Emerald', colors: ['#f3f6f3', '#1b3322', '#2e7d32'], isDark: false },
  { id: 'midnight', label: 'Midnight Slate', colors: ['#090a0f', '#f1f5f9', '#8b5cf6'], isDark: true },
  { id: 'solarized', label: 'Solarized Sand', colors: ['#fdf6e3', '#073642', '#2aa198'], isDark: false },
  { id: 'rose-gold', label: 'Rose Gold', colors: ['#fffbfb', '#4a343b', '#c490b0'], isDark: false },
  { id: 'cyber-mint', label: 'Cyber Mint', colors: ['#090f0e', '#f0fdfa', '#2dd4bf'], isDark: true }
];

// 5 Typographies
const TYPOGRAPHIES = [
  { id: 'inter', label: 'Inter (Sans)', fontClass: 'font-inter', desc: 'Clean and modern interface typography' },
  { id: 'grotesk', label: 'Space Grotesk', fontClass: 'font-grotesk', desc: 'High-tech geometric headers and body' },
  { id: 'outfit', label: 'Outfit (Modern)', fontClass: 'font-outfit', desc: 'Minimalist tech brand typography' },
  { id: 'fira', label: 'Fira Code (Dev)', fontClass: 'font-fira', desc: 'Developer monospace hybrid structure' },
  { id: 'jetbrains', label: 'JetBrains Mono', fontClass: 'font-jetbrains', desc: 'Ultimate readable tech programmer layout' }
];

export function Settings() {
  const { progress, setGithubUser, disconnectGithub, syncExternalProfiles, resetAllProgress } = useProgress();
  const { currentUser, deleteAccount } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteAccount();
      window.location.assign('/');
    } catch (err) {
      console.error('Account deletion failed:', err);
      setDeleteError(err.code === 'auth/popup-closed-by-user'
        ? 'Deletion cancelled: please confirm with Google to delete your account.'
        : 'Your account could not be deleted. Please try again.');
      setIsDeleting(false);
    }
  };

  const [githubUsername, setGithubUsername] = useState('');
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);
  const [githubError, setGithubError] = useState('');

  // Trimmed Platform Configurations for functional portfolio & API tracking
  const PLATFORM_CONFIGS = [
    { key: 'leetcodeUser', label: 'LeetCode Username', placeholder: 'leetcode_id' },
    { key: 'kaggleUser', label: 'Kaggle Username', placeholder: 'kaggler_id' },
    { key: 'huggingfaceUser', label: 'Hugging Face Username', placeholder: 'hf_id' },
    { key: 'mediumUser', label: 'Medium Handle', placeholder: '@medium_id' }
  ];

  const [profileState, setProfileState] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    if (progress._externalProfiles) {
      setProfileState(progress._externalProfiles);
    }
  }, [progress._externalProfiles]);

  const handleProfileValChange = (key, val) => {
    setProfileState(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const [activeTrack, setActiveTrack] = useState(() => {
    return localStorage.getItem('active-track') || 'ds';
  });

  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    return localStorage.getItem('reminders-enabled') === 'true';
  });

  const [reminderTimes, setReminderTimes] = useState(() => {
    const saved = localStorage.getItem('reminder-times');
    return saved ? JSON.parse(saved) : DEFAULT_TIMES;
  });

  const [studyGoal, setStudyGoal] = useState(() => {
    return parseInt(localStorage.getItem('daily-study-goal') || '60', 10);
  });

  // UI Sound Toggle state
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('sound-effects-enabled') !== 'false';
  });

  // Theme & Font states
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('active-theme') || 'default';
  });

  const [activeFont, setActiveFont] = useState(() => {
    return localStorage.getItem('active-font') || 'inter';
  });

  const [tutorPersonality, setTutorPersonality] = useState(() => {
    return localStorage.getItem('ai-tutor-personality') || 'mentor';
  });

  const [mathPref, setMathPref] = useState(() => {
    return localStorage.getItem('math-preference') !== 'false';
  });

  const [saveStatus, setSaveStatus] = useState(false);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return false;
    }
    const permission = await Notification.requestPermission();
    return permission === "granted";
  };

  const handleToggleReminders = async () => {
    playClick();
    if (!remindersEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setRemindersEnabled(true);
        localStorage.setItem('reminders-enabled', 'true');
        new Notification('Data Scientist Path', {
          body: 'Daily study reminders enabled successfully! 🚀',
          icon: '/favicon.svg'
        });
      }
    } else {
      setRemindersEnabled(false);
      localStorage.setItem('reminders-enabled', 'false');
    }
  };

  const handleSaveSettings = () => {
    playSuccess();
    localStorage.setItem('active-track', activeTrack);
    localStorage.setItem('reminder-times', JSON.stringify(reminderTimes));
    localStorage.setItem('daily-study-goal', String(studyGoal));
    localStorage.setItem('sound-effects-enabled', String(soundEnabled));
    localStorage.setItem('active-theme', activeTheme);
    localStorage.setItem('active-font', activeFont);
    localStorage.setItem('ai-tutor-personality', tutorPersonality);
    localStorage.setItem('math-preference', String(mathPref));

    // Dispatch global changes immediately for theme & typography wrappers
    window.dispatchEvent(new Event('settings-changed'));

    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = value;
    setReminderTimes(newTimes);
  };

  // Connect by public username: no token is needed or stored.
  const handleConnectGithub = async () => {
    playClick();
    const username = githubUsername.trim().replace(/^@/, '');
    if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(username)) {
      setGithubError('Please enter a valid GitHub username.');
      return;
    }
    setIsConnectingGithub(true);
    setGithubError('');
    try {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
      if (response.status === 404) throw new Error('not-found');
      if (!response.ok) throw new Error('unavailable');
      const data = await response.json();
      await setGithubUser({
        username: data.login,
        name: data.name || data.login,
        avatarUrl: data.avatar_url,
      });
      setGithubUsername('');
      playSuccess();
    } catch (err) {
      setGithubError(err.message === 'not-found'
        ? 'No GitHub account with that username.'
        : 'Could not reach GitHub right now. Please try again.');
    } finally {
      setIsConnectingGithub(false);
    }
  };

  const handleSyncProfiles = async () => {
    // Saves the usernames so they appear as links on your profile and CV.
    // Nothing is fetched from these sites.
    playClick();
    setIsSyncing(true);
    setSyncSuccess(false);
    const sanitized = {};
    PLATFORM_CONFIGS.forEach(plat => {
      sanitized[plat.key] = (profileState[plat.key] || '').trim();
    });
    await syncExternalProfiles(sanitized);
    setIsSyncing(false);
    setSyncSuccess(true);
    playSuccess();
    setTimeout(() => setSyncSuccess(false), 3000);
  };

  const handleResetProgress = async () => {
    playClick();
    if (confirm("Are you absolutely sure you want to reset all your learning progress? This cannot be undone.")) {
      await resetAllProgress();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      <header className="flex justify-between items-center border-b border-border-line pb-4 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-phase-violet/15 rounded-xl text-phase-violet">
            <Sliders size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-display text-text-main">Settings</h2>
            <p className="text-xs text-text-dim">Configure and customize your workspace environment</p>
          </div>
        </div>
        
        {/* Floating Save Action */}
        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 bg-phase-violet hover:bg-phase-violet/85 text-white font-mono font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          {saveStatus ? <CheckCircle size={14} /> : <Save size={14} />}
          <span>{saveStatus ? 'Settings Saved!' : 'Save Options'}</span>
        </button>
      </header>

      {/* Learning Track Specialization */}
      <div className="flat-card p-6 border border-border-line">
        <TrackSelector currentTrack={activeTrack} onSelect={setActiveTrack} />
      </div>

      {/* Theme Studio Customizer (10+ options) */}
      <div className="flat-card p-6 border border-border-line space-y-4">
        <div className="flex items-center gap-3">
          <Palette className="text-phase-violet" size={24} />
          <div>
            <h3 className="font-semibold text-text-main">Color Theme Engine</h3>
            <p className="text-xs text-text-faint">Select a premium color theme to match your mood</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => {
                playClick();
                setActiveTheme(theme.id);
              }}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-20 ${
                activeTheme === theme.id
                  ? 'bg-phase-violet/10 border-phase-violet/40 text-phase-violet ring-2 ring-phase-violet/25'
                  : 'bg-surface border-border-line hover:bg-bg-raise'
              }`}
            >
              <span className="text-xs font-bold font-display">{theme.label}</span>
              <div className="flex gap-1.5 mt-2">
                {theme.colors.map((color, idx) => (
                  <div key={idx} className="w-4 h-4 rounded-full border border-border-line" style={{ backgroundColor: color }} />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Typography Selection (5 Options) */}
      <div className="flat-card p-6 border border-border-line space-y-4">
        <div className="flex items-center gap-3">
          <Type className="text-phase-teal" size={24} />
          <div>
            <h3 className="font-semibold text-text-main">System Typography</h3>
            <p className="text-xs text-text-faint">Configure the default typeface structure of the app</p>
          </div>
        </div>
        <div className="space-y-3 pt-2">
          {TYPOGRAPHIES.map(type => (
            <button
              key={type.id}
              onClick={() => {
                playClick();
                setActiveFont(type.id);
              }}
              className={`w-full p-4 rounded-xl border text-left cursor-pointer transition-all flex justify-between items-center ${
                activeFont === type.id
                  ? 'bg-phase-teal/10 border-phase-teal/40 text-phase-teal'
                  : 'bg-surface border-border-line hover:bg-bg-raise'
              }`}
            >
              <div>
                <span className={`text-base font-bold ${type.fontClass}`}>{type.label}</span>
                <span className="text-[10px] text-text-faint block mt-0.5">{type.desc}</span>
              </div>
              {activeFont === type.id && <CheckCircle className="text-phase-teal" size={18} />}
            </button>
          ))}
        </div>
      </div>

      {/* Reminders Section */}
      <div className="flat-card p-6 border border-border-line space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="text-phase-teal" size={24} />
            <div>
              <h3 className="font-semibold text-text-main">Study Reminders (4x Daily)</h3>
              <p className="text-xs text-text-faint">Receive notifications to keep your streak active</p>
            </div>
          </div>
          <button
            onClick={handleToggleReminders}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              remindersEnabled ? 'bg-phase-teal' : 'bg-bg-raise'
            }`}
          >
            <div
              className={`bg-surface w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                remindersEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {remindersEnabled && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border-line animate-slide-up">
            {reminderTimes.map((time, idx) => (
              <div key={idx} className="space-y-1">
                <label className="text-[10px] font-mono text-text-faint uppercase">Reminder #{idx + 1}</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => handleTimeChange(idx, e.target.value)}
                  className="w-full bg-bg-main border border-border-line rounded-lg p-2 text-text-main text-sm focus:outline-none focus:border-phase-teal"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Study Goals Section */}
      <div className="flat-card p-6 border border-border-line space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="text-phase-amber" size={24} />
          <div>
            <h3 className="font-semibold text-text-main">Daily Study Target</h3>
            <p className="text-xs text-text-faint">Set your focus timer goal in minutes</p>
          </div>
        </div>
        <div className="flex items-center gap-4 pt-2">
          <input
            type="range"
            min="15"
            max="180"
            step="15"
            value={studyGoal}
            onChange={(e) => {
              playClick();
              setStudyGoal(parseInt(e.target.value, 10));
            }}
            className="flex-1 accent-phase-amber cursor-pointer"
          />
          <span className="text-sm font-bold font-mono text-phase-amber bg-phase-amber/10 px-3 py-1.5 rounded-lg border border-phase-amber/25">
            {studyGoal} mins
          </span>
        </div>
      </div>

      {/* Interactive Sound Settings */}
      <div className="flat-card p-6 border border-border-line flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Volume2 className="text-phase-violet" size={24} />
          <div>
            <h3 className="font-semibold text-text-main">UI Sound Effects</h3>
            <p className="text-xs text-text-faint">Enable arpeggio completion chimes and navigation clicks</p>
          </div>
        </div>
        <button
          onClick={() => {
            playClick();
            setSoundEnabled(!soundEnabled);
          }}
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
            soundEnabled ? 'bg-phase-violet' : 'bg-bg-raise'
          }`}
        >
          <div
            className={`bg-surface w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
              soundEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* AI Tutoring Persona Selector */}
      <div className="flat-card p-6 border border-border-line space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="text-phase-teal" size={24} />
          <div>
            <h3 className="font-semibold text-text-main">AI Companion Tutoring Persona</h3>
            <p className="text-xs text-text-faint">Change the guidance tone of your Mascot study assistant</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { id: 'coach', title: 'Coach', desc: 'Encouraging, active & pushy' },
            { id: 'mentor', title: 'Mentor', desc: 'Insightful, gentle & guiding' },
            { id: 'academic', title: 'Academic', desc: 'Precise, rigorous & Socratic' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => {
                playClick();
                setTutorPersonality(p.id);
              }}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                tutorPersonality === p.id
                  ? 'bg-phase-violet/10 border-phase-violet/40 text-phase-violet'
                  : 'bg-surface border-border-line hover:bg-bg-raise'
              }`}
            >
              <div className="text-xs font-bold">{p.title}</div>
              <div className="text-[10px] text-text-faint mt-1 leading-snug">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Math Complexity Show/Hide Toggle */}
      <div className="flat-card p-6 border border-border-line flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sliders className="text-phase-amber" size={24} />
          <div>
            <h3 className="font-semibold text-text-main">LaTeX Math Formulas</h3>
            <p className="text-xs text-text-faint">Show or hide complex mathematical proofs/formulas in lessons</p>
          </div>
        </div>
        <button
          onClick={() => {
            playClick();
            setMathPref(!mathPref);
          }}
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
            mathPref ? 'bg-phase-amber' : 'bg-bg-raise'
          }`}
        >
          <div
            className={`bg-surface w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
              mathPref ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* GitHub Portfolio Integration */}
      <div className="flat-card p-6 border border-border-line space-y-4">
        <div className="flex items-center gap-3">
          <GithubIcon className="text-phase-violet" size={24} />
          <div>
            <h3 className="font-semibold text-text-main">GitHub Portfolio Integration</h3>
            <p className="text-xs text-text-faint">Link your GitHub profile to import repositories and auto-verify project submissions</p>
          </div>
        </div>

        {progress._githubUser ? (
          <div className="p-4 bg-bg-raise rounded-xl border border-border-line flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <img
                src={progress._githubUser.avatarUrl}
                alt={progress._githubUser.username}
                className="w-10 h-10 rounded-full border border-border-strong"
              />
              <div>
                <div className="text-sm font-bold text-text-main flex items-center gap-1.5">
                  {progress._githubUser.name}
                  <span className="text-[10px] bg-phase-teal/10 text-phase-teal border border-phase-teal/20 px-1.5 py-0.5 rounded font-mono font-bold">
                    CONNECTED
                  </span>
                </div>
                <div className="text-xs text-text-dim">@{progress._githubUser.username}</div>
              </div>
            </div>
            <button
              onClick={() => {
                playClick();
                disconnectGithub();
              }}
              className="px-4 py-2 border border-border-strong rounded-xl text-xs font-bold text-text-dim hover:text-phase-brick hover:border-phase-brick/30 transition-colors cursor-pointer"
            >
              Disconnect Account
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-text-dim">
              Enter your GitHub username to show your profile on your portfolio and CV.
              Only public information is used, and no password or token is needed.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="your-github-username"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                maxLength={40}
                autoComplete="off"
                className="flex-1 bg-bg-main border border-border-line rounded-xl px-4 py-2 text-sm text-text-main focus:outline-none focus:border-phase-violet placeholder:text-text-faint font-mono"
              />
              <button
                onClick={handleConnectGithub}
                disabled={isConnectingGithub}
                className="bg-phase-violet hover:bg-phase-violet/85 text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isConnectingGithub ? <Loader2 size={14} className="animate-spin" /> : null}
                Connect
              </button>
            </div>

            {githubError && (
              <p className="text-xs text-phase-brick font-semibold">{githubError}</p>
            )}
          </div>
        )}
      </div>

      {/* Learning profile usernames */}
      <div className="flat-card p-6 border border-border-line space-y-4">
        <div className="flex items-center gap-3">
          <Globe className="text-phase-teal" size={24} />
          <div>
            <h3 className="font-semibold text-text-main">Learning Profiles</h3>
            <p className="text-xs text-text-faint">Add your usernames so your profile and CV can link to them. Progress is not imported from these sites; tick items off yourself.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {PLATFORM_CONFIGS.map(plat => (
            <div className="space-y-1" key={plat.key}>
              <label className="text-[11px] font-bold text-text-dim">{plat.label}</label>
              <input
                type="text"
                placeholder={plat.placeholder}
                value={profileState[plat.key] || ''}
                onChange={(e) => handleProfileValChange(plat.key, e.target.value)}
                className="w-full bg-bg-main border border-border-line rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:border-phase-teal placeholder:text-text-faint"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border-line flex-wrap gap-3">
          {syncSuccess ? (
            <div className="flex items-center gap-2 text-phase-teal text-xs font-semibold animate-bounce-in">
              <Check size={14} /> Usernames saved.
            </div>
          ) : (
            <div />
          )}

          <button
            onClick={handleSyncProfiles}
            disabled={isSyncing}
            className="bg-phase-teal hover:bg-phase-teal/85 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSyncing ? <Loader2 size={12} className="animate-spin" /> : null}
            {isSyncing ? 'Saving...' : 'Save usernames'}
          </button>
        </div>
      </div>

      {/* Onboarding & Diagnostics */}
      <div className="flat-card p-6 border border-border-line space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="text-phase-amber" size={24} />
          <div>
            <h3 className="font-semibold text-text-main">Guided Tour</h3>
            <p className="text-xs text-text-faint">Replay the short guided tour of the app</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              playClick();
              localStorage.removeItem('onboarding-completed');
              window.location.reload();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-phase-violet/10 text-phase-violet hover:bg-phase-violet/20 transition-colors cursor-pointer"
          >
            Relaunch Onboarding Tutorial
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="flat-card p-6 border border-phase-brick/20 bg-phase-brick/5 space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="text-phase-brick" size={24} />
          <div>
            <h3 className="font-semibold text-phase-brick">Danger Zone</h3>
            <p className="text-xs text-text-faint">Actions that permanently remove your data</p>
          </div>
        </div>
        <button
          onClick={handleResetProgress}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-phase-brick hover:bg-phase-brick/80 text-white transition-colors cursor-pointer"
        >
          <Trash2 size={14} />
          Reset All Roadmap Progress
        </button>

        {currentUser && (
          <div className="border-t border-phase-brick/20 pt-4 space-y-2">
            <h4 className="font-semibold text-sm text-text-main">Delete my account</h4>
            <p className="text-xs text-text-dim">
              Permanently deletes your account, progress, leaderboard entry and everything you posted
              (stories, questions, answers, comments and study-room messages). This cannot be undone.
              Google will ask you to confirm it's you.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE to confirm"
                aria-label="Type DELETE to confirm"
                className="flex-1 bg-bg-main border border-border-line rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:border-phase-brick"
              />
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || isDeleting}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-phase-brick hover:bg-phase-brick/80 text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete my account
              </button>
            </div>
            {deleteError && <p className="text-xs text-phase-brick font-semibold">{deleteError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
