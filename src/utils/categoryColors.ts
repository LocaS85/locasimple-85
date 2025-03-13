
// Map category IDs to Tailwind colors
export const getCategoryColor = (categoryId: string): string => {
  switch (categoryId) {
    case 'restaurants':
      return 'bg-red-500 text-white hover:bg-red-600';
    case 'bars':
      return 'bg-amber-500 text-white hover:bg-amber-600';
    case 'cafes':
      return 'bg-orange-500 text-white hover:bg-orange-600';
    case 'shopping':
      return 'bg-blue-500 text-white hover:bg-blue-600';
    case 'hotels':
      return 'bg-indigo-500 text-white hover:bg-indigo-600';
    case 'entertainment':
      return 'bg-purple-500 text-white hover:bg-purple-600';
    case 'health':
      return 'bg-green-500 text-white hover:bg-green-600';
    case 'services':
      return 'bg-teal-500 text-white hover:bg-teal-600';
    case 'education':
      return 'bg-cyan-500 text-white hover:bg-cyan-600';
    case 'transport':
      return 'bg-slate-500 text-white hover:bg-slate-600';
    default:
      return 'bg-gray-500 text-white hover:bg-gray-600';
  }
};

// Get hover color for buttons
export const getHoverColor = (categoryId: string): string => {
  switch (categoryId) {
    case 'restaurants':
      return 'hover:text-red-500 hover:border-red-500';
    case 'bars':
      return 'hover:text-amber-500 hover:border-amber-500';
    case 'cafes':
      return 'hover:text-orange-500 hover:border-orange-500';
    case 'shopping':
      return 'hover:text-blue-500 hover:border-blue-500';
    case 'hotels':
      return 'hover:text-indigo-500 hover:border-indigo-500';
    case 'entertainment':
      return 'hover:text-purple-500 hover:border-purple-500';
    case 'health':
      return 'hover:text-green-500 hover:border-green-500';
    case 'services':
      return 'hover:text-teal-500 hover:border-teal-500';
    case 'education':
      return 'hover:text-cyan-500 hover:border-cyan-500';
    case 'transport':
      return 'hover:text-slate-500 hover:border-slate-500';
    default:
      return 'hover:text-gray-500 hover:border-gray-500';
  }
};
