import React, { useState, useEffect, useRef } from 'react';
import { playLevelUp } from '../utils/audioEngine';
import { Trophy, Sparkles, X, ChevronRight } from 'lucide-react';

export function LevelUpOverlay() {
  const [level, setLevel] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleLevelUp = (e) => {
      const newLevel = e.detail?.level;
      if (newLevel) {
        setLevel(newLevel);
        setIsOpen(true);
        // Play triumphant synthesized arpeggio chime!
        playLevelUp();
      }
    };

    window.addEventListener('level-up-triggered', handleLevelUp);
    return () => window.removeEventListener('level-up-triggered', handleLevelUp);
  }, []);

  // Confetti Animation Effect inside overlay canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Confetti {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 8 + 4;
        this.color = ['#9b8ec4', '#7bc8c4', '#e8a87c', '#d4849a', '#c490b0', '#d4b87c'][Math.floor(Math.random() * 6)];
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 3 + 3;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 4 - 2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        if (this.y > canvas.height) {
          this.y = -20;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    const confettis = Array.from({ length: 80 }, () => new Confetti());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettis.forEach(c => {
        c.update();
        c.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md animate-fade-in">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full z-10" />

      {/* Triumphant Card Panel */}
      <div className="relative z-20 w-full max-w-md mx-4 p-8 rounded-3xl bg-surface border border-border-strong shadow-2xl text-center space-y-6 animate-scale-in">
        {/* Dismiss Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-text-faint hover:text-text-main hover:bg-bg-raise transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Animated Trophy badge */}
        <div className="flex justify-center">
          <div className="relative p-6 bg-phase-gold/15 rounded-full text-phase-gold border border-phase-gold/30 animate-bounce-in">
            <Trophy size={48} className="animate-pulse" />
            <Sparkles size={20} className="absolute top-1 right-1 text-phase-amber animate-float" />
          </div>
        </div>

        {/* Level Up Stats details */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold text-phase-amber uppercase tracking-widest block">
            Roadmap Promotion
          </span>
          <h2 className="text-3xl font-extrabold font-display text-text-main leading-tight">
            Level Up!
          </h2>
          <p className="text-sm text-text-dim max-w-xs mx-auto">
            Congratulations! You've unlocked higher privileges and proven your data scientist capacity.
          </p>
        </div>

        {/* Level Badge Banner */}
        <div className="p-4 bg-bg-raise rounded-2xl border border-border-line flex items-center justify-center gap-4">
          <div className="text-right">
            <span className="text-[10px] font-mono text-text-faint uppercase block">Rank Promotion</span>
            <span className="text-xs font-bold text-text-main">Data Science Squire</span>
          </div>
          <div className="h-8 w-px bg-border-line" />
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black font-mono text-phase-violet">Lvl {level}</span>
          </div>
        </div>

        {/* Call to action */}
        <button
          onClick={() => setIsOpen(false)}
          className="w-full py-3 bg-phase-violet hover:bg-phase-violet/85 text-white font-mono font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Continue Journey</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
