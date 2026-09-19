import React from 'react';
import { motion } from 'framer-motion';

export interface BlurFadeProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export const BlurFade: React.FC<BlurFadeProps> = ({
  children,
  delay = 0,
  duration = 0.4,
  yOffset = 12,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -yOffset, filter: 'blur(6px)' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
