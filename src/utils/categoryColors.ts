
export const getCategoryColorClass = (categoryId: string): string => {
  switch (categoryId) {
    case 'adresse-principale':
      return 'bg-app-primary/10 hover:bg-app-primary/20';
    case 'famille':
      return 'bg-app-secondary/10 hover:bg-app-secondary/20';
    case 'travail':
      return 'bg-success/10 hover:bg-success/20';
    case 'ecole':
      return 'bg-accent/10 hover:bg-accent/20';
    case 'alimentation':
      return 'bg-green-500/10 hover:bg-green-500/20';
    case 'achats':
      return 'bg-blue-500/10 hover:bg-blue-500/20';
    case 'services':
      return 'bg-orange-500/10 hover:bg-orange-500/20';
    case 'sante':
      return 'bg-red-500/10 hover:bg-red-500/20';
    case 'divertissement':
      return 'bg-purple-500/10 hover:bg-purple-500/20';
    case 'hebergement':
      return 'bg-pink-500/10 hover:bg-pink-500/20';
    case 'divers':
      return 'bg-teal-500/10 hover:bg-teal-500/20';
    default:
      return 'bg-gray-100 hover:bg-gray-200';
  }
};

// Add these new functions to fix import errors
export const getCategoryColor = (categoryId: string): string => {
  switch (categoryId) {
    case 'restaurants': return 'bg-app-secondary hover:bg-app-secondary text-white border-app-secondary';
    case 'bars': return 'bg-orange-500 hover:bg-orange-500 text-white border-orange-500';
    case 'cafes': return 'bg-amber-500 hover:bg-amber-500 text-white border-amber-500';
    case 'shopping': return 'bg-app-primary hover:bg-app-primary text-white border-app-primary';
    case 'hotels': return 'bg-lime-500 hover:bg-lime-500 text-white border-lime-500';
    case 'entertainment': return 'bg-app-gray hover:bg-app-gray text-white border-app-gray';
    case 'health': return 'bg-teal-500 hover:bg-teal-500 text-white border-teal-500';
    case 'services': return 'bg-cyan-500 hover:bg-cyan-500 text-white border-cyan-500';
    case 'education': return 'bg-blue-500 hover:bg-blue-500 text-white border-blue-500';
    case 'transport': return 'bg-indigo-500 hover:bg-indigo-500 text-white border-indigo-500';
    default: return 'bg-app-dark hover:bg-app-dark text-white border-app-dark';
  }
};
  
export const getHoverColor = (categoryId: string): string => {
  switch (categoryId) {
    case 'restaurants': return 'hover:bg-app-secondary/20 hover:text-app-secondary hover:border-app-secondary';
    case 'bars': return 'hover:bg-orange-200 hover:text-orange-700 hover:border-orange-500';
    case 'cafes': return 'hover:bg-amber-200 hover:text-amber-700 hover:border-amber-500';
    case 'shopping': return 'hover:bg-app-primary/20 hover:text-app-primary hover:border-app-primary';
    case 'hotels': return 'hover:bg-lime-200 hover:text-lime-700 hover:border-lime-500';
    case 'entertainment': return 'hover:bg-app-gray/20 hover:text-app-gray hover:border-app-gray';
    case 'health': return 'hover:bg-teal-200 hover:text-teal-700 hover:border-teal-500';
    case 'services': return 'hover:bg-cyan-200 hover:text-cyan-700 hover:border-cyan-500';
    case 'education': return 'hover:bg-blue-200 hover:text-blue-700 hover:border-blue-500';
    case 'transport': return 'hover:bg-indigo-200 hover:text-indigo-700 hover:border-indigo-500';
    default: return 'hover:bg-gray-200 hover:text-gray-700 hover:border-gray-500';
  }
};
