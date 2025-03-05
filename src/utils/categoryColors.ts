
/**
 * Utility functions for managing category colors
 */

/**
 * Get the background and text color classes for a selected category
 */
export const getCategoryColor = (categoryId: string): string => {
  switch(categoryId) {
    case 'restaurants': return 'bg-red-500 text-white border-red-500';
    case 'bars': return 'bg-orange-500 text-white border-orange-500';
    case 'cafes': return 'bg-amber-500 text-white border-amber-500';
    case 'shopping': return 'bg-yellow-500 text-white border-yellow-500';
    case 'hotels': return 'bg-lime-500 text-white border-lime-500';
    case 'entertainment': return 'bg-green-500 text-white border-green-500';
    case 'health': return 'bg-teal-500 text-white border-teal-500';
    case 'services': return 'bg-cyan-500 text-white border-cyan-500';
    case 'education': return 'bg-blue-500 text-white border-blue-500';
    case 'transport': return 'bg-indigo-500 text-white border-indigo-500';
    default: return 'bg-black text-white border-black';
  }
};

/**
 * Get the hover color classes for a category
 */
export const getHoverColor = (categoryId: string): string => {
  switch(categoryId) {
    case 'restaurants': return 'hover:bg-red-200 hover:text-red-700 hover:border-red-500';
    case 'bars': return 'hover:bg-orange-200 hover:text-orange-700 hover:border-orange-500';
    case 'cafes': return 'hover:bg-amber-200 hover:text-amber-700 hover:border-amber-500';
    case 'shopping': return 'hover:bg-yellow-200 hover:text-yellow-700 hover:border-yellow-500';
    case 'hotels': return 'hover:bg-lime-200 hover:text-lime-700 hover:border-lime-500';
    case 'entertainment': return 'hover:bg-green-200 hover:text-green-700 hover:border-green-500';
    case 'health': return 'hover:bg-teal-200 hover:text-teal-700 hover:border-teal-500';
    case 'services': return 'hover:bg-cyan-200 hover:text-cyan-700 hover:border-cyan-500';
    case 'education': return 'hover:bg-blue-200 hover:text-blue-700 hover:border-blue-500';
    case 'transport': return 'hover:bg-indigo-200 hover:text-indigo-700 hover:border-indigo-500';
    default: return 'hover:bg-gray-200 hover:text-gray-700 hover:border-gray-500';
  }
};
