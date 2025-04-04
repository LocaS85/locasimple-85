
// Common utility functions for category colors

// Text color for category icons and text based on category ID
export const getCategoryTextColor = (categoryId: string): string => {
  switch(categoryId) {
    case 'alimentation': 
    case 'restaurants':
    case 'cafes':
      return '#f97316'; // orange-500
    case 'divertissement':
    case 'cinemas':
    case 'theatres':
      return '#3b82f6'; // blue-500
    case 'sante':
    case 'hopitaux':
    case 'pharmacies':
      return '#ef4444'; // red-500
    case 'travail':
    case 'bureaux':
      return '#8b5cf6'; // violet-500
    case 'shopping':
    case 'magasins':
      return '#22c55e'; // green-500
    case 'quotidien':
    case 'daily':
      return '#06b6d4'; // cyan-500
    case 'hotel':
    case 'hebergement':
      return '#06b6d4'; // cyan-500
    case 'transport':
    case 'vehicules':
      return '#a855f7'; // purple-500
      
    // Quotidien subcategories
    case 'adresse-principale':
      return '#8B5CF6'; // violet-600
    case 'famille':
      return '#D946EF'; // pink-600
    case 'amis':
      return '#3B82F6'; // blue-600
    case 'ecole':
      return '#0EA5E9'; // sky-500
    case 'activites':
      return '#10B981'; // emerald-500
      
    default:
      return '#f8fafc'; // slate-50
  }
};

// Tailwind CSS class for category icon color
export const getCategoryIconColorClass = (categoryId: string): string => {
  switch (categoryId) {
    case 'alimentation':
    case 'restaurants': 
      return 'text-orange-600';
    case 'divertissement':
    case 'cinemas':
      return 'text-blue-600';
    case 'sante':
    case 'hopitaux':
      return 'text-red-600';
    case 'travail':
    case 'bureaux':
      return 'text-purple-600';
    case 'quotidien':
      return 'text-cyan-600';
    case 'shopping':
    case 'magasins':
      return 'text-green-600';
    case 'hotel':
    case 'hebergement':
      return 'text-cyan-600';
    case 'transport':
    case 'vehicules':
      return 'text-purple-600';
      
    // Quotidien subcategories
    case 'adresse-principale':
      return 'text-violet-600';
    case 'famille':
      return 'text-pink-600';
    case 'amis':
      return 'text-blue-600';
    case 'ecole':
      return 'text-sky-500';
    case 'activites':
      return 'text-emerald-500';
      
    default:
      return 'text-gray-600';
  }
};

// Function to get Tailwind hover background color class for each category
export const getCategoryHoverColorClass = (categoryId: string): string => {
  switch (categoryId) {
    case 'alimentation':
      return 'hover:bg-orange-200';
    case 'divertissement':
      return 'hover:bg-blue-200';
    case 'sante':
      return 'hover:bg-red-200';
    case 'travail':
      return 'hover:bg-purple-200';
    case 'quotidien':
      return 'hover:bg-cyan-200';
    case 'shopping':
      return 'hover:bg-green-200';
    case 'hotel':
      return 'hover:bg-cyan-200';
    case 'transport':
      return 'hover:bg-purple-200';
      
    // Quotidien subcategories
    case 'adresse-principale':
      return 'hover:bg-violet-200';
    case 'famille':
      return 'hover:bg-pink-200';
    case 'amis':
      return 'hover:bg-blue-200';
    case 'ecole':
      return 'hover:bg-sky-200';
    case 'activites':
      return 'hover:bg-emerald-200';
      
    default:
      return 'hover:bg-gray-200';
  }
};
