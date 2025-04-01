// Utility to get category color based on category ID or type
export const getCategoryColor = (category: string | null): string => {
  if (!category) return 'bg-gray-500';
  
  const colorMap: Record<string, string> = {
    'restaurants': 'app-secondary',
    'shopping': 'app-primary',
    'entertainment': 'purple-600',
    // Can add more categories as needed
  };

  return colorMap[category] || 'gray-500';
};

// Utility to get gradient color class for a category
export const getCategoryGradient = (category: string | null): string => {
  if (!category) return 'from-gray-400 to-gray-600';
  
  const gradientMap: Record<string, string> = {
    'restaurants': 'from-app-secondary/70 to-app-secondary',
    'shopping': 'from-app-primary/70 to-app-primary',
    'entertainment': 'from-purple-400 to-purple-600',
    // Can add more categories as needed
  };

  return gradientMap[category] || 'from-gray-400 to-gray-600';
};

// Utility to get tailwind color class
export const getCategoryColorClass = (categoryId: string): string => {
  // Extract the main category type from the ID (e.g., 'restaurants-1' → 'restaurants')
  const categoryType = categoryId.split('-')[0];
  
  const colorClasses: Record<string, string> = {
    'restaurants': 'bg-gradient-to-br from-app-secondary/70 to-app-secondary',
    'shopping': 'bg-gradient-to-br from-app-primary/70 to-app-primary',
    'entertainment': 'bg-gradient-to-br from-purple-400 to-purple-600',
    // Can add more as needed
  };
  
  return colorClasses[categoryType] || 'bg-gradient-to-br from-gray-400 to-gray-600';
};
