import { ScrollArea } from '@/components/ui/scroll-area.js';
import { mockMessages } from '@/data/mockMessages';
import { Conversation } from '@/types.js';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { ChatMessage as ChatMessageType } from '@/types/chat';

import { ChatHeader } from './ChatHeader.js';
import { ChatInput } from './ChatInput.js';
import { ChatMessage } from './ChatMessage.js';
import { ConversationSidebar } from './ConversationSidebar.js';
import { WelcomePage } from './WelcomePage.js';

export function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const conversationGroups: { [key: string]: ChatMessageType[] } = {};
    let currentGroup = '';

    mockMessages.forEach((msg) => {
      if (msg.role === 'user') {
        currentGroup = msg.id;
        conversationGroups[currentGroup] = [];
      }
      if (currentGroup) {
        conversationGroups[currentGroup].push(msg);
      }
    });

    const convList = Object.entries(conversationGroups).map(([id, messages]) => ({
      id,
      title: messages[0].content.slice(0, 50) + (messages[0].content.length > 50 ? '...' : '')
    }));

    setConversations(convList);
  }, []);

  useEffect(() => {
    if (!currentConversationId) {
      setMessages([]);
      return;
    }

    let foundStart = false;
    const conversationMessages = mockMessages.filter((msg) => {
      if (msg.id === currentConversationId) {
        foundStart = true;
        return true;
      }
      if (!foundStart) return false;
      if (msg.role === 'user' && msg.id !== currentConversationId) {
        foundStart = false;
        return false;
      }
      return foundStart;
    });

    setMessages(conversationMessages);
  }, [currentConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    let foundStart = false;
    const conversationMessages = mockMessages.filter((msg) => {
      if (msg.id === id) {
        foundStart = true;
        return true;
      }
      if (!foundStart) return false;
      if (msg.role === 'user' && msg.id !== id) {
        foundStart = false;
        return false;
      }
      return foundStart;
    });

    setMessages(conversationMessages);
    setHasInteracted(true);
  };

  const handleNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      title: 'new chat'
    };
    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newId);
    setMessages([]);
    setHasInteracted(false);
  };

  const handleSendMessage = (content: string) => {
    setHasInteracted(true);

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
      category: 'general'
    };
    setMessages((prev) => [...prev, userMessage]);

    if (messages.length === 0) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversationId
            ? { ...conv, title: content.slice(0, 50) + (content.length > 50 ? '...' : '') }
            : conv
        )
      );
    }

    setIsLoading(true);
    setTimeout(() => {
      let responseMessage: ChatMessageType | undefined;

      if (content.toLowerCase().includes('compare') && content.toLowerCase().includes('brown')) {
        responseMessage = mockMessages.find(
          (msg) => msg.category === 'switch_comparison' && msg.role === 'assistant'
        );
      } else if (content.toLowerCase().includes('typing experience')) {
        responseMessage = mockMessages.find(
          (msg) => msg.content.includes('typing experience') && msg.role === 'assistant'
        );
      } else if (content.toLowerCase().includes('office')) {
        responseMessage = mockMessages.find(
          (msg) => msg.content.includes('office use') && msg.role === 'assistant'
        );
      }

      if (!responseMessage) {
        responseMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          category: 'general',
          content:
            "I'd be happy to help with your question about mechanical keyboard switches. Could you please be more specific about what you'd like to know?"
        };
      }

      const finalResponse = {
        ...responseMessage,
        id: `assistant-${Date.now()}`,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, finalResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    if (id === currentConversationId) {
      const remainingConversations = conversations.filter((conv) => conv.id !== id);
      if (remainingConversations.length > 0) {
        setCurrentConversationId(remainingConversations[0].id);
        setMessages(
          mockMessages.filter((msg) => {
            return msg.id === remainingConversations[0].id || msg.role === 'assistant';
          })
        );
      } else {
        setCurrentConversationId(null);
        setMessages([]);
        setHasInteracted(false);
      }
    }
  };

  const handleResetState = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setHasInteracted(false);
  };

  return (
    <div className="flex h-screen dark:bg-background">
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader onReset={handleResetState} />

        <div className="relative flex flex-1 flex-col overflow-hidden bg-muted/50">
          {!hasInteracted ? (
            <WelcomePage onSendMessage={handleSendMessage} isLoading={isLoading} />
          ) : (
            <ScrollArea className="flex-1 px-4">
              <div className="container max-w-4xl mx-auto">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLastMessage={index === messages.length - 1}
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-start py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}

          {hasInteracted && (
            <div className="bg-background p-4">
              <div className="container max-w-4xl mx-auto space-y-2">
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                <p className="text-xs text-center text-muted-foreground">
                  for educational purposes :D
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
