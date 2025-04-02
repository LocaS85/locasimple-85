
// Default theme colors for icons
export const defaultThemeColors = {
  primary: '#2563eb',    // blue-600
  secondary: '#ea580c',  // orange-600
  success: '#22c55e',    // green-500
  accent: '#8b5cf6',     // purple-500
  error: '#ef4444',      // red-500
  warning: '#f59e0b',    // amber-500
  info: '#3b82f6',       // blue-500
  
  // Transport modes
  bus: '#eab308',        // yellow-500
  car: '#3b82f6',        // blue-500
  bike: '#ef4444',       // red-500
  train: '#000000',      // black
  plane: '#6b7280',      // gray-500
  ship: '#06b6d4',       // cyan-500
  
  // Category specific
  food: '#f97316',       // orange-500
  shopping: '#ec4899',   // pink-500
  health: '#10b981',     // emerald-500
  entertainment: '#8b5cf6', // purple-500
  accommodation: '#f59e0b', // amber-500
  services: '#6366f1',   // indigo-500
};

// Get a theme color with fallback
export const getThemeColor = (colorKey: keyof typeof defaultThemeColors, customTheme?: Record<string, string>): string => {
  if (customTheme && customTheme[colorKey]) {
    return customTheme[colorKey];
  }
  return defaultThemeColors[colorKey] || defaultThemeColors.primary;
};

// Function to generate a complete theme based on user preferences
export const generateTheme = (userPreferences: Record<string, string> = {}): Record<string, string> => {
  return {
    ...defaultThemeColors,
    ...userPreferences
  };
};
