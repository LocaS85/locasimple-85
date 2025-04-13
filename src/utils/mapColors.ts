
// Utility functions for map colors

export const getColorForCategory = (categoryId: string): string => {
  switch (categoryId) {
    case 'alimentation':
    case 'restaurants':
      return '#f97316'; // orange-500
    case 'shopping':
    case 'achat':
      return '#3b82f6'; // blue-500
    case 'divertissement':
    case 'loisirs':
      return '#ec4899'; // pink-500
    case 'services':
      return '#10b981'; // emerald-500
    case 'sante':
      return '#14b8a6'; // teal-500
    case 'hebergement':
    case 'hotel':
      return '#84cc16'; // lime-500
    case 'travail':
      return '#6366f1'; // indigo-500
    case 'quotidien':
      return '#8b5cf6'; // violet-500
    case 'ecole':
    case 'education':
      return '#06b6d4'; // cyan-500
    case 'adresse-principale':
      return '#ef4444'; // red-500
    case 'famille':
      return '#f59e0b'; // amber-500
    case 'amis':
      return '#22c55e'; // green-500
    default:
      return '#6b7280'; // gray-500
  }
};

export const getColorForResult = (color: string): string => {
  if (color.startsWith('#')) {
    return color;
  }
  
  return color || '#6b7280'; // Return the color or default gray
};
