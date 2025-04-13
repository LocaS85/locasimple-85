
import React from 'react';
import { 
  Home, 
  Users, 
  Briefcase, 
  School, 
  Utensils, 
  ShoppingBag, 
  Heart, 
  Film, 
  Hotel, 
  Wrench,
  Bus,
  Bike,
  Car,
  Ship,
  Train,
  CircleEllipsis
} from 'lucide-react';

export const getCategoryIcon = (categoryId: string, className: string = "w-5 h-5") => {
  switch (categoryId) {
    case 'adresse-principale':
      return <Home className={className} />;
    case 'famille':
      return <Users className={className} />;
    case 'amis':
      return <Users className={className} />;
    case 'travail':
      return <Briefcase className={className} />;
    case 'ecole':
    case 'education':
      return <School className={className} />;
    case 'alimentation':
    case 'restaurants':
      return <Utensils className={className} />;
    case 'shopping':
    case 'achat':
      return <ShoppingBag className={className} />;
    case 'sante':
      return <Heart className={className} />;
    case 'divertissement':
    case 'loisirs':
      return <Film className={className} />;
    case 'hebergement':
    case 'hotel':
      return <Hotel className={className} />;
    case 'services':
      return <Wrench className={className} />;
    case 'transport-public':
    case 'bus':
      return <Bus className={className} />;
    case 'velo':
    case 'cycling':
      return <Bike className={className} />;
    case 'voiture':
    case 'driving':
      return <Car className={className} />;
    case 'bateau':
    case 'boat':
      return <Ship className={className} />;
    case 'train':
    case 'metro':
    case 'tram':
      return <Train className={className} />;
    case 'quotidien':
      return <CircleEllipsis className={className} />;
    default:
      return <CircleEllipsis className={className} />;
  }
};

export const getTransportModeIcon = (mode: string, className: string = "w-5 h-5") => {
  switch (mode) {
    case 'driving':
    case 'voiture':
      return <Car className={className} />;
    case 'walking':
    case 'marche':
      return <Users className={className} />;
    case 'cycling':
    case 'velo':
      return <Bike className={className} />;
    case 'transit':
    case 'public':
    case 'transport-public':
      return <Bus className={className} />;
    case 'boat':
    case 'bateau':
      return <Ship className={className} />;
    case 'train':
    case 'metro':
    case 'tram':
      return <Train className={className} />;
    default:
      return <Car className={className} />;
  }
};
