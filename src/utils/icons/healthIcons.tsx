
import React from 'react';
import { 
  Heart,
  Stethoscope,
  Microscope,
  Brain,
  Dog,
  Glasses,
  Pill
} from 'lucide-react';

export const getHealthIcon = (categoryId: string, className: string, color?: string) => {
  const getIcon = (Icon: React.FC<any>, defaultColor: string) => {
    if (color) {
      return <Icon className={className} style={{ color }} />;
    }
    return <Icon className={`${className} text-${defaultColor}`} />;
  };

  switch (categoryId) {
    // Main health category
    case 'sante':
      return getIcon(Heart, "red-500");
    
    // Health subcategories
    case 'hopitaux':
      return getIcon(Heart, "red-600");
    case 'cliniques':
      return getIcon(Heart, "pink-500");
    case 'dentistes':
      return getIcon(Stethoscope, "blue-500");
    case 'medecins':
      return getIcon(Stethoscope, "green-500");
    case 'laboratoires':
      return getIcon(Microscope, "purple-500");
    case 'radiologie':
      return getIcon(Microscope, "indigo-500");
    case 'psychologues':
      return getIcon(Brain, "blue-600");
    case 'veterinaires':
      return getIcon(Dog, "amber-500");
    case 'opticiens':
      return getIcon(Glasses, "gray-700");
    case 'pharmacies':
      return getIcon(Pill, "green-600");
    default:
      return null;
  }
};
