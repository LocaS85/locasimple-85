
import React from 'react';
import { 
  Home, 
  Utensils, 
  ShoppingBag, 
  Briefcase, 
  Heart, 
  Film, 
  Hotel,
  Users
} from 'lucide-react';

interface IconOptions {
  className?: string;
  color?: string;
}

export const getCategoryIcon = (categoryId: string, options: IconOptions | string = {}) => {
  // Handle legacy format where options is just a className string
  let className = typeof options === 'string' ? options : options.className || "h-6 w-6";
  let color = typeof options === 'object' ? options.color : undefined;
  
  switch (categoryId) {
    case 'quotidien':
      return <Users className={className} style={color ? { color } : undefined} />;
    case 'alimentation':
      return <Utensils className={className} style={color ? { color } : undefined} />;
    case 'shopping':
      return <ShoppingBag className={className} style={color ? { color } : undefined} />;
    case 'services':
      return <Briefcase className={className} style={color ? { color } : undefined} />;
    case 'sante':
      return <Heart className={className} style={color ? { color } : undefined} />;
    case 'divertissement':
      return <Film className={className} style={color ? { color } : undefined} />;
    case 'hebergement':
      return <Hotel className={className} style={color ? { color } : undefined} />;
    default:
      return <Home className={className} style={color ? { color } : undefined} />;
  }
};
