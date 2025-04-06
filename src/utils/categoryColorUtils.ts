
/**
 * Returns the appropriate text color class for a category
 */
export const getCategoryTextColor = (categoryId: string): string => {
  // Shopping & sub-categories
  if (categoryId === 'shopping' || 
      categoryId === 'vetements' || 
      categoryId === 'electronique' || 
      categoryId === 'librairies') {
    return "#27ae60"; // Green
  }
  
  // Food & sub-categories
  if (categoryId === 'alimentation' || 
      categoryId === 'restaurants' || 
      categoryId === 'cafes-salons' || 
      categoryId === 'boulangeries') {
    return "#e67e22"; // Orange
  }
  
  // Health & sub-categories
  if (categoryId === 'sante' || 
      categoryId === 'hopitaux' || 
      categoryId === 'pharmacies' || 
      categoryId === 'medecins') {
    return "#e74c3c"; // Red
  }
  
  // Entertainment & sub-categories
  if (categoryId === 'divertissement' || 
      categoryId === 'cinemas' || 
      categoryId === 'theatres' || 
      categoryId === 'parcs') {
    return "#3498db"; // Blue
  }
  
  // Accommodation & sub-categories
  if (categoryId === 'hebergement' || 
      categoryId === 'hotels' || 
      categoryId === 'auberges') {
    return "#9b59b6"; // Purple
  }
  
  // Services
  if (categoryId === 'services' || 
      categoryId === 'banques' || 
      categoryId === 'poste') {
    return "#f39c12"; // Yellow
  }
  
  // Default color
  return "#34495e"; // Dark blue
};

/**
 * Returns the appropriate icon color class for a category 
 */
export const getCategoryIconColorClass = (categoryId: string): string => {
  // Shopping & sub-categories
  if (categoryId === 'shopping' || 
      categoryId.includes('vetements') || 
      categoryId.includes('electronique') || 
      categoryId.includes('magasin')) {
    return "text-green-600";
  }
  
  // Food & sub-categories
  if (categoryId === 'alimentation' || 
      categoryId.includes('restaurant') || 
      categoryId.includes('cafe') || 
      categoryId.includes('boulangerie')) {
    return "text-orange-600";
  }
  
  // Health & sub-categories
  if (categoryId === 'sante' || 
      categoryId.includes('hopital') || 
      categoryId.includes('pharmacie') || 
      categoryId.includes('medecin')) {
    return "text-red-600";
  }
  
  // Entertainment & sub-categories
  if (categoryId === 'divertissement' || 
      categoryId.includes('cinema') || 
      categoryId.includes('theatre') || 
      categoryId.includes('parc')) {
    return "text-blue-600";
  }
  
  // Accommodation & sub-categories
  if (categoryId === 'hebergement' || 
      categoryId.includes('hotel') || 
      categoryId.includes('auberge')) {
    return "text-purple-600";
  }
  
  // Services
  if (categoryId === 'services' || 
      categoryId.includes('banque') || 
      categoryId.includes('poste')) {
    return "text-yellow-600";
  }
  
  // Default color
  return "text-gray-600";
};
