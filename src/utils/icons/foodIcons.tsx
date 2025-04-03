
import React from 'react';
import { 
  Utensils, 
  Coffee, 
  Pizza, 
  Wine, 
  Beer, 
  Map,
  ShoppingCart,
  ShoppingBag,
  Salad,
  Apple,
  Carrot,
  Egg,
  Sandwich,
  Cherry,
  Croissant,
  Banana
} from 'lucide-react';
import clsx from 'clsx';

// 🎨 Configuration of icons and associated colors
const foodIcons: Record<string, { icon: React.FC<any>; color: string }> = {
  // Main food category
  alimentation: { icon: Utensils, color: "text-orange-500" },
  
  // Food subcategories
  restaurants: { icon: Utensils, color: "text-orange-400" },
  gastronomie: { icon: Utensils, color: "text-red-600" },
  rapide: { icon: Sandwich, color: "text-yellow-500" },
  vegetariens: { icon: Salad, color: "text-green-400" },
  pizza: { icon: Pizza, color: "text-orange-500" },
  sushi: { icon: Utensils, color: "text-gray-700" },
  'cuisine-monde': { icon: Map, color: "text-blue-500" },
  bars: { icon: Beer, color: "text-amber-600" },
  'bars-vin': { icon: Wine, color: "text-red-700" },
  pubs: { icon: Beer, color: "text-yellow-700" },
  'bars-cocktails': { icon: Wine, color: "text-purple-500" },
  'cafes-salons': { icon: Coffee, color: "text-brown-500" },
  cafes: { icon: Coffee, color: "text-amber-800" },
  'salons-the': { icon: Coffee, color: "text-teal-700" },
  boulangeries: { icon: Croissant, color: "text-yellow-600" },
  supermarches: { icon: ShoppingCart, color: "text-blue-600" },
  'vente-emporter': { icon: ShoppingBag, color: "text-orange-300" },
  livraison: { icon: ShoppingBag, color: "text-red-400" },
};

// 🔥 Function to get the icon
export const getFoodCategoryIcon = (categoryId: string, className: string, colorOverride?: string) => {
  // Handle kebab-case keys
  const category = foodIcons[categoryId];

  if (!category) return null; // If the category doesn't exist, return null

  const { icon: Icon, color } = category;

  return <Icon className={clsx(className, colorOverride || color)} />;
};
