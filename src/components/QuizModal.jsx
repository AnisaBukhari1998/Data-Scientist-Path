import { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, Award, AlertCircle } from 'lucide-react';
import { QUIZ_DATA } from '../data/quizData';
import { useProgress } from '../context/ProgressContext';
import { CircularProgress } from './CircularProgress';

export function QuizModal({ isOpen, onClose, phaseKey, phaseTitle }) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);

  const { progress, setProgress } = useProgress();

  useEffect(() => {
    if (isOpen) {
      let allQuestions = [];
      if (phaseKey === 'revive') {
        Object.keys(QUIZ_DATA).forEach(k => {
          allQuestions = [...allQuestions, ...(QUIZ_DATA[k] || [])];
        });
      } else {
        allQuestions = QUIZ_DATA[phaseKey] || [];
      }
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      setQuizQuestions(shuffled.slice(0, 10));
      setCurrentQuestionIdx(0);
      setScore(0);
      setShowResult(false);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [isOpen, phaseKey]);

  if (!isOpen) return null;

  if (quizQuestions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-surface rounded-2xl p-8 max-w-md w-full text-center relative border border-border-line animate-scale-in">
          <button onClick={onClose} className="absolute top-4 right-4 text-text-faint hover:text-text-main transition-colors">
            <X size={24} />
          </button>
          <AlertCircle size={48} className="mx-auto text-phase-amber mb-4" />
          <h2 className="text-2xl font-bold font-display text-text-main mb-2">Quiz Coming Soon</h2>
          <p className="text-text-dim">Questions for this phase are being prepared.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIdx];
  const questionProgress = ((currentQuestionIdx + 1) / quizQuestions.length) * 100;

  const handleOptionSelect = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIdx + 1 < quizQuestions.length) {
        setCurrentQuestionIdx(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setShowResult(true);
        const passThreshold = Math.ceil(quizQuestions.length * 0.7);
        if (score + (index === currentQuestion.correctAnswer ? 1 : 0) >= passThreshold) {
          if (phaseKey !== 'revive') {
            setProgress(prev => ({
              ...prev,
              [phaseKey]: {
                ...prev[phaseKey],
                quizPassed: true
              }
            }));
          }
        }
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const passThreshold = Math.ceil(quizQuestions.length * 0.7);
  const passed = score >= passThreshold;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-surface rounded-2xl p-6 md:p-8 max-w-2xl w-full relative border border-border-line shadow-2xl overflow-y-auto max-h-[90vh] animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-faint hover:text-text-main bg-bg-raise rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {!showResult ? (
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-line">
              <span className="text-sm font-semibold text-phase-violet uppercase tracking-wider font-mono">
                {phaseTitle} Quiz
              </span>
              <span className="text-sm font-medium text-text-faint font-mono">
                {currentQuestionIdx + 1} / {quizQuestions.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-bg-raise rounded-full overflow-hidden mb-8">
              <div
                className="h-full bg-gradient-to-r from-phase-violet to-phase-rose rounded-full transition-all duration-500"
                style={{ width: `${questionProgress}%` }}
              />
            </div>

            {/* Question */}
            <h3 className="text-xl md:text-2xl font-bold text-text-main mb-8 leading-relaxed font-display">
              {currentQuestion.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                let buttonStyle = 'bg-bg-raise hover:bg-surface-hover text-text-main border-border-line';
                let icon = null;

                if (isAnswered) {
                  if (idx === currentQuestion.correctAnswer) {
                    buttonStyle = 'bg-phase-teal/10 border-phase-teal/50 text-phase-teal';
                    icon = <CheckCircle2 className="text-phase-teal flex-shrink-0" size={20} />;
                  } else if (idx === selectedOption) {
                    buttonStyle = 'bg-phase-brick/10 border-phase-brick/50 text-phase-brick';
                    icon = <XCircle className="text-phase-brick flex-shrink-0" size={20} />;
                  } else {
                    buttonStyle = 'bg-bg-raise opacity-40 border-border-line text-text-faint';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${buttonStyle}`}
                  >
                    <span className="font-medium">{option}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {isAnswered && currentQuestion.explanation && (
              <div className="mt-4 p-4 bg-phase-violet/5 border border-phase-violet/20 rounded-xl text-sm text-text-dim animate-slide-up">
                <span className="font-semibold text-phase-violet">Explanation: </span>
                {currentQuestion.explanation}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            {passed ? (
              <div className="space-y-4 animate-bounce-in">
                <div className="flex justify-center mb-6">
                  <CircularProgress
                    percent={Math.round((score / quizQuestions.length) * 100)}
                    size={120}
                    strokeWidth={8}
                    color="var(--teal)"
                    label="Score"
                  />
                </div>
                <Award className="text-phase-gold mx-auto animate-float" size={48} />
                <h2 className="text-3xl font-bold font-display text-text-main">Phase Mastered!</h2>
                <p className="text-lg text-text-dim">
                  You scored {score} out of {quizQuestions.length}. Outstanding!
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-8 py-3 bg-phase-violet hover:bg-phase-violet/80 text-white font-bold rounded-xl transition-colors"
                >
                  Continue Roadmap
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-scale-in">
                <div className="flex justify-center mb-6">
                  <CircularProgress
                    percent={Math.round((score / quizQuestions.length) * 100)}
                    size={120}
                    strokeWidth={8}
                    color="var(--brick)"
                    label="Score"
                  />
                </div>
                <h2 className="text-3xl font-bold font-display text-text-main">Keep Learning</h2>
                <p className="text-lg text-text-dim">
                  You scored {score} out of {quizQuestions.length}. You need {passThreshold} to pass.
                </p>
                <div className="flex gap-4 justify-center mt-6">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-bg-raise hover:bg-surface text-text-dim font-bold rounded-xl transition-colors border border-border-line"
                  >
                    Review Material
                  </button>
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-3 bg-phase-violet hover:bg-phase-violet/80 text-white font-bold rounded-xl transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
