
import React from 'react';
import { 
  Hotel,
  Umbrella,
  Home,
  BuildingIcon,
  Bed,
  House,
  Tent
} from 'lucide-react';
import clsx from 'clsx';

// 🎨 Configuration of icons and associated colors
const accommodationIcons: Record<string, { icon: React.FC<any>; color: string; description: string }> = {
  // Main accommodation category
  hebergement: { 
    icon: Hotel, 
    color: "text-pink-500",
    description: "Icône représentant le secteur de l'hébergement avec un symbole d'hôtel élégant"
  },
  
  // Accommodation subcategories
  hotels: { 
    icon: Hotel, 
    color: "text-pink-600",
    description: "Icône d'hôtel avec un lit et une enseigne, dans des tons rose vif"
  },
  auberges: { 
    icon: BuildingIcon, 
    color: "text-pink-400",
    description: "Icône d'une auberge avec une façade simple, dans des tons roses doux"
  },
  'chambres-hotes': { 
    icon: House, 
    color: "text-pink-300",
    description: "Icône d'une maison accueillante avec une fenêtre, dans des tons roses clairs"
  },
  camping: { 
    icon: Tent, 
    color: "text-green-500",
    description: "Icône d'une tente de camping dans un environnement naturel, en vert forêt"
  },
  'locations-vacances': { 
    icon: Home, 
    color: "text-amber-500",
    description: "Icône d'une maison de vacances avec une terrasse, en ambre chaleureux"
  },
};

// 🔥 Function to get the icon
export const getAccommodationIcon = (categoryId: string, className: string, colorOverride?: string) => {
  // Handle kebab-case keys
  const category = accommodationIcons[categoryId];

  if (!category) return null; // If the category doesn't exist, return null

  const { icon: Icon, color } = category;

  return <Icon className={clsx(className, colorOverride || color)} />;
};

// 📖 Function to get icon description
export const getAccommodationIconDescription = (categoryId: string): string => {
  const category = accommodationIcons[categoryId];
  return category?.description || "Icône d'hébergement";
};

// 🎭 Export all accommodation icons for direct usage
export const AccommodationIcons = accommodationIcons;
