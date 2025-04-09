
import React from 'react';
import { 
  Heart,
  Stethoscope,
  Microscope,
  Brain,
  Dog,
  Glasses,
  Pill,
  Activity,
  Flower2,
  Building2,
  Cross,
  Tooth,
  Building,
  Flask,
  Scan
} from 'lucide-react';
import clsx from 'clsx';

// 🎨 Configuration of icons and associated colors
const healthIcons: Record<string, { icon: React.FC<any>; color: string; description: string }> = {
  // Main health category
  sante: { 
    icon: Heart, 
    color: "text-red-500",
    description: "Icône représentant le secteur de la santé et du bien-être"
  },
  
  // Health subcategories
  hopitaux: { 
    icon: Building2, 
    color: "text-blue-500",
    description: "Icône représentant un bâtiment hospitalier avec une croix rouge, dans une teinte bleue apaisante"
  },
  cliniques: { 
    icon: Building, 
    color: "text-green-400",
    description: "Icône d'une petite clinique avec une croix verte, dans des tons verts clairs"
  },
  dentistes: { 
    icon: Tooth, 
    color: "text-cyan-500",
    description: "Icône d'une dent stylisée avec une brosse à dents, en blanc et bleu"
  },
  medecins: { 
    icon: Stethoscope, 
    color: "text-blue-800",
    description: "Icône d'un stéthoscope enroulé en forme de cœur, en bleu marine"
  },
  pharmacies: { 
    icon: Cross, 
    color: "text-emerald-600",
    description: "Icône d'une croix de pharmacie verte avec une feuille, en vert émeraude"
  },
  laboratoires: { 
    icon: Flask, 
    color: "text-red-800",
    description: "Icône d'un tube à essai avec un liquide rouge, en rouge bordeaux"
  },
  opticiens: { 
    icon: Glasses, 
    color: "text-gray-800",
    description: "Icône de lunettes stylisées, en noir et argent"
  },
  radiologie: { 
    icon: Scan, 
    color: "text-gray-700",
    description: "Icône d'une silhouette humaine avec une radiographie visible, en gris anthracite"
  },
  psychologues: { 
    icon: Brain, 
    color: "text-purple-500",
    description: "Icône d'un cerveau stylisé avec des vagues, en violet doux"
  },
  veterinaires: { 
    icon: Dog, 
    color: "text-amber-700",
    description: "Icône d'une patte d'animal avec une croix, en marron et beige"
  },
};

// 🔥 Function to get the icon
export const getHealthIcon = (categoryId: string, className: string, colorOverride?: string) => {
  // Handle kebab-case keys
  const category = healthIcons[categoryId];

  if (!category) return null; // If the category doesn't exist, return null

  const { icon: Icon, color } = category;

  return <Icon className={clsx(className, colorOverride || color)} />;
};

// 📖 Function to get icon description
export const getHealthIconDescription = (categoryId: string): string => {
  const category = healthIcons[categoryId];
  return category?.description || "Icône de santé";
};

// 🎭 Export all health icons for direct usage
export const HealthIcons = healthIcons;
