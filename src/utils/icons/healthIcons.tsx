
import React from 'react';
import { 
  Heart,
  Stethoscope,
  Microscope,
  Brain,
  Dog,
  Glasses,
  Pill,
  FirstAid,
  Flower2
} from 'lucide-react';
import clsx from 'clsx';

// 🎨 Configuration of icons and associated colors
const healthIcons: Record<string, { icon: React.FC<any>; color: string }> = {
  // Main health category
  sante: { icon: Heart, color: "text-red-500" },
  
  // Health subcategories
  hopitaux: { icon: FirstAid, color: "text-red-600" },
  cliniques: { icon: Heart, color: "text-pink-500" },
  dentistes: { icon: Stethoscope, color: "text-blue-500" },
  medecins: { icon: Stethoscope, color: "text-green-500" },
  laboratoires: { icon: Microscope, color: "text-purple-500" },
  radiologie: { icon: Microscope, color: "text-indigo-500" },
  psychologues: { icon: Brain, color: "text-blue-600" },
  veterinaires: { icon: Dog, color: "text-amber-500" },
  opticiens: { icon: Glasses, color: "text-gray-700" },
  pharmacies: { icon: Pill, color: "text-green-600" },
};

// 🔥 Function to get the icon
export const getHealthIcon = (categoryId: string, className: string, colorOverride?: string) => {
  // Handle kebab-case keys
  const category = healthIcons[categoryId];

  if (!category) return null; // If the category doesn't exist, return null

  const { icon: Icon, color } = category;

  return <Icon className={clsx(className, colorOverride || color)} />;
};
