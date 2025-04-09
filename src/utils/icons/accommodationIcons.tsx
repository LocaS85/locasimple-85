
import React from 'react';
import { 
  Building,
  Home,
  Heart,
  Tent,
  Sun,
  Trees,
  Warehouse,
  LandPlot,
  Palmtree,
  Hotel,
  Bed
} from 'lucide-react';
import clsx from 'clsx';

// 🎨 Configuration of icons and associated colors
const accommodationIcons: Record<string, { icon: React.FC<any>; color: string; description: string }> = {
  // Main accommodation category
  hebergement: { 
    icon: Hotel, 
    color: "text-sky-500",
    description: "Icône représentant le secteur de l'hébergement avec un symbole d'immeuble élégant"
  },
  
  // Accommodation subcategories
  hotels: { 
    icon: Building, 
    color: "text-amber-600",
    description: "Icône représentant un bâtiment hôtelier de plusieurs étages avec une enseigne 'Hôtel' en façade, dans des tons dorés et bleu marine"
  },
  auberges: { 
    icon: Warehouse, 
    color: "text-olive-600",
    description: "Icône illustrant une auberge traditionnelle avec un toit en pente et une cheminée fumante, en nuances de brun et vert olive"
  },
  'chambres-hotes': { 
    icon: Home, 
    color: "text-rose-300",
    description: "Icône d'une maison accueillante avec un cœur sur la porte, symbolisant une chambre d'hôtes, en teintes pastel de rose et beige"
  },
  camping: { 
    icon: Tent, 
    color: "text-emerald-600",
    description: "Icône représentant une tente de camping sous des arbres avec un feu de camp à proximité, en vert forêt et orange feu"
  },
  'locations-vacances': { 
    icon: Palmtree, 
    color: "text-cyan-500",
    description: "Icône d'une maison de plage avec une vague et un soleil, évoquant une location de vacances, en bleu turquoise et jaune sable"
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
