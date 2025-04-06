
// Default theme colors for icons based on our premium palette
export const defaultThemeColors = {
  primary: '#5B9CF6',    // Electric blue
  secondary: '#C7956D',  // Copper
  success: '#22c55e',    // Green (kept)
  accent: '#A9B7AC',     // Sage green
  error: '#ef4444',      // Red (kept)
  warning: '#f59e0b',    // Amber (kept)
  info: '#5B9CF6',       // Electric blue
  
  // Transport modes
  bus: '#C7956D',        // Copper
  car: '#5B9CF6',        // Electric blue
  bike: '#A9B7AC',       // Sage green
  train: '#273647',      // Slate blue
  plane: '#EAEAEA',      // Velvet gray
  ship: '#5B9CF6',       // Electric blue
  
  // Category specific
  food: '#C7956D',       // Copper
  shopping: '#5B9CF6',   // Electric blue
  health: '#A9B7AC',     // Sage green
  entertainment: '#5B9CF6', // Electric blue
  accommodation: '#C7956D', // Copper
  services: '#273647',   // Slate blue
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
