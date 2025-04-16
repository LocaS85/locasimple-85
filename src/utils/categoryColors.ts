
// Function to get a CSS class for the category background color
export function getCategoryColorClass(categoryId: string): string {
  switch (categoryId) {
    case 'quotidien':
      return 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30';
    case 'alimentation':
      return 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30';
    case 'shopping':
      return 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30';
    case 'services':
      return 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30';
    case 'sante':
      return 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30';
    case 'divertissement':
      return 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30';
    case 'hebergement':
      return 'bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/30';
    default:
      return 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/30';
  }
}

// Function to get a text color for category
export function getCategoryTextColor(categoryId: string): string {
  switch (categoryId) {
    case 'quotidien':
      return 'text-blue-600 dark:text-blue-400';
    case 'alimentation':
      return 'text-orange-600 dark:text-orange-400';
    case 'shopping':
      return 'text-green-600 dark:text-green-400';
    case 'services':
      return 'text-purple-600 dark:text-purple-400';
    case 'sante':
      return 'text-red-600 dark:text-red-400';
    case 'divertissement':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'hebergement':
      return 'text-cyan-600 dark:text-cyan-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

// Function to get a color class for category buttons
export function getCategoryColor(categoryId: string): string {
  switch(categoryId) {
    case 'restaurants': return 'bg-red-500 hover:bg-red-600 text-white border-red-500';
    case 'bars': return 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500';
    case 'cafes': return 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500';
    case 'shopping': return 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500';
    case 'hotels': return 'bg-lime-500 hover:bg-lime-600 text-white border-lime-500';
    case 'entertainment': return 'bg-green-500 hover:bg-green-600 text-white border-green-500';
    case 'health': return 'bg-teal-500 hover:bg-teal-600 text-white border-teal-500';
    case 'services': return 'bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500';
    case 'education': return 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500';
    case 'transport': return 'bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-500';
    case 'alimentation': return 'bg-red-500 hover:bg-red-600 text-white border-red-500';
    case 'achat': return 'bg-purple-500 hover:bg-purple-600 text-white border-purple-500';
    case 'sante': return 'bg-teal-500 hover:bg-teal-600 text-white border-teal-500';
    case 'divertissement': return 'bg-green-500 hover:bg-green-600 text-white border-green-500';
    case 'hebergement': return 'bg-lime-500 hover:bg-lime-600 text-white border-lime-500';
    case 'quotidien': return 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500';
    default: return 'bg-slate-500 hover:bg-slate-600 text-white border-slate-500';
  }
}

// Function to get hover color classes
export function getHoverColor(categoryId: string): string {
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
    case 'alimentation': return 'hover:bg-red-200 hover:text-red-700 hover:border-red-500';
    case 'achat': return 'hover:bg-purple-200 hover:text-purple-700 hover:border-purple-500';
    case 'sante': return 'hover:bg-teal-200 hover:text-teal-700 hover:border-teal-500';
    case 'divertissement': return 'hover:bg-green-200 hover:text-green-700 hover:border-green-500';
    case 'hebergement': return 'hover:bg-lime-200 hover:text-lime-700 hover:border-lime-500';
    case 'quotidien': return 'hover:bg-blue-200 hover:text-blue-700 hover:border-blue-500';
    default: return 'hover:bg-gray-200 hover:text-gray-700 hover:border-gray-500';
  }
}
