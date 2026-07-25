import { useState } from 'react';
import { Target, CheckCircle2, Sliders, Brain, GraduationCap, ArrowRight, ArrowLeft, Trophy, Sparkles, Volume2, Shield } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

const SCREENING_QUESTIONS = [
  {
    q: "Which keyword handles non-blocking, asynchronous execution natively in Python?",
    options: ["threading", "multiprocessing", "async/await", "locks"],
    ans: 2,
    explanation: "async/await allows cooperative multi-tasking on a single event loop, avoiding blocking context switches."
  },
  {
    q: "Which pandas function merges time-series datasets on timestamps that do not match exactly?",
    options: ["pd.concat", "pd.merge_asof", "df.join", "pd.merge(how='cross')"],
    ans: 1,
    explanation: "pd.merge_asof matches on closest preceding or succeeding keys, ideal for high-frequency logs."
  },
  {
    q: "Which activation function is primary for resolving vanishing gradients in deep feedforward networks?",
    options: ["Sigmoid", "Tanh", "ReLU", "Step"],
    ans: 2,
    explanation: "ReLU has a constant gradient of 1 for all positive inputs, preventing activation scaling decay."
  },
  {
    q: "What is the mathematical computational complexity of the standard self-attention mechanism?",
    options: ["O(N)", "O(N log N)", "O(N^2)", "O(N^3)"],
    ans: 3,
    explanation: "Self-attention computes dot-products between all pairs of N query/key vectors, scaling quadratically."
  },
  {
    q: "What deployment style routes live traffic to a new model but only serves baseline outputs to users?",
    options: ["Canary Deployment", "Shadow Deployment", "Blue-Green Deployment", "A/B Testing"],
    ans: 1,
    explanation: "Shadow deployments process real traffic silently to test performance without impacting users."
  }
];

