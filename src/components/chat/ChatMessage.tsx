'use client';

import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils.js';

import type { ComparisonSwitchData } from '@/types/api';
import type { ChatMessage as ChatMessageType, StructuredContent, User } from '@/types/chat';

import { Badge } from '@/components/ui/badge.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransitionPanel } from '@/components/ui/transition-panel';

export interface ChatMessageProps {
  message: ChatMessageType;
  isLastMessage: boolean;
  currentUser?: User | null;
  onContentLoaded?: () => void;
}

const sanitizeHtml = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'b',
      'i',
      'em',
      'strong',
      'code',
      'pre',
      'br',
      'p',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td'
    ],
    ALLOWED_ATTR: []
  });
};

export function ChatMessage({
  message,
  isLastMessage,
  currentUser,
  onContentLoaded
}: ChatMessageProps) {
  const isUserMessage = message.role === 'user';
  const [displayContent, setDisplayContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const isLoading = message.id === 'loading' && message.metadata?.loadingSteps;

  const getFullMessageContent = (): string => {
    if (isUserMessage || isLoading) {
      return typeof message.content === 'string' ? message.content : '';
    }

    let structuredContent: StructuredContent | null = null;

    if (message.analysis) {
      structuredContent = message.analysis;
    } else if (typeof message.content === 'object' && message.content !== null) {
      structuredContent = message.content as StructuredContent;
    } else if (message.metadata && typeof message.metadata === 'object') {
      if ('overview' in message.metadata) {
        structuredContent = message.metadata as StructuredContent;
      }
    }

    if (structuredContent) {
      const parts: string[] = [];

      if (structuredContent.overview) {
        parts.push(structuredContent.overview);
      }

      if (structuredContent.analysis) {
        parts.push(structuredContent.analysis);
      }

      if (structuredContent.comparativeAnalysis) {
        const compAnalysis = structuredContent.comparativeAnalysis;
        const compParts: string[] = [];

        if (compAnalysis.feelingTactility) {
          const tactility =
            typeof compAnalysis.feelingTactility === 'string'
              ? compAnalysis.feelingTactility
              : `**Feeling & Tactility:**\n${compAnalysis.feelingTactility.description || ''}\n${compAnalysis.feelingTactility.keyDifferences || ''}\n${compAnalysis.feelingTactility.userImpact || ''}`;
          compParts.push(tactility);
        }

        if (compAnalysis.soundProfile) {
          const sound =
            typeof compAnalysis.soundProfile === 'string'
              ? compAnalysis.soundProfile
              : `**Sound Profile:**\n${compAnalysis.soundProfile.description || ''}\n${compAnalysis.soundProfile.acousticDifferences || ''}\n${compAnalysis.soundProfile.environmentalConsiderations || ''}`;
          compParts.push(sound);
        }

        if (compAnalysis.buildMaterialComposition) {
          const build =
            typeof compAnalysis.buildMaterialComposition === 'string'
              ? compAnalysis.buildMaterialComposition
              : `**Build & Material Composition:**\n${compAnalysis.buildMaterialComposition.materialComparison || ''}\n${compAnalysis.buildMaterialComposition.durabilityAssessment || ''}\n${compAnalysis.buildMaterialComposition.modificationPotential || ''}`;
          compParts.push(build);
        }

        if (compAnalysis.performanceAspects) {
          const performance =
            typeof compAnalysis.performanceAspects === 'string'
              ? compAnalysis.performanceAspects
              : `**Performance Aspects:**\n${compAnalysis.performanceAspects.gamingPerformance || ''}\n${compAnalysis.performanceAspects.typingPerformance || ''}\n${compAnalysis.performanceAspects.consistencyReliability || ''}\n${compAnalysis.performanceAspects.fatigueFactors || ''}`;
          compParts.push(performance);
        }

        if (compParts.length > 0) {
          parts.push(`## Comparative Analysis\n\n${compParts.join('\n\n')}`);
        }
      }

      if (structuredContent.conclusion) {
        const conclusion =
          typeof structuredContent.conclusion === 'string'
            ? structuredContent.conclusion
            : `## Conclusion\n\n${structuredContent.conclusion.primaryDifferences || ''}\n\n${structuredContent.conclusion.overallAssessment || ''}\n\n${structuredContent.conclusion.decisionGuidance || ''}`;
        parts.push(conclusion);
      }

      const result = parts.length > 0 ? parts.join('\n\n') : '';
      return result;
    }

    return typeof message.content === 'string' ? message.content : '';
  };

  const fullContent = getFullMessageContent();

  useEffect(() => {
    if (fullContent) {
      const sanitizedContent = sanitizeHtml(fullContent);
      setDisplayContent(sanitizedContent);
      setIsTyping(false);
      if (isLastMessage && onContentLoaded) {
        setTimeout(() => onContentLoaded(), 50);
      }
    } else {
      setDisplayContent('');
      setIsTyping(false);
    }
  }, [fullContent, isLastMessage, onContentLoaded]);

  const messageVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.1
      }
    }
  };

  const renderProgressiveLoader = () => {
    if (!isLoading) return null;
    const steps = message.metadata?.loadingSteps as string[];

    return (
      <div className="p-4 space-y-2">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-2 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <span className="text-main-color">✓</span>
            <span>{step}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  const getConclusionText = (conclusion: unknown): string => {
    if (!conclusion) return '';
    if (typeof conclusion === 'string') return conclusion;
    if (
      typeof conclusion === 'object' &&
      conclusion !== null &&
      'overallAssessment' in conclusion
    ) {
      return (conclusion as { overallAssessment: string }).overallAssessment || '';
    }
    return '';
  };

  const renderSwitchComparison = () => {
    if (!message.analysis?.comparedSwitches) return null;
    const switches: ComparisonSwitchData[] = Object.values(message.analysis.comparedSwitches);

    return (
      <>
        <div className="space-y-6 mt-6 -mx-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {switches.map((switchData, index) => (
              <TransitionPanel
                key={index}
                delay={index * 0.15}
                direction={index % 2 === 0 ? 'left' : 'right'}
              >
                <Card
                  className="backdrop-blur-sm h-full shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--sub-color)',
                    color: 'var(--text-color)',
                    borderColor: 'var(--sub-alt-color)'
                  }}
                >
                  <CardHeader className="pb-3">
                    <CardTitle
                      className="text-base font-semibold"
                      style={{ color: 'var(--text-color)' }}
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(switchData.specifications?.switchName || '')
                      }}
                    />
                    <Badge
                      variant="outline"
                      className="mt-1 text-xs"
                      style={{
                        borderColor: 'var(--sub-alt-color)',
                        color: 'var(--text-color)'
                      }}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(switchData.specifications?.manufacturer || '')
                        }}
                      />
                    </Badge>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <div
                      className="grid grid-cols-2 gap-x-3 gap-y-1 p-3 rounded-md"
                      style={{ backgroundColor: 'var(--bg-color)' }}
                    >
                      <div>
                        <p
                          className="text-[10px] uppercase tracking-wider font-medium"
                          style={{ color: 'var(--sub-alt-color)' }}
                        >
                          Actuation
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: 'var(--text-color)' }}
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(
                              `${switchData.specifications?.actuationForceG || ''}g`
                            )
                          }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-[10px] uppercase tracking-wider font-medium"
                          style={{ color: 'var(--sub-alt-color)' }}
                        >
                          Bottom-out
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: 'var(--text-color)' }}
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(
                              `${switchData.specifications?.bottomOutForceG || ''}g`
                            )
                          }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-[10px] uppercase tracking-wider font-medium"
                          style={{ color: 'var(--sub-alt-color)' }}
                        >
                          Pre-travel
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: 'var(--text-color)' }}
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(
                              `${switchData.specifications?.preTravelMm || ''}mm`
                            )
                          }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-[10px] uppercase tracking-wider font-medium"
                          style={{ color: 'var(--sub-alt-color)' }}
                        >
                          Total travel
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: 'var(--text-color)' }}
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(
                              `${switchData.specifications?.totalTravelMm || ''}mm`
                            )
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className="space-y-1 p-3 rounded-md"
                      style={{ backgroundColor: 'var(--bg-color)' }}
                    >
                      <p
                        className="text-[10px] uppercase tracking-wider font-medium"
                        style={{ color: 'var(--sub-alt-color)' }}
                      >
                        Spring Type:{' '}
                        <span
                          className="font-semibold normal-case"
                          style={{ color: 'var(--text-color)' }}
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(switchData.specifications?.spring || '')
                          }}
                        />
                      </p>
                      <p
                        className="text-[10px] uppercase tracking-wider font-medium"
                        style={{ color: 'var(--sub-alt-color)' }}
                      >
                        Stem:{' '}
                        <span
                          className="font-semibold normal-case"
                          style={{ color: 'var(--text-color)' }}
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(switchData.specifications?.stem || '')
                          }}
                        />
                      </p>
                      <p
                        className="text-[10px] uppercase tracking-wider font-medium"
                        style={{ color: 'var(--sub-alt-color)' }}
                      >
                        Housing:{' '}
                        <span
                          className="font-semibold normal-case"
                          style={{ color: 'var(--text-color)' }}
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(
                              `${switchData.specifications?.topHousing || ''} / ${
                                switchData.specifications?.bottomHousing || ''
                              }`
                            )
                          }}
                        />
                      </p>
                      <p
                        className="text-[10px] uppercase tracking-wider font-medium"
                        style={{ color: 'var(--sub-alt-color)' }}
                      >
                        Factory Lubed:{' '}
                        <span
                          className="font-semibold normal-case"
                          style={{ color: 'var(--text-color)' }}
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(switchData.specifications?.factoryLubed || '')
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
        {!isUserMessage && message.analysis?.conclusion && (
          <motion.div
            className="mt-6 pt-4 border-t"
            style={{ borderColor: 'var(--sub-alt-color)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: switches.length * 0.15 + 0.1 }}
          >
            <p
              className="text-sm italic leading-relaxed"
              style={{ color: 'var(--sub-alt-color)' }}
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(getConclusionText(message.analysis.conclusion))
              }}
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
      exit="exit"
      className={cn(
        'flex w-full items-start gap-x-4 py-4',
        isUserMessage ? 'justify-end pl-8 sm:pl-12' : 'justify-start pr-8 sm:pr-12'
      )}
      id={isLastMessage ? 'last-message' : undefined}
    >
      {!isUserMessage && (
        <motion.img
          src="/assets/icons/switch.ai v2 Logo.png"
          alt="AI"
          className="h-7 w-7 rounded-full flex-shrink-0 mt-1 opacity-90"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ delay: 0.2 }}
        />
      )}
      <div
        className={cn(
          'group rounded-xl px-4 py-3 max-w-[85%] sm:max-w-[75%] shadow-lg transition-all duration-200',
          isUserMessage ? 'rounded-br-none' : 'rounded-bl-none backdrop-blur-sm',
          message.metadata?.error ? 'opacity-80' : ''
        )}
        style={{
          backgroundColor: message.metadata?.error
            ? 'var(--sub-color)'
            : isUserMessage
              ? 'var(--main-color)'
              : 'var(--sub-color)',
          color: isUserMessage ? 'var(--bg-color)' : 'var(--text-color)',
          borderColor: 'var(--sub-alt-color)',
          borderWidth: isUserMessage ? '0px' : '1px'
        }}
      >
        {isLoading ? (
          renderProgressiveLoader()
        ) : (
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {isTyping && !isUserMessage ? (
              <>
                <span dangerouslySetInnerHTML={{ __html: displayContent }} />{' '}
                <span className="animate-pulse" style={{ color: 'var(--sub-alt-color)' }}>
                  ▍
                </span>
              </>
            ) : (
              <span
                dangerouslySetInnerHTML={{
                  __html: isUserMessage ? message.content : sanitizeHtml(displayContent)
                }}
              />
            )}
          </div>
        )}
        {!isUserMessage &&
          !isLoading &&
          message.analysis?.comparedSwitches &&
          renderSwitchComparison()}
      </div>
      {isUserMessage && (
        <div
          className="h-7 w-7 rounded-full flex items-center justify-center text-sm mt-1 flex-shrink-0 border"
          style={{
            backgroundColor: 'var(--sub-color)',
            color: 'var(--text-color)',
            borderColor: 'var(--sub-alt-color)'
          }}
        >
          {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      )}
    </motion.div>
  );
}
