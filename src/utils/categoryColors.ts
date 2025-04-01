
// Utility to get category color based on category ID or type
export const getCategoryColor = (category: string | null): string => {
  if (!category) return 'bg-gray-500';
  
  const colorMap: Record<string, string> = {
    'restaurants': 'app-secondary',
    'shopping': 'app-primary',
    'entertainment': 'purple-600',
    'alimentation': 'blue-500',
    'achats': 'pink-500',
    'services': 'amber-500',
    'sante': 'green-500',
    'divertissement': 'purple-500',
    'hebergement': 'orange-500',
    'adresse-principale': 'violet-500',
    'famille': 'pink-500',
    'travail': 'orange-500',
    'ecole': 'blue-500',
    'divers': 'green-500',
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
    'alimentation': 'from-blue-400 to-blue-600',
    'achats': 'from-pink-400 to-pink-600',
    'services': 'from-amber-400 to-amber-600',
    'sante': 'from-green-400 to-green-600',
    'divertissement': 'from-purple-400 to-purple-600',
    'hebergement': 'from-orange-400 to-orange-600',
    'adresse-principale': 'from-violet-400 to-violet-600',
    'famille': 'from-pink-400 to-pink-600',
    'travail': 'from-orange-400 to-orange-600',
    'ecole': 'from-blue-400 to-blue-600',
    'divers': 'from-green-400 to-green-600',
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
    'alimentation': 'bg-gradient-to-br from-blue-400 to-blue-600',
    'achats': 'bg-gradient-to-br from-pink-400 to-pink-600',
    'services': 'bg-gradient-to-br from-amber-400 to-amber-600',
    'sante': 'bg-gradient-to-br from-green-400 to-green-600',
    'divertissement': 'bg-gradient-to-br from-purple-400 to-purple-600',
    'hebergement': 'bg-gradient-to-br from-orange-400 to-orange-600',
    'adresse-principale': 'bg-gradient-to-br from-violet-400 to-violet-600',
    'famille': 'bg-gradient-to-br from-pink-400 to-pink-600',
    'travail': 'bg-gradient-to-br from-orange-400 to-orange-600',
    'ecole': 'bg-gradient-to-br from-blue-400 to-blue-600',
    'divers': 'bg-gradient-to-br from-green-400 to-green-600',
    // Can add more as needed
  };
  
  return colorClasses[categoryType] || 'bg-gradient-to-br from-gray-400 to-gray-600';
};

// Utility to get hover color based on category
export const getHoverColor = (category: string | null): string => {
  if (!category) return 'hover:bg-gray-600';
  
  const hoverMap: Record<string, string> = {
    'restaurants': 'hover:bg-app-secondary-dark',
    'shopping': 'hover:bg-app-primary-dark',
    'entertainment': 'hover:bg-purple-700',
    'alimentation': 'hover:bg-blue-700',
    'achats': 'hover:bg-pink-700',
    'services': 'hover:bg-amber-700',
    'sante': 'hover:bg-green-700',
    'divertissement': 'hover:bg-purple-700',
    'hebergement': 'hover:bg-orange-700',
    'adresse-principale': 'hover:bg-violet-700',
    'famille': 'hover:bg-pink-700',
    'travail': 'hover:bg-orange-700',
    'ecole': 'hover:bg-blue-700',
    'divers': 'hover:bg-green-700',
    // Can add more categories as needed
  };

  return hoverMap[category] || 'hover:bg-gray-600';
};
