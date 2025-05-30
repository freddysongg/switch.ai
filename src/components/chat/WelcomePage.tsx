import { SendHorizontal } from 'lucide-react';
import { KeyboardEvent, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button.js';
import { Textarea } from '@/components/ui/textarea.js';

interface WelcomePageProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function WelcomePage({ onSendMessage, isLoading }: WelcomePageProps) {
  const [displayContent, setDisplayContent] = useState('');
  const text = 'gpt, but for switches...';

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

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      const content = e.currentTarget.value.trim();
      if (content) {
        onSendMessage(content);
        e.currentTarget.value = '';
      }
    }
  };

  const handleClick = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const content = textarea.value.trim();
      if (content) {
        onSendMessage(content);
        textarea.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] mx-auto px-4 text-center w-full">
      <div className="w-full max-w-3xl">
        <div className="mb-12">
          <div className="mb-8 inline-flex items-center justify-center">
            <img
              src="/assets/icons/switch.ai v2 Logo.png"
              alt="switch.ai"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-4xl font-display font-semibold mb-4 lowercase">switch.ai</h1>
          <p className="text-lg text-muted-foreground mb-12 lowercase h-6">
            {displayContent}
            <span className="animate-blink">|</span>
          </p>

          <div className="relative w-full max-w-2xl mx-auto">
            <Textarea
              placeholder="i'm looking for a switch that..."
              className="min-h-[60px] pr-12 bg-card/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 dark:focus-visible:ring-white/20 resize-none"
              disabled={isLoading}
              onKeyDown={handleKeyDown}
            />
            <Button
              size="icon"
              className="absolute right-2 bottom-2 h-8 w-8"
              disabled={isLoading}
              onClick={handleClick}
            >
              <SendHorizontal className="h-4 w-4" />
              <span className="sr-only">send message</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
