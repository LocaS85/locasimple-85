
// Utility function to get category color CSS classes

export function getCategoryColorClass(categoryId: string): string {
  switch(categoryId) {
    case 'alimentation':
    case 'restaurants':
      return 'bg-orange-500 hover:bg-orange-600 text-white';
    case 'shopping':
    case 'achat':
      return 'bg-blue-500 hover:bg-blue-600 text-white';
    case 'divertissement':
    case 'loisirs':
      return 'bg-pink-500 hover:bg-pink-600 text-white';
    case 'services':
      return 'bg-emerald-500 hover:bg-emerald-600 text-white';
    case 'sante':
      return 'bg-teal-500 hover:bg-teal-600 text-white';
    case 'hebergement':
    case 'hotel':
      return 'bg-lime-500 hover:bg-lime-600 text-white';
    case 'travail':
      return 'bg-indigo-500 hover:bg-indigo-600 text-white';
    case 'quotidien':
      return 'bg-violet-500 hover:bg-violet-600 text-white';
    case 'ecole':
    case 'education':
      return 'bg-cyan-500 hover:bg-cyan-600 text-white';
    case 'adresse-principale':
      return 'bg-red-500 hover:bg-red-600 text-white';
    case 'famille':
      return 'bg-amber-500 hover:bg-amber-600 text-white';
    case 'amis':
      return 'bg-green-500 hover:bg-green-600 text-white';
    default:
      return 'bg-gray-500 hover:bg-gray-600 text-white';
  }
}

export function getCategoryTextColor(categoryId: string): string {
  switch(categoryId) {
    case 'alimentation':
    case 'restaurants':
      return 'text-orange-500';
    case 'shopping':
    case 'achat':
      return 'text-blue-500';
    case 'divertissement':
    case 'loisirs':
      return 'text-pink-500';
    case 'services':
      return 'text-emerald-500';
    case 'sante':
      return 'text-teal-500';
    case 'hebergement':
    case 'hotel':
      return 'text-lime-500';
    case 'travail':
      return 'text-indigo-500';
    case 'quotidien':
      return 'text-violet-500';
    case 'ecole':
    case 'education':
      return 'text-cyan-500';
    case 'adresse-principale':
      return 'text-red-500';
    case 'famille':
      return 'text-amber-500';
    case 'amis':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
}

// Add missing functions that were causing build errors
export function getCategoryColor(categoryId: string): string {
  switch(categoryId) {
    case 'alimentation':
    case 'restaurants':
      return 'bg-orange-500 text-white';
    case 'shopping':
    case 'achat':
      return 'bg-blue-500 text-white';
    case 'divertissement':
    case 'loisirs':
      return 'bg-pink-500 text-white';
    case 'services':
      return 'bg-emerald-500 text-white';
    case 'sante':
      return 'bg-teal-500 text-white';
    case 'hebergement':
    case 'hotel':
      return 'bg-lime-500 text-white';
    case 'travail':
      return 'bg-indigo-500 text-white';
    case 'quotidien':
      return 'bg-violet-500 text-white';
    case 'ecole':
    case 'education':
      return 'bg-cyan-500 text-white';
    case 'adresse-principale':
      return 'bg-red-500 text-white';
    case 'famille':
      return 'bg-amber-500 text-white';
    case 'amis':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

export function getHoverColor(categoryId: string): string {
  switch(categoryId) {
    case 'alimentation':
    case 'restaurants':
      return 'hover:bg-orange-100 hover:text-orange-700';
    case 'shopping':
    case 'achat':
      return 'hover:bg-blue-100 hover:text-blue-700';
    case 'divertissement':
    case 'loisirs':
      return 'hover:bg-pink-100 hover:text-pink-700';
    case 'services':
      return 'hover:bg-emerald-100 hover:text-emerald-700';
    case 'sante':
      return 'hover:bg-teal-100 hover:text-teal-700';
    case 'hebergement':
    case 'hotel':
      return 'hover:bg-lime-100 hover:text-lime-700';
    case 'travail':
      return 'hover:bg-indigo-100 hover:text-indigo-700';
    case 'quotidien':
      return 'hover:bg-violet-100 hover:text-violet-700';
    case 'ecole':
    case 'education':
      return 'hover:bg-cyan-100 hover:text-cyan-700';
    case 'adresse-principale':
      return 'hover:bg-red-100 hover:text-red-700';
    case 'famille':
      return 'hover:bg-amber-100 hover:text-amber-700';
    case 'amis':
      return 'hover:bg-green-100 hover:text-green-700';
    default:
      return 'hover:bg-gray-100 hover:text-gray-700';
  }
}
