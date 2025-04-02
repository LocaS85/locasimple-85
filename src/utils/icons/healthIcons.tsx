
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

export const getHealthIcon = (categoryId: string, className: string) => {
  switch (categoryId) {
    // Main health category
    case 'sante':
      return <Heart className={`${className} text-red-500`} />;
    
    // Health subcategories
    case 'hopitaux':
      return <Heart className={`${className}`} />;
    case 'cliniques':
      return <Heart className={`${className}`} />;
    case 'dentistes':
      return <Stethoscope className={`${className}`} />;
    case 'medecins':
      return <Stethoscope className={`${className}`} />;
    case 'laboratoires':
      return <Microscope className={`${className}`} />;
    case 'radiologie':
      return <Microscope className={`${className}`} />;
    case 'psychologues':
      return <Brain className={`${className}`} />;
    case 'veterinaires':
      return <Dog className={`${className}`} />;
    case 'opticiens':
      return <Glasses className={`${className}`} />;
    case 'pharmacies':
      return <Pill className={`${className}`} />;
    default:
      return null;
  }
};
