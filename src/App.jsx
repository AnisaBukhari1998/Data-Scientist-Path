import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';

/* ── Eager: always-mounted shell chrome + the default "/" landing page ── */
import { StreakCalendar } from './components/StreakCalendar';
import { ThemeToggle } from './components/ThemeToggle';
import { CircularProgress } from './components/CircularProgress';
import { Avatar3D } from './components/Avatar3D';
import { ParticleBackground } from './components/ParticleBackground';
import { LevelUpOverlay } from './components/LevelUpOverlay';
import { SearchModal } from './components/SearchModal';
import { OnboardingTutorial, WarmupSuggestion } from './components/OnboardingTutorial';
import { DailyChallenge } from './components/DailyChallenge';
import {
  BookOpen, Clock, Target, Menu, X, LogIn, LogOut, User, UserPlus,
  BrainCircuit, Award, ChevronLeft, ChevronRight,
  Video, Book, Globe, LayoutTemplate, GraduationCap, Trophy,
  Flame, Sparkles, Search, BarChart3, Sliders, Briefcase, Code, MessageSquare, GitFork,
  Loader2, Calendar
} from 'lucide-react';
import { PHASES } from './data/roadmap';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { LoginModal } from './components/LoginModal';
import { QuizModal } from './components/QuizModal';
import { TRACKS } from './components/TrackSelector';
import { AICopilot } from './components/AICopilot';
import { MascotWidget } from './components/MascotWidget';
import { PersonalizationSurvey } from './components/PersonalizationSurvey';
import { AppLogo } from './components/AppLogo';
import { ProjectProgressTracker } from './components/ProjectProgressTracker';
import { PdfViewerModal } from './components/PdfViewerModal';

/* ── Lazy: only fetched when the matching route is actually visited ──
   This is what shrinks the initial bundle — none of this code (or the
   data it pulls in) ships until someone navigates to that page. */
const VelocityDashboard = lazy(() => import('./components/VelocityDashboard').then(m => ({ default: m.VelocityDashboard })));
const SkillTree = lazy(() => import('./components/SkillTree').then(m => ({ default: m.SkillTree })));
const PhaseDetail = lazy(() => import('./components/PhaseDetail').then(m => ({ default: m.PhaseDetail })));
const FocusTimer = lazy(() => import('./components/FocusTimer').then(m => ({ default: m.FocusTimer })));
const Flashcards = lazy(() => import('./components/Flashcards').then(m => ({ default: m.Flashcards })));
const MockInterview = lazy(() => import('./components/MockInterview').then(m => ({ default: m.MockInterview })));
const Settings = lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));
const SuccessStories = lazy(() => import('./components/SuccessStories').then(m => ({ default: m.SuccessStories })));
const JobBoard = lazy(() => import('./components/JobBoard').then(m => ({ default: m.JobBoard })));
const PythonTerminal = lazy(() => import('./components/PythonTerminal').then(m => ({ default: m.PythonTerminal })));
const MasterCapstone = lazy(() => import('./components/MasterCapstone').then(m => ({ default: m.MasterCapstone })));
const Community = lazy(() => import('./components/Community').then(m => ({ default: m.Community })));
const PortfolioGenerator = lazy(() => import('./components/PortfolioGenerator').then(m => ({ default: m.PortfolioGenerator })));
const ArchitectureCanvas = lazy(() => import('./components/ArchitectureCanvas').then(m => ({ default: m.ArchitectureCanvas })));
const Leaderboard = lazy(() => import('./components/Leaderboard').then(m => ({ default: m.Leaderboard })));
const FiveYearPlan = lazy(() => import('./components/FiveYearPlan').then(m => ({ default: m.FiveYearPlan })));
const UserProfile = lazy(() => import('./components/UserProfile').then(m => ({ default: m.UserProfile })));

/* ── Fallback shown in the main content area while a lazy route loads ── */
function RouteLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 size={28} className="animate-spin text-phase-violet" />
    </div>
  );
}

/* ─── Phase Color Mapping ─── */
const PHASE_COLORS = {
  'phase-teal': 'bg-phase-teal',
  'phase-amber': 'bg-phase-amber',
  'phase-violet': 'bg-phase-violet',
  'phase-brick': 'bg-phase-brick',
  'phase-rose': 'bg-phase-rose',
  'phase-gold': 'bg-phase-gold',
};

