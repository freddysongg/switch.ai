import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { AI_CONFIG } from '@/config/ai.config.js';
import { useAuth } from '@/hooks/use-auth.js';
import { chatApi } from '@/lib/api.js';

import { ChatMessage as ChatMessageType, Conversation } from '@/types/chat.js';

import { ScrollArea } from '@/components/ui/scroll-area.js';
import { useToast } from '@/components/ui/use-toast.js';
import { ChatHeader } from '@/components/chat/ChatHeader.js';
import { ChatInput } from '@/components/chat/ChatInput.js';
import { ChatMessage } from '@/components/chat/ChatMessage.js';
import { ConversationSidebar } from '@/components/chat/ConversationSidebar.js';
import { WelcomePage } from '@/components/chat/WelcomePage.js';

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
    setError(null);
    setMessages([]);
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setHasInteracted(false);
    setError(null);
  };

  const handleSendMessage = async (content: string) => {
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

    const newUserMessage: ChatMessageType = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      content,
      role: 'user',
      timestamp: new Date().toISOString(),
      createdAt: new Date(),
      metadata: {}
    };
    setMessages((prev) => [...prev, newUserMessage]);

    setIsLoading(true);
    try {
      const response = await retryApiCall(() =>
        chatApi.sendMessage({
          message: content,
          conversationId: currentConversationId || undefined
        })
      );

      if (!currentConversationId && response.metadata && response.metadata.conversationId) {
        setCurrentConversationId(response.metadata.conversationId);
        if (authToken) {
          retryApiCall(() => chatApi.listConversations())
            .then(setConversations)
            .catch((err) => console.error('Failed to refresh convos', err));
        }
      }
      const assistantMessage: ChatMessageType = {
        ...response,
        id: response.id || `asst-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
        timestamp: new Date().toISOString(),
        createdAt: new Date()
      };

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== newUserMessage.id),
        newUserMessage,
        assistantMessage
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

      const errorResponseMessage: ChatMessageType = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: AI_CONFIG?.FALLBACK_ERROR_MESSAGE_LLM || 'Apologies, an error occurred.',
        timestamp: new Date().toISOString(),
        createdAt: new Date(),
        metadata: { error: true }
      };
      setMessages((prev) => [...prev, errorResponseMessage]);
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
    <div className="flex h-screen bg-background dark:bg-background/95 text-foreground">
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader onReset={handleNewConversation} />
        <div className="relative flex flex-1 flex-col overflow-hidden bg-muted/30 dark:bg-muted/10">
          {!hasInteracted && !currentConversationId ? (
            <AnimatePresence>
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                <WelcomePage onSendMessage={handleSendMessage} isLoading={isLoading} />
              </motion.div>
            </AnimatePresence>
          ) : (
            <ScrollArea className="flex-1 px-2 sm:px-4 pt-2 sm:pt-4">
              <div className="container max-w-4xl mx-auto space-y-1 pb-2">
                {error && (
                  <motion.div
                    className="bg-destructive/20 text-destructive px-4 py-2.5 rounded-lg mb-3 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}
                <AnimatePresence initial={false}>
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isLastMessage={index === messages.length - 1}
                      currentUser={currentUser || undefined}
                    />
                  ))}
                </AnimatePresence>
                {isLoading && messages.length > 0 && messages.slice(-1)[0]?.role === 'user' && (
                  <motion.div
                    className="flex items-center gap-2 py-4 pl-10 text-muted-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-xs">assistant is typing...</span>
                  </motion.div>
                )}
                <div ref={messagesEndRef} className="h-1" />
              </div>
            </ScrollArea>
          )}
          {(hasInteracted || currentConversationId) && (
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          )}
        </div>
      </main>
    </div>
  );
}
