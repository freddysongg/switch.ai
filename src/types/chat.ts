import { AnalysisResponse } from './api';

export type UserRole = 'user' | 'assistant';

export interface StructuredContent {
  overview?: string;
  analysis?: string;
  conclusion?:
    | string
    | {
        primaryDifferences?: string;
        overallAssessment?: string;
        decisionGuidance?: string;
      };
  comparativeAnalysis?: {
    feelingTactility?:
      | string
      | {
          description?: string;
          keyDifferences?: string;
          userImpact?: string;
        };
    soundProfile?:
      | string
      | {
          description?: string;
          acousticDifferences?: string;
          environmentalConsiderations?: string;
        };
    buildMaterialComposition?:
      | string
      | {
          materialComparison?: string;
          durabilityAssessment?: string;
          modificationPotential?: string;
        };
    performanceAspects?:
      | string
      | {
          gamingPerformance?: string;
          typingPerformance?: string;
          consistencyReliability?: string;
          fatigueFactors?: string;
        };
  };
}

export interface ChatMessage {
  id: string;
  role: UserRole;
  content: string | StructuredContent;
  timestamp: string;
  metadata: Record<string, unknown>;
  analysis?: AnalysisResponse;
  createdAt: Date;
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
