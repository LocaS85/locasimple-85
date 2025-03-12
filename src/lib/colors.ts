
/**
 * Modern flat design color palette for the application
 * Used for consistent theming across components
 */

export const colors = {
  // Primary colors
  primary: {
    light: '#3b82f6', // blue-500
    DEFAULT: '#2563eb', // blue-600
    dark: '#1d4ed8', // blue-700
  },
  
  // Secondary colors
  secondary: {
    light: '#f97316', // orange-500
    DEFAULT: '#ea580c', // orange-600
    dark: '#c2410c', // orange-700
  },

  // Accent colors
  accent: {
    green: '#10b981', // green-500
    purple: '#8b5cf6', // purple-500
    pink: '#ec4899', // pink-500
    yellow: '#eab308', // yellow-500
  },

  // Success states
  success: {
    light: '#4ade80', // green-400
    DEFAULT: '#22c55e', // green-500
    dark: '#16a34a', // green-600
  },

  // Error states
  error: {
    light: '#f87171', // red-400
    DEFAULT: '#ef4444', // red-500
    dark: '#dc2626', // red-600
  },

  // Warning states
  warning: {
    light: '#fbbf24', // amber-400
    DEFAULT: '#f59e0b', // amber-500
    dark: '#d97706', // amber-600
  },

  // Information states
  info: {
    light: '#60a5fa', // blue-400
    DEFAULT: '#3b82f6', // blue-500
    dark: '#2563eb', // blue-600
  },
  
  // Neutral colors
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// Category colors for map pins and UI elements
export const categoryColors = {
  restaurants: 'orange',
  shopping: 'green',
  hotels: 'purple',
  attractions: 'pink',
  services: 'blue',
  transport: 'yellow',
  other: 'gray',
};

// Helper function to get a color based on category
export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'restaurants':
      return 'text-orange-500 bg-orange-500 border-orange-500';
    case 'shopping':
    case 'commerces':
      return 'text-green-500 bg-green-500 border-green-500';
    case 'hotels':
    case 'hébergements':
      return 'text-purple-500 bg-purple-500 border-purple-500';
    case 'attractions':
    case 'loisirs':
      return 'text-pink-500 bg-pink-500 border-pink-500';
    case 'services':
      return 'text-blue-500 bg-blue-500 border-blue-500';
    case 'transport':
      return 'text-yellow-500 bg-yellow-500 border-yellow-500';
    default:
      return 'text-gray-500 bg-gray-500 border-gray-500';
  }
};

export default colors;
