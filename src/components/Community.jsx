import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, ChevronDown, ChevronUp, Send, Check, AlertCircle, HelpCircle, Tag, Clock, ExternalLink, Globe } from 'lucide-react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';

// SVG branding icons
const DiscordIcon = (props) => (
  <svg viewBox="0 0 127.14 96.36" fill="currentColor" {...props}>
    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.8,6.83,77.19,77.19,0,0,0,49.5,0,105.15,105.15,0,0,0,19.06,8.07C-3.06,41.21-1.07,73.5,8.88,88.24A105.73,105.73,0,0,0,40.71,96.36c2.72-3.71,5.12-7.74,7.16-12A68.32,68.32,0,0,1,36.53,78.9c.95-.69,1.87-1.42,2.77-2.17a75,75,0,0,0,75.4,0c.9,0.76,1.82,1.48,2.77,2.17a68.48,68.48,0,0,1-11.34,5.49c2,4.28,4.44,8.31,7.16,12a105.73,105.73,0,0,0,31.83-8.12C128.83,73.5,130.82,41.21,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
  </svg>
);

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const StackOverflowIcon = (props) => (
  <svg viewBox="0 0 384 512" fill="currentColor" {...props}>
    <path d="M290.7 311L95 269.7 86.8 309l195.7 41.3 8.2-39.3zm21.3-80.6L123.6 158l-18 36.8 188.4 92.4 18-36.8zm28.7-71L174.8 54l-26.2 31.8 166.1 136.6 26.2-31.8zM17.4 391.2c-.3 13.9 11.4 25.1 25.4 24.8h298.5c14-.3 25.1-11.4 24.8-25.4V264.4h-42.7v108.6H60.1V264.4H17.4v126.8zm272.5-44.3L96.8 346l-2.4 39.9 193.1 10.9 2.4-39.9zm91-236.4l-32.9 27.2 119.4 144.1 32.9-27.2-119.4-144.1z"/>
  </svg>
);

