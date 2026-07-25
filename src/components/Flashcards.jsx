import { useState } from 'react';
import { Repeat, CheckCircle2, RotateCcw, BrainCircuit, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { FLASHCARDS } from '../data/flashcardsData';

export function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [learningCount, setLearningCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  /* Extract unique categories for filter */
  const categories = ['All', ...new Set(FLASHCARDS.map(c => c.category))];
  const filteredCards = selectedCategory === 'All'
    ? FLASHCARDS
    : FLASHCARDS.filter(c => c.category === selectedCategory);

  const card = filteredCards[currentIndex % filteredCards.length];

  const handleNext = (known) => {
    setIsFlipped(false);
    setTimeout(() => {
      if (known) setKnownCount(prev => prev + 1);
      else setLearningCount(prev => prev + 1);
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 300);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 300);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(Math.floor(Math.random() * filteredCards.length));
    }, 300);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCount(0);
    setLearningCount(0);
  };

  const progress = ((currentIndex) / filteredCards.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <header className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-3 bg-phase-violet/15 rounded-xl text-phase-violet">
            <BrainCircuit size={32} />
          </div>
          <h2 className="text-3xl font-bold font-display text-text-main">Master Data Science</h2>
        </div>
        <p className="text-text-dim">
          Learn the {filteredCards.length} most important terms to ace your interviews.
        </p>
      </header>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setCurrentIndex(0); setIsFlipped(false); }}
            className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-phase-violet/15 text-phase-violet border-phase-violet/30 font-bold'
                : 'bg-surface text-text-faint border-border-line hover:text-text-dim hover:border-border-strong'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-surface p-4 rounded-2xl border border-border-line flex items-center gap-4">
        <span className="text-sm font-medium text-text-faint whitespace-nowrap font-mono">
          {(currentIndex % filteredCards.length) + 1} / {filteredCards.length}
        </span>
        <div className="flex-1 h-2 bg-bg-raise rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-phase-violet to-phase-rose transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard 3D Container */}
      <div
        className="relative w-full h-80 md:h-96 perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`w-full h-full relative preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>

          {/* Front of card */}
          <div className="absolute inset-0 backface-hidden bg-surface rounded-2xl border border-border-line p-8 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow">
            <span className="absolute top-6 left-6 text-sm font-semibold tracking-wider text-phase-violet uppercase font-mono">
              {card.category}
            </span>
            <h3 className="text-4xl md:text-5xl font-bold font-display text-text-main leading-tight">
              {card.term}
            </h3>
            <span className="absolute bottom-6 text-sm text-text-faint flex items-center gap-2">
              <RotateCcw size={16} /> Tap to flip
            </span>
          </div>

          {/* Back of card */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-phase-violet/5 rounded-2xl border border-phase-violet/20 p-8 flex flex-col items-center justify-center text-center">
            <h4 className="text-xl font-bold text-phase-violet font-display mb-4 pb-4 border-b border-border-line w-full">
              {card.term}
            </h4>
            <p className="text-lg md:text-xl text-text-dim leading-relaxed overflow-y-auto custom-scrollbar">
              {card.definition}
            </p>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center items-center gap-3">
        <button
          onClick={handlePrev}
          className="p-3 rounded-xl bg-surface border border-border-line text-text-dim hover:text-text-main hover:border-border-strong transition-all"
          aria-label="Previous card"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleShuffle}
          className="p-3 rounded-xl bg-surface border border-border-line text-text-dim hover:text-text-main hover:border-border-strong transition-all"
          aria-label="Random card"
        >
          <Shuffle size={20} />
        </button>
        <button
          onClick={handlePrev}
          className="p-3 rounded-xl bg-surface border border-border-line text-text-dim hover:text-text-main hover:border-border-strong transition-all"
          aria-label="Next card"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4 pt-2">
        <button
          onClick={() => handleNext(false)}
          className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-phase-amber/10 hover:bg-phase-amber/20 text-phase-amber font-semibold transition-colors"
        >
          <Repeat size={20} />
          Still Learning
        </button>
        <button
          onClick={() => handleNext(true)}
          className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-phase-teal/10 hover:bg-phase-teal/20 text-phase-teal font-semibold transition-colors"
        >
          <CheckCircle2 size={20} />
          Got It!
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        <div className="bg-surface p-4 rounded-2xl border border-border-line text-center">
          <div className="text-2xl font-bold text-phase-teal font-display">{knownCount}</div>
          <div className="text-sm text-text-faint">Mastered</div>
        </div>
        <div className="bg-surface p-4 rounded-2xl border border-border-line text-center">
          <div className="text-2xl font-bold text-phase-amber font-display">{learningCount}</div>
          <div className="text-sm text-text-faint">Reviewing</div>
        </div>
        <button
          onClick={handleReset}
          className="col-span-2 bg-bg-raise hover:bg-surface p-4 rounded-2xl border border-border-line text-center flex items-center justify-center gap-2 text-text-dim transition-colors"
        >
          <RotateCcw size={20} />
          Reset Session
        </button>
      </div>
    </div>
  );
}
