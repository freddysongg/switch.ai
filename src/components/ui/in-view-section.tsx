'use client';

import { motion, useInView } from 'framer-motion';
import type * as React from 'react';
import { useRef } from 'react';

interface InViewSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'none';
  id?: string;
}

export function InViewSection({
  children,
  className,
  delay = 0,
  threshold = 0.2,
  animation = 'slide-up',
  id
}: InViewSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const animations = {
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    'slide-up': { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 } },
    'slide-down': { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 } },
    'slide-left': { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } },
    'slide-right': { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } },
    scale: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
    none: { initial: {}, animate: {} }
  };

  const { initial, animate } = animations[animation];

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={initial}
      animate={isInView ? animate : initial}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.section>
  );
}