const PHASE_TEXT_COLORS = {
  'phase-teal': 'text-phase-teal',
  'phase-amber': 'text-phase-amber',
  'phase-violet': 'text-phase-violet',
  'phase-brick': 'text-phase-brick',
  'phase-rose': 'text-phase-rose',
  'phase-gold': 'text-phase-gold',
};

const PHASE_RING_COLORS = {
  'phase-teal': 'var(--teal)',
  'phase-amber': 'var(--amber)',
  'phase-violet': 'var(--violet)',
  'phase-brick': 'var(--brick)',
  'phase-rose': 'var(--rose)',
  'phase-gold': 'var(--gold)',
};

/* ─── Category Icons ─── */
const CATEGORY_ICONS = {
  courses: GraduationCap,
  books: Book,
  videos: Video,
  websites: Globe,
  projects: LayoutTemplate,
  certs: Trophy,
};

/* ─── Navigation Items ─── */
const NAV_ITEMS = [
  // 1. Core Study & Curriculum
  { to: '/', icon: BookOpen, label: 'Roadmap', color: 'phase-amber' },
  { to: '/plan', icon: Calendar, label: '5-Year Plan', color: 'phase-teal' },
  { to: '/skills', icon: Sparkles, label: 'Skill Tree', color: 'phase-brick' },
  { to: '/focus', icon: Clock, label: 'Focus Forest', color: 'phase-teal' },
  { to: '/flashcards', icon: BrainCircuit, label: 'Flashcards', color: 'phase-violet' },
  { to: '/sandbox', icon: Code, label: 'Sandbox', color: 'phase-violet' },
  { to: '/architecture', icon: GitFork, label: 'Pipelines', color: 'phase-brick' },
  { to: '/capstone', icon: Trophy, label: 'Capstone', color: 'phase-gold' },

  // 2. Classrooms & Peer Engagement
  { to: '/leaderboard', icon: Trophy, label: 'Rankings', color: 'phase-gold' },
  { to: '/community', icon: MessageSquare, label: 'Community', color: 'phase-violet' },

  // 3. Career & Job Placement
  { to: '/interview', icon: Target, label: 'Interview Prep', color: 'phase-rose' },
  { to: '/portfolio', icon: User, label: 'Portfolio Builder', color: 'phase-teal' },
  { to: '/jobs', icon: Briefcase, label: 'Job Board', color: 'phase-rose' },
  { to: '/success', icon: Award, label: 'Success Stories', color: 'phase-rose' },

  // 4. Personal Progress & Admin
  { to: '/dashboard', icon: BarChart3, label: 'Analytics', color: 'phase-gold' },
  { to: '/settings', icon: Sliders, label: 'Settings', color: 'phase-violet' },
];

/* ═══════════════════════════════════════════════════════════════════
   APP CONTENT — Main shell with sidebar, theme, routing
   ═══════════════════════════════════════════════════════════════════ */
