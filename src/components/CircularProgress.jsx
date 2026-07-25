import { useEffect, useRef, useState, useId } from 'react';

/**
 * SVG-based circular progress ring with animated fill.
 * Animates from 0 → target `percent` on mount using a spring-like easing.
 */
export function CircularProgress({
  percent = 0,
  size = 80,
  strokeWidth = 6,
  color = 'var(--violet)',
  label = '',
}) {
  const [rendered, setRendered] = useState(0);
  const rafRef = useRef(null);
  const gradientId = useId();

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Clamp percent to 0-100
  const target = Math.max(0, Math.min(100, percent));

  // Animate on mount / when target changes
  useEffect(() => {
    const duration = 900; // ms
    const start = performance.now();
    const from = 0;

    const ease = (t) => {
      // cubic-bezier(0.16, 1, 0.3, 1) approximation — fast start, smooth deceleration
      return 1 - Math.pow(1 - t, 3);
    };

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = ease(progress);
      setRendered(from + (target - from) * eased);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  const offset = circumference - (rendered / 100) * circumference;
  const displayPercent = Math.round(rendered);

  // Determine if color is a CSS variable reference
  const isVar = typeof color === 'string' && color.startsWith('var(');
  const resolvedColor = color;

  return (
    <div
      className="inline-flex flex-col items-center justify-center gap-1"
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ? `${label}: ${displayPercent}%` : `${displayPercent}% complete`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="block -rotate-90"
          aria-hidden="true"
        >
          <defs>
            {/* Gradient stop colors inherit the CSS variable via `stop-color` */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={resolvedColor} stopOpacity={1} />
              <stop offset="100%" stopColor={resolvedColor} stopOpacity={0.6} />
            </linearGradient>
          </defs>

          {/* Track ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--line)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={isVar ? resolvedColor : `url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-100 ease-out"
          />
        </svg>

        {/* Center text overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        >
          <span
            className="font-display font-bold leading-none text-text-main"
            style={{ fontSize: size * 0.24 }}
          >
            {displayPercent}
            <span
              className="font-normal text-text-faint"
              style={{ fontSize: size * 0.14 }}
            >
              %
            </span>
          </span>
          {label && (
            <span
              className="text-text-dim font-medium leading-tight mt-0.5 text-center max-w-full truncate px-1"
              style={{ fontSize: Math.max(size * 0.12, 10) }}
            >
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
