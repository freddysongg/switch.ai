import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils.js';

import { ChatMessageProps } from '@/types/chat';

import { Badge } from '@/components/ui/badge.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransitionPanel } from '@/components/ui/transition-panel';

const sanitizeHtml = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre', 'br', 'p', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
};

export function ChatMessage({ message, isLastMessage, currentUser }: ChatMessageProps) {
  const isUserMessage = message.role === 'user';
  const [displayContent, setDisplayContent] = useState('');
  const [isTyping, setIsTyping] = useState(
    !isUserMessage && message.content && message.content.length > 0
  );

  useEffect(() => {
    if (isUserMessage || !message.content) {
      setDisplayContent(message.content);
      setIsTyping(false);
      return;
    }

    const sanitizedContent = sanitizeHtml(message.content);

    setIsTyping(true);
    let currentIndex = 0;
    const typingSpeed = 10;
    const segmentLength = Math.max(1, Math.floor(sanitizedContent.length / (300 / typingSpeed)));

    const interval = setInterval(() => {
      if (currentIndex <= sanitizedContent.length) {
        setDisplayContent(sanitizedContent.slice(0, currentIndex));
        currentIndex += segmentLength;
      } else {
        setDisplayContent(sanitizedContent);
        setIsTyping(false);
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [message.content, message.role, isUserMessage]);

  const messageVariants = {
    hidden: {
      opacity: 0,
      y: isUserMessage ? 10 : 20,
      x: isUserMessage ? 10 : -10,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        duration: 0.4
      }
    }
  };

  const renderSwitchComparison = () => {
    if (!message.comparison) return null;
    const switches = Object.entries(message.comparison)
      .filter(([key]) => key.startsWith('switch'))
      .map(([, value]) => value);

    return (
      <>
        <div className="space-y-6 mt-4 -mx-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {switches.map((switchData, index) => (
              <TransitionPanel
                key={index}
                delay={index * 0.15}
                direction={index % 2 === 0 ? 'left' : 'right'}
              >
                <Card className="bg-card/80 dark:bg-card/50 backdrop-blur-sm text-card-foreground border-border hover:border-primary/30 transition-all duration-300 h-full shadow-md hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle
                      className="text-base font-semibold"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(switchData.name || '') }}
                    />
                    <Badge variant="outline" className="mt-1 text-xs">
                      <span
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(switchData.brand || '') }}
                      />
                    </Badge>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 p-2 rounded-md bg-muted/40">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                          Actuation
                        </p>
                        <p
                          className="font-semibold"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(switchData.actuation_weight || '')
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                          Bottom-out
                        </p>
                        <p
                          className="font-semibold"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(switchData.bottom_out || '')
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                          Pre-travel
                        </p>
                        <p
                          className="font-semibold"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(switchData.pre_travel || '')
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                          Total travel
                        </p>
                        <p
                          className="font-semibold"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(switchData.total_travel || '')
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1 p-2 rounded-md bg-muted/40">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Spring Type:{' '}
                        <span
                          className="font-semibold normal-case text-foreground"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(switchData.spring || '')
                          }}
                        />
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Stem:{' '}
                        <span
                          className="font-semibold normal-case text-foreground"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(switchData.stem_material || '')
                          }}
                        />
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Housing:{' '}
                        <span
                          className="font-semibold normal-case text-foreground"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(switchData.housing_material || '')
                          }}
                        />
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Factory Lubed:{' '}
                        <span
                          className="font-semibold normal-case text-foreground"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(switchData.lubed_status || '')
                          }}
                        />
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TransitionPanel>
            ))}
          </div>
        </div>
        {!isUserMessage && message.comparison && message.analysis && (
          <motion.div
            className="mt-4 pt-3 border-t border-border/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: switches.length * 0.15 + 0.1 }}
          >
            <p
              className="text-xs italic text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(message.analysis || '') }}
            />
          </motion.div>
        )}
      </>
    );
  };

  return (
    <motion.div
      layout
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className={cn(
        'flex w-full items-start gap-x-3 py-3',
        isUserMessage ? 'justify-end pl-8 sm:pl-12' : 'justify-start pr-8 sm:pr-12'
      )}
      id={isLastMessage ? 'last-message' : undefined}
    >
      {!isUserMessage && (
        <motion.img
          src="/assets/icons/switch.ai v2 Logo.png"
          alt="AI"
          className="h-6 w-6 rounded-full flex-shrink-0 mt-1 opacity-80"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ delay: 0.2 }}
        />
      )}
      <div
        className={cn(
          'group rounded-xl px-3.5 py-2.5 max-w-[85%] sm:max-w-[75%] shadow-sm transition-colors duration-200',
          isUserMessage
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card text-card-foreground border border-border/70 rounded-bl-none',
          message.metadata?.error
            ? 'bg-destructive/20 border-destructive text-destructive-foreground'
            : ''
        )}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {isTyping && !isUserMessage ? (
            <>
              <span dangerouslySetInnerHTML={{ __html: displayContent }} />{' '}
              <span className="animate-pulse">▍</span>
            </>
          ) : (
            <span
              dangerouslySetInnerHTML={{
                __html: isUserMessage ? message.content : sanitizeHtml(message.content || '')
              }}
            />
          )}
        </p>
        {message.category === 'switch_comparison' && !isUserMessage && renderSwitchComparison()}
      </div>
      {isUserMessage && (
        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs mt-1 flex-shrink-0">
          {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      )}
    </motion.div>
  );
}
