import { useState, useEffect } from 'react';
import { Award, Briefcase, Star, MessageSquare, Plus, Check, AlertCircle } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const DEFAULT_STORIES = [
  {
    name: 'Sarah Jenkins',
    role: 'Data Scientist @ Google',
    path: 'Data Scientist Track',
    quote: 'The structured roadmap kept me focused. The mock interview panel exactly mirrored the questions I faced during my Google technical assessment!',
    img: '👩‍💻'
  },
  {
    name: 'David Chen',
    role: 'ML Engineer @ Meta',
    path: 'ML Engineer Track',
    quote: 'Being able to verify my project commits directly on GitHub and generate standardized READMEs helped build a portfolio that got me past the recruiters.',
    img: '🧑‍💻'
  },
  {
    name: 'Amara Okafor',
    role: 'AI Researcher @ OpenAI',
    path: 'AI Engineer Track',
    quote: 'The Forest study timer kept me off social media. I planted 140 virtual trees during my deep work blocks. An absolute game-changer for focus.',
    img: '👩‍🔬'
  }
];

const EMOJIS = ['🧑‍💻', '👩‍💻', '👩‍🔬', '👨‍💼', '🚀', '🎓', '🏆', '🔥'];

export function SuccessStories() {
  const { progress } = useProgress();
  const [stories, setStories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formPath, setFormPath] = useState('Data Scientist Track');
  const [formQuote, setFormQuote] = useState('');
  const [formEmoji, setFormEmoji] = useState('🧑‍💻');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Sync with Firestore collection success_stories with fallback to localStorage
  useEffect(() => {
    if (db) {
      const q = query(collection(db, 'success_stories'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firestoreList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStories([...firestoreList, ...DEFAULT_STORIES]);
      }, (err) => {
        console.warn('Firestore success stories error:', err);
        loadLocalStories();
      });
      return () => unsubscribe();
    } else {
      loadLocalStories();
    }
  }, []);

  const loadLocalStories = () => {
    try {
      const local = JSON.parse(localStorage.getItem('custom-success-stories') || '[]');
      setStories([...local, ...DEFAULT_STORIES]);
    } catch (e) {
      setStories(DEFAULT_STORIES);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formRole.trim() || !formQuote.trim()) {
      setSubmitError('Please complete all form fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    const newStory = {
      name: formName.trim(),
      role: formRole.trim(),
      path: formPath,
      quote: formQuote.trim(),
      img: formEmoji,
      timestamp: Date.now()
    };

    try {
      if (db) {
        await addDoc(collection(db, 'success_stories'), newStory);
      } else {
        // Fallback local storage
        const currentLocal = JSON.parse(localStorage.getItem('custom-success-stories') || '[]');
        const updated = [newStory, ...currentLocal];
        localStorage.setItem('custom-success-stories', JSON.stringify(updated));
        setStories([...updated, ...DEFAULT_STORIES]);
      }

      setSubmitSuccess(true);
      setFormName('');
      setFormRole('');
      setFormQuote('');
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowAddForm(false);
      }, 2000);
    } catch (err) {
      console.error('Error submitting success story:', err);
      setSubmitError('Failed to publish success story. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border-line pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-phase-gold/15 rounded-xl text-phase-gold">
            <Award size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-display text-text-main">Success Stories</h2>
            <p className="text-text-dim text-sm mt-0.5">Alumni career transformations using this curriculum path</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-phase-gold hover:bg-phase-gold/85 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          Share Your Success
        </button>
      </header>

      {/* Share Success Form Panel */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="flat-card p-6 border border-phase-gold/20 bg-phase-gold/[0.02] space-y-4 animate-scale-in"
        >
          <h3 className="font-display font-bold text-lg text-text-main">Publish Your Story</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-dim">Your Name</label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-bg-main border border-border-line rounded-xl px-3 py-2 text-sm text-text-main focus:outline-none focus:border-phase-gold"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-dim">Role / Title Obtained</label>
              <input
                type="text"
                placeholder="e.g. ML Intern @ Apple"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="w-full bg-bg-main border border-border-line rounded-xl px-3 py-2 text-sm text-text-main focus:outline-none focus:border-phase-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-dim">Roadmap Track Completed</label>
              <select
                value={formPath}
                onChange={(e) => setFormPath(e.target.value)}
                className="w-full bg-bg-main border border-border-line rounded-xl p-2 text-sm text-text-main focus:outline-none"
              >
                <option value="Data Scientist Track">Data Scientist Track</option>
                <option value="Data Analyst Track">Data Analyst Track</option>
                <option value="ML Engineer Track">ML Engineer Track</option>
                <option value="AI Engineer Track">AI Engineer Track</option>
                <option value="Data Engineer Track">Data Engineer Track</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-dim">Choose Avatar Emoji</label>
              <div className="flex gap-2 flex-wrap">
                {EMOJIS.map(emo => (
                  <button
                    key={emo}
                    type="button"
                    onClick={() => setFormEmoji(emo)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg border transition-all ${
                      formEmoji === emo
                        ? 'border-phase-gold bg-phase-gold/10'
                        : 'border-border-line hover:bg-bg-raise'
                    }`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-dim">Your Quote / Review</label>
            <textarea
              rows={3}
              placeholder="Detail your learning experience, tools used, key study schedules, or interview preparation tips..."
              value={formQuote}
              onChange={(e) => setFormQuote(e.target.value)}
              className="w-full bg-bg-main border border-border-line rounded-xl p-3 text-sm text-text-main focus:outline-none focus:border-phase-gold resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border-line flex-wrap gap-3">
            {submitSuccess ? (
              <div className="flex items-center gap-2 text-phase-teal text-sm font-semibold animate-bounce-in">
                <Check size={16} /> Story published successfully!
              </div>
            ) : submitError ? (
              <div className="flex items-center gap-2 text-phase-brick text-xs font-semibold animate-shake">
                <AlertCircle size={16} /> {submitError}
              </div>
            ) : (
              <div />
            )}
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-border-strong rounded-xl text-xs font-bold text-text-dim hover:text-text-main"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-phase-gold hover:bg-phase-gold/85 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Story'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Stories list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((s, idx) => (
          <div
            key={s.id || idx}
            className="flat-card p-6 border border-border-line flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden animate-slide-up"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="absolute top-4 right-4 text-4xl opacity-15 select-none">
              <MessageSquare size={48} className="text-text-faint" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-1 text-phase-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>

              <p className="text-text-main text-[14px] italic leading-relaxed z-10 relative">
                "{s.quote}"
              </p>
            </div>

            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border-line">
              <div className="w-10 h-10 rounded-full bg-bg-raise flex items-center justify-center text-xl shadow-sm border border-border-line">
                {s.img}
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-main leading-tight">{s.name}</h4>
                <div className="text-xs text-text-dim flex items-center gap-1 mt-0.5">
                  <Briefcase size={12} className="text-phase-teal" />
                  {s.role}
                </div>
                <div className="text-[10px] font-mono text-text-faint mt-0.5">
                  {s.path}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
