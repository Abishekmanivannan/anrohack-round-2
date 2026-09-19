import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverable ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border border-white/10 bg-slate-900/80 p-5 text-white shadow-card transition-all duration-200 ${
        hoverable ? 'hover:shadow-card-hover hover:border-white/20 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};
