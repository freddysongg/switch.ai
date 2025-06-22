'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

import { cn } from '@/lib/oauth';

interface InfiniteSliderProps {
  children?: React.ReactNode;
  items?: string[] | React.ReactNode[];
  direction?: 'left' | 'right';
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
  itemClassName?: string;
}

export function InfiniteSlider({
  children,
  items = [],
  direction = 'left',
  speed = 20,
  pauseOnHover = true,
  className,
  itemClassName
}: InfiniteSliderProps) {
  const [hovering, setHovering] = React.useState(false);

  // Use either children or items
  const content = children || items;
  const duplicatedItems = Array.isArray(content) ? [...content, ...content] : [content, content];

  return (
    <div
      className={cn('overflow-hidden w-full', className)}
      onMouseEnter={pauseOnHover ? () => setHovering(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setHovering(false) : undefined}
    >
      <motion.div
        className="flex"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
        }}
        transition={{
          ease: 'linear',
          duration: speed,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'loop'
        }}
        style={{
          animationPlayState: pauseOnHover && hovering ? 'paused' : 'running'
        }}
      >
        {Array.isArray(content) ? (
          duplicatedItems.map((item, index) => (
            <div key={index} className={cn('flex-shrink-0 w-auto px-8 py-4', itemClassName)}>
              {typeof item === 'string' ? (
                <span className="text-xl font-medium text-muted-foreground transition-transform hover:scale-105">
                  {item}
                </span>
              ) : (
                item
              )}
            </div>
          ))
        ) : (
          <div className={cn('flex-shrink-0 w-auto px-8 py-4', itemClassName)}>{content}</div>
        )}
      </motion.div>
    </div>
  );
}