export function Community() {
  const { currentUser } = useAuth();
  const authorName = (currentUser?.displayName || currentUser?.email?.split('@')[0] || 'learner').slice(0, 60);
  const [questions, setQuestions] = useState([]);
  const [activeAnswers, setActiveAnswers] = useState({});
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Question Form States
  const [qTitle, setQTitle] = useState('');
  const [qContent, setQContent] = useState('');
  const [qTag, setQTag] = useState('General');
  
  // Answer Form State
  const [newAnswerText, setNewAnswerText] = useState('');

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Questions posted by real learners (Firestore "community_questions").
  const [loadError, setLoadError] = useState('');
  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'community_questions'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadError('');
    }, (err) => {
      console.warn('Firestore questions load error:', err);
      setLoadError('Could not load questions right now. Please try again later.');
    });
    return () => unsubscribe();
  }, []);

  // Sync Answers for the expanded question in real time
  useEffect(() => {
    if (!expandedQuestionId) return;

    if (!db) return;
    const q = query(
      collection(db, 'community_answers'),
      where('questionId', '==', expandedQuestionId),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setActiveAnswers(snapshot.docs.map(doc => doc.data()));
    }, (err) => console.warn('Firestore answers load error:', err));
    return () => unsubscribe();
  }, [expandedQuestionId]);

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMsg('Please sign in to post a question.');
      return;
    }
    if (!qTitle.trim() || !qContent.trim()) {
      setErrorMsg('Please enter a question title and details.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg(false);

    const questionData = {
      title: qTitle.trim().slice(0, 150),
      content: qContent.trim().slice(0, 3000),
      tag: qTag,
      author: authorName,
      authorId: currentUser.uid,
      date: 'Just now',
      timestamp: Date.now(),
      answersCount: 0
    };

    try {
      await addDoc(collection(db, 'community_questions'), questionData);

      setSuccessMsg(true);
      setQTitle('');
      setQContent('');
      setTimeout(() => {
        setSuccessMsg(false);
        setShowAddForm(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to post question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswerText.trim() || !expandedQuestionId) return;
    if (!currentUser) {
      setErrorMsg('Please sign in to answer.');
      return;
    }

    const answerData = {
      questionId: expandedQuestionId,
      author: authorName,
      authorId: currentUser.uid,
      content: newAnswerText.trim().slice(0, 2000),
      date: 'Just now',
      timestamp: Date.now()
    };

    try {
      await addDoc(collection(db, 'community_answers'), answerData);
      setNewAnswerText('');
    } catch (err) {
      console.error('Answer submit error:', err);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchQuery = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTag = selectedTag === 'All' || q.tag === selectedTag;
    return matchQuery && matchTag;
  });

  // Dynamic Stack Overflow search url helper
  const stackOverflowUrl = useMemo(() => {
    const term = searchQuery ? encodeURIComponent(searchQuery) : 'pandas';
    return `https://stackoverflow.com/questions/tagged/pandas+or+python+or+machine-learning?tab=Active&s=${term}`;
  }, [searchQuery]);

  // Dynamic GitHub discussions search url
  const githubDiscussionsUrl = useMemo(() => {
    const term = searchQuery ? encodeURIComponent(searchQuery) : 'data science';
    return `https://github.com/topics/data-science?q=${term}`;
  }, [searchQuery]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border-line pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-phase-violet/15 rounded-xl text-phase-violet">
            <HelpCircle size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-display text-text-main">Community Hub</h2>
            <p className="text-text-dim text-sm mt-0.5">Ask questions, share advice, and integrate global developer platforms</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-phase-violet hover:bg-phase-violet/85 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          Ask a Question
        </button>
      </header>

      {/* Two Column Layout: Q&A feed + Global communities sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Core Q&A Board */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ask Question Form Panel */}
          {showAddForm && (
            <form
              onSubmit={handlePostQuestion}
              className="flat-card p-6 border border-phase-violet/20 bg-phase-violet/[0.02] space-y-4 animate-scale-in"
            >
              <h3 className="font-display font-bold text-lg text-text-main">Post New Question</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-text-dim">Question Title</label>
                  <input
                    type="text"
                    placeholder="What are you stuck on?"
                    maxLength={150}
                    value={qTitle}
                    onChange={(e) => setQTitle(e.target.value)}
                    className="w-full bg-bg-main border border-border-line rounded-xl px-3 py-2 text-sm text-text-main focus:outline-none focus:border-phase-violet"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-dim">Roadmap Phase Tag</label>
                  <select
                    value={qTag}
                    onChange={(e) => setQTag(e.target.value)}
                    className="w-full bg-bg-main border border-border-line rounded-xl p-2 text-sm text-text-main focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Phase 1">Phase 1 (Python)</option>
                    <option value="Phase 2">Phase 2 (Core ML)</option>
                    <option value="Phase 3">Phase 3 (Deep Learning &amp; Deployment)</option>
                    <option value="Phase 4">Phase 4 (Capstone &amp; Jobs)</option>
                    <option value="Phase 5">Phase 5 (AI Engineering)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-dim">Explain your query in detail</label>
                <textarea
                  rows={4}
                  maxLength={3000}
                  placeholder="Include error codes, package versions, context, or what solution paths you already tried..."
                  value={qContent}
                  onChange={(e) => setQContent(e.target.value)}
                  className="w-full bg-bg-main border border-border-line rounded-xl p-3 text-sm text-text-main focus:outline-none focus:border-phase-violet resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border-line flex-wrap gap-3">
                {successMsg ? (
                  <div className="flex items-center gap-2 text-phase-teal text-sm font-semibold animate-bounce-in">
                    <Check size={16} /> Question posted successfully!
                  </div>
                ) : errorMsg ? (
                  <div className="flex items-center gap-2 text-phase-brick text-xs font-semibold animate-shake">
                    <AlertCircle size={16} /> {errorMsg}
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
                    className="bg-phase-violet hover:bg-phase-violet/85 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Question'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Search and Filters */}
          <div className="bg-surface rounded-2xl border border-border-line p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center shadow-sm">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
              <input
                type="text"
                placeholder="Search queries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-main border border-border-line rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-phase-violet placeholder:text-text-faint font-sans"
              />
            </div>

            <div className="flex items-center gap-3">
              <Tag size={14} className="text-text-faint" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="flex-1 bg-bg-main border border-border-line rounded-xl p-2.5 text-sm text-text-main focus:outline-none"
              >
                <option value="All">All Topics</option>
                <option value="General">General</option>
                <option value="Phase 1">Phase 1</option>
                <option value="Phase 2">Phase 2</option>
                <option value="Phase 3">Phase 3</option>
                <option value="Phase 4">Phase 4</option>
                <option value="Phase 5">Phase 5</option>
              </select>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {loadError && (
              <div className="flex items-center gap-2 text-phase-brick text-sm"><AlertCircle size={16} /> {loadError}</div>
            )}
            {filteredQuestions.length === 0 ? (
              <div className="p-12 text-center animate-fade-in border border-border-line rounded-2xl bg-surface">
                <div className="text-5xl mb-3">💬</div>
                <p className="text-text-dim font-semibold">{questions.length === 0 ? 'No questions yet' : 'No questions match your search'}</p>
                <p className="text-text-faint text-sm mt-1">Be the first to post a question for this topic!</p>
              </div>
            ) : (
              filteredQuestions.map(q => {
                const isExpanded = expandedQuestionId === q.id;

                return (
                  <div
                    key={q.id}
                    className="flat-card border border-border-line bg-surface hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  >
                    <div
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="p-5 flex justify-between items-start gap-4 cursor-pointer hover:bg-bg-raise/30 transition-colors"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-mono bg-phase-violet/10 text-phase-violet px-2 py-0.5 rounded border border-phase-violet/20 font-semibold">
                            {q.tag}
                          </span>
                          <span className="text-text-faint flex items-center gap-1">
                            <Clock size={11} /> Posted by @{q.author}
                          </span>
                        </div>

                        <h3 className="text-[16px] font-bold text-text-main font-display leading-snug">
                          {q.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 text-text-dim mt-1.5">
                        <span className="text-xs font-semibold">
                          {isExpanded ? activeAnswers.length : (q.answersCount || 0)} answers
                        </span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-border-line bg-bg-raise/20 p-5 space-y-6 animate-fade-in">
                        <div className="bg-surface p-4 rounded-xl border border-border-line space-y-2">
                          <h4 className="text-xs font-mono font-bold text-text-faint uppercase">Question Detail</h4>
                          <p className="text-sm text-text-dim leading-relaxed whitespace-pre-wrap">{q.content}</p>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-xs font-mono font-bold text-text-faint uppercase tracking-wider">
                            Discussion Thread ({activeAnswers.length})
                          </h4>
                          {activeAnswers.length === 0 ? (
                            <p className="text-xs text-text-faint italic pl-1">No answers yet. Share your knowledge below!</p>
                          ) : (
                            <div className="space-y-3">
                              {activeAnswers.map((ans, aIdx) => (
                                <div key={aIdx} className="bg-surface p-4 rounded-xl border border-border-line space-y-2 relative animate-fade-in">
                                  <div className="flex items-center justify-between text-[11px] text-text-faint">
                                    <span className="font-bold text-phase-teal">@{ans.author}</span>
                                    <span>{ans.date || 'Just now'}</span>
                                  </div>
                                  <p className="text-xs text-text-dim leading-relaxed">{ans.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <form onSubmit={handlePostAnswer} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Write your answer..."
                            maxLength={2000}
                            value={newAnswerText}
                            onChange={(e) => setNewAnswerText(e.target.value)}
                            className="flex-1 bg-surface border border-border-line rounded-xl px-4 py-2 text-xs text-text-main focus:outline-none focus:border-phase-violet"
                          />
                          <button
                            type="submit"
                            className="bg-phase-violet hover:bg-phase-violet/85 text-white p-2.5 rounded-xl cursor-pointer transition-colors"
                          >
                            <Send size={14} />
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Developer Community Integrations */}
        <div className="space-y-6">
          
          {/* Discord integration */}
          <div className="flat-card p-6 border border-border-line space-y-4 bg-surface shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#5865F2]/10 text-[#5865F2] rounded-xl">
                <DiscordIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-text-main text-sm font-display">Discord Community</h3>
                <span className="text-[10px] text-text-faint font-mono">Public server, not run by this app</span>
              </div>
            </div>
            <p className="text-xs text-text-dim leading-relaxed">
              A large public data science Discord where you can ask questions and find study partners.
            </p>
            <a
              href="https://discord.gg/datascience"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#5865F2] hover:bg-[#5865F2]/90 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer text-center"
            >
              Join Discord Server <ExternalLink size={12} />
            </a>
          </div>

          {/* GitHub integrations */}
          <div className="flat-card p-6 border border-border-line space-y-4 bg-surface shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-phase-brick/10 text-phase-brick rounded-xl">
                <GithubIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-text-main text-sm font-display">GitHub Discussions</h3>
                <span className="text-[10px] text-text-faint font-mono">Open Source Projects</span>
              </div>
            </div>
            <p className="text-xs text-text-dim leading-relaxed">
              Browse open-source data science projects and discussions on GitHub.
            </p>
            <a
              href={githubDiscussionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-surface border border-border-line hover:border-border-strong text-text-main text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer text-center"
            >
              Explore Data Science Repos <ExternalLink size={12} />
            </a>
          </div>

          {/* Stack Overflow integration */}
          <div className="flat-card p-6 border border-border-line space-y-4 bg-surface shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F48225]/10 text-[#F48225] rounded-xl">
                <StackOverflowIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-text-main text-sm font-display">Stack Overflow helper</h3>
                <span className="text-[10px] text-text-faint font-mono">Tagged searches</span>
              </div>
            </div>
            <p className="text-xs text-text-dim leading-relaxed">
              Directly query technical packages like `pandas`, `numpy`, and `scikit-learn` using your active search tags.
            </p>
            <a
              href={stackOverflowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#F48225] hover:bg-[#F48225]/90 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer text-center"
            >
              Search SO Questions <ExternalLink size={12} />
            </a>
          </div>

          {/* freeCodeCamp integration */}
          <div className="flat-card p-6 border border-border-line space-y-4 bg-surface shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#0a0a23]/10 text-[#0a0a23] dark:text-white rounded-xl">
                <Globe className="w-6 h-6 text-phase-rose" />
              </div>
              <div>
                <h3 className="font-bold text-text-main text-sm font-display">freeCodeCamp Forum</h3>
                <span className="text-[10px] text-text-faint font-mono">Data Analysis Section</span>
              </div>
            </div>
            <p className="text-xs text-text-dim leading-relaxed">
              Explore thousands of structured coding tutorials and join discussions in the data analysis help center.
            </p>
            <a
              href="https://forum.freecodecamp.org/c/help/data-analysis/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0a0a23] hover:bg-[#0a0a23]/90 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer text-center"
            >
              Join FCC Forum <ExternalLink size={12} />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
