import React, { useEffect, useState } from 'react';

export interface CounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export const Counter: React.FC<CounterProps> = ({ value, duration = 1000, className = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }

    const totalMiliseconds = duration;
    const incrementTime = (totalMiliseconds / end) * 0.8;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, Math.max(incrementTime, 30));

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span className={className}>{count}</span>;
};
