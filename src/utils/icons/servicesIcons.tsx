
import React from 'react';
import { 
  Star,
  Mail,
  Building,
  Building2,
  Landmark,
  UserCheck,
  Siren,
  Flag,
  Briefcase,
  BadgeDollarSign
} from 'lucide-react';

export const getServicesIcon = (categoryId: string, className: string) => {
  switch (categoryId) {
    // Main services category
    case 'services':
      return <Star className={`${className} text-orange-500`} />;
    
    // Services subcategories
    case 'poste':
      return <Mail className={`${className}`} />;
    case 'assurances':
      return <Building className={`${className}`} />;
    case 'immobilier':
      return <Building2 className={`${className}`} />;
    case 'services-publics':
      return <Landmark className={`${className}`} />;
    case 'mairie':
      return <Landmark className={`${className}`} />;
    case 'police':
      return <UserCheck className={`${className}`} />;
    case 'pompiers':
      return <Siren className={`${className}`} />;
    case 'ambassade':
      return <Flag className={`${className}`} />;
    case 'emploi':
      return <Briefcase className={`${className}`} />;
    case 'impots':
      return <BadgeDollarSign className={`${className}`} />;
    default:
      return null;
  }
};
