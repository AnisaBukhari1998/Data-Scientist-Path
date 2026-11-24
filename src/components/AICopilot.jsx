import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { getGenerativeModel } from 'firebase/ai';
import { ai } from '../firebase';
import { X, Send, Sparkles, Loader2, LogIn, Mic, MicOff, BookOpen, Layers, FileText } from 'lucide-react';

export function AICopilot() {
  const { currentUser } = useAuth();
  const { progress, setProgress, syncProgress } = useProgress();
  // Start closed: open by default, the panel covered most of the page on phones.
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Hello! I'm your AI Study Copilot 🌾 powered by Gemini. Ask me anything about data science, Python, ML, SQL, or your Harvest Guardian capstone!"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);
  const scrollRef = useRef(null);

  // States for new features
  const [isRecording, setIsRecording] = useState(false);
  const [socraticActive, setSocraticActive] = useState(false);
  const [showPaperUpload, setShowPaperUpload] = useState(false);
  const [paperText, setPaperText] = useState('');
  const recognitionRef = useRef(null);

  const tutor = progress._aiTutorPersonality || 'mentor';
  const industry = progress._targetIndustry || 'tech';

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => setIsRecording(true);
      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setInputVal(prev => prev ? prev + ' ' + text : text);
      };
      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);
      recognitionRef.current = rec;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech-to-Text not supported in this browser. Please use Chrome/Safari.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Build instruction prompt dynamically
  const getSystemInstruction = () => {
    let tutorPrompt = "You are an encouraging mentor study tutor. Break down coding gently.";
    if (tutor === 'coach') {
      tutorPrompt = "You are a strict study coach. Pushes for high clean-code standards and answers directly with accountability.";
    } else if (tutor === 'academic') {
      tutorPrompt = "You are a technical academic tutor. Explain concepts with math proofs and refer to research papers.";
    }

    let instruction = `${tutorPrompt} Help the student with Python, SQL, stats, ML, and their Harvest Guardian capstone (industry focus: ${industry}). Keep responses under 120 words. Use markdown coding blocks.`;

    if (socraticActive) {
      instruction += " CRITICAL: You are in Socratic Mode. Do NOT give direct answers. Instead, respond with guiding questions that lead the student to find the answer themselves.";
    }
    return instruction;
  };

  // Re-init chat session on instruction changes
  useEffect(() => {
    if (currentUser && ai) {
      try {
        const model = getGenerativeModel(ai, {
          model: 'gemini-3.5-flash',
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.7,
          },
          systemInstruction: {
            parts: [{ text: getSystemInstruction() }]
          }
        });

        chatRef.current = model.startChat({ history: [] });
      } catch (err) {
        console.error('Failed to init Gemini chat:', err);
      }
    } else {
      chatRef.current = null;
    }
  }, [currentUser, tutor, industry, socraticActive]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputVal.trim();
    if (!text) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputVal('');
    setIsTyping(true);

    if (currentUser && chatRef.current) {
      try {
        const result = await chatRef.current.sendMessage(text);
        const reply = result.response.text();
        setMessages(prev => [...prev, { role: 'model', text: reply }]);
      } catch (err) {
        console.error('Gemini error:', err);
        setMessages(prev => [...prev, { role: 'model', text: '⚠️ Service busy. Please try again.' }]);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Mock fallback
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'model', text: "Please log in to activate the live Gemini tutor!" }]);
        setIsTyping(false);
      }, 800);
    }
  };

  // Instant Card Generator
  const generateInstantCard = async () => {
    setIsTyping(true);
    const lastMsg = messages[messages.length - 1]?.text || "Machine Learning basics";
    
    if (currentUser && ai) {
      try {
        const model = getGenerativeModel(ai, {
          model: 'gemini-3.5-flash',
          generationConfig: {
            responseMimeType: 'application/json',
            maxOutputTokens: 256,
            temperature: 0.4,
          }
        });

        const prompt = `Create a single high-quality study flashcard summarizing key concepts from: "${lastMsg}".
Respond ONLY with this exact JSON format:
{
  "front": "The concept question or term",
  "back": "The brief description or answer"
}`;

        const res = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
        const data = JSON.parse(res.response.text());
        
        // Add to global custom flashcard list
        const customCards = progress._customFlashcards || [];
        const nextProgress = {
          ...progress,
          _customFlashcards: [...customCards, { id: Date.now(), ...data }]
        };
        
        // Save progress (if syncProgress isn't exported, write local fallback)
        setProgress(nextProgress);
        localStorage.setItem('dsp_progress', JSON.stringify(nextProgress));

        setMessages(prev => [...prev, { role: 'model', text: `✨ Custom flashcard successfully generated and saved! \n\n**Front:** ${data.front}\n**Back:** ${data.back}` }]);
      } catch (err) {
        console.error("Flashcard generation failed:", err);
      } finally {
        setIsTyping(false);
      }
    } else {
      alert("Sign in to generate custom flashcards!");
      setIsTyping(false);
    }
  };

  // Paper Summarizer
  const summarizePaper = async () => {
    if (!paperText.trim()) return;
    setIsTyping(true);
    setShowPaperUpload(false);
    
    if (currentUser && ai) {
      try {
        const model = getGenerativeModel(ai, {
          model: 'gemini-3.5-flash',
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.2,
          }
        });

        const prompt = `You are a research papers reviewer. Summarize the following research abstract, focus on extracting its core mathematical equations/logic:
"${paperText}"`;

        const res = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
        setMessages(prev => [...prev, { 
          role: 'user', 
          text: `Paper Abstract Upload: "${paperText.slice(0, 50)}..."` 
        }, { 
          role: 'model', 
          text: `📄 **Research Paper Mathematical Breakdown:**\n\n${res.response.text()}` 
        }]);
      } catch (err) {
        console.error("Paper summary failed:", err);
      } finally {
        setIsTyping(false);
        setPaperText('');
      }
    } else {
      alert("Sign in to review research papers!");
      setIsTyping(false);
    }
  };

  return (
    // bottom-24 on phones keeps the button above the bottom menu bar.
    <div className="fixed bottom-24 md:bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-phase-amber hover:bg-phase-amber/90 hover:scale-105 transition-all text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer border border-white/20"
          aria-label="Open AI Copilot"
        >
          <Sparkles size={24} className="animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] bg-surface border border-border-line rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
          
          {/* Header */}
          <div className="px-4 py-3 bg-phase-amber/10 border-b border-border-line flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-phase-amber" />
              <div>
                <h4 className="text-xs font-bold text-text-main">AI Study Copilot</h4>
                <p className="text-[10px] text-text-faint font-mono uppercase">
                  {tutor} • {industry}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Socratic toggle */}
              <button
                onClick={() => setSocraticActive(!socraticActive)}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold cursor-pointer transition-colors border ${
                  socraticActive 
                    ? 'bg-phase-rose/15 border-phase-rose text-phase-rose' 
                    : 'bg-bg-raise border-border-line text-text-faint hover:text-text-dim'
                }`}
                title="Toggle Socratic Mode (asking queries instead of giving keys)"
              >
                Socratic {socraticActive ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-text-faint hover:text-text-main rounded-lg"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Action Ribbon */}
          <div className="px-4 py-1.5 bg-bg-raise/50 border-b border-border-line flex justify-between text-[10px] font-mono font-bold text-text-dim">
            <button 
              onClick={generateInstantCard}
              disabled={messages.length <= 1 || isTyping}
              className="flex items-center gap-1 hover:text-phase-violet disabled:opacity-40 cursor-pointer"
              title="Create flashcard from last AI reply"
            >
              <Layers size={10} /> Generate Card
            </button>
            <button 
              onClick={() => setShowPaperUpload(!showPaperUpload)}
              className="flex items-center gap-1 hover:text-phase-teal cursor-pointer"
            >
              <FileText size={10} /> Paper Dropspace
            </button>
          </div>

          {/* Paper Summarizer Upload panel */}
          {showPaperUpload && (
            <div className="bg-bg-raise p-3 border-b border-border-line space-y-2 animate-slide-up">
              <textarea
                placeholder="Paste paper abstract or details here..."
                value={paperText}
                onChange={(e) => setPaperText(e.target.value)}
                className="w-full h-16 bg-surface border border-border-line rounded-lg p-2 text-[10px] font-mono focus:outline-none focus:border-phase-teal"
              />
              <div className="flex justify-end gap-2 text-[10px] font-mono">
                <button onClick={() => setShowPaperUpload(false)} className="px-2 py-1 text-text-faint">Cancel</button>
                <button onClick={summarizePaper} className="bg-phase-teal text-white px-3 py-1 rounded">Summarize</button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-phase-amber text-white rounded-tr-none'
                      : 'bg-bg-raise text-text-main border border-border-line rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-bg-raise text-text-faint border border-border-line rounded-2xl rounded-tl-none px-3.5 py-2 text-xs flex items-center gap-1.5 animate-pulse">
                  <Loader2 size={12} className="animate-spin" /> Thinking...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-border-line bg-surface flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl border cursor-pointer transition-all ${
                isRecording 
                  ? 'bg-phase-brick/20 border-phase-brick text-phase-brick animate-pulse'
                  : 'bg-bg-raise border-border-line text-text-faint hover:text-text-dim'
              }`}
              title="Dictate with voice input"
            >
              {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
            
            <input
              type="text"
              placeholder={currentUser ? "Ask Gemini..." : "Ask a question..."}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-bg-main border border-border-line rounded-xl px-3 py-2 text-xs text-text-main focus:outline-none focus:border-phase-amber"
            />
            
            <button
              type="submit"
              disabled={isTyping}
              className="bg-phase-amber hover:bg-phase-amber/90 text-white p-2 rounded-xl disabled:opacity-50 flex items-center justify-center cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
