
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

export const getFoodCategoryIcon = (categoryId: string, className: string) => {
  switch (categoryId) {
    // Main food category
    case 'alimentation':
      return <Utensils className={`${className} text-green-500`} />;
    
    // Food subcategories
    case 'restaurants':
      return <Utensils className={`${className} text-orange-400`} />;
    case 'gastronomie':
      return <Utensils className={`${className}`} />;
    case 'rapide':
      return <Pizza className={`${className}`} />;
    case 'vegetariens':
      return <Utensils className={`${className} text-green-400`} />;
    case 'pizza':
      return <Pizza className={`${className}`} />;
    case 'sushi':
      return <Utensils className={`${className}`} />;
    case 'cuisine-monde':
      return <Map className={`${className}`} />;
    case 'bars':
      return <Beer className={`${className}`} />;
    case 'bars-vin':
      return <Wine className={`${className}`} />;
    case 'pubs':
      return <Beer className={`${className}`} />;
    case 'bars-cocktails':
      return <Wine className={`${className}`} />;
    case 'cafes-salons':
      return <Coffee className={`${className}`} />;
    case 'cafes':
      return <Coffee className={`${className}`} />;
    case 'salons-the':
      return <Coffee className={`${className}`} />;
    case 'boulangeries':
      return <Utensils className={`${className}`} />;
    case 'supermarches':
      return <ShoppingCart className={`${className}`} />;
    case 'vente-emporter':
      return <ShoppingBag className={`${className}`} />;
    case 'livraison':
      return <ShoppingBag className={`${className}`} />;
    default:
      return null;
  }
};
