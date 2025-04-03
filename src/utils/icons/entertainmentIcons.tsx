
import React from 'react';
import { 
  Film,
  Theater,
  Landmark,
  Music,
  Palmtree,
  Gamepad2,
  Snowflake,
  Waves,
  PartyPopper,
  Tent,
  Microphone,
  Trees
} from 'lucide-react';

export const getEntertainmentIcon = (categoryId: string, className: string, color?: string) => {
  const getIcon = (Icon: React.FC<any>, defaultColor: string) => {
    if (color) {
      return <Icon className={className} style={{ color }} />;
    }
    return <Icon className={`${className} text-${defaultColor}`} />;
  };

  switch (categoryId) {
    // Main entertainment category
    case 'divertissement':
      return getIcon(Film, "purple-500");
    
    // Entertainment subcategories
    case 'cinemas':
      return getIcon(Film, "purple-600");
    case 'theatres':
      return getIcon(Theater, "purple-400");
    case 'musees':
      return getIcon(Landmark, "yellow-700");
    case 'parcs-attractions':
      return getIcon(PartyPopper, "red-500");
    case 'salles-concert':
      return getIcon(Music, "blue-500");
    case 'clubs':
      return getIcon(Microphone, "indigo-500");
    case 'parcs':
      return getIcon(Trees, "green-600");
    case 'centres-loisirs':
      return getIcon(Gamepad2, "pink-500");
    case 'bowling':
      return getIcon(Tent, "gray-700");
    case 'patinoires':
      return getIcon(Snowflake, "blue-300");
    case 'piscines':
      return getIcon(Waves, "blue-500");
    case 'plages':
      return getIcon(Palmtree, "yellow-600");
    default:
      return null;
  }
};
