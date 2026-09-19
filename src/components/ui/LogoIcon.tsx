import React from 'react';

interface LogoIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const LogoIcon: React.FC<LogoIconProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      <img
        src="/logo-icon.png"
        alt="CareFlow Logo"
        className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]"
      />
    </div>
  );
};
