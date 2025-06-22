'use client';

import { motion } from 'motion/react';

import { cn } from '@/lib/oauth.js';

import { Button, type ButtonProps } from '@/components/ui/button';

interface GlowButtonProps extends ButtonProps {
  glowColor?: string;
  glowIntensity?: number;
}

export function GlowButton({
  children,
  className,
  glowColor = 'hsl(var(--primary))',
  glowIntensity = 0.6,
  ...props
}: GlowButtonProps) {
  return (
    <motion.div className="relative group" whileTap={{ scale: 0.99 }}>
      <motion.div
        className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: glowColor,
          filter: `blur(15px)`,
          opacity: 0
        }}
        animate={{
          opacity: [0, glowIntensity, 0]
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse'
        }}
      />
      <Button className={cn('relative z-10', className)} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}
