
import React from 'react';
import { 
  Hotel,
  Umbrella,
  Home
} from 'lucide-react';

export const getAccommodationIcon = (categoryId: string, className: string) => {
  switch (categoryId) {
    // Main accommodation category
    case 'hebergement':
      return <Hotel className={`${className} text-pink-500`} />;
    
    // Accommodation subcategories
    case 'hotels':
      return <Hotel className={`${className}`} />;
    case 'auberges':
      return <Hotel className={`${className}`} />;
    case 'chambres-hotes':
      return <Hotel className={`${className}`} />;
    case 'camping':
      return <Umbrella className={`${className}`} />;
    case 'locations-vacances':
      return <Home className={`${className}`} />;
    default:
      return null;
  }
};
