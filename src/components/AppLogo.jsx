import { useId } from 'react';

export function AppLogo({ size = 36, className = "" }) {
  const gradientId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-[0_8px_16px_rgba(124,58,237,0.35)] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${className}`}
    >
      {/* Gradient Background Squircle */}
      <rect
        width="100"
        height="100"
        rx="26"
        fill={`url(#${gradientId})`}
      />
      
      {/* Subtle Orbital Pathways */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <circle
        cx="50"
        cy="50"
        r="28"
        stroke="rgba(255, 255, 255, 0.25)"
        strokeWidth="1"
      />

      {/* Styled Bar Chart & Neural Nodes */}
      {/* Node 1 - Base of Bar 1 */}
      <circle cx="34" cy="66" r="4.5" fill="#ffffff" />
      {/* Bar 1 line */}
      <line x1="34" y1="66" x2="34" y2="42" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      {/* Node 2 - Top of Bar 1 */}
      <circle cx="34" cy="42" r="5" fill="#ffffff" />

      {/* Node 3 - Base of Bar 2 */}
      <circle cx="50" cy="66" r="4.5" fill="#ffffff" />
      {/* Bar 2 line */}
      <line x1="50" y1="66" x2="50" y2="28" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      {/* Node 4 - Top of Bar 2 */}
      <circle cx="50" cy="28" r="5.5" fill="#ffffff" />

      {/* Node 5 - Base of Bar 3 */}
      <circle cx="66" cy="66" r="4.5" fill="#ffffff" />
      {/* Bar 3 line */}
      <line x1="66" y1="66" x2="66" y2="48" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      {/* Node 6 - Top of Bar 3 */}
      <circle cx="66" cy="48" r="5" fill="#ffffff" />

      {/* Interlinked neural network arches */}
      <path
        d="M34 42 C 40 32, 45 28, 50 28"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 28 C 55 28, 60 38, 66 48"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Center glowing star representing data insights - scales on hover */}
      <path
        d="M50 42 L52.5 45.5 L56 48 L52.5 50.5 L50 54 L47.5 50.5 L44 48 L47.5 45.5 Z"
        fill="#ffe58f"
        className="animate-pulse origin-center transition-transform duration-500 group-hover:scale-125"
      />

      {/* Gradients - Vibrant, high-contrast hex gradient to ensure excellent visibility in both light & dark themes */}
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#db2777" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
    </svg>
  );
}
