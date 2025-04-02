
import React from 'react';
import { 
  Hotel,
  Umbrella,
  Home
} from 'lucide-react';

export const getAccommodationIcon = (categoryId: string, className: string, color?: string) => {
  const getIcon = (Icon: React.FC<any>, defaultColor: string) => {
    if (color) {
      return <Icon className={className} style={{ color }} />;
    }
    return <Icon className={`${className} text-${defaultColor}`} />;
  };

  switch (categoryId) {
    // Main accommodation category
    case 'hebergement':
      return getIcon(Hotel, "pink-500");
    
    // Accommodation subcategories
    case 'hotels':
      return getIcon(Hotel, "pink-600");
    case 'auberges':
      return getIcon(Hotel, "pink-400");
    case 'chambres-hotes':
      return getIcon(Hotel, "pink-300");
    case 'camping':
      return getIcon(Umbrella, "green-500");
    case 'locations-vacances':
      return getIcon(Home, "amber-500");
    default:
      return null;
  }
};
