
import React from 'react';
import { 
  Mail,
  Building,
  Building2,
  Landmark,
  GanttChartSquare,
  Shield,
  Siren,
  Flag,
  Briefcase,
  BadgeDollarSign
} from 'lucide-react';

export const getServicesIcon = (categoryId: string, className: string, color?: string) => {
  const getIcon = (Icon: React.FC<any>, defaultColor: string) => {
    if (color) {
      return <Icon className={className} style={{ color }} />;
    }
    return <Icon className={`${className} text-${defaultColor}`} />;
  };

  switch (categoryId) {
    // Main services category
    case 'services':
      return getIcon(Building, "blue-600");
    
    // Services subcategories
    case 'poste':
      return getIcon(Mail, "blue-600");
    case 'assurances':
      return getIcon(Building, "purple-700");
    case 'immobilier':
      return getIcon(Building2, "amber-600");
    case 'services-publics':
      return getIcon(Landmark, "blue-800");
    case 'mairie':
      return getIcon(GanttChartSquare, "blue-500");
    case 'police':
      return getIcon(Shield, "indigo-700");
    case 'pompiers':
      return getIcon(Siren, "red-600");
    case 'ambassade':
      return getIcon(Flag, "green-600");
    case 'emploi':
      return getIcon(Briefcase, "purple-500");
    case 'impots':
      return getIcon(BadgeDollarSign, "green-700");
    default:
      return null;
  }
};
