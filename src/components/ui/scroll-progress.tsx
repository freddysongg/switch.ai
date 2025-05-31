'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import type { RefObject } from 'react';

import { cn } from '@/lib/utils';

interface ScrollProgressProps {
  className?: string;
  containerRef?: RefObject<HTMLElement>;
  springOptions?: {
    stiffness?: number;
    damping?: number;
    restDelta?: number;
  };
}

export function ScrollProgress({
  className,
  containerRef,
  springOptions = {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  }
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll(containerRef ? { container: containerRef } : undefined);

  const scaleX = useSpring(scrollYProgress, springOptions);

  return (
    <motion.div
      className={cn(
        'absolute top-0 left-0 right-0 h-1 bg-zinc-800 dark:bg-zinc-600 origin-left z-10',
        className
      )}
      style={{ scaleX }}
    />
  );
}
