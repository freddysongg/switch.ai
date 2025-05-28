import { Badge } from '@/components/ui/badge.js';
import { Card } from '@/components/ui/card.js';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils.js';

import { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  isLastMessage: boolean;
}

export function ChatMessage({ message, isLastMessage }: ChatMessageProps) {
  const isUserMessage = message.role === 'user';
  const [displayContent, setDisplayContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!message.content || message.role === 'user') {
      setDisplayContent(message.content);
      return;
    }

    setIsTyping(true);
    let currentIndex = 0;
    const content = message.content;
    const typingInterval = setInterval(() => {
      if (currentIndex <= content.length) {
        setDisplayContent(content.slice(0, currentIndex));
        currentIndex += 2;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 10);

    return () => clearInterval(typingInterval);
  }, [message.content, message.role]);

  const renderSwitchComparison = () => {
    if (!message.comparison) return null;
    const switches = Object.entries(message.comparison)
      .filter(([key]) => key.startsWith('switch'))
      .map(([, value]) => value);

    return (
      <>
        <div className="space-y-6 px-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {switches.map((switchData, index) => (
              <div
                key={index}
                className="opacity-0"
                style={{
                  animation: 'card-appear 0.5s ease-out forwards',
                  animationDelay: `${index * 200}ms`
                }}
              >
                <Card className="relative overflow-hidden bg-card hover:bg-card/90 transition-all duration-200 border hover:border-primary/30 hover:shadow-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-base font-semibold">{switchData.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {switchData.brand}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Force Characteristics */}
                      <div className="grid grid-cols-2 gap-3 p-2 rounded-lg bg-muted/30">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                            Actuation
                          </p>
                          <p className="text-sm font-semibold">{switchData.actuation_weight}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                            Bottom-out
                          </p>
                          <p className="text-sm font-semibold">{switchData.bottom_out}</p>
                        </div>
                      </div>

                      {/* Travel Distance */}
                      <div className="grid grid-cols-2 gap-3 p-2 rounded-lg bg-muted/30">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                            Pre-travel
                          </p>
                          <p className="text-sm font-semibold">{switchData.pre_travel}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                            Total travel
                          </p>
                          <p className="text-sm font-semibold">{switchData.total_travel}</p>
                        </div>
                      </div>

                      {/* Spring and Materials */}
                      <div className="space-y-2 p-2 rounded-lg bg-muted/30">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                            Spring Type
                          </p>
                          <p className="text-sm font-semibold">{switchData.spring}</p>
                        </div>
                        <div className="space-y-1 pt-1 border-t border-border/50">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Stem</span>
                            <span className="font-medium">{switchData.stem_material}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Housing</span>
                            <span className="font-medium">{switchData.housing_material}</span>
                          </div>
                        </div>
                        <div className="pt-1 border-t border-border/50">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                            Factory Lubed
                          </p>
                          <p className="text-sm font-semibold">{switchData.lubed_status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
        {!isUserMessage && message.comparison && (
          <div
            className="mt-6 px-4 text-muted-foreground opacity-0 animate-[card-appear_0.5s_ease-out_forwards]"
            style={{ animationDelay: '400ms' }}
          >
            <p className="text-sm leading-relaxed">
              {message.analysis ||
                'Based on the comparison, each switch offers unique characteristics. Consider factors like actuation force, travel distance, and whether they come pre-lubricated when making your choice. The spring type and materials used will also affect the typing experience and longevity of the switches.'}
            </p>
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className={cn(
        'flex w-full items-start gap-4 py-4 animate-in fade-in-0 duration-300',
        isUserMessage ? 'justify-end' : 'justify-start'
      )}
      id={isLastMessage ? 'last-message' : undefined}
    >
      <div
        className={cn(
          'group rounded-lg px-4 py-3 max-w-[95%] transition-colors duration-200',
          isUserMessage
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-card hover:bg-card/90 dark:hover:bg-card/70'
        )}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {isTyping && !isUserMessage ? displayContent : message.content}
        </p>
        {message.category === 'switch_comparison' && !isUserMessage && renderSwitchComparison()}
      </div>
    </div>
  );
}
