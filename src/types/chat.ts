export type SwitchComparison = {
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
};

export type MessageCategory = 'general' | 'switch_comparison' | 'keyboard_recommendation';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  category?: MessageCategory;
  comparison?: {
    [key: `switch${number}`]: SwitchComparison;
  };
  analysis?: string;
  timestamp: string;
};
