
import React from 'react';
import { 
  Coffee, 
  Utensils, 
  ShoppingBag, 
  Building2, 
  Landmark, 
  Hotel, 
  GraduationCap, 
  Bus, 
  Building, 
  Heart, 
  Dumbbell,
  MapPin,
  Car,
  Train,
  Bike
} from 'lucide-react';

// Flexible icon props that can be a string or an object with className and color
type IconProps = string | { className?: string; color?: string };

export const getCategoryIcon = (categoryId: string, props: IconProps = {}, color?: string) => {
  // Handle both string and object params
  let className = typeof props === 'string' ? props : props.className || '';
  let iconColor = color || (typeof props !== 'string' ? props.color : undefined);
  
  const iconProps = {
    className,
    color: iconColor,
    size: 16
  };

  switch(categoryId) {
    case 'restaurant':
    case 'restaurants':
      return <Utensils {...iconProps} />;
    case 'cafe':
    case 'cafes':
      return <Coffee {...iconProps} />;
    case 'shopping':
      return <ShoppingBag {...iconProps} />;
    case 'business':
      return <Building2 {...iconProps} />;
    case 'attraction':
      return <Landmark {...iconProps} />;
    case 'hotel':
    case 'hotels':
      return <Hotel {...iconProps} />;
    case 'education':
      return <GraduationCap {...iconProps} />;
    case 'transport':
      return <Bus {...iconProps} />;
    case 'office':
      return <Building {...iconProps} />;
    case 'health':
      return <Heart {...iconProps} />;
    case 'sport':
      return <Dumbbell {...iconProps} />;
    case 'driving':
    case 'car':
      return <Car {...iconProps} />;
    case 'walking':
    case 'walk':
      return <MapPin {...iconProps} />;
    case 'cycling':
    case 'bike':
    case 'bicycle':
      return <Bike {...iconProps} />;
    case 'transit':
    case 'train':
      return <Train {...iconProps} />;
    default:
      return <MapPin {...iconProps} />;
  }
};

export const getTransportModeIcon = (transportMode: string, className: string = '') => {
  switch(transportMode) {
    case 'driving':
    case 'car':
      return <Car className={className} />;
    case 'walking':
    case 'walk':
      return <MapPin className={className} />;
    case 'cycling':
    case 'bike':
    case 'bicycle':
      return <Bike className={className} />;
    case 'transit':
    case 'train':
      return <Train className={className} />;
    default:
      return <Car className={className} />;
  }
};
