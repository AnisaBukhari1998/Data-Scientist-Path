import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Undo2 } from 'lucide-react';

export function UndoToast({ message, onUndo, onDismiss, duration = 5000 }) {
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef(null);

  const handleDismiss = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  }, [isExiting, onDismiss]);

  const handleUndo = useCallback(() => {
    if (isExiting) return;
    onUndo?.();
    setIsExiting(true);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  }, [isExiting, onUndo, onDismiss]);

  useEffect(() => {
    timerRef.current = setTimeout(handleDismiss, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [duration, handleDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 
        glass rounded-xl px-5 py-3 flex items-center gap-4 shadow-lg
        min-w-[280px] max-w-[420px]
        transition-all duration-300 ease-out
        ${isExiting 
          ? 'opacity-0 translate-y-4 pointer-events-none' 
          : 'animate-slide-up opacity-100'
        }`}
    >
      {/* Message */}
      <span className="text-sm font-medium text-text-main flex-1 truncate">
        {message}
      </span>

      {/* Undo button */}
      <button
        onClick={handleUndo}
        className="flex items-center gap-1.5 text-sm font-semibold text-phase-violet 
          hover:text-phase-violet/80 transition-colors shrink-0 cursor-pointer
          focus:outline-none focus-visible:ring-2 focus-visible:ring-phase-violet/40 rounded"
      >
        <Undo2 size={14} />
        Undo
      </button>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="p-1 rounded-md text-text-faint hover:text-text-main 
          hover:bg-surface-hover transition-colors shrink-0 cursor-pointer
          focus:outline-none focus-visible:ring-2 focus-visible:ring-phase-violet/40"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
