import { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { StreakCalendar } from './StreakCalendar';
import { Avatar3D } from './Avatar3D';
import { 
  Award, Shield, Flame, Clock, BrainCircuit, CheckCircle2, 
  Target, Briefcase, Globe, Lock, Settings, User, Sparkles, Trophy, BookOpen, ExternalLink, ChevronRight, Palette, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResumeBuilder } from './ResumeBuilder';
import { playClick } from '../utils/audioEngine';

const PLATFORMS = [
  { key: 'leetcodeUser', label: 'LeetCode', color: 'bg-orange-500/10 text-orange-500 border-orange-500/25', url: 'https://leetcode.com' },
  { key: 'kaggleUser', label: 'Kaggle', color: 'bg-sky-500/10 text-sky-500 border-sky-500/25', url: 'https://kaggle.com' },
  { key: 'huggingfaceUser', label: 'Hugging Face', color: 'bg-yellow-600/10 text-yellow-600 border-yellow-600/25', url: 'https://huggingface.co' },
  { key: 'mediumUser', label: 'Medium', color: 'bg-slate-800/10 text-slate-800 border-slate-800/25', url: 'https://medium.com' }
];

const DOMAINS = ['Healthcare', 'Finance', 'E-commerce', 'Climate/Energy', 'Logistics/Transit', 'Social Good', 'Agriculture', 'Entertainment'];
const TECHNIQUES = ['Large Language Models / RAG', 'Computer Vision / CNNs', 'Time-series Forecasting', 'Tabular Classification/Regression', 'Recommender Systems', 'Speech/Audio AI'];
const DEPLOYMENTS = ['FastAPI API & Docker Container', 'Interactive Streamlit Dashboard', 'React/Next.js Web Interface', 'WhatsApp/Telegram Bot Integration', 'Desktop App Shell (Electron)'];

export function UserProfile() {
  const { progress, saveCustomAvatar } = useProgress();
  const { currentUser } = useAuth();
  
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  
  // Calculate XP values
  const xp = progress._xp || 0;
  const level = progress._level || 1;
  const nextLevelXp = level * 100;
  const prevLevelXp = (level - 1) * 100;
  const levelProgressXp = xp - prevLevelXp;
  const levelPercent = Math.min(100, Math.max(0, Math.round((levelProgressXp / 100) * 100)));
  
  // Fetch active specialization track
  const track = localStorage.getItem('active-track') || 'ds';
  const trackLabels = {
    ds: 'General Data Scientist',
    finance: 'Finance Data Scientist',
    healthcare: 'Healthcare Data Scientist',
    agtech: 'AgTech Data Scientist',
  };
  
  // Calculate completed course items
  const getModulesCount = () => {
    let completed = 0;
    ['phase1', 'phase2', 'phase3', 'phase4', 'phase5'].forEach(pKey => {
      const p = progress[pKey] || {};
      ['courses', 'books', 'videos', 'websites', 'projects', 'certs'].forEach(cat => {
        if (p[cat]) {
          completed += p[cat].length;
        }
      });
    });
    return completed;
  };
  
  const connectedProfiles = progress._externalProfiles || {};

  // 3D Avatar Customization States
  const [showAvatarBuilder, setShowAvatarBuilder] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(() => progress._customAvatar || {
    skinColor: '#fbd3c3',
    eyes: 'happy',
    hair: 'sleek',
    clothing: 'hoodie',
    accessory: 'glasses',
    bgGradient: 'aurora'
  });

  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // 20 deg tilt
    const y = ((rect.top - e.clientY) / rect.height + 0.5) * 20;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Render the Customizer workspace
  if (showAvatarBuilder) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-border-line pb-4">
          <div>
            <h2 className="text-2xl font-bold font-display text-text-main flex items-center gap-2">
              <Sparkles size={22} className="text-phase-gold animate-float" />
              3D Avatar Studio
            </h2>
            <p className="text-xs text-text-dim">Build your digital data scientist alter-ego in real-time 3D</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAvatarBuilder(false)}
              className="px-4 py-2 border border-border-line bg-bg-raise hover:bg-surface text-text-dim hover:text-text-main rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                saveCustomAvatar(tempAvatar);
                setShowAvatarBuilder(false);
              }}
              className="px-5 py-2 bg-phase-violet hover:bg-phase-violet/85 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
            >
              Save Avatar
            </button>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 3D Interactive Preview Column */}
          <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-surface border border-border-line rounded-2xl shadow-sm space-y-6">
            <span className="text-[10px] font-mono font-bold text-text-faint uppercase tracking-wider">
              3D Interactive Preview
            </span>
            <div 
              className="p-8 bg-bg-raise border border-border-line rounded-3xl"
              style={{
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}
            >
              <Avatar3D config={tempAvatar} size={150} interactive={true} />
            </div>
            <p className="text-[10px] text-text-faint text-center max-w-[200px] italic leading-relaxed">
              Click and drag inside the avatar to rotate the 3D model on any axis!
            </p>
          </div>

          {/* Configuration Options Column */}
          <div className="md:col-span-2 flat-card p-6 border border-border-line bg-surface space-y-6">
            {/* Skin Tone Selector */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-text-main uppercase block">1. Skin Tone</span>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'Peach', color: '#fbd3c3' },
                  { name: 'Warm', color: '#e8a88a' },
                  { name: 'Bronze', color: '#c68a6c' },
                  { name: 'Dark', color: '#8d5b4c' },
                  { name: 'Alien Green', color: '#a3d9c9' }
                ].map(s => (
                  <button
                    key={s.color}
                    onClick={() => setTempAvatar(prev => ({ ...prev, skinColor: s.color }))}
                    className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer ${
                      tempAvatar.skinColor === s.color 
                        ? 'border-phase-violet scale-110 shadow-md' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: s.color }}
                    title={s.name}
                  />
                ))}
              </div>
            </div>

            {/* Background Selector */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-text-main uppercase block">2. Background Glow</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'aurora', label: 'Aurora 🌌' },
                  { key: 'cyberpunk', label: 'Cyberpunk 🌆' },
                  { key: 'teal', label: 'Neon Teal 🔮' },
                  { key: 'gold', label: 'Warm Gold ✨' },
                  { key: 'sunset', label: 'Sunset 🌅' },
                  { key: 'cool', label: 'Deep Void 🌌' }
                ].map(bg => (
                  <button
                    key={bg.key}
                    onClick={() => setTempAvatar(prev => ({ ...prev, bgGradient: bg.key }))}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                      tempAvatar.bgGradient === bg.key
                        ? 'bg-phase-gold/15 text-phase-gold border-phase-gold/40 shadow-sm'
                        : 'bg-bg-raise text-text-dim border-border-line hover:text-text-main'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Selector */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-text-main uppercase block">3. Hair & Headwear</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'sleek', label: 'Sleek Parting 💇‍♂️' },
                  { key: 'cap', label: 'Backward Cap 🧢' },
                  { key: 'headphones', label: 'Headphones 🎧' },
                  { key: 'beanie', label: 'Knit Beanie 🧶' },
                  { key: 'messy', label: 'Messy Spikes ⚡' },
                  { key: 'none', label: 'None 🧑‍🦲' }
                ].map(h => (
                  <button
                    key={h.key}
                    onClick={() => setTempAvatar(prev => ({ ...prev, hair: h.key }))}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                      tempAvatar.hair === h.key
                        ? 'bg-phase-violet/15 text-phase-violet border-phase-violet/40 shadow-sm'
                        : 'bg-bg-raise text-text-dim border-border-line hover:text-text-main'
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Expressions Selector */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-text-main uppercase block">4. Expression</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'happy', label: 'Happy 😊' },
                  { key: 'determined', label: 'Determined 💪' },
                  { key: 'cool', label: 'Cool 😎' },
                  { key: 'coding', label: 'Coding 🖥️' },
                  { key: 'sleepy', label: 'Sleepy 😴' },
                  { key: 'focused', label: 'Focused 🎯' }
                ].map(e => (
                  <button
                    key={e.key}
                    onClick={() => setTempAvatar(prev => ({ ...prev, eyes: e.key }))}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                      tempAvatar.eyes === e.key
                        ? 'bg-phase-teal/15 text-phase-teal border-phase-teal/40 shadow-sm'
                        : 'bg-bg-raise text-text-dim border-border-line hover:text-text-main'
                    }`}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clothing Selector */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-text-main uppercase block">5. Outfit</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'hoodie', label: 'Dev Hoodie 🧥' },
                  { key: 'tshirt', label: 'Tech T-Shirt 👕' },
                  { key: 'blazer', label: 'Blazer & Tie 👔' },
                  { key: 'sweater', label: 'Cozy Sweater 🧣' }
                ].map(c => (
                  <button
                    key={c.key}
                    onClick={() => setTempAvatar(prev => ({ ...prev, clothing: c.key }))}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                      tempAvatar.clothing === c.key
                        ? 'bg-phase-brick/15 text-phase-brick border-phase-brick/40 shadow-sm'
                        : 'bg-bg-raise text-text-dim border-border-line hover:text-text-main'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories Selector */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-text-main uppercase block">6. Extra Accessory</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'glasses', label: 'Developer Glasses 👓' },
                  { key: 'halo', label: 'AI Angel Halo 😇' },
                  { key: 'coffee', label: 'Coffee Cup Badge ☕' },
                  { key: 'none', label: 'None ❌' }
                ].map(acc => (
                  <button
                    key={acc.key}
                    onClick={() => setTempAvatar(prev => ({ ...prev, accessory: acc.key }))}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                      tempAvatar.accessory === acc.key
                        ? 'bg-phase-rose/15 text-phase-rose border-phase-rose/40 shadow-sm'
                        : 'bg-bg-raise text-text-dim border-border-line hover:text-text-main'
                    }`}
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Profile View
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header Bio Card */}
      <div className="flat-card p-6 md:p-8 border border-border-line relative overflow-hidden flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="absolute top-0 right-0 p-4">
          <Link to="/settings" className="text-text-faint hover:text-text-main transition-colors" title="Edit Settings">
            <Settings size={20} />
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          {/* Avatar frame */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-phase-violet to-phase-rose flex items-center justify-center shadow-xl overflow-hidden">
              {progress._customAvatar ? (
                <Avatar3D config={progress._customAvatar} size={96} />
              ) : currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Avatar" className="w-24 h-24 rounded-2xl object-cover" />
              ) : progress._githubUser?.avatarUrl ? (
                <img src={progress._githubUser.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-2xl object-cover" />
              ) : (
                <User size={40} className="text-white" />
              )}
            </div>
            <button
              onClick={() => setShowAvatarBuilder(true)}
              className="absolute inset-0 bg-black/40 text-white text-xs font-bold font-mono opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 rounded-2xl transition-opacity cursor-pointer"
            >
              <Sparkles size={14} className="animate-spin-slow" /> Customize
            </button>
            <div className="absolute -bottom-2 -right-2 bg-phase-violet text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded-lg border-2 border-surface shadow-md">
              LVL {level}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h2 className="text-2xl font-bold font-display text-text-main">
                {currentUser?.displayName || progress._githubUser?.name || currentUser?.email || 'Anonymous Student'}
              </h2>
              {progress._githubUser?.username && (
                <span className="text-[10px] bg-phase-violet/10 text-phase-violet border border-phase-violet/20 px-2 py-0.5 rounded-full font-mono font-semibold">
                  @{progress._githubUser.username}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-text-dim flex items-center justify-center md:justify-start gap-1">
              <Target size={14} className="text-phase-amber" />
              {trackLabels[track]} Track
            </p>
            <p className="text-xs text-text-faint max-w-sm">
              Leveling up to become a fully fledged Data Science Architect. Syncing resources and earning XP daily.
            </p>
          </div>
        </div>

        {/* Level Stats Summary */}
        <div className="w-full md:w-64 bg-bg-raise border border-border-line rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-text-faint">Level Progression</span>
            <span className="font-bold text-text-main">{levelPercent}%</span>
          </div>
          <div className="h-3 rounded-full bg-bg-main overflow-hidden border border-border-line">
            <div 
              className="h-full bg-gradient-to-r from-phase-violet to-phase-rose rounded-full transition-all duration-500" 
              style={{ width: `${levelPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-text-faint">
            <span>{xp} XP Earned</span>
            <span>{nextLevelXp} XP Next</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left column: Streaks and study stats */}
        <div className="md:col-span-1 space-y-6">
          <StreakCalendar />

          {/* Core Analytics Card */}
          <div className="flat-card p-6 border border-border-line space-y-4">
            <h3 className="text-sm font-mono text-text-faint uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={16} className="text-phase-teal" /> Core Analytics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-raise p-3 rounded-xl border border-border-line text-center">
                <span className="text-[10px] font-mono text-text-faint uppercase">XP Gained</span>
                <p className="text-lg font-bold text-text-main mt-1">{xp} XP</p>
              </div>
              <div className="bg-bg-raise p-3 rounded-xl border border-border-line text-center">
                <span className="text-[10px] font-mono text-text-faint uppercase">Completed</span>
                <p className="text-lg font-bold text-text-main mt-1">{getModulesCount()} items</p>
              </div>
              <div className="bg-bg-raise p-3 rounded-xl border border-border-line text-center">
                <span className="text-[10px] font-mono text-text-faint uppercase">Freezes</span>
                <p className="text-lg font-bold text-text-main mt-1">{progress._streakFreezes || 0}</p>
              </div>
              <div className="bg-bg-raise p-3 rounded-xl border border-border-line text-center">
                <span className="text-[10px] font-mono text-text-faint uppercase">Study Level</span>
                <p className="text-lg font-bold text-text-main mt-1">{level}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Integrated Learning Platforms & Badges */}
        <div className="md:col-span-2 space-y-6">
          <div className="flat-card p-6 border border-border-line space-y-5">
            <div className="flex justify-between items-center border-b border-border-line pb-3">
              <div>
                <h3 className="text-lg font-bold font-display text-text-main flex items-center gap-2">
                  <Globe size={20} className="text-phase-teal" /> Integrated Learning Profiles
                </h3>
                <p className="text-xs text-text-faint mt-0.5">Platforms linked to sync course completions automatically</p>
              </div>
              <Link to="/settings" className="text-xs font-mono font-bold text-phase-violet hover:underline flex items-center gap-1">
                Manage accounts <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLATFORMS.map(p => {
                const isConnected = !!connectedProfiles[p.key];
                return (
                  <a
                    key={p.key}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                      isConnected 
                        ? `${p.color} ring-2 ring-current/15`
                        : 'bg-surface border-border-line opacity-50 hover:opacity-70'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="text-xs font-bold font-display">{p.label}</span>
                      {isConnected ? (
                        <CheckCircle2 size={14} className="text-current animate-scale-in" />
                      ) : (
                        <Lock size={12} className="text-text-faint" />
                      )}
                    </div>
                    
                    <div className="text-[10px] font-mono truncate mt-2 w-full flex items-center gap-1">
                      {isConnected ? (
                        <>
                          <span className="font-semibold text-current truncate">{connectedProfiles[p.key]}</span>
                          <ExternalLink size={10} className="flex-shrink-0" />
                        </>
                      ) : (
                        <span className="text-text-faint italic text-[9px]">Disconnected</span>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Credentials and Verification badges */}
          <div className="flat-card p-6 border border-border-line space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="text-sm font-mono text-text-faint uppercase tracking-wider flex items-center gap-1.5">
                <Award size={16} className="text-phase-rose" /> Earned Certificates
              </h3>
              <button
                onClick={() => {
                  playClick();
                  setShowResumeBuilder(true);
                }}
                className="px-3 py-1.5 bg-phase-violet/10 hover:bg-phase-violet/20 border border-phase-violet/25 text-phase-violet font-mono font-bold text-[10px] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileText size={12} /> Build Professional CV
              </button>
            </div>
            
            {getModulesCount() >= 10 ? (
              <div className="p-4 bg-bg-raise rounded-xl border border-border-line flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-phase-gold/15 rounded-xl text-phase-gold">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-main">Data Science Pathway Master Certificate</h4>
                    <p className="text-xs text-text-dim">Verified Program Certificate of completion</p>
                  </div>
                </div>
                <Link 
                  to="/verify"
                  className="px-4 py-2 bg-phase-violet hover:bg-phase-violet/85 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <BookOpen size={14} /> View Certificate
                </Link>
              </div>
            ) : (
              <div className="p-5 border border-dashed border-border-line rounded-xl text-center text-xs text-text-faint py-8">
                <Lock size={20} className="mx-auto text-text-faint mb-2" />
                <p className="font-bold text-text-main">Academic Certificate Locked</p>
                <p className="mt-1">Complete at least 10 curriculum items to unlock your Harvard/edX-style graduation certificate.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Resume Builder Modal */}
      {showResumeBuilder && (
        <ResumeBuilder onClose={() => setShowResumeBuilder(false)} />
      )}
    </div>
  );
}
