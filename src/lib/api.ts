import axios from 'axios';

import { ChatMessage, ChatResponse, Conversation } from '@/types/chat';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export const chatApi = {
  // Send a chat message
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    try {
      const response = await api.post('/chat', request);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get conversation history
  getConversation: async (conversationId: string): Promise<ChatMessage[]> => {
    try {
      const response = await api.get(`/chat/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting conversation:', error);
      throw error;
    }
  },

  // List all conversations
  listConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await api.get('/chat');
      return response.data;
    } catch (error) {
      console.error('Error listing conversations:', error);
      throw error;
    }
  },

  // Delete a conversation
  deleteConversation: async (conversationId: string): Promise<void> => {
    try {
      await api.delete(`/chat/${conversationId}`);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }
};
