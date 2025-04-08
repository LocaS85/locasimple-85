
import React from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Shirt, 
  Package, 
  Gift, 
  Palette,
  Smartphone,
  BookOpen,
  Gem,
  Flower,
  Dumbbell,
  Glasses,
  Building,
  Car,
  Scissors,
  Sparkles
} from 'lucide-react';

export const getShoppingCategoryIcon = (categoryId: string, className: string, color?: string) => {
  const getIcon = (Icon: React.FC<any>, defaultColor: string) => {
    if (color) {
      return <Icon className={className} style={{ color }} />;
    }
    return <Icon className={`${className} text-${defaultColor}`} />;
  };

  switch (categoryId) {
    // Main shopping category
    case 'shopping':
      return getIcon(ShoppingBag, "pink-500");
    
    // Shopping subcategories
    case 'centres-commerciaux':
      return getIcon(ShoppingCart, "blue-500");
    case 'vetements':
      return getIcon(Shirt, "purple-600");
    case 'chaussures':
      return getIcon(Package, "amber-600");
    case 'cadeaux':
      return getIcon(Gift, "red-500");
    case 'art':
      return getIcon(Palette, "teal-500");
    case 'electronique':
      return getIcon(Smartphone, "gray-700");
    case 'librairies':
      return getIcon(BookOpen, "amber-800");
    case 'bijouteries':
      return getIcon(Gem, "yellow-500");
    case 'fleuristes':
      return getIcon(Flower, "pink-400");
    case 'sport':
      return getIcon(Dumbbell, "emerald-600");
    case 'opticiens-achats':
      return getIcon(Glasses, "blue-700");
    case 'jouets':
      return getIcon(Gift, "indigo-500");
    case 'parfumeries':
      return getIcon(Sparkles, "violet-400");
    case 'coiffeurs':
      return getIcon(Scissors, "cyan-600");
    case 'beaute':
      return getIcon(Sparkles, "fuchsia-500");
    case 'pressing':
      return getIcon(Shirt, "sky-500");
    case 'automobile':
      return getIcon(Car, "slate-600");
    case 'banques':
      return getIcon(Building, "emerald-700");
    default:
      return null;
  }
};
