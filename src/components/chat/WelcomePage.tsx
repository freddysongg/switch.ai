import { motion } from 'framer-motion';
import { SendHorizontal } from 'lucide-react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';

import { GlowButton } from '@/components/ui/glow-button.js';
import { Textarea } from '@/components/ui/textarea.js';

interface WelcomePageProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function WelcomePage({ onSendMessage, isLoading }: WelcomePageProps) {
  const [displayContent, setDisplayContent] = useState('');
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="w-full max-w-2xl">
        <motion.div
          className="mb-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="mb-6 inline-flex items-center justify-center">
            <motion.img
              src="/assets/icons/switch.ai v2 Logo.png"
              alt="switch.ai"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
              whileHover={{ scale: 1.1, rotate: 5 }}
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold mb-3 lowercase text-foreground">
            switch.ai
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground lowercase h-6">
            {displayContent}
            {!displayContent.endsWith(text) && <span className="animate-pulse">▍</span>}
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
            className="min-h-[52px] sm:min-h-[60px] resize-none pr-12 py-3 bg-muted/60 dark:bg-muted/30 border rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40 dark:focus-visible:ring-primary/60 text-foreground placeholder:text-muted-foreground/70 shadow-sm w-full"
            disabled={isLoading}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <GlowButton
            size="icon"
            className="absolute right-2.5 bottom-2.5 h-8 w-8 sm:h-9 sm:w-9"
            disabled={isLoading}
            onClick={handleSend}
            glowColor="hsl(var(--primary))"
            glowIntensity={0.6}
          >
            <SendHorizontal className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            <span className="sr-only">send message</span>
          </GlowButton>
        </motion.div>
      </div>
    </motion.div>
  );
}
