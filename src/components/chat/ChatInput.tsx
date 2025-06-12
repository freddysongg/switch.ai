import { motion } from 'framer-motion';
import { AlertTriangle, SendHorizontal } from 'lucide-react';
import { FormEvent, KeyboardEvent, useMemo, useRef, useState } from 'react';

import { ChatInputProps } from '@/types/chat.js';

import { GlowButton } from '@/components/ui/glow-button.js';
import { Textarea } from '@/components/ui/textarea.js';

const VALIDATION_RULES = {
  MAX_LENGTH: 2000,
  MIN_LENGTH: 1,
  SUSPICIOUS_PATTERNS: [
    /script[\s\S]*?>/i, // Script injection
    /javascript:/i, // JavaScript URLs
    /<iframe/i, // iFrame injection
    /on\w+\s*=/i, // Event handlers (onclick, onload, etc.)
    /document\.(cookie|domain)/i, // Document manipulation
    /eval\s*\(/i, // Eval function
    /\.\.\//g // Path traversal attempts (multiple occurrences)
  ]
} as const;

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const validateMessage = (text: string): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (text.length < VALIDATION_RULES.MIN_LENGTH) {
      errors.push('Message cannot be empty');
    } else if (text.length > VALIDATION_RULES.MAX_LENGTH) {
      errors.push(`Message must be under ${VALIDATION_RULES.MAX_LENGTH} characters`);
    } else if (text.length > VALIDATION_RULES.MAX_LENGTH * 0.9) {
      warnings.push('Message is getting close to the character limit');
    }

    for (const pattern of VALIDATION_RULES.SUSPICIOUS_PATTERNS) {
      if (pattern.test(text)) {
        errors.push('Message contains potentially unsafe content');
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const validation = useMemo(() => validateMessage(message), [message]);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const trimmedMessage = message.trim();

    if (trimmedMessage && !isLoading && validation.isValid) {
      onSendMessage(trimmedMessage);
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

  const isNearLimit = message.length > VALIDATION_RULES.MAX_LENGTH * 0.8;
  const isOverLimit = message.length > VALIDATION_RULES.MAX_LENGTH;
  const hasErrors = validation.errors.length > 0;
  const hasWarnings = validation.warnings.length > 0;

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 p-3 md:p-4 bg-muted/60 dark:bg-muted/30 border-t border-border/80"
      initial={{ opacity: 0, y: 20 }}
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
          className={`min-h-[52px] sm:min-h-[60px] resize-none pr-12 py-3 bg-muted/60 dark:bg-muted/30 border rounded-xl focus-visible:ring-2 text-muted-foreground placeholder:text-muted-foreground/70 shadow-sm transition-colors ${
            hasErrors
              ? 'border-destructive focus-visible:ring-destructive/40'
              : hasWarnings
                ? 'border-yellow-500 focus-visible:ring-yellow-500/40'
                : 'focus-visible:ring-primary/40 dark:focus-visible:ring-primary/60'
          }`}
          disabled={isLoading}
          rows={1}
        />
        <GlowButton
          type="submit"
          size="icon"
          disabled={isLoading || !message.trim() || !validation.isValid}
          className="absolute right-2.5 bottom-2.5 h-8 w-8 sm:h-9 sm:w-9"
          glowColor={hasErrors ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
          glowIntensity={hasErrors ? 0.3 : 0.6}
        >
          <SendHorizontal className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          <span>send message</span>
        </GlowButton>
      </div>

      {/* Validation feedback and character counter */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex flex-col gap-1">
          {/* Error messages */}
          {validation.errors.map((error, index) => (
            <motion.div
              key={`error-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 text-destructive"
            >
              <AlertTriangle className="h-3 w-3" />
              <span>{error}</span>
            </motion.div>
          ))}

          {/* Warning messages */}
          {validation.warnings.map((warning, index) => (
            <motion.div
              key={`warning-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400"
            >
              <AlertTriangle className="h-3 w-3" />
              <span>{warning}</span>
            </motion.div>
          ))}
        </div>

        {/* Character counter */}
        <div
          className={`transition-colors ${
            isOverLimit
              ? 'text-destructive'
              : isNearLimit
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-muted-foreground'
          }`}
        >
          {message.length}/{VALIDATION_RULES.MAX_LENGTH}
        </div>
      </div>
    </motion.form>
  );
}
