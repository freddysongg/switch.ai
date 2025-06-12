'use client';

import { motion } from 'framer-motion';
import { SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import { GlowButton } from '@/components/ui/glow-button.js';
import { Textarea } from '@/components/ui/textarea.js';

interface WelcomePageProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function WelcomePage({ onSendMessage, isLoading }: WelcomePageProps) {
  const [displayContent, setDisplayContent] = useState('');
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const text = 'gpt, but for switches...';
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayContent(text.slice(0, currentIndex));
        currentIndex += 1;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  const handleSend = () => {
    if (textareaRef.current) {
      const content = textareaRef.current.value.trim();
      if (content && !isLoading) {
        onSendMessage(content);
        textareaRef.current.value = '';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center flex-1 p-4 text-center w-full"
      style={{ backgroundColor: 'var(--background)' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="w-full max-w-2xl">
        <motion.div
          className="mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="mb-8 inline-flex items-center justify-center">
            <motion.img
              src="/assets/icons/switch.ai v2 Logo.png"
              alt="switch.ai"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
              whileHover={{ scale: 1.1, rotate: 5 }}
            />
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 lowercase"
            style={{ color: 'var(--text-color)' }}
          >
            switch.ai
          </h1>
          <p className="text-lg sm:text-xl lowercase h-8" style={{ color: 'var(--text-color)' }}>
            {displayContent}
            {!displayContent.endsWith(text) && (
              <span className="animate-pulse" style={{ color: 'var(--sub-alt-color)' }}>
                ▍
              </span>
            )}
          </p>
        </motion.div>

        <motion.div
          className="relative w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Textarea
            ref={textareaRef}
            placeholder="i'm looking for a switch that..."
            className="min-h-[60px] sm:min-h-[70px] resize-none pr-14 py-4 rounded-xl focus-visible:ring-2 shadow-lg backdrop-blur-sm w-full text-base"
            style={
              {
                backgroundColor: 'var(--sub-alt-color)',
                borderColor: 'var(--sub-color)',
                color: 'var(--text-color)',
                '--tw-ring-color': 'var(--main-color)',
                '--tw-placeholder-color': 'var(--main-color)'
              } as React.CSSProperties
            }
            disabled={isLoading}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <motion.div
            className="absolute right-3 bottom-3"
            onHoverStart={() => setIsButtonHovered(true)}
            onHoverEnd={() => setIsButtonHovered(false)}
          >
            <GlowButton
              size="icon"
              className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full overflow-hidden"
              style={{
                backgroundColor: 'var(--sub-alt-color)',
                color: 'var(--main-color)',
                borderColor: 'var(--sub-alt-color)'
              }}
              disabled={isLoading}
              onClick={handleSend}
              glowColor={`color-mix(in srgb, var(--main-color) 10%, transparent)`}
              glowIntensity={0.8}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, color-mix(in srgb, var(--main-color) 20%, transparent), color-mix(in srgb, var(--main-color) 30%, transparent), color-mix(in srgb, var(--main-color) 20%, transparent))`
                }}
                animate={{
                  opacity: isButtonHovered ? 1 : 0,
                  scale: isButtonHovered ? 1 : 0.8
                }}
                transition={{ duration: 0.3 }}
              />
              <SendHorizontal className="h-5 w-5 relative z-10" />
              <span className="sr-only">send message</span>
            </GlowButton>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-8 text-sm"
          style={{ color: 'var(--text-color)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          get ai-powered recommendations, compare specifications, and discover switches tailored to
          your typing style
        </motion.div>
      </div>
    </motion.div>
  );
}
