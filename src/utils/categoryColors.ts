
export const getCategoryColorClass = (categoryId: string): string => {
  switch (categoryId) {
    case 'adresse-principale':
      return 'bg-primary/10 hover:bg-primary/20';
    case 'famille':
      return 'bg-secondary/10 hover:bg-secondary/20';
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
