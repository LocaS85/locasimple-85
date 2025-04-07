
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
