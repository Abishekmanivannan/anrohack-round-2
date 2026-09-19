import React from 'react';

export interface AnimatedGridPatternProps {
  className?: string;
  numSquares?: number;
  maxOpacity?: number;
}

export const AnimatedGridPattern: React.FC<AnimatedGridPatternProps> = ({
  className = '',
  maxOpacity = 0.15,
}) => {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full stroke-slate-300/40 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)] ${className}`}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="grid-pattern-svg"
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
          x="-1"
          y="-1"
        >
          <path d="M.5 32V.5H32" fill="none" strokeDasharray="0" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid-pattern-svg)" />
    </svg>
  );
};
