import { ChatMessage } from '@/types/chat';

export const mockMessages: ChatMessage[] = [
  // Conversation 1: Browns Comparison
  {
    id: '1',
    role: 'user',
    content: 'Compare Cherry MX Browns, Gateron Browns, and Akko CS Ocean switches',
    category: 'switch_comparison',
    timestamp: '2025-05-26T12:45:00.000Z'
  },
  {
    id: '2',
    role: 'assistant',
    content: "Here's a comparison of these tactile switches:",
    category: 'switch_comparison',
    timestamp: '2025-05-26T12:45:01.000Z',
    comparison: {
      switch1: {
        name: 'Cherry MX Brown',
        brand: 'Cherry',
        actuation_weight: '45g',
        bottom_out: '60g',
        pre_travel: '2.0mm',
        total_travel: '4.0mm',
        spring: 'Standard',
        stem_material: 'POM',
        housing_material: 'Nylon/PC',
        lubed_status: 'No'
      },
      switch2: {
        name: 'Gateron Brown',
        brand: 'Gateron',
        actuation_weight: '45g',
        bottom_out: '55g',
        pre_travel: '2.0mm',
        total_travel: '4.0mm',
        spring: 'Standard',
        stem_material: 'POM',
        housing_material: 'Nylon/PC',
        lubed_status: 'No'
      },
      switch3: {
        name: 'Akko CS Ocean',
        brand: 'Akko',
        actuation_weight: '38g',
        bottom_out: '45g',
        pre_travel: '1.9mm',
        total_travel: '4.0mm',
        spring: 'Long Spring',
        stem_material: 'POM',
        housing_material: 'Nylon PA66',
        lubed_status: 'Factory Lubed'
      }
    },
    analysis:
      'Looking at these switches, each offers a different take on the tactile experience. The Cherry MX Browns are the classic choice with a moderate tactile bump and standard spring weight, making them suitable for both typing and gaming. Gateron Browns offer a smoother operation with slightly reduced resistance, which some users find more comfortable for long typing sessions. The Akko CS Ocean stands out with its lighter actuation force and factory lubrication, potentially offering the smoothest typing experience out of the box. If minimizing finger fatigue is a priority, the Akko CS Ocean would be the best choice. For a more traditional tactile feel, the Cherry MX Browns remain a reliable option.'
  },
  {
    id: '3',
    role: 'user',
    content: 'Which one would you recommend for office use?',
    timestamp: '2025-05-26T12:45:02.000Z'
  },
  {
    id: '4',
    role: 'assistant',
    content:
      "For office use, I would recommend the Akko CS Ocean switches. They have the lightest actuation force among the three, which means less finger fatigue during long typing sessions. They're also factory lubed, resulting in smoother operation and reduced noise out of the box. The Gateron Browns would be my second choice as they have a slightly lighter bottom-out force compared to Cherry MX Browns, making them more comfortable for extended use.",
    timestamp: '2025-05-26T12:45:03.000Z'
  },

  // Conversation 2: Silent Switches
  {
    id: '5',
    role: 'user',
    content: 'What are the quietest mechanical switches?',
    category: 'switch_comparison',
    timestamp: '2025-05-26T12:46:00.000Z'
  },
  {
    id: '6',
    role: 'assistant',
    content: 'Let me show you a comparison of popular silent switches:',
    category: 'switch_comparison',
    timestamp: '2025-05-26T12:46:01.000Z',
    comparison: {
      switch1: {
        name: 'Zilent V2',
        brand: 'ZealPC',
        actuation_weight: '62g',
        bottom_out: '78g',
        pre_travel: '2.0mm',
        total_travel: '4.0mm',
        spring: 'Gold-plated',
        stem_material: 'POM',
        housing_material: 'PC Top/Nylon Bottom',
        lubed_status: 'No'
      },
      switch2: {
        name: 'Silent Alpaca',
        brand: 'JWK/Durock',
        actuation_weight: '62g',
        bottom_out: '67g',
        pre_travel: '2.0mm',
        total_travel: '4.0mm',
        spring: 'Gold-plated',
        stem_material: 'POM',
        housing_material: 'Nylon/PC',
        lubed_status: 'No'
      },
      switch3: {
        name: 'Bobagum Silent Linear',
        brand: 'Gazzew',
        actuation_weight: '52g',
        bottom_out: '62g',
        pre_travel: '1.7mm',
        total_travel: '4.0mm',
        spring: 'Stainless Steel',
        stem_material: 'POM',
        housing_material: 'Custom Blend',
        lubed_status: 'No'
      }
    }
  },

  // Conversation 3: Gaming Switches
  {
    id: '7',
    role: 'user',
    content: 'Best switches for gaming?',
    category: 'general',
    timestamp: '2025-05-26T12:47:00.000Z'
  },
  {
    id: '8',
    role: 'assistant',
    content:
      'For gaming, many prefer linear switches due to their smooth, consistent keypresses. Here are some popular choices:',
    category: 'switch_comparison',
    timestamp: '2025-05-26T12:47:01.000Z',
    comparison: {
      switch1: {
        name: 'Gateron CJ',
        brand: 'Gateron',
        actuation_weight: '45g',
        bottom_out: '55g',
        pre_travel: '2.0mm',
        total_travel: '4.0mm',
        spring: 'Double-stage',
        stem_material: 'POM',
        housing_material: 'Nylon PA66',
        lubed_status: 'Factory Lubed'
      },
      switch2: {
        name: 'NK Cream',
        brand: 'Novelkeys',
        actuation_weight: '55g',
        bottom_out: '70g',
        pre_travel: '2.0mm',
        total_travel: '4.0mm',
        spring: 'Standard',
        stem_material: 'POM',
        housing_material: 'POM',
        lubed_status: 'No'
      }
    }
  },

  // Conversation: Linear Switch Comparison
  {
    id: 'linear-1',
    role: 'user',
    content: 'Can you compare the most popular linear switches?',
    category: 'switch_comparison',
    timestamp: '2025-05-26T12:48:00.000Z'
  },
  {
    id: 'linear-2',
    role: 'assistant',
    content: "Here's a detailed comparison of five popular linear switches for keyboards:",
    category: 'switch_comparison',
    timestamp: '2025-05-26T12:48:01.000Z',
    comparison: {
      switch1: {
        name: 'Gateron CJ Linear',
        brand: 'Gateron',
        actuation_weight: '45g',
        bottom_out: '55g',
        pre_travel: '2.0mm',
        total_travel: '4.0mm',
        spring: 'Double-stage',
        stem_material: 'POM',
        housing_material: 'Nylon PA66',
        lubed_status: 'Factory Lubed'
      },
      switch2: {
        name: 'NK Cream',
        brand: 'Novelkeys',
        actuation_weight: '55g',
        bottom_out: '70g',
        pre_travel: '2.0mm',
        total_travel: '4.0mm',
        spring: 'Standard',
        stem_material: 'POM',
        housing_material: 'POM',
        lubed_status: 'No'
      },
      switch3: {
        name: 'C³Equalz X TKC Tangerine',
        brand: 'C³Equalz',
        actuation_weight: '62g',
        bottom_out: '67g',
        pre_travel: '2.0mm',
        total_travel: '3.8mm',
        spring: 'Gold-plated',
        stem_material: 'UHMWPE',
        housing_material: 'Custom UHMWPE blend',
        lubed_status: 'Factory Lubed'
      },
      switch4: {
        name: 'Alpaca Linear',
        brand: 'JWK',
        actuation_weight: '60g',
        bottom_out: '65g',
        pre_travel: '2.0mm',
        total_travel: '4.0mm',
        spring: 'Gold-plated',
        stem_material: 'POM',
        housing_material: 'Nylon/PC',
        lubed_status: 'No'
      },
      switch5: {
        name: 'Gateron Oil King',
        brand: 'Gateron',
        actuation_weight: '55g',
        bottom_out: '65g',
        pre_travel: '2.0mm',
        total_travel: '4.0mm',
        spring: 'Double-stage',
        stem_material: 'Nylon',
        housing_material: 'Nylon KS-3',
        lubed_status: 'Factory Lubed'
      }
    }
  },
  {
    id: 'linear-3',
    role: 'user',
    content: 'Which one is the smoothest?',
    category: 'general',
    timestamp: '2025-05-26T12:48:02.000Z'
  },
  {
    id: 'linear-4',
    role: 'assistant',
    content:
      "Among these switches, the C³Equalz X TKC Tangerine and Gateron Oil King are generally considered the smoothest out of the box. The Tangerines are especially known for their ultra-smooth feel due to their UHMWPE housing and stem materials. The Oil Kings also provide excellent smoothness thanks to Gateron's special nylon KS-3 housing and factory lubing. That said, all of these switches can become incredibly smooth with proper lubrication. NK Creams have a unique characteristic where they become noticeably smoother over time as the POM housing and stem wear against each other.",
    timestamp: '2025-05-26T12:48:03.000Z'
  }
];
