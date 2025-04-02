
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

export const getTransportIcon = (categoryId: string, className: string, color?: string) => {
  const getIcon = (Icon: React.FC<any>, defaultColor: string) => {
    if (color) {
      return <Icon className={className} style={{ color }} />;
    }
    return <Icon className={`${className} text-${defaultColor}`} />;
  };

  switch (categoryId) {
    // Main transport category
    case 'transport':
      return getIcon(Bus, "indigo-500");
    
    // Transport subcategories
    case 'bus':
      return getIcon(Bus, "yellow-500");
    case 'car':
      return getIcon(Car, "blue-500");
    case 'bike':
      return getIcon(Bike, "red-500");
    case 'train':
      return getIcon(Train, "gray-900");
    case 'plane':
      return getIcon(Plane, "gray-500");
    case 'tram':
      return getIcon(Train, "purple-500");
    case 'ship':
      return getIcon(Ship, "cyan-500");
    case 'truck':
      return getIcon(Truck, "amber-600");
    case 'cable-car':
      return getIcon(Cable, "green-500");
    case 'metro':
      return getIcon(Train, "blue-700");
    case 'taxi':
      return getIcon(Car, "yellow-400");
    case 'airport':
      return getIcon(Plane, "blue-300");
    case 'station':
      return getIcon(Train, "gray-700");
    case 'port':
      return getIcon(Ship, "blue-400");
    case 'transport-hub':
      return getIcon(LocateFixed, "purple-400");
    case 'navigation':
      return getIcon(Navigation, "gray-800");
    default:
      return null;
  }
};
