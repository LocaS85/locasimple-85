
import React from 'react';
import { 
  Utensils, 
  Coffee, 
  Pizza, 
  Wine, 
  Beer, 
  Map,
  ShoppingCart,
  ShoppingBag
} from 'lucide-react';

export const getFoodCategoryIcon = (categoryId: string, className: string, color?: string) => {
  const getIcon = (Icon: React.FC<any>, defaultColor: string) => {
    if (color) {
      return <Icon className={className} style={{ color }} />;
    }
    return <Icon className={`${className} text-${defaultColor}`} />;
  };

  switch (categoryId) {
    // Main food category
    case 'alimentation':
      return getIcon(Utensils, "green-500");
    
    // Food subcategories
    case 'restaurants':
      return getIcon(Utensils, "orange-400");
    case 'gastronomie':
      return getIcon(Utensils, "red-600");
    case 'rapide':
      return getIcon(Pizza, "yellow-500");
    case 'vegetariens':
      return getIcon(Utensils, "green-400");
    case 'pizza':
      return getIcon(Pizza, "orange-500");
    case 'sushi':
      return getIcon(Utensils, "gray-700");
    case 'cuisine-monde':
      return getIcon(Map, "blue-500");
    case 'bars':
      return getIcon(Beer, "amber-600");
    case 'bars-vin':
      return getIcon(Wine, "red-700");
    case 'pubs':
      return getIcon(Beer, "yellow-700");
    case 'bars-cocktails':
      return getIcon(Wine, "purple-500");
    case 'cafes-salons':
      return getIcon(Coffee, "brown-500");
    case 'cafes':
      return getIcon(Coffee, "amber-800");
    case 'salons-the':
      return getIcon(Coffee, "teal-700");
    case 'boulangeries':
      return getIcon(Utensils, "yellow-600");
    case 'supermarches':
      return getIcon(ShoppingCart, "blue-600");
    case 'vente-emporter':
      return getIcon(ShoppingBag, "orange-300");
    case 'livraison':
      return getIcon(ShoppingBag, "red-400");
    default:
      return null;
  }
};
