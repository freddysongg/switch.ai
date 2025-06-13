'use client';

import { motion } from 'motion/react';
import type * as React from 'react';

import { cn } from '@/lib/utils.js';

interface BorderTrailProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  duration?: number;
}

export function BorderTrail({
  children,
  className,
  color = 'primary',
  duration = 3
}: BorderTrailProps) {
  return (
    <motion.div
      className={cn('relative', className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 rounded-[inherit] z-0"
        style={{
          background: `conic-gradient(from 0deg, transparent, hsl(var(--${color})), hsl(var(--${color}) / 0.7), hsl(var(--${color}) / 0.4), transparent)`
        }}
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
      />
      <div className="absolute inset-[1px] bg-background rounded-[inherit] z-0" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
