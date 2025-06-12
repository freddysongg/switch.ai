/* eslint-disable @typescript-eslint/no-explicit-any */
import { SwitchDetails } from './api.js';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  category?: string;
  timestamp?: string;
  comparison?: {
    switch1: SwitchDetails;
    switch2: SwitchDetails;
    switch3?: SwitchDetails;
    switch4?: SwitchDetails;
    switch5?: SwitchDetails;
  };
  analysis?: string;
}

export interface ChatMessageProps {
  message: ChatMessage;
  isLastMessage: boolean;
  currentUser?: User;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
}

export interface ConversationSidebarProps extends ConversationListProps {
  onNewConversation: () => void;
}

export interface SwitchSearchResult {
  id: string;
  name: string;
  manufacturer: string;
  type: string | null;
  spring: string | null;
  actuationForce: number | null;
  description_text?: string;
  similarity?: number;
}

export interface Conversation {
  id: string;
  userId: string;
  title?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}
