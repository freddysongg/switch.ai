'use client';

import { motion } from 'motion/react';

import { cn } from '@/lib/oauth.js';

interface AnimatedTabsProps {
  tabs: { label: string }[];
  activeTab: number | null;
  onChange: (index: number) => void;
  className?: string;
}

export function AnimatedTabs({ tabs, activeTab, onChange, className }: AnimatedTabsProps) {
  return (
    <div className={cn('flex space-x-1', className)}>
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => onChange(index)}
          className={cn(
            'relative px-3 py-2 text-sm font-medium transition-colors',
            'text-white/80 hover:text-white rounded-lg',
            activeTab === index ? 'text-white' : ''
          )}
        >
          {tab.label}
          {activeTab === index && (
            <motion.div
              layoutId="active-tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
