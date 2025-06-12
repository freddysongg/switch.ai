'use client';

import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useAuth } from '@/contexts/auth-context';
import { chatApi } from '@/lib/api.js';

import type { ChatMessage as ChatMessageType, Conversation } from '@/types/chat.js';

import { ScrollArea } from '@/components/ui/scroll-area.js';
import { useToast } from '@/components/ui/use-toast.js';
import { ChatHeader } from '@/components/chat/ChatHeader.js';
import { ChatInput } from '@/components/chat/ChatInput.js';
import { ChatMessage } from '@/components/chat/ChatMessage.js';
import { ConversationSidebar } from '@/components/chat/ConversationSidebar.js';
import { WelcomePage } from '@/components/chat/WelcomePage.js';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default function ChatInterface() {
  const { authToken, currentUser } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSteps, setLoadingSteps] = useState<string[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const retryApiCall = useCallback(
    async <T,>(apiCall: () => Promise<T>, retries = MAX_RETRIES): Promise<T> => {
      try {
        return await apiCall();
      } catch (error) {
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 429) {
            console.warn('Rate limit exceeded, not retrying immediately');
            throw error;
          }
        }

        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return retryApiCall(apiCall, retries - 1);
        }
        throw error;
      }
    },
    []
  );

  useEffect(() => {
    let isMounted = true;

    const loadConversations = async () => {
      if (!authToken || !currentUser) {
        console.log('No auth token or user, skipping conversation load.');
        if (isMounted) {
          setConversations([]);
        }
        return;
      }

      try {
        if (isMounted) {
          setConversations(await retryApiCall(() => chatApi.listConversations()));
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        if (
          !(
            error &&
            typeof error === 'object' &&
            'response' in error &&
            (error as { response?: { status?: number } }).response?.status === 429
          )
        ) {
          toast({
            title: 'error',
            description: 'failed to load conversations.',
            variant: 'destructive'
          });
        }
        setConversations([]);
      }
    };

    loadConversations();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, currentUser, toast]);

  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      if (!currentConversationId) {
        if (isMounted) {
          setMessages([]);
        }
        return;
      }

      try {
        const messages = await retryApiCall(() => chatApi.getConversation(currentConversationId));
        if (isMounted) {
          setMessages(messages);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        if (
          !(
            error &&
            typeof error === 'object' &&
            'response' in error &&
            (error as { response?: { status?: number } }).response?.status === 429
          )
        ) {
          toast({
            title: 'error',
            description: 'failed to load conversation messages.',
            variant: 'destructive'
          });
        }
        setMessages([]);
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversationId, toast]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const behavior = lastMessage?.role === 'user' || isLoading ? 'smooth' : 'auto';
      setTimeout(() => scrollToBottom(behavior), 50);
    }
  }, [messages, isLoading, scrollToBottom]);

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    setHasInteracted(true);
    setMessages([]);
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setHasInteracted(false);
  };

  const handleSendMessage = async (content: string) => {
    if (content.trim().length < 3) {
      toast({
        title: 'Message too short',
        description: 'Your message must be at least 3 characters long.',
        variant: 'destructive'
      });
      return;
    }

    setHasInteracted(true);

    const newUserMessage: ChatMessageType = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
      createdAt: new Date(),
      metadata: {}
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoadingSteps(['Analyzing intent...']);

    setIsLoading(true);
    try {
      setTimeout(() => setLoadingSteps((prev) => [...prev, 'Searching database...']), 1500);
      setTimeout(() => setLoadingSteps((prev) => [...prev, 'Formatting response...']), 3000);

      const response = await retryApiCall(() =>
        chatApi.sendMessage({
          message: content,
          conversationId: currentConversationId || undefined
        })
      );

      console.log('Full API Response:', response);

      if (!currentConversationId && response.conversationId) {
        const conversationId = response.conversationId;
        setCurrentConversationId(conversationId);
        const title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
        await retryApiCall(() => chatApi.updateConversation(conversationId, { title }));
        retryApiCall(() => chatApi.listConversations())
          .then(setConversations)
          .catch((err) => console.error('Failed to refresh convos', err));
      }

      const assistantMessage: ChatMessageType = {
        id: `asst-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
        role: 'assistant',
        content: response.analysis || response.overview,
        analysis: response,
        timestamp: new Date().toISOString(),
        createdAt: new Date(),
        metadata: {}
      };

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== newUserMessage.id),
        newUserMessage,
        assistantMessage
      ]);
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      let errorMessage = 'Failed to send message';
      let errorDetails: unknown = error;

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: {
            data?: { error?: string | { message: string; details?: Record<string, unknown> } };
          };
          message?: string;
        };
        const errorData = axiosError.response?.data?.error;
        if (typeof errorData === 'object' && errorData !== null && 'message' in errorData) {
          errorMessage = errorData.message;
          errorDetails = errorData.details || errorData;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
      }

      const errorResponse: ChatMessageType = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date().toISOString(),
        createdAt: new Date(),
        metadata: {
          error: true,
          details: errorDetails
        }
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
      setLoadingSteps([]);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <ConversationSidebar
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        currentConversationId={currentConversationId}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader
          onReset={handleNewConversation}
          conversationCount={conversations.length}
          isAiThinking={isLoading}
        />
        <div className="relative flex flex-1 flex-col overflow-hidden bg-background text-foreground">
          {messages.length > 0 || hasInteracted ? (
            <>
              <ScrollArea className="flex-1 p-4" id="chat-scroll-area">
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <ChatMessage
                      key={msg.id}
                      message={msg}
                      currentUser={currentUser}
                      isLastMessage={index === messages.length - 1}
                    />
                  ))}
                  {isLoading && loadingSteps.length > 0 && (
                    <ChatMessage
                      key="loading"
                      message={{
                        id: 'loading',
                        role: 'assistant',
                        content: '',
                        timestamp: new Date().toISOString(),
                        createdAt: new Date(),
                        metadata: { loadingSteps }
                      }}
                      currentUser={currentUser}
                      isLastMessage={true}
                    />
                  )}
                  <div ref={messagesEndRef} className="h-1" />
                </AnimatePresence>
              </ScrollArea>
              <div className="border-t bg-background p-4">
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <WelcomePage onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
