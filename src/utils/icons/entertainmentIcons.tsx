
import React from 'react';
import { 
  Film,
  Ticket,
  Landmark,
  Music,
  Umbrella,
  Gamepad2,
  Circle,
  Droplets,
  Palmtree
} from 'lucide-react';

export const getEntertainmentIcon = (categoryId: string, className: string) => {
  switch (categoryId) {
    // Main entertainment category
    case 'divertissement':
      return <Film className={`${className} text-purple-500`} />;
    
    // Entertainment subcategories
    case 'cinemas':
      return <Film className={`${className}`} />;
    case 'theatres':
      return <Ticket className={`${className}`} />;
    case 'musees':
      return <Landmark className={`${className}`} />;
    case 'parcs-attractions':
      return <Ticket className={`${className}`} />;
    case 'salles-concert':
      return <Music className={`${className}`} />;
    case 'clubs':
      return <Music className={`${className}`} />;
    case 'parcs':
      return <Umbrella className={`${className}`} />;
    case 'centres-loisirs':
      return <Gamepad2 className={`${className}`} />;
    case 'bowling':
      return <Circle className={`${className}`} />;
    case 'patinoires':
      return <Circle className={`${className}`} />;
    case 'piscines':
      return <Droplets className={`${className}`} />;
    case 'plages':
      return <Palmtree className={`${className}`} />;
    default:
      return null;
  }
};
