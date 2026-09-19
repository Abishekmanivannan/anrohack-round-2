import React from 'react';

export interface GlowBorderProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlowBorder: React.FC<GlowBorderProps> = ({
  children,
  className = '',
  glowColor = 'from-teal-500 via-indigo-500 to-emerald-400',
}) => {
  return (
    <div className={`relative p-[1.5px] rounded-2xl overflow-hidden group ${className}`}>
      <div
        className={`absolute -inset-[100%] bg-gradient-to-r ${glowColor} opacity-70 blur-xs transition-all duration-700 group-hover:opacity-100 animate-spin-slow`}
      />
      <div className="relative rounded-2xl bg-slate-900 h-full w-full">{children}</div>
    </div>
  );
};
