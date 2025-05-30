import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AI_CONFIG } from '@/config/ai.config.js';
import { useAuth } from '@/hooks/use-auth.js';
import { chatApi } from '@/lib/api.js';

import { ChatMessage as ChatMessageType, Conversation } from '@/types/chat.js';

import { ScrollArea } from '@/components/ui/scroll-area.js';
import { useToast } from '@/components/ui/use-toast.js';

import { ChatHeader } from './ChatHeader.js';
import { ChatInput } from './ChatInput.js';
import { ChatMessage } from './ChatMessage.js';
import { ConversationSidebar } from './ConversationSidebar.js';
import { WelcomePage } from './WelcomePage.js';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { authToken, currentUser } = useAuth();

  // Retry logic for API calls
  const retryApiCall = useCallback(
    async <T,>(apiCall: () => Promise<T>, retries = MAX_RETRIES): Promise<T> => {
      try {
        return await apiCall();
      } catch (error) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          return retryApiCall(apiCall, retries - 1);
        }
        throw error;
      }
    },
    []
  );

  // Load conversations from API
  useEffect(() => {
    const loadConversations = async () => {
      if (!authToken || !currentUser) {
        console.log('No auth token or user, skipping conversation load.');
        setConversations([]);
        return;
      }

      try {
        setError(null);
        const apiConversations = await retryApiCall(() => chatApi.listConversations());
        setConversations(apiConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load conversations';
        setError(errorMessage);
        toast({
          title: 'error',
          description: 'failed to load conversations.',
          variant: 'destructive'
        });
        setConversations([]);
      }
    };

    loadConversations();
  }, [toast, retryApiCall, authToken, currentUser]);

  // Load conversation messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentConversationId) {
        setMessages([]);
        return;
      }

      setError(null);
      try {
        const messages = await retryApiCall(() => chatApi.getConversation(currentConversationId));
        setMessages(messages);
      } catch (error) {
        console.error('Error loading messages:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load messages';
        setError(errorMessage);
        toast({
          title: 'error',
          description: 'failed to load conversation messages.',
          variant: 'destructive'
        });
        setMessages([]);
      }
    };

    loadMessages();
  }, [currentConversationId, toast, retryApiCall]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    setHasInteracted(true);
    setError(null);
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setHasInteracted(false);
    setError(null);
  };

  const handleSendMessage = async (content: string) => {
    // Input validation
    if (!content.trim()) {
      toast({
        title: 'error',
        description: 'cannot send an empty message',
        variant: 'destructive'
      });
      return;
    }

    setHasInteracted(true);
    setError(null);

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
      createdAt: new Date(),
      metadata: {}
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    try {
      const response = await retryApiCall(() =>
        chatApi.sendMessage({
          message: content,
          conversationId: currentConversationId || undefined
        })
      );

      // Handle new conversation creation
      if (!currentConversationId && response.metadata && response.metadata.conversationId) {
        setCurrentConversationId(response.metadata.conversationId);
        // Optionally refresh conversation list
        if (authToken) {
          try {
            const apiConversations = await retryApiCall(() => chatApi.listConversations());
            setConversations(apiConversations);
          } catch (error) {
            console.error('Error refreshing conversations:', error);
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          ...response,
          timestamp: new Date().toISOString(),
          createdAt: new Date()
        }
      ]);
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      let errorMessage = 'Failed to send message';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } }; message?: string };
        errorMessage = axiosError.response?.data?.error || axiosError.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast({
        title: 'error',
        description: 'failed to send message. please try again.',
        variant: 'destructive'
      });

      // Add a fallback error message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content:
            AI_CONFIG?.FALLBACK_ERROR_MESSAGE_LLM ||
            "i apologize, but i'm having trouble responding right now. please try again in a moment.",
          timestamp: new Date().toISOString(),
          createdAt: new Date(),
          metadata: { error: true }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await retryApiCall(() => chatApi.deleteConversation(id));
      setConversations((prev) => prev.filter((conv) => conv.id !== id));
      if (id === currentConversationId) {
        const remainingConversations = conversations.filter((conv) => conv.id !== id);
        if (remainingConversations.length > 0) {
          setCurrentConversationId(remainingConversations[0].id);
        } else {
          handleResetState();
        }
      }
      toast({
        title: 'success',
        description: 'conversation deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      const errorMessage = error instanceof Error ? error.message : 'failed to delete conversation';
      setError(errorMessage);
      toast({
        title: 'error',
        description: 'failed to delete conversation. please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleResetState = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setHasInteracted(false);
    setError(null);
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
                {error && (
                  <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mb-4">
                    {error}
                  </div>
                )}
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
                <p className="text-xs text-center text-muted-foreground">connected to ai</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
