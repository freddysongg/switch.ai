'use client';

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { ThemeSwitcherSpotlight } from '@/components/themes/ThemeSwitcherSpotlight.js';

interface ChatHeaderProps {
  onReset: () => void;
}

export function ChatHeader({ onReset }: ChatHeaderProps) {
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onReset();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/80 backdrop-blur-md dark:bg-background/70">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleLogoClick}
          whileHover={{ opacity: 0.85, scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <motion.img
            src="/assets/icons/switch.ai v2 Logo.png"
            alt="switch.ai logo"
            className="h-7 w-7 sm:h-8 sm:w-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
          />
          <div className="flex flex-col justify-center lowercase">
            <h1 className="text-base sm:text-lg font-semibold leading-none text-foreground">
              switch.ai
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              gpt, but for switches...
            </p>
          </div>
        </motion.div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherSpotlight />
        </div>
      </div>
    </header>
  );
}
