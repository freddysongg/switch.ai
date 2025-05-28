import { ScrollArea } from '@/components/ui/scroll-area.js';
import { useToast } from '@/components/ui/use-toast.js';
import { mockMessages } from '@/data/mockMessages';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { chatApi } from '@/lib/api';

import { ChatMessage as ChatMessageType, Conversation } from '@/types/chat';

import { ChatHeader } from './ChatHeader.js';
import { ChatInput } from './ChatInput.js';
import { ChatMessage } from './ChatMessage.js';
import { ConversationSidebar } from './ConversationSidebar.js';
import { WelcomePage } from './WelcomePage.js';

const DEMO_CONVERSATIONS = mockMessages.slice(0, 4);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
      try {
        setError(null);
        const apiConversations = await retryApiCall(() => chatApi.listConversations());

        // Create demo conversations
        const demoConvs = DEMO_CONVERSATIONS.reduce((acc: Conversation[], msg) => {
          if (msg.role === 'user') {
            acc.push({
              id: msg.id,
              title: msg.content.slice(0, 50) + (msg.content.length > 50 ? '...' : ''),
              userId: 'demo',
              category: 'demo',
              createdAt: new Date(msg.timestamp || Date.now()),
              updatedAt: new Date(msg.timestamp || Date.now())
            });
          }
          return acc;
        }, []);

        setConversations([...demoConvs, ...apiConversations]);
      } catch (error) {
        console.error('Error loading conversations:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to load conversations';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: 'Failed to load conversations. Showing demo content only.',
          variant: 'destructive'
        });

        // Fall back to demo conversations only
        const demoConvs = DEMO_CONVERSATIONS.reduce((acc: Conversation[], msg) => {
          if (msg.role === 'user') {
            acc.push({
              id: msg.id,
              title: msg.content.slice(0, 50) + (msg.content.length > 50 ? '...' : ''),
              userId: 'demo',
              category: 'demo',
              createdAt: new Date(msg.timestamp || Date.now()),
              updatedAt: new Date(msg.timestamp || Date.now())
            });
          }
          return acc;
        }, []);
        setConversations(demoConvs);
      }
    };

    loadConversations();
  }, [toast, retryApiCall]);

  // Load conversation messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentConversationId) {
        setMessages([]);
        return;
      }

      // If it's a demo conversation, use mock data
      if (currentConversationId.startsWith('1') || currentConversationId.startsWith('2')) {
        setIsDemo(true);
        let foundStart = false;
        const conversationMessages = DEMO_CONVERSATIONS.filter((msg) => {
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
        return;
      }

      setIsDemo(false);
      setError(null);
      try {
        const messages = await retryApiCall(() => chatApi.getConversation(currentConversationId));
        setMessages(messages);
      } catch (error) {
        console.error('Error loading messages:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load messages';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: 'Failed to load conversation messages.',
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
    setIsDemo(false);
    setError(null);
  };

  const handleSendMessage = async (content: string) => {
    setHasInteracted(true);
    setError(null);

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date().toISOString()
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

      // If this was the first message in a new conversation, update the conversations list
      if (!currentConversationId) {
        const newConversation: Conversation = {
          id: response.id.split('-')[0],
          title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
          userId: 'user',
          category: 'chat',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setConversations((prev) => [newConversation, ...prev]);
        setCurrentConversationId(newConversation.id);
      }

      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });

      // Add a friendly error message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content:
            "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    if (id.startsWith('1') || id.startsWith('2')) {
      return;
    }

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
        title: 'Success',
        description: 'Conversation deleted successfully.'
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete conversation';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: 'Failed to delete conversation. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleResetState = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setHasInteracted(false);
    setIsDemo(false);
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
                <p className="text-xs text-center text-muted-foreground">
                  {isDemo ? 'demo mode - showing example responses' : 'connected to AI'}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