export function PersonalizationSurvey({ isOpen, onClose }) {
  const { savePersonalization, setProgress, progress } = useProgress();
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Placement Test
  const [placementAnswers, setPlacementAnswers] = useState(Array(5).fill(null));
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [skipPhases, setSkipPhases] = useState(false);

  // Step 2: Intensity
  const [studyIntensity, setStudyIntensity] = useState('serious');
  const [targetTimeline, setTargetTimeline] = useState('90');

  // Step 3: Domain & Math
  const [targetIndustry, setTargetIndustry] = useState('tech');
  const [mathPreference, setMathPreference] = useState(true);

  // Step 4: AI Tutor Select
  const [aiTutorPersonality, setAiTutorPersonality] = useState('mentor');

  // Step 5: Custom Accent Theme
  const [accentHue, setAccentHue] = useState(250);
  const [accentSat, setAccentSat] = useState(70);
  const [accentLight, setAccentLight] = useState(60);
  const [reminderTime, setReminderTime] = useState('17:00');

  if (!isOpen) return null;

  const score = placementAnswers.filter((a, idx) => a === SCREENING_QUESTIONS[idx].ans).length;
  const isEligibleToSkip = score >= 4;

  const handleOptionSelect = (qIdx, optIdx) => {
    if (testSubmitted) return;
    const nextAns = [...placementAnswers];
    nextAns[qIdx] = optIdx;
    setPlacementAnswers(nextAns);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(s => s + 1);
    } else {
      // Compile personalization settings
      const finalSettings = {
        studyIntensity,
        targetIndustry,
        mathPreference,
        aiTutorPersonality,
        customHsl: { h: accentHue, s: accentSat, l: accentLight },
        reminderTimes: [reminderTime]
      };

      // Set accent CSS variable dynamically on save
      document.documentElement.style.setProperty('--accent-h', accentHue);
      document.documentElement.style.setProperty('--accent-s', `${accentSat}%`);
      document.documentElement.style.setProperty('--accent-l', `${accentLight}%`);

      // If user skipped phases based on placement test, mark them as checked off
      if (skipPhases && isEligibleToSkip) {
        setProgress(prev => {
          const next = { ...prev };
          // Auto check courses and books for phase 1 & 2
          next.phase1 = { courses: [0, 1, 2, 3], books: [0, 1], quizPassed: true };
          next.phase2 = { courses: [0, 1, 2], books: [0], quizPassed: true };
          return next;
        });
      }

      savePersonalization(finalSettings);
      onClose?.();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-surface border border-border-line rounded-2xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh] animate-scale-in">
        
        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8 border-b border-border-line pb-4">
          <h3 className="font-display font-bold text-lg text-text-main flex items-center gap-2">
            <Sparkles className="text-phase-violet" size={18} />
            Personalize Your Pathway
          </h3>
          <span className="font-mono text-xs text-text-faint">Step {currentStep + 1} of 5</span>
        </div>

        {/* Steps Content */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h4 className="text-xl font-bold font-display text-text-main mb-2">Knowledge Screening (Optional)</h4>
              <p className="text-sm text-text-dim mb-4 leading-relaxed">
                Answer these 5 questions to gauge your starting baseline. Score 4+ to skip foundations!
              </p>
            </div>

            <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-1">
              {SCREENING_QUESTIONS.map((qObj, qIdx) => (
                <div key={qIdx} className="bg-bg-raise border border-border-line p-4 rounded-xl space-y-3">
                  <p className="text-sm font-semibold text-text-main leading-relaxed">{qIdx + 1}. {qObj.q}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {qObj.options.map((opt, optIdx) => {
                      const active = placementAnswers[qIdx] === optIdx;
                      let btnStyle = "text-left p-3 rounded-lg border text-xs transition-colors cursor-pointer ";
                      if (testSubmitted) {
                        if (optIdx === qObj.ans) {
                          btnStyle += "bg-phase-teal/15 border-phase-teal text-phase-teal font-bold";
                        } else if (active) {
                          btnStyle += "bg-phase-brick/15 border-phase-brick text-phase-brick";
                        } else {
                          btnStyle += "bg-surface border-border-line opacity-50";
                        }
                      } else {
                        btnStyle += active
                          ? "bg-phase-violet/15 border-phase-violet text-phase-violet font-semibold"
                          : "bg-surface border-border-line hover:bg-surface-hover text-text-dim";
                      }
                      return (
                        <button
                          key={optIdx}
                          disabled={testSubmitted}
                          onClick={() => handleOptionSelect(qIdx, optIdx)}
                          className={btnStyle}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!testSubmitted ? (
              <button
                onClick={() => setTestSubmitted(true)}
                disabled={placementAnswers.includes(null)}
                className="w-full py-3 rounded-xl bg-phase-violet text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
              >
                Submit Screening Test
              </button>
            ) : (
              <div className="bg-phase-violet/10 border border-phase-violet/20 p-5 rounded-xl text-center space-y-3 animate-fade-in">
                <p className="text-sm font-bold text-text-main">
                  Your Score: <span className="text-phase-violet text-lg font-mono">{score} / 5</span>
                </p>
                {isEligibleToSkip ? (
                  <div className="space-y-2">
                    <p className="text-xs text-phase-teal font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={16} /> Eligible to bypass Phase 1 & 2 Foundations!
                    </p>
                    <label className="flex items-center justify-center gap-2 text-xs text-text-main cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={skipPhases}
                        onChange={(e) => setSkipPhases(e.target.checked)}
                        className="rounded accent-phase-violet"
                      />
                      Pre-check foundations as complete (Phase 1 & 2)
                    </label>
                  </div>
                ) : (
                  <p className="text-xs text-text-dim">
                    Recommended Path: Start from Phase 1 to solidify core programming and statistics basics.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <h4 className="text-xl font-bold font-display text-text-main">Study Intensity & Graduation Goal</h4>
            <p className="text-sm text-text-dim">Configure daily commitment rates to adjust projected completion calculations.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'casual', label: 'Casual Focus', mins: '15 mins / day', timeline: '12 months', color: 'border-phase-teal text-phase-teal' },
                { id: 'serious', label: 'Serious Study', mins: '45 mins / day', timeline: '4 months', color: 'border-phase-violet text-phase-violet' },
                { id: 'insane', label: 'Insane Mode', mins: '90 mins / day', timeline: '2 months', color: 'border-phase-brick text-phase-brick' }
              ].map(i => {
                const active = studyIntensity === i.id;
                return (
                  <button
                    key={i.id}
                    onClick={() => setStudyIntensity(i.id)}
                    className={`text-center p-5 rounded-xl border-2 transition-all flex flex-col justify-center items-center gap-2 cursor-pointer ${
                      active ? `${i.color} bg-bg-raise font-bold scale-[1.02]` : 'bg-surface border-border-line text-text-dim hover:bg-bg-raise'
                    }`}
                  >
                    <span className="text-sm">{i.label}</span>
                    <span className="text-xs font-mono font-normal opacity-85">{i.mins}</span>
                    <span className="text-[10px] font-mono opacity-70">Graduation: {i.timeline}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-main">Target Graduation Timeline (days):</label>
              <input
                type="number"
                min="30"
                max="365"
                value={targetTimeline}
                onChange={(e) => setTargetTimeline(e.target.value)}
                className="w-full bg-bg-raise border border-border-line rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-phase-violet"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h4 className="text-xl font-bold font-display text-text-main">Target Domain & Mathematical Depth</h4>
            <p className="text-sm text-text-dim">Tailor capstone examples and mathematical formulas displayed throughout resource checklists.</p>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-main">Industry Specialization Preference:</label>
              <select
                value={targetIndustry}
                onChange={(e) => setTargetIndustry(e.target.value)}
                className="w-full bg-bg-raise border border-border-line rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-phase-violet"
              >
                <option value="tech">Core Technology (Generic ML models)</option>
                <option value="finance">Quantitative Finance (Risk, Pricing, Fraud)</option>
                <option value="healthcare">Bio-Health Sciences (Imaging, Clinical analytics)</option>
                <option value="agtech">Precision Agriculture (Yield tracking, Soil loss forecasting)</option>
              </select>
            </div>

            <div className="bg-bg-raise border border-border-line p-5 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-bold text-text-main">Enable LaTeX Theoretical Equations</p>
                <p className="text-xs text-text-dim">If off, complex formulas are summarized in simple verbal notes.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={mathPreference}
                  onChange={(e) => setMathPreference(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border-line peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-line after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-phase-violet"></div>
              </label>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h4 className="text-xl font-bold font-display text-text-main">Choose Your AI Tutor Personality</h4>
            <p className="text-sm text-text-dim">AI reviews, flashcard feedback, and explanations will align with this persona.</p>

            <div className="space-y-3">
              {[
                { id: 'coach', title: 'Strict Coach 🏋️‍♂️', desc: 'Direct, highly motivational, sets tough goals, holds you accountable, pushes for clean code.' },
                { id: 'mentor', title: 'Encouraging Mentor ☕️', desc: 'Warm, supportive, breaks down complex topics step-by-step with practical scenarios.' },
                { id: 'academic', title: 'Technical Academic 🎓', desc: 'Rigorous math proofs, deep explanations of theoretical models, references research papers.' }
              ].map(p => {
                const active = aiTutorPersonality === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setAiTutorPersonality(p.id)}
                    className={`w-full text-left p-5 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                      active
                        ? 'bg-phase-violet/10 border-phase-violet shadow-md scale-[1.01]'
                        : 'bg-surface border-border-line hover:bg-bg-raise'
                    }`}
                  >
                    <span className="font-bold text-sm text-text-main">{p.title}</span>
                    <span className="text-xs text-text-dim leading-relaxed">{p.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h4 className="text-xl font-bold font-display text-text-main">Accent Color Customization & Alerts</h4>
            <p className="text-sm text-text-dim">Calibrate your personal visual workspace and study reminder schedule.</p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border-line text-center bg-bg-raise" style={{
                color: `hsl(${accentHue}, ${accentSat}%, ${accentLight}%)`
              }}>
                <span className="font-bold font-display text-base">Interactive Theme Preview Element</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-text-dim">
                  <span>Theme Hue ({accentHue}°)</span>
                  <span>Color Balance</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={accentHue}
                  onChange={(e) => setAccentHue(parseInt(e.target.value))}
                  className="w-full accent-phase-violet"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-text-dim">Saturation ({accentSat}%)</span>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={accentSat}
                    onChange={(e) => setAccentSat(parseInt(e.target.value))}
                    className="w-full accent-phase-violet"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-mono text-text-dim">Lightness ({accentLight}%)</span>
                  <input
                    type="range"
                    min="40"
                    max="80"
                    value={accentLight}
                    onChange={(e) => setAccentLight(parseInt(e.target.value))}
                    className="w-full accent-phase-violet"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-sm font-semibold text-text-main">Daily Study Reminder Time:</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="bg-bg-raise border border-border-line rounded-xl px-4 py-3 text-sm font-mono w-full focus:outline-none focus:border-phase-violet"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-border-line">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-text-dim hover:text-text-main disabled:opacity-30 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 bg-text-main text-bg-main px-6 py-2.5 rounded-xl text-xs font-mono font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            {currentStep < 4 ? 'Next' : 'Save & Initialize'}
            {currentStep < 4 ? <ArrowRight size={14} /> : <Sparkles size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
