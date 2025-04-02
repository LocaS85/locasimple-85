
import React from 'react';
import { 
  Home, 
  Users, 
  Briefcase, 
  BookOpen,
  MapPin, 
  CircleEllipsis 
} from 'lucide-react';

export const getMainCategoryIcon = (categoryId: string, className: string, color?: string) => {
  const getIcon = (Icon: React.FC<any>, defaultColor: string) => {
    if (color) {
      return <Icon className={className} style={{ color }} />;
    }
    return <Icon className={`${className} text-${defaultColor}`} />;
  };

  switch (categoryId) {
    case 'adresse-principale':
      return getIcon(Home, "primary");
    case 'famille':
      return getIcon(Users, "secondary");
    case 'travail':
      return getIcon(Briefcase, "success");
    case 'ecole':
      return getIcon(BookOpen, "accent");
    case 'divers':
      return getIcon(CircleEllipsis, "teal-500");
    default:
      return color 
        ? <MapPin className={className} style={{ color }} />
        : <MapPin className={`${className} text-gray-500`} />;
  }
};
