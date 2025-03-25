
export type ProductCategory = 'gaming' | 'animation' | 'survey' | 'simulation';

export interface Feature {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  shortDescription: string;
  price: number;
  image: string;
  features: Feature[];
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedFeatures: Feature[];
  quantity: number;
}

// Mock product data
export const products: Product[] = [
  {
    id: 'gaming-cloud-1',
    name: 'GameStream Pro',
    category: 'gaming',
    description: 'High-performance cloud gaming platform with ultra-low latency and 4K streaming capabilities. Access hundreds of AAA titles instantly without downloads.',
    shortDescription: 'Premium cloud gaming with ultra-low latency',
    price: 14.99,
    image: '/placeholder.svg',
    isFeatured: true,
    features: [
      { id: 'g1-f1', name: '4K Resolution', description: 'Stream games at crisp 4K resolution', price: 5.99 },
      { id: 'g1-f2', name: 'Unlimited Hours', description: 'No time limits on your gaming sessions', price: 9.99 },
      { id: 'g1-f3', name: 'Multi-device Support', description: 'Play across PC, mobile, and TV', price: 3.99 }
    ]
  },
  {
    id: 'animation-cloud-1',
    name: 'AnimateX Studio',
    category: 'animation',
    description: 'Professional-grade cloud animation software with real-time rendering and collaboration tools. Create stunning 3D and 2D animations with industry-leading tools.',
    shortDescription: 'Cloud-based animation studio with real-time rendering',
    price: 29.99,
    image: '/placeholder.svg',
    isFeatured: true,
    features: [
      { id: 'a1-f1', name: 'AI-Powered Rigging', description: 'Automatic character rigging with AI', price: 12.99 },
      { id: 'a1-f2', name: '4K Export', description: 'Export animations in 4K quality', price: 8.99 },
      { id: 'a1-f3', name: 'Team Collaboration', description: 'Real-time collaboration tools', price: 15.99 }
    ]
  },
  {
    id: 'survey-cloud-1',
    name: 'SurveyFlow',
    category: 'survey',
    description: 'Comprehensive survey platform with advanced analytics and customizable templates. Gather insights with ease using our intuitive interface and powerful reporting tools.',
    shortDescription: 'Advanced survey platform with powerful analytics',
    price: 9.99,
    image: '/placeholder.svg',
    isFeatured: true,
    features: [
      { id: 's1-f1', name: 'Advanced Analytics', description: 'Deep insights with AI-powered analytics', price: 7.99 },
      { id: 's1-f2', name: 'Unlimited Responses', description: 'No cap on survey responses', price: 12.99 },
      { id: 's1-f3', name: 'Custom Branding', description: 'Add your brand elements to surveys', price: 5.99 }
    ]
  },
  {
    id: 'simulation-cloud-1',
    name: 'SimulatePro',
    category: 'simulation',
    description: 'Enterprise-grade simulation software for modeling complex systems and scenarios. From engineering to scientific research, simulate with precision and performance.',
    shortDescription: 'High-performance simulation platform for complex modeling',
    price: 49.99,
    image: '/placeholder.svg',
    isFeatured: true,
    features: [
      { id: 'sim1-f1', name: 'Parallel Processing', description: 'Run simulations on multiple cloud cores', price: 24.99 },
      { id: 'sim1-f2', name: 'Real-time Visualization', description: '3D visualization of simulation results', price: 19.99 },
      { id: 'sim1-f3', name: 'Data Integration', description: 'Import/export from multiple data sources', price: 14.99 }
    ]
  },
  {
    id: 'gaming-cloud-2',
    name: 'CloudPlay',
    category: 'gaming',
    description: 'Affordable cloud gaming solution with a growing library of indie and popular titles. Perfect for casual gamers who want flexibility without high hardware costs.',
    shortDescription: 'Affordable cloud gaming for everyone',
    price: 7.99,
    image: '/placeholder.svg',
    features: [
      { id: 'g2-f1', name: 'HD Streaming', description: '1080p HD game streaming', price: 3.99 },
      { id: 'g2-f2', name: '100+ Game Library', description: 'Access to over 100 games', price: 5.99 },
      { id: 'g2-f3', name: 'Friend Multiplayer', description: 'Play with friends online', price: 2.99 }
    ]
  },
  {
    id: 'animation-cloud-2',
    name: 'MotionLab',
    category: 'animation',
    description: 'Intuitive animation platform designed for beginners and intermediate users. Create beautiful 2D animations with easy-to-use tools and templates.',
    shortDescription: 'User-friendly 2D animation in the cloud',
    price: 19.99,
    image: '/placeholder.svg',
    features: [
      { id: 'a2-f1', name: 'Template Library', description: 'Access hundreds of animation templates', price: 7.99 },
      { id: 'a2-f2', name: 'Sound Effects', description: 'Library of royalty-free sound effects', price: 4.99 },
      { id: 'a2-f3', name: 'Social Sharing', description: 'Directly share to social platforms', price: 2.99 }
    ]
  },
  {
    id: 'survey-cloud-2',
    name: 'FeedbackHub',
    category: 'survey',
    description: 'Specialized feedback collection system designed for product development and customer experience teams. Get actionable insights to improve your offerings.',
    shortDescription: 'Focused feedback system for product teams',
    price: 14.99,
    image: '/placeholder.svg',
    features: [
      { id: 's2-f1', name: 'Sentiment Analysis', description: 'AI-powered sentiment detection', price: 8.99 },
      { id: 's2-f2', name: 'Integration Suite', description: 'Connect with popular development tools', price: 9.99 },
      { id: 's2-f3', name: 'Priority Support', description: '24/7 customer support', price: 6.99 }
    ]
  },
  {
    id: 'simulation-cloud-2',
    name: 'PhysicsEngine',
    category: 'simulation',
    description: 'Physics-focused simulation platform for engineering, education, and research. Model physical systems with precision and visualize results in real-time.',
    shortDescription: 'Precise physics simulation for engineering',
    price: 39.99,
    image: '/placeholder.svg',
    features: [
      { id: 'sim2-f1', name: 'Fluid Dynamics', description: 'Advanced fluid simulation capabilities', price: 19.99 },
      { id: 'sim2-f2', name: 'Structural Analysis', description: 'Test structural integrity under stress', price: 15.99 },
      { id: 'sim2-f3', name: 'Export to CAD', description: 'Seamless export to CAD software', price: 12.99 }
    ]
  }
];

// Get products by category
export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return products.filter(product => product.category === category);
};

// Get featured products
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.isFeatured);
};

// Get product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Categories data
export interface Category {
  id: ProductCategory;
  name: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'High-performance cloud gaming solutions',
    icon: 'Game'
  },
  {
    id: 'animation',
    name: 'Animation',
    description: 'Professional animation tools in the cloud',
    icon: 'Clapperboard'
  },
  {
    id: 'survey',
    name: 'Survey',
    description: 'Advanced survey and data collection platforms',
    icon: 'ClipboardList'
  },
  {
    id: 'simulation',
    name: 'Simulation',
    description: 'Complex simulation software for professionals',
    icon: 'BarChart'
  }
];
