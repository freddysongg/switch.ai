'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Settings, User } from 'lucide-react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/auth-context';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.js';
import { GlowButton } from '@/components/ui/glow-button.js';
import { ThemeSwitcherSpotlight } from '@/components/themes/ThemeSwitcherSpotlight.js';

interface ChatHeaderProps {
  onReset: () => void;
  conversationCount?: number;
  isAiThinking?: boolean;
}

export function ChatHeader({
  onReset,
  conversationCount = 0,
  isAiThinking = false
}: ChatHeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onReset();
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header
      className="relative z-30 w-full"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="fixed inset-x-[5%] top-4 w-[90%] z-40">
        <motion.div
          className="relative backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-color)',
            borderColor: 'var(--sub-color)'
          }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {isAiThinking && (
              <motion.div
                className="absolute top-0 left-0 right-0 h-1"
                style={{
                  background: `linear-gradient(90deg, var(--main-color) 0%, var(--main-color) 50%, var(--main-color) 100%)`
                }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{
                  scaleX: [0, 1, 0],
                  originX: [0, 0, 1]
                }}
                exit={{
                  scaleX: 0,
                  originX: 1,
                  transition: { duration: 0.2 }
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut'
                }}
              />
            )}
          </AnimatePresence>

          <div className="relative flex items-center justify-between px-6 py-4">
            <motion.div
              className="flex items-center gap-4 cursor-pointer"
              onClick={handleLogoClick}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <motion.img
                  src="/switch-ai-logo.png"
                  alt="switch.ai logo"
                  className="h-10 w-10"
                  animate={{ rotate: isAiThinking ? 360 : 0 }}
                  transition={{
                    duration: 2,
                    repeat: isAiThinking ? Number.POSITIVE_INFINITY : 0,
                    ease: 'linear'
                  }}
                />
                {isAiThinking && (
                  <motion.div
                    className="absolute -inset-1 rounded-full border-2 border-accent/50"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  />
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1
                    className="text-xl font-bold tracking-tight"
                    style={{ color: 'var(--text-color)' }}
                  >
                    switch.ai
                  </h1>
                  <div className="flex items-center gap-2 mt-1 px-2">
                    <div
                      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--sub-alt-color)',
                        color: 'var(--main-color)'
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: 'var(--main-color)' }}
                      ></div>
                      ready
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="hidden md:flex items-center gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4 bg-background/80" />
                <span className="text-sm">{conversationCount}</span>
              </div>
              <div className="w-px h-6 bg-border" />
              <div className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </motion.div>

            <div className="flex items-center gap-3">
              <ThemeSwitcherSpotlight />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <GlowButton
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 rounded-full bg-transparent border border-border hover:bg-transparent transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--sub-alt-color)',
                      borderColor: 'var(--sub-color)'
                    }}
                    glowColor={`color-mix(in srgb, var(--main-color) 20%, transparent)`}
                    glowIntensity={0.7}
                  >
                    <motion.div
                      className="h-6 w-6 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--main-color) 20%, transparent)'
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                        <User className="h-4 w-4" style={{ color: 'var(--main-color)' }} />
                      </motion.div>
                    </motion.div>
                  </GlowButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="backdrop-blur-xl border"
                  style={{
                    backgroundColor: 'var(--bg-color)',
                    borderColor: 'var(--sub-color)',
                    color: 'var(--text-color)'
                  }}
                >
                  <DropdownMenuItem
                    className="hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent cursor-pointer"
                    style={{ color: 'var(--text-color)' }}
                  >
                    <motion.div
                      className="flex items-center"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <motion.span whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        settings
                      </motion.span>
                    </motion.div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent cursor-pointer"
                    style={{ color: 'var(--text-color)' }}
                  >
                    <motion.div
                      className="flex items-center"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <motion.span whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        sign out
                      </motion.span>
                    </motion.div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="h-20" />
    </motion.header>
  );
}
