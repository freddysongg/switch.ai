'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, SendHorizontal } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

import type { ChatInputProps } from '@/types/chat.js';

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
  const [currentMainColor, setCurrentMainColor] = useState('rgb(20 184 166)');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const updateMainColor = () => {
      const mainColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--main-color')
        ?.trim();
      if (mainColor) {
        setCurrentMainColor(mainColor);
      }
    };

    updateMainColor();

    const observer = new MutationObserver(updateMainColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });

    return () => observer.disconnect();
  }, []);

  const validateMessage = (text: string): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (text.length > VALIDATION_RULES.MAX_LENGTH) {
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
      className="flex flex-col gap-2 p-4 md:p-6 border-t backdrop-blur-sm"
      style={{
        backgroundColor: 'var(--bg-color)',
        borderColor: 'var(--sub-color)',
        color: 'var(--text-color)'
      }}
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
          className="min-h-[60px] sm:min-h-[70px] resize-none pr-14 py-4 border rounded-xl focus-visible:ring-2 shadow-lg backdrop-blur-sm transition-colors"
          style={
            {
              backgroundColor: 'var(--bg-color)',
              borderColor: hasErrors
                ? 'var(--sub-color)'
                : hasWarnings
                  ? 'var(--sub-color)'
                  : 'var(--sub-alt-color)',
              color: 'var(--text-color)',
              '--tw-ring-color': hasErrors
                ? 'var(--sub-color)'
                : hasWarnings
                  ? 'var(--sub-color)'
                  : `color-mix(in srgb, var(--sub-color) 40%, transparent)`,
              '--tw-placeholder-color': 'var(--sub-alt-color)'
            } as React.CSSProperties
          }
          disabled={isLoading}
          rows={1}
        />
        <GlowButton
          type="submit"
          size="icon"
          disabled={isLoading || !message.trim() || !validation.isValid}
          className="absolute right-3 bottom-3 h-10 w-10 sm:h-11 sm:w-11"
          style={
            {
              backgroundColor: hasErrors ? 'rgba(239, 68, 68, 0.8)' : 'var(--main-color)',
              color: 'var(--bg-color)',
              '--hover-bg': hasErrors
                ? 'rgba(239, 68, 68, 0.9)'
                : `color-mix(in srgb, var(--main-color) 90%, white)`,
              '--glow-color': hasErrors ? 'rgba(239, 68, 68, 1)' : 'var(--main-color)'
            } as React.CSSProperties
          }
          glowColor={hasErrors ? 'rgb(239 68 68)' : currentMainColor}
          glowIntensity={hasErrors ? 0.3 : 0.8}
        >
          <SendHorizontal className="h-5 w-5" />
          <span className="sr-only">send message</span>
        </GlowButton>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex flex-col gap-1">
          {validation.errors.map((error, index) => (
            <motion.div
              key={`error-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5"
              style={{ color: 'rgba(239, 68, 68, 0.9)' }}
            >
              <AlertTriangle className="h-3 w-3" />
              <span>{error}</span>
            </motion.div>
          ))}

          {validation.warnings.map((warning, index) => (
            <motion.div
              key={`warning-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5"
              style={{ color: 'rgba(245, 158, 11, 0.9)' }}
            >
              <AlertTriangle className="h-3 w-3" />
              <span>{warning}</span>
            </motion.div>
          ))}
        </div>

        <div
          className="transition-colors"
          style={{
            color: isOverLimit
              ? 'rgba(239, 68, 68, 0.9)'
              : isNearLimit
                ? 'rgba(245, 158, 11, 0.9)'
                : 'var(--sub-color)'
          }}
        >
          {message.length}/{VALIDATION_RULES.MAX_LENGTH}
        </div>
      </div>
    </motion.form>
  );
}