function AppContent() {
  /* ── Theme Management ── */
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('theme-mode') || 'system';
  });

  const resolveIsDark = useCallback((mode) => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, []);

  const [darkMode, setDarkMode] = useState(() => resolveIsDark(themeMode));

  const handleThemeModeChange = useCallback((mode) => {
    setThemeMode(mode);
    setDarkMode(resolveIsDark(mode));
  }, [resolveIsDark]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  /* ── Dynamic Layout Engine (Themes & Fonts) ── */
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('active-theme') || 'default';
  });

  const [activeFont, setActiveFont] = useState(() => {
    return localStorage.getItem('active-font') || 'inter';
  });

  useEffect(() => {
    const handleSettingsChange = () => {
      const theme = localStorage.getItem('active-theme') || 'default';
      const font = localStorage.getItem('active-font') || 'inter';
      setActiveTheme(theme);
      setActiveFont(font);
    };
    window.addEventListener('settings-changed', handleSettingsChange);
    return () => window.removeEventListener('settings-changed', handleSettingsChange);
  }, []);

  // Propagate font classes and theme classes directly to the root element for index.css mapping
  useEffect(() => {
    // 1. Handle fonts
    const fontClasses = ['font-inter', 'font-grotesk', 'font-outfit', 'font-fira', 'font-jetbrains'];
    fontClasses.forEach(c => document.documentElement.classList.remove(c));
    document.documentElement.classList.add(`font-${activeFont}`);

    // 2. Handle themes
    const themePrefix = 'theme-';
    const classList = Array.from(document.documentElement.classList);
    classList.forEach(c => {
      if (c.startsWith(themePrefix)) {
        document.documentElement.classList.remove(c);
      }
    });
    if (activeTheme !== 'default') {
      document.documentElement.classList.add(`theme-${activeTheme}`);
    }
  }, [activeFont, activeTheme]);

  /* ── Sidebar State ── */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  /* ── Auth & Login ── */
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  /* ── Search Modal ── */
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  /* ── Onboarding ── */
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('onboarding-completed');
  });

  /* ── Warmup suggestion (7+ days inactive) ── */
  const [isReviveQuizOpen, setIsReviveQuizOpen] = useState(false);
  const [daysInactive, setDaysInactive] = useState(() => {
    const lastVisit = localStorage.getItem('last-visit-date');
    if (!lastVisit) return 0;
    return Math.floor((Date.now() - new Date(lastVisit).getTime()) / 86400000);
  });

  const [showWarmup, setShowWarmup] = useState(() => {
    const lastVisit = localStorage.getItem('last-visit-date');
    if (!lastVisit) return false;
    const daysSince = (Date.now() - new Date(lastVisit).getTime()) / 86400000;
    return daysSince >= 7;
  });

  useEffect(() => {
    // Only update if not currently showing warmup/revive options, to allow testing refreshes
    localStorage.setItem('last-visit-date', new Date().toISOString());
  }, []);

  /* ── Cmd+K shortcut ── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* ─── Daily Study Reminders Scheduler ─── */
  useEffect(() => {
    const checkReminders = () => {
      const remindersEnabled = localStorage.getItem('reminders-enabled') === 'true';
      if (!remindersEnabled) return;

      const now = new Date();
      const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const savedTimes = localStorage.getItem('reminder-times');
      const reminderTimes = savedTimes ? JSON.parse(savedTimes) : ['09:00', '13:00', '17:00', '21:00'];

      if (reminderTimes.includes(currentHourMin)) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification('Time to Study! 📚', {
            body: 'Keep your streak alive. Open the Roadmap to complete today\'s target!',
            icon: '/favicon.svg'
          });
        }
      }
    };

    // Check immediately, then every 60 seconds
    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  /* ── Progress ── */
  const location = useLocation();
  const { progress, loading: progressLoading, activePdf, closePdf } = useProgress();

  let totalItems = 0;
  let completedItems = 0;
  PHASES.forEach(phase => {
    const categories = ['courses', 'books', 'videos', 'websites', 'projects', 'certs'];
    categories.forEach(catKey => {
      if (phase[catKey]) {
        totalItems += phase[catKey].length;
        if (progress[phase.key]?.[catKey]) {
          const validChecked = progress[phase.key][catKey].filter(idx => idx < phase[catKey].length);
          completedItems += validChecked.length;
        }
      }
    });
  });
  const overallProgressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  /* Close sidebar on route change (mobile) */
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  /* Google Translate Widget */
  useEffect(() => {
    const initTranslate = () => {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        const container = document.getElementById('google_translate_element');
        if (container && container.innerHTML.trim() === '') {
          new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
        }
      }
    };

    const scriptId = 'google-translate-script';
    if (!document.getElementById(scriptId)) {
      window.googleTranslateElementInit = initTranslate;
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      initTranslate();
    }
  }, [location]);

  /* ── Active Route Detection ── */
  const isActiveRoute = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg-main">
      <ParticleBackground />
      <LevelUpOverlay />
      {/* ═══════ Mobile Header ═══════ */}
      <div className="md:hidden flex items-center justify-between p-4 glass border-b border-border-line animate-slide-up">
        <Link to="/" className="group flex items-center gap-3 hover:opacity-90 transition-opacity">
          <AppLogo size={36} className="group-hover:scale-120 group-hover:rotate-[360deg]" />
          <h1 className="text-sm font-bold font-display leading-tight">
            Data Scientist
            <br/>
            <span className="text-[10px] font-mono text-text-faint uppercase tracking-wider">Roadmap</span>
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle currentMode={themeMode} onModeChange={handleThemeModeChange} />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-text-main p-2 rounded-lg hover:bg-surface transition-colors"
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ═══════ Sidebar Navigation ═══════ */}
      <nav
        className={`
          fixed inset-y-0 left-0 z-20
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
          glass border-r border-border-line
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          md:relative flex flex-col
          ${isSidebarCollapsed ? 'p-3' : 'p-4'}
        `}
        aria-label="Main navigation"
      >
        {/* ── Sidebar Header (Desktop) ── */}
        <div className={`hidden md:flex flex-col mb-6 pb-4 border-b border-border-line space-y-3`}>
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isSidebarCollapsed ? (
              <Link to="/" className="group flex items-center gap-3 animate-fade-in hover:opacity-90 transition-opacity">
                <AppLogo size={32} className="group-hover:scale-120 group-hover:rotate-[360deg]" />
                <h1 className="text-sm font-bold font-display leading-tight">
                  Data Scientist
                  <br/>
                  <span className="text-[10px] font-mono text-text-faint uppercase tracking-wider">Roadmap</span>
                </h1>
              </Link>
            ) : (
              <Link to="/" className="group hover:opacity-90 transition-opacity flex justify-center w-full">
                <AppLogo size={36} className="group-hover:scale-120 group-hover:rotate-[360deg]" />
              </Link>
            )}
          </div>

          {/* User Profile / Auth integration at top-left corner */}
          <div className="animate-fade-in">
            {currentUser ? (
              isSidebarCollapsed ? (
                <Link 
                  to="/profile" 
                  className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-phase-violet/20 border border-phase-violet/30 hover:border-phase-violet transition-colors"
                  title="Profile Stats"
                >
                  {progress._customAvatar ? (
                    <Avatar3D config={progress._customAvatar} size={40} />
                  ) : currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
                  ) : (
                    <User size={18} className="text-phase-violet" />
                  )}
                </Link>
              ) : (
                <Link 
                  to="/profile" 
                  className="flex items-center justify-between p-2.5 bg-bg-raise hover:bg-surface-hover rounded-xl border border-border-line transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-7 h-7 rounded-full bg-phase-violet/20 flex items-center justify-center flex-shrink-0 border border-phase-violet/30 group-hover:border-phase-violet/60 transition-colors">
                      {progress._customAvatar ? (
                        <Avatar3D config={progress._customAvatar} size={28} />
                      ) : currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="Profile" className="w-7 h-7 rounded-full" />
                      ) : (
                        <User size={14} className="text-phase-violet" />
                      )}
                    </div>
                    <div className="flex flex-col items-start overflow-hidden">
                      <span className="text-xs font-semibold text-text-main truncate w-32 group-hover:text-phase-violet transition-colors">
                        {currentUser.displayName || 'My Profile'}
                      </span>
                      <span className="text-[9px] font-mono text-text-faint uppercase tracking-wider">
                        View Stats &rarr;
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                    className="p-1 text-text-faint hover:text-phase-brick transition-colors rounded-md hover:bg-surface"
                    title="Sign Out"
                  >
                    <LogOut size={14} />
                  </button>
                </Link>
              )
            ) : (
              isSidebarCollapsed ? (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl bg-phase-violet/10 border border-phase-violet/20 hover:bg-phase-violet/20 hover:border-phase-violet/40 transition-all text-phase-violet cursor-pointer"
                  title="Sign In"
                >
                  <LogIn size={18} />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-phase-violet/10 hover:bg-phase-violet/20 text-phase-violet border border-phase-violet/20 hover:border-phase-violet/40 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogIn size={14} />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-phase-amber/15 hover:bg-phase-amber/25 text-phase-amber border border-phase-amber/20 hover:border-phase-amber/40 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus size={14} />
                    <span>Sign Up</span>
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* ── Theme Toggle (Desktop) ── */}
        <div className={`hidden md:flex ${isSidebarCollapsed ? 'justify-center' : ''} mb-4`}>
          <ThemeToggle currentMode={themeMode} onModeChange={handleThemeModeChange} />
        </div>

        {/* ── Google Translate Widget ── */}
        {!isSidebarCollapsed && (
          <div className="mb-4 px-1 animate-fade-in">
            <div id="google_translate_element"></div>
          </div>
        )}

        {/* ── Navigation Links ── */}
        <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
          {!isSidebarCollapsed && (
            <div className="text-[10px] uppercase tracking-[0.12em] text-text-faint font-mono px-3 py-2">
              Menu
            </div>
          )}
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`
              w-full flex items-center gap-3 rounded-xl transition-all duration-200 text-left cursor-pointer
              ${isSidebarCollapsed ? 'justify-center p-3' : 'p-3 px-4 mb-2'}
              bg-bg-raise hover:bg-surface text-text-dim hover:text-text-main border border-border-line
            `}
            title={isSidebarCollapsed ? 'Search (Cmd+K)' : undefined}
          >
            <Search size={isSidebarCollapsed ? 22 : 18} className="text-text-faint" />
            {!isSidebarCollapsed && (
              <div className="flex-1 flex justify-between items-center">
                <span className="text-sm font-medium">Search...</span>
                <kbd className="text-[9px] font-mono bg-surface border border-border-line px-1 rounded text-text-faint">
                  ⌘K
                </kbd>
              </div>
            )}
          </button>
          {NAV_ITEMS.map(({ to, icon: Icon, label, color }) => {
            const active = isActiveRoute(to);
            return (
              <Link
                key={to}
                to={to}
                className={`
                  flex items-center gap-3 rounded-xl transition-all duration-200 group
                  ${isSidebarCollapsed ? 'justify-center p-3' : 'p-3 px-4'}
                  ${active
                    ? `bg-surface shadow-sm border border-border-line ${PHASE_TEXT_COLORS[color] || 'text-text-main'}`
                    : 'text-text-dim hover:bg-surface/50 hover:text-text-main'
                  }
                `}
                title={isSidebarCollapsed ? label : undefined}
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  size={isSidebarCollapsed ? 22 : 18}
                  className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`}
                />
                {!isSidebarCollapsed && (
                  <span className="text-sm font-medium">{label}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Mascot Widget ── */}
        {!isSidebarCollapsed && (
          <div className="mb-4 px-1 animate-fade-in">
            <MascotWidget />
          </div>
        )}

        {/* ── Overall Progress ── */}
        <div className={`mt-auto pt-4 border-t border-border-line ${isSidebarCollapsed ? 'flex justify-center' : 'px-2'}`}>
          {isSidebarCollapsed ? (
            <CircularProgress
              percent={overallProgressPercent}
              size={48}
              strokeWidth={4}
              color="var(--violet)"
            />
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] font-mono text-text-faint uppercase tracking-[0.08em]">
                  Overall Progress
                </div>
                <div className="text-xs font-bold text-text-main">{overallProgressPercent}%</div>
              </div>
              <div className="h-2 rounded-full bg-bg-main overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-phase-violet to-phase-rose rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${overallProgressPercent}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-text-faint mt-1.5">
                {completedItems} of {totalItems} items
              </div>
            </div>
          )}
        </div>



        {/* ── Collapse Toggle (Desktop) ── */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex items-center justify-center mt-3 p-2 rounded-lg text-text-faint hover:text-text-dim hover:bg-surface transition-all"
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </nav>

      {/* ═══════ Mobile Sidebar Overlay ═══════ */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 md:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ═══════ Bottom Tab Bar (Mobile) ═══════ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-border-line flex justify-around py-2 px-1 z-30">
        {/* First 5 menu items: adding 5-Year Plan would otherwise push Flashcards off the bar */}
        {NAV_ITEMS.slice(0, 5).map(({ to, icon: Icon, label, color }) => {
          const active = isActiveRoute(to);
          return (
            <Link
              key={to}
              to={to}
              className={`
                flex flex-col items-center gap-0.5 px-1.5 py-1.5 rounded-xl transition-all duration-200 min-w-0
                ${active
                  ? `${PHASE_TEXT_COLORS[color] || 'text-text-main'} scale-105`
                  : 'text-text-faint hover:text-text-dim'
                }
              `}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
              <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* ═══════ Main Content Area ═══════ */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto pb-24 md:pb-12 bg-bg-main relative">
        <div className="animate-fade-in">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Roadmap />} />
              <Route path="/dashboard" element={<VelocityDashboard />} />
              <Route path="/phase/:phaseId" element={<PhaseDetail />} />
              <Route path="/focus" element={<FocusTimer />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/skills" element={<SkillTree />} />
              <Route path="/interview" element={<MockInterview />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/success" element={<SuccessStories />} />
              <Route path="/jobs" element={<JobBoard />} />
              <Route path="/sandbox" element={<PythonTerminal />} />
              <Route path="/capstone" element={<MasterCapstone />} />
              <Route path="/community" element={<Community />} />
              <Route path="/portfolio" element={<PortfolioGenerator />} />
              <Route path="/architecture" element={<ArchitectureCanvas />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/plan" element={<FiveYearPlan />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      {showOnboarding && <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />}
      {showWarmup && (
        <WarmupSuggestion 
          onDismiss={() => setShowWarmup(false)} 
          daysInactive={daysInactive}
          onStartReviveQuiz={() => {
            setShowWarmup(false);
            setIsReviveQuizOpen(true);
          }}
        />
      )}
      <QuizModal 
        isOpen={isReviveQuizOpen} 
        onClose={() => setIsReviveQuizOpen(false)} 
        phaseKey="revive" 
        phaseTitle="Revive Knowledge Quiz" 
      />
      <AICopilot />
      {/* Wait until saved progress has loaded, or the survey flashes up for people who already finished it */}
      <PersonalizationSurvey isOpen={!progressLoading && !progress._onboardingCompleted} />
      <PdfViewerModal pdf={activePdf} onClose={closePdf} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   COMMIT GRID — GitHub-style progress grid
   ═══════════════════════════════════════════════════════════════════ */
function CommitGrid() {
  const { progress, toggleItem } = useProgress();
  const allItems = [];

  PHASES.forEach(phase => {
    const categories = ['courses', 'books', 'videos', 'websites', 'projects', 'certs'];
    categories.forEach(catKey => {
      if (phase[catKey]) {
        phase[catKey].forEach((item, idx) => {
          const isCompleted = progress[phase.key]?.[catKey]?.includes(idx);
          const title = item[0] || 'Resource';
          allItems.push({ phase, catKey, idx, isCompleted, title });
        });
      }
    });
  });

  return (
    <div className="mb-12 animate-slide-up stagger-2">
      <div className="text-xs font-mono text-text-faint uppercase tracking-[0.12em] mb-4 flex items-center gap-2">
        <Flame size={14} className="text-phase-amber" />
        Overall Progress Tracking
      </div>
      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {allItems.map((item, i) => (
          <button
            key={i}
            onClick={() => toggleItem(item.phase.key, item.catKey, item.idx)}
            className={`
              w-4 h-4 md:w-[18px] md:h-[18px] rounded-[4px] border transition-all duration-200
              hover:scale-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-phase-violet/30
              ${item.isCompleted
                ? `${PHASE_COLORS[item.phase.color]} border-transparent shadow-sm`
                : 'bg-bg-raise border-border-line hover:border-border-strong'
              }
            `}
            title={item.isCompleted ? `✓ ${item.title}` : `Mark: ${item.title}`}
            aria-label={item.isCompleted ? `Completed: ${item.title}` : `Mark complete: ${item.title}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROADMAP — Home page with phase cards
   ═══════════════════════════════════════════════════════════════════ */
function Roadmap() {
  const { progress, getPhaseProgress } = useProgress();
  const { currentUser } = useAuth();

  const activeTrackId = localStorage.getItem('active-track') || 'ds';
  const activeTrack = TRACKS.find(t => t.id === activeTrackId) || TRACKS[0];

  // Calculate XP values
  const xp = progress._xp || 0;
  const level = progress._level || 1;
  const prevLevelXp = (level - 1) * 100;
  const levelProgressXp = xp - prevLevelXp;
  const levelPercent = Math.min(100, Math.max(0, Math.round((levelProgressXp / 100) * 100)));

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header with integrated profile banner */}
      <header className="flat-card p-6 border border-border-line relative overflow-hidden flex flex-col md:flex-row items-center md:items-start justify-between gap-6 animate-slide-up">
        <div className="space-y-3 text-center md:text-left flex-1">
          <h1 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-phase-violet via-phase-rose to-phase-amber bg-clip-text text-transparent leading-tight">
            Welcome back, {currentUser?.displayName || progress._githubUser?.name || (currentUser?.email ? currentUser.email.split('@')[0] : 'Data Science Scholar')}! 🚀
          </h1>
          <p className="text-sm text-text-dim max-w-xl leading-relaxed">
            Customize HSL themes, review code models, complete phase challenges, and build a portfolio of real projects.
          </p>
          <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
            <span className="text-xs font-semibold text-phase-violet bg-phase-violet/10 border border-phase-violet/25 px-2.5 py-1 rounded-lg">
              🎯 Specialization: {activeTrack.name}
            </span>
            <span className="text-xs font-bold text-phase-amber bg-phase-amber/10 border border-phase-amber/25 px-2.5 py-1 rounded-lg">
              🔥 Lvl {level} Scholar
            </span>
          </div>
        </div>

        {/* Mini Level Tracker & view button */}
        <div className="w-full md:w-64 bg-bg-raise border border-border-line rounded-2xl p-4 space-y-3 flex-shrink-0">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-text-faint">Level {level} Progress</span>
            <span className="font-bold text-text-main">{levelPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-bg-main overflow-hidden border border-border-line">
            <div 
              className="h-full bg-gradient-to-r from-phase-violet to-phase-rose rounded-full transition-all duration-500" 
              style={{ width: `${levelPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-[10px] font-mono text-text-faint">{xp} XP Total</span>
            <Link to="/profile" className="text-[10px] font-mono font-bold text-phase-violet hover:underline flex items-center gap-0.5">
              View Profile details →
            </Link>
          </div>
        </div>
      </header>

      {/* Streak Calendar & Daily Challenge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 animate-slide-up stagger-1">
          <StreakCalendar />
        </div>
        <div className="animate-slide-up stagger-2">
          <DailyChallenge />
        </div>
      </div>

      {/* Commit Grid */}
      <CommitGrid />

      {/* Project & Overall Progress Tracker */}
      <div className="animate-slide-up stagger-3">
        <ProjectProgressTracker />
      </div>

      {/* Phase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PHASES.map((phase, index) => {
          const categories = [phase.courses, phase.books, phase.videos, phase.websites, phase.projects, phase.certs].filter(Boolean);
          const phaseTotal = categories.reduce((acc, cat) => acc + (cat?.length || 0), 0);
          const isInTrack = activeTrack.phases.includes(phase.key);

          const progressPercent = getPhaseProgress(phase.key);
          const phaseCompleted = Math.round((progressPercent / 100) * phaseTotal);
          const isPassed = progress[phase.key]?.quizPassed;

          /* Count items per category for icons */
          const categoryCounts = {};
          ['courses', 'books', 'videos', 'projects'].forEach(k => {
            if (phase[k]?.length) categoryCounts[k] = phase[k].length;
          });

          return (
            <Link
              key={phase.id}
              to={`/phase/${phase.key}`}
              className={`
                group flex flex-col flat-card p-7 md:p-8
                border border-border-line
                animate-slide-up
                ${isPassed ? 'ring-2 ring-phase-gold/40 border-phase-gold/30' : ''}
                ${!isInTrack ? 'opacity-50 hover:opacity-85 saturate-[0.15] hover:saturate-100' : ''}
              `}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              {/* Phase Header */}
              <div className="flex justify-between items-start mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold bg-bg-raise text-text-dim uppercase tracking-wider">
                  {phase.months}
                </span>
                {!isInTrack && (
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-text-faint px-2 py-0.5 bg-bg-raise border border-border-line rounded-md">
                    Optional Track
                  </span>
                )}
                <div className={`h-2.5 w-2.5 rounded-full ${PHASE_COLORS[phase.color]} shadow-sm transition-transform group-hover:scale-125`}></div>
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-display font-bold mb-3 flex items-center justify-between group-hover:text-phase-violet transition-colors">
                <span>{phase.title.split('—')[0].trim()}</span>
                {isPassed && <Award className="text-phase-gold animate-bounce-in" size={22} />}
              </h2>

              {/* Description */}
              <p className="text-text-dim text-[15px] leading-relaxed flex-1 mb-4">{phase.focus}</p>

              {/* Category Icons Row */}
              <div className="flex items-center gap-3 mb-6">
                {Object.entries(categoryCounts).map(([cat, count]) => {
                  const CatIcon = CATEGORY_ICONS[cat];
                  return CatIcon ? (
                    <div key={cat} className="flex items-center gap-1 text-text-faint" title={`${count} ${cat}`}>
                      <CatIcon size={14} />
                      <span className="text-[11px] font-mono">{count}</span>
                    </div>
                  ) : null;
                })}
              </div>

              {/* Progress Section */}
              <div className="pt-5 border-t border-border-line">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold mb-1">{progressPercent}% completed</div>
                    <div className="text-[11px] text-text-faint">{phaseCompleted} / {phaseTotal} items</div>
                  </div>
                  <CircularProgress
                    percent={progressPercent}
                    size={56}
                    strokeWidth={5}
                    color={PHASE_RING_COLORS[phase.color] || 'var(--violet)'}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROOT APP — Providers wrapper
   ═══════════════════════════════════════════════════════════════════ */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <AppContent />
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
