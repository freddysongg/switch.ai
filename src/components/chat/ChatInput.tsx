import { motion } from 'framer-motion';
import { SendHorizontal } from 'lucide-react';
import { FormEvent, KeyboardEvent, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { ChatInputProps } from '@/types/chat.js';

import { GlowButton } from '@/components/ui/glow-button.js';
import { Textarea } from '@/components/ui/textarea.js';

export function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={cn(
        'flex items-end gap-2 p-3 md:p-4 border-t border-border/80',
        'bg-card dark:bg-slate-900'
      )}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          placeholder="i'm looking for a switch that..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'min-h-[52px] sm:min-h-[60px] resize-none pr-12 py-3 border rounded-xl text-foreground placeholder:text-muted-foreground/80 shadow-sm',
            'bg-card dark:bg-slate-900',
            'border-border/70 focus-visible:ring-2 focus-visible:ring-primary/40 dark:focus-visible:ring-primary/60',
            'focus-visible:border-transparent'
          )}
          disabled={isLoading}
          rows={1}
        />
        <GlowButton
          type="submit"
          size="icon"
          disabled={isLoading || !message.trim()}
          className="absolute right-2.5 bottom-2.5 h-8 w-8 sm:h-9 sm:w-9"
          glowColor="hsl(var(--primary))"
          glowIntensity={0.6}
        >
          <SendHorizontal className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          <span>send message</span>
        </GlowButton>
      </div>
    </motion.form>
  );
}
