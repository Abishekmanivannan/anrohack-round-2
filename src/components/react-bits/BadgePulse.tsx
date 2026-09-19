import React from 'react';

export interface BadgePulseProps {
  color?: 'teal' | 'emerald' | 'amber' | 'rose' | 'indigo';
  label?: string;
  className?: string;
}

export const BadgePulse: React.FC<BadgePulseProps> = ({
  color = 'teal',
  label,
  className = '',
}) => {
  const colors = {
    teal: 'bg-teal-500 text-teal-700 bg-teal-50 border-teal-200',
    emerald: 'bg-emerald-500 text-emerald-700 bg-emerald-50 border-emerald-200',
    amber: 'bg-amber-500 text-amber-700 bg-amber-50 border-amber-200',
    rose: 'bg-rose-500 text-rose-700 bg-rose-50 border-rose-200',
    indigo: 'bg-indigo-500 text-indigo-700 bg-indigo-50 border-indigo-200',
  };

  const dotColors = {
    teal: 'bg-teal-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${colors[color]} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColors[color]} opacity-75`}
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[color]}`} />
      </span>
      {label && <span>{label}</span>}
    </span>
  );
};
