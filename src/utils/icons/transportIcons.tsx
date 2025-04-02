
import React from 'react';
import { 
  Bus, 
  Car, 
  Bike, 
  Train, 
  Plane, 
  Ship,
  Truck,
  Cable,
  LocateFixed,
  Navigation
} from 'lucide-react';

export const getTransportIcon = (categoryId: string, className: string) => {
  switch (categoryId) {
    // Main transport category
    case 'transport':
      return <Bus className={`${className} text-indigo-500`} />;
    
    // Transport subcategories
    case 'bus':
      return <Bus className={`${className}`} />;
    case 'car':
      return <Car className={`${className}`} />;
    case 'bike':
      return <Bike className={`${className}`} />;
    case 'train':
      return <Train className={`${className}`} />;
    case 'plane':
      return <Plane className={`${className}`} />;
    case 'tram':
      return <Train className={`${className}`} />; // Changed from Tram to Train
    case 'ship':
      return <Ship className={`${className}`} />;
    case 'truck':
      return <Truck className={`${className}`} />;
    case 'cable-car':
      return <Cable className={`${className}`} />;
    case 'metro':
      return <Train className={`${className}`} />;
    case 'taxi':
      return <Car className={`${className}`} />;
    case 'airport':
      return <Plane className={`${className}`} />;
    case 'station':
      return <Train className={`${className}`} />;
    case 'port':
      return <Ship className={`${className}`} />;
    case 'transport-hub':
      return <LocateFixed className={`${className}`} />;
    case 'navigation':
      return <Navigation className={`${className}`} />;
    default:
      return null;
  }
};
