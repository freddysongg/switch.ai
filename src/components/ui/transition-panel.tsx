'use client';

import { motion } from 'motion/react';
import type * as React from 'react';

import { cn } from '@/lib/utils.js';

interface TransitionPanelProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
}

export function TransitionPanel({
  children,
  className,
  direction = 'up',
  duration = 0.5,
  delay = 0
}: TransitionPanelProps) {
  const directionMap = {
    left: { x: '-100%', y: 0 },
    right: { x: '100%', y: 0 },
    up: { x: 0, y: '-100%' },
    down: { x: 0, y: '100%' }
  };

  const initial = directionMap[direction];

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        initial={{ ...initial, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        exit={{ ...initial, opacity: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          duration,
          delay
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
