import { useEffect, useCallback, useId } from 'react';
import { Monitor, Sun, Moon } from 'lucide-react';

const modes = [
  { key: 'system', label: 'System theme', Icon: Monitor },
  { key: 'light', label: 'Light theme', Icon: Sun },
  { key: 'dark', label: 'Dark theme', Icon: Moon },
];

/**
 * Three-way theme toggle: System / Light / Dark.
 * Stores preference in localStorage under 'theme-mode'.
 * Resolves actual dark/light from system preference when mode is 'system'.
 */
export function ThemeToggle({ currentMode = 'system', onModeChange }) {
  const groupId = useId();

  /** Resolve whether the current configuration should be dark */
  const resolveIsDark = useCallback((mode) => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    // system
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, []);

  // Persist preference and notify parent when mode changes
  const handleSelect = useCallback(
    (mode) => {
      localStorage.setItem('theme-mode', mode);
      onModeChange?.(mode);
    },
    [onModeChange],
  );

  // Listen for OS-level theme changes when in 'system' mode
  useEffect(() => {
    if (currentMode !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      // Re-trigger mode change so the parent can re-resolve isDark
      onModeChange?.('system');
    };

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [currentMode, onModeChange]);

  const activeIndex = modes.findIndex((m) => m.key === currentMode);

  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className="relative inline-flex items-center gap-0.5 rounded-full p-1
                 bg-surface/70 backdrop-blur-xl border border-border-line
                 shadow-sm"
    >
      {/* Sliding indicator */}
      <span
        aria-hidden="true"
        className="absolute top-1 left-1 h-[calc(100%-0.5rem)] rounded-full
                   bg-bg-raise border border-border-line
                   shadow-sm
                   transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: `calc((100% - 0.5rem - 0.25rem) / 3)`,
          transform: `translateX(calc(${activeIndex} * (100% + 2px)))`,
        }}
      />

      {modes.map(({ key, label, Icon }) => {
        const isActive = key === currentMode;
        const inputId = `${groupId}-${key}`;

        return (
          <label
            key={key}
            htmlFor={inputId}
            title={label}
            className={`
              relative z-10 flex items-center justify-center
              w-8 h-8 rounded-full cursor-pointer
              transition-colors duration-200
              ${isActive ? 'text-text-main' : 'text-text-faint hover:text-text-dim'}
            `}
          >
            <input
              type="radio"
              id={inputId}
              name={`${groupId}-theme`}
              value={key}
              checked={isActive}
              onChange={() => handleSelect(key)}
              className="sr-only"
              aria-label={label}
            />
            <Icon size={16} strokeWidth={2} aria-hidden="true" />
          </label>
        );
      })}
    </div>
  );
}
