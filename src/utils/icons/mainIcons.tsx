
import React from 'react';
import { 
  Home, 
  Users, 
  Briefcase, 
  BookOpen,
  MapPin, 
  CircleEllipsis 
} from 'lucide-react';

export const getMainCategoryIcon = (categoryId: string, className: string) => {
  switch (categoryId) {
    case 'adresse-principale':
      return <Home className={`${className} text-primary`} />;
    case 'famille':
      return <Users className={`${className} text-secondary`} />;
    case 'travail':
      return <Briefcase className={`${className} text-success`} />;
    case 'ecole':
      return <BookOpen className={`${className} text-accent`} />;
    case 'divers':
      return <CircleEllipsis className={`${className} text-teal-500`} />;
    default:
      return <MapPin className={`${className} text-gray-500`} />;
  }
};
