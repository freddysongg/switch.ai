import { Button } from '@/components/ui/button.js';
import { Textarea } from '@/components/ui/textarea.js';
import { SendHorizontal } from 'lucide-react';
import { FormEvent, KeyboardEvent, useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 bg-background">
      <div className="relative flex-1">
        <Textarea
          placeholder="i'm looking for a switch that..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] resize-none pr-12 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 dark:focus-visible:ring-white/20"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !message.trim()}
          className="absolute right-2 bottom-2 h-8 w-8 bg-primary hover:bg-primary/90"
        >
          <SendHorizontal className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
