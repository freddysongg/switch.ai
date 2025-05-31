import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils.js';

import { ChatMessageProps } from '@/types/chat';

import { Badge } from '@/components/ui/badge.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransitionPanel } from '@/components/ui/transition-panel';

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

    setIsTyping(true);
    let currentIndex = 0;
    const typingSpeed = 10;
    const segmentLength = Math.max(1, Math.floor(message.content.length / (300 / typingSpeed)));

    const interval = setInterval(() => {
      if (currentIndex <= message.content.length) {
        setDisplayContent(message.content.slice(0, currentIndex));
        currentIndex += segmentLength;
      } else {
        setDisplayContent(message.content);
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
                    <CardTitle className="text-base font-semibold">{switchData.name}</CardTitle>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {switchData.brand}
                    </Badge>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 p-2 rounded-md bg-muted/40">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                          Actuation
                        </p>
                        <p className="font-semibold">{switchData.actuation_weight}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                          Bottom-out
                        </p>
                        <p className="font-semibold">{switchData.bottom_out}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                          Pre-travel
                        </p>
                        <p className="font-semibold">{switchData.pre_travel}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                          Total travel
                        </p>
                        <p className="font-semibold">{switchData.total_travel}</p>
                      </div>
                    </div>
                    <div className="space-y-1 p-2 rounded-md bg-muted/40">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Spring Type:{' '}
                        <span className="font-semibold normal-case text-foreground">
                          {switchData.spring}
                        </span>
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Stem:{' '}
                        <span className="font-semibold normal-case text-foreground">
                          {switchData.stem_material}
                        </span>
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Housing:{' '}
                        <span className="font-semibold normal-case text-foreground">
                          {switchData.housing_material}
                        </span>
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Factory Lubed:{' '}
                        <span className="font-semibold normal-case text-foreground">
                          {switchData.lubed_status}
                        </span>
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
            <p className="text-xs italic text-muted-foreground leading-relaxed">
              {message.analysis}
            </p>
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
              {displayContent} <span className="animate-pulse">▍</span>
            </>
          ) : (
            message.content
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
