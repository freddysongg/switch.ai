/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  category?: string;
  timestamp?: string;
  createdAt?: Date;
  metadata?: Record<string, any>;
  comparison?: {
    switch1: SwitchDetails;
    switch2: SwitchDetails;
    switch3?: SwitchDetails;
    switch4?: SwitchDetails;
    switch5?: SwitchDetails;
  };
  analysis?: string;
}

export interface SwitchDetails {
  name: string;
  brand: string;
  actuation_weight: string;
  bottom_out: string;
  pre_travel: string;
  total_travel: string;
  spring: string;
  stem_material: string;
  housing_material: string;
  lubed_status: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatResponse {
  id: string;
  role: 'assistant';
  content: string;
  metadata?: Record<string, any>;
}
