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
      className={`rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/80 p-5 text-slate-900 dark:text-white shadow-sm dark:shadow-card transition-all duration-200 ${
        hoverable ? 'hover:shadow-md dark:hover:shadow-card-hover hover:border-slate-300 dark:hover:border-white/20 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};
