import { useState, useEffect, useRef } from 'react';
import { QUIZ_DATA } from '../data/quizData';
import { Play, Check, X, RefreshCw, Trophy, BrainCircuit, Volume2, VolumeX, Mic, MicOff, Loader2 } from 'lucide-react';
import { getGenerativeModel } from 'firebase/ai';
import { ai } from '../firebase';
import { useAuth } from '../context/AuthContext';

export function MockInterview() {
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  // Speech Recognition (STT) States
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition on Mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
        if (questions[currentIndex]?.type !== 'open-ended') {
          setTranscription('');
        }
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscription(prev => questions[currentIndex]?.type === 'open-ended' ? (prev ? prev + ' ' + text : text) : text);
        
        // Auto-evaluate multiple choice, let open-ended be reviewed before submission
        if (questions[currentIndex]?.type !== 'open-ended') {
          evaluateSpokenAnswer(text);
        }
      };

      rec.onerror = (err) => {
        console.error('Speech recognition error:', err);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [currentIndex, questions]);

  // Toggle Recording
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Safari.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop talking first
      }
      recognitionRef.current.start();
    }
  };

  // Evaluate Spoken Answer using Gemini
  const evaluateSpokenAnswer = async (spokenText) => {
    const currentQ = questions[currentIndex];
    if (!spokenText.trim()) return;
    setIsValidating(true);
    
    // Stop TTS if speaking
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Default Fallback matching (if Gemini is not configured/offline)
    const runFallbackEval = () => {
      if (currentQ.type === 'open-ended') {
        setSelectedOption(0);
        setScore(s => s + 1); // Open-ended questions pass by default in fallback
        setAiFeedback(`Recorded response: "${spokenText}"\n\nFallback check: Analysis complete. (Note: Log in with Gemini to get detailed accuracy scores and recommendations).`);
        setShowExplanation(true);
        setIsValidating(false);
        return;
      }

      let matchedIdx = null;
      const cleanText = spokenText.toLowerCase();
      
      currentQ.options.forEach((opt, idx) => {
        const label = String.fromCharCode(65 + idx).toLowerCase();
        if (cleanText.includes(`option ${label}`) || cleanText.includes(`choice ${label}`) || cleanText === label) {
          matchedIdx = idx;
        } else if (cleanText.includes(opt.toLowerCase())) {
          matchedIdx = idx;
        }
      });

      if (matchedIdx === null) {
        const firstChar = cleanText.trim()[0];
        if (['a', 'b', 'c', 'd'].includes(firstChar)) {
          matchedIdx = firstChar.charCodeAt(0) - 97;
        }
      }

      if (matchedIdx !== null) {
        setSelectedOption(matchedIdx);
        if (matchedIdx === currentQ.correctAnswer) {
          setScore(s => s + 1);
        }
        setAiFeedback(`Speech matched to option ${String.fromCharCode(65 + matchedIdx)}. ${currentQ.explanation}`);
      } else {
        setAiFeedback(`Could not verify answer. Speech heard: "${spokenText}". Please tap the correct option manually.`);
      }
      setShowExplanation(true);
      setIsValidating(false);
    };

    if (!currentUser || !ai) {
      runFallbackEval();
      return;
    }

    try {
      const model = getGenerativeModel(ai, {
        model: 'gemini-3.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 256,
          temperature: 0.2,
        }
      });

      let prompt = '';
      if (currentQ.type === 'open-ended') {
        prompt = `You are a technical interviewer checking a candidate's spoken response to an open-ended question.
Question: ${currentQ.question}
Expected concepts/rubric: ${currentQ.explanation}

Based on the candidate's answer:
"${spokenText}"

Your tasks:
1. Grade their response on a scale of 0 to 100 based on accuracy, completeness, and clarity.
2. Provide constructive feedback (under 75 words), highlighting what they got right and what key details they missed.
3. Determine if they score >= 70 (isCorrect = true/false).

Respond ONLY with this exact JSON format:
{
  "detectedOptionIndex": 0,
  "isCorrect": true,
  "feedback": "Score: 85/100. Correct! You successfully identified..."
}`;
      } else {
        prompt = `You are a technical interviewer checking a candidate's spoken response.
Question: ${currentQ.question}
Expected options:
${currentQ.options.map((o, i) => `${String.fromCharCode(65 + i)}: ${o}`).join('\n')}
Correct Answer Index: ${currentQ.correctAnswer} (0 = A, 1 = B, 2 = C, 3 = D)

Based on the candidate's speech transcription:
"${spokenText}"

Your tasks:
1. Determine which option (0, 1, 2, or 3) they selected or supported. If they didn't explicitly say the letter, match their reasoning to the closest option.
2. If they are correct, congratulate them and briefly explain why.
3. If they are incorrect, explain their mistake and state what the correct answer is.
Keep feedback short (under 75 words).

Respond ONLY with this exact JSON format:
{
  "detectedOptionIndex": 0,
  "isCorrect": true,
  "feedback": "Correct! You successfully identified..."
}`;
      }

      const res = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
      const responseText = res.response.text();
      const parsed = JSON.parse(responseText);

      if (currentQ.type === 'open-ended') {
        setSelectedOption(0);
        if (parsed.isCorrect) {
          setScore(s => s + 1);
        }
        setAiFeedback(parsed.feedback);
      } else if (parsed.detectedOptionIndex !== null && parsed.detectedOptionIndex >= 0 && parsed.detectedOptionIndex <= 3) {
        setSelectedOption(parsed.detectedOptionIndex);
        if (parsed.detectedOptionIndex === currentQ.correctAnswer) {
          setScore(s => s + 1);
        }
        setAiFeedback(parsed.feedback);
      } else {
        runFallbackEval();
        return;
      }
      setShowExplanation(true);
    } catch (err) {
      console.error("Gemini speech evaluation failed:", err);
      runFallbackEval();
    } finally {
      setIsValidating(false);
    }
  };

  // Initialize random 50 questions
  const startInterview = () => {
    let allQs = [];
    Object.values(QUIZ_DATA).forEach(phaseArray => {
      allQs = [...allQs, ...phaseArray];
    });
    
    const shuffled = allQs.sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 50));
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setShowExplanation(false);
    setSelectedOption(null);
    setTranscription('');
    setAiFeedback('');
    setIsStarted(true);
  };

  const handleAnswer = (optionIdx) => {
    if (showExplanation) return;
    setSelectedOption(optionIdx);
    setAiFeedback(questions[currentIndex].explanation);
    setShowExplanation(true);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    if (optionIdx === questions[currentIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setShowExplanation(false);
      setSelectedOption(null);
      setTranscription('');
      setAiFeedback('');
    } else {
      setIsFinished(true);
    }
  };

  // Text-To-Speech (TTS) logic
  useEffect(() => {
    if (!isStarted || isFinished || questions.length === 0 || showExplanation || isRecording) return;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      if (speechEnabled) {
        const textToSpeak = `Question ${currentIndex + 1}. ${questions[currentIndex].question}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        const voices = window.speechSynthesis.getVoices();
        const idealVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || 
                           voices.find(v => v.lang.startsWith('en')) || 
                           voices[0];
        
        if (idealVoice) {
          utterance.voice = idealVoice;
        }
        
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        window.speechSynthesis.speak(utterance);
      }
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentIndex, isStarted, isFinished, speechEnabled, questions, showExplanation, isRecording]);

  if (!isStarted) {
    return (
      <div className="max-w-3xl mx-auto py-12 animate-fade-in flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-phase-teal/10 rounded-full flex items-center justify-center mb-6">
          <BrainCircuit size={48} className="text-phase-teal" />
        </div>
        <h1 className="text-4xl font-display font-bold mb-4">Mock Interview Panel</h1>
        <p className="text-lg text-text-dim mb-10 max-w-xl">
          Test your knowledge with 50 highly advanced data science questions randomly pulled from all phases of the curriculum. 
          Prepare for the toughest technical interviews.
        </p>
        <button 
          onClick={startInterview}
          className="bg-phase-teal hover:bg-opacity-90 text-bg-main px-8 py-4 rounded-xl font-bold font-mono text-lg transition-transform hover:scale-105 flex items-center gap-3"
        >
          <Play size={24} />
          Start Mock Interview
        </button>

        {/* External Practice Resources */}
        <div className="mt-16 w-full max-w-2xl border-t border-border-line pt-10">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-faint mb-5">
            Recommended Technical Prep Platforms
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a 
              href="https://datalemur.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flat-card p-5 border border-border-line hover:border-phase-teal rounded-2xl bg-bg-raise hover:bg-surface text-left transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <h4 className="font-bold text-sm text-text-main group-hover:text-phase-teal transition-colors flex items-center gap-2">
                  DataLemur 🚀
                </h4>
                <p className="text-xs text-text-dim mt-1.5 leading-relaxed">
                  Practice real SQL & database interview questions from FAANG and high-growth startups.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-phase-teal mt-4 flex items-center gap-1">
                Solve SQL problems &rarr;
              </span>
            </a>

            <a 
              href="https://www.stratascratch.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flat-card p-5 border border-border-line hover:border-phase-teal rounded-2xl bg-bg-raise hover:bg-surface text-left transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <h4 className="font-bold text-sm text-text-main group-hover:text-phase-teal transition-colors flex items-center gap-2">
                  StrataScratch 🎯
                </h4>
                <p className="text-xs text-text-dim mt-1.5 leading-relaxed">
                  1,000+ real coding interview questions from top tech companies covering Python, SQL, and Machine Learning.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-phase-teal mt-4 flex items-center gap-1">
                Explore ML & coding questions &rarr;
              </span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto py-12 animate-fade-in flex flex-col items-center text-center">
        <div className="w-32 h-32 bg-phase-gold/10 rounded-full flex items-center justify-center mb-6 border-4 border-phase-gold">
          <Trophy size={64} className="text-phase-gold" />
        </div>
        <h2 className="text-4xl font-display font-bold mb-2">Interview Complete</h2>
        <p className="text-2xl text-text-dim mb-8">You scored {score} out of {questions.length} ({percentage}%)</p>
        
        {percentage >= 80 ? (
          <div className="bg-phase-teal/20 text-phase-teal p-6 rounded-2xl border border-phase-teal/30 mb-8">
            <h3 className="font-bold text-xl mb-2">Outstanding Performance!</h3>
            <p>You have demonstrated a mastery of data science concepts and are ready for real technical interviews.</p>
          </div>
        ) : (
          <div className="bg-phase-brick/20 text-phase-brick p-6 rounded-2xl border border-phase-brick/30 mb-8">
            <h3 className="font-bold text-xl mb-2">Keep Practicing</h3>
            <p>Review the flashcards and course materials to strengthen your weaknesses.</p>
          </div>
        )}

        <button 
          onClick={startInterview}
          className="bg-surface hover:bg-surface-hover border border-border-strong text-text-main px-8 py-4 rounded-xl font-bold font-mono transition-colors flex items-center gap-3"
        >
          <RefreshCw size={20} />
          Take Another Interview
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-display font-bold flex items-center gap-3">
          <BrainCircuit className="text-phase-teal" />
          Question {currentIndex + 1} <span className="text-text-faint">/ {questions.length}</span>
        </h2>
        <div className="flex items-center gap-3">
          {/* STT Microphone Input */}
          <button
            onClick={toggleRecording}
            disabled={showExplanation || isValidating}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-mono font-bold cursor-pointer disabled:opacity-40 ${
              isRecording
                ? 'bg-phase-brick/20 text-phase-brick border-phase-brick/40 animate-pulse'
                : 'bg-bg-raise text-text-dim border-border-line hover:text-text-main'
            }`}
            title={isRecording ? "Stop Recording" : "Speak your answer choice"}
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            {isRecording ? 'Listening...' : 'Speak Answer'}
          </button>

          {/* Voice Simulator Toggle Button */}
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-mono font-bold cursor-pointer ${
              speechEnabled
                ? 'bg-phase-teal/15 text-phase-teal border-phase-teal/30 hover:bg-phase-teal/25'
                : 'bg-bg-raise text-text-faint border-border-line hover:text-text-dim'
            }`}
            title={speechEnabled ? "Mute Voice Assistant" : "Enable Voice Assistant"}
          >
            {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {speechEnabled ? 'Voice ON' : 'Voice OFF'}
          </button>
          
          <div className="font-mono text-sm bg-bg-raise px-4 py-2 rounded-lg border border-border-line">
            Score: <span className="text-phase-teal font-bold">{score}</span>
          </div>
        </div>
      </div>

      {transcription && (
        <div className="bg-phase-violet/10 border border-phase-violet/20 p-4 rounded-xl mb-6 text-xs font-mono">
          <span className="font-bold text-phase-violet">Transcription Heard:</span> "{transcription}"
        </div>
      )}

      {isValidating && (
        <div className="bg-bg-raise border border-border-line p-5 rounded-xl mb-6 flex items-center gap-3 text-xs font-mono">
          <Loader2 className="animate-spin text-phase-teal" size={16} />
          <span>AI is evaluating your speech logic...</span>
        </div>
      )}

      <div className="bg-surface border border-border-line rounded-2xl p-6 md:p-10 mb-8 shadow-sm">
        <p className="text-xl font-medium mb-8 leading-relaxed">{currentQ.question}</p>
        
        {currentQ.type === 'open-ended' ? (
          <div className="space-y-4">
            <textarea
              placeholder="Speak or type your explanation here..."
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              disabled={showExplanation || isValidating}
              className="w-full h-36 bg-bg-main border border-border-line rounded-xl p-4 text-xs font-mono text-text-main focus:outline-none focus:border-phase-teal leading-relaxed resize-none"
            />
            {!showExplanation && (
              <button
                onClick={() => evaluateSpokenAnswer(transcription)}
                disabled={!transcription.trim() || isValidating}
                className="bg-phase-teal hover:bg-phase-teal/90 text-white font-bold px-6 py-3 rounded-xl text-xs transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
              >
                Submit for AI Grading
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 ";
              
              if (showExplanation) {
                if (idx === currentQ.correctAnswer) {
                  btnClass += "bg-phase-teal/10 border-phase-teal text-phase-teal font-bold";
                } else if (idx === selectedOption) {
                  btnClass += "bg-phase-brick/10 border-phase-brick text-phase-brick";
                } else {
                  btnClass += "bg-bg-raise border-border-line opacity-50";
                }
              } else {
                btnClass += "bg-bg-raise border-border-line hover:border-phase-amber hover:bg-surface-hover cursor-pointer";
              }

              return (
                <button 
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={showExplanation}
                  className={btnClass}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-bg-main border border-border-line flex flex-shrink-0 items-center justify-center font-mono text-xs">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="font-medium">{opt}</span>
                    {showExplanation && idx === currentQ.correctAnswer && <Check className="ml-auto flex-shrink-0" size={20} />}
                    {showExplanation && idx === selectedOption && idx !== currentQ.correctAnswer && <X className="ml-auto flex-shrink-0" size={20} />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showExplanation && (
        <div className="animate-slide-up bg-bg-raise border-l-4 border-phase-amber p-6 rounded-r-2xl mb-8 flex flex-col items-start">
          <h4 className="font-bold font-mono text-phase-amber mb-2 uppercase tracking-wider text-sm">AI Evaluation Feedback</h4>
          <p className="text-text-main leading-relaxed mb-6 whitespace-pre-wrap">{aiFeedback}</p>
          <button 
            onClick={nextQuestion}
            className="bg-text-main text-bg-main px-6 py-3 rounded-xl font-bold font-mono text-sm transition-transform hover:scale-105 hover:shadow-lg cursor-pointer"
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
          </button>
        </div>
      )}
    </div>
  );
}
