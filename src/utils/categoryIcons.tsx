
import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  Utensils, 
  Heart, 
  Briefcase, 
  BookOpen, 
  Film, 
  Hotel, 
  Search,
  CircleEllipsis,
  Star,
  MapPin
} from 'lucide-react';

export const getCategoryIcon = (categoryId: string, className = "h-12 w-12") => {
  switch (categoryId) {
    case 'adresse-principale':
      return <Home className={`${className} text-primary`} />;
    case 'famille':
      return <Home className={`${className} text-secondary`} />;
    case 'travail':
      return <Briefcase className={`${className} text-success`} />;
    case 'ecole':
      return <BookOpen className={`${className} text-accent`} />;
    case 'alimentation':
      return <Utensils className={`${className} text-green-500`} />;
    case 'achats':
      return <ShoppingBag className={`${className} text-blue-500`} />;
    case 'services':
      return <Star className={`${className} text-orange-500`} />;
    case 'sante':
      return <Heart className={`${className} text-red-500`} />;
    case 'divertissement':
      return <Film className={`${className} text-purple-500`} />;
    case 'hebergement':
      return <Hotel className={`${className} text-pink-500`} />;
    case 'divers':
      return <CircleEllipsis className={`${className} text-teal-500`} />;
    default:
      return <MapPin className={`${className} text-gray-500`} />;
  }
};
