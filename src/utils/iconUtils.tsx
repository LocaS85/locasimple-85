
import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';
import * as PhosphorIcons from '@phosphor-icons/react';

// Type pour une icône polymorphe qui peut provenir de différentes bibliothèques
export type IconSource = 
  | { type: 'lucide'; icon: React.FC<LucideProps> } 
  | { type: 'phosphor'; icon: React.FC<PhosphorIcons.IconProps>; weight?: PhosphorIcons.IconWeight };

interface IconRendererProps {
  icon: IconSource;
  className?: string;
  color?: string;
  size?: number;
}

/**
 * Composant pour rendre une icône depuis n'importe quelle bibliothèque supportée
 */
export const IconRenderer: React.FC<IconRendererProps> = ({ 
  icon, 
  className = "", 
  color,
  size 
}) => {
  if (icon.type === 'lucide') {
    const LucideIconComponent = icon.icon;
    return (
      <LucideIconComponent 
        className={className} 
        style={color ? { color } : undefined}
        size={size}
      />
    );
  }
  
  if (icon.type === 'phosphor') {
    const PhosphorIconComponent = icon.icon;
    return (
      <PhosphorIconComponent 
        className={className} 
        style={color ? { color } : undefined} 
        size={size}
        weight={icon.weight || 'regular'}
      />
    );
  }
  
  return null;
};

/**
 * Crée un mappage entre les noms de catégories et les icônes de différentes bibliothèques
 */
export const createIconMap = () => {
  const iconMap = new Map<string, IconSource>();
  
  // Catégories principales
  iconMap.set('alimentation', { type: 'lucide', icon: require('lucide-react').Utensils });
  iconMap.set('divertissement', { type: 'lucide', icon: require('lucide-react').Film });
  iconMap.set('sante', { type: 'lucide', icon: require('lucide-react').Heart });
  iconMap.set('travail', { type: 'lucide', icon: require('lucide-react').Briefcase });
  iconMap.set('shopping', { type: 'lucide', icon: require('lucide-react').ShoppingBag });
  iconMap.set('education', { type: 'lucide', icon: require('lucide-react').BookOpen });
  iconMap.set('home', { type: 'lucide', icon: require('lucide-react').Home });
  iconMap.set('hotel', { type: 'lucide', icon: require('lucide-react').Hotel });
  
  // Ajouter des exemples d'icônes Phosphor pour certaines catégories
  iconMap.set('restaurants-phosphor', { 
    type: 'phosphor', 
    icon: PhosphorIcons.ForkKnife,
    weight: 'fill'
  });
  
  iconMap.set('hotels-phosphor', { 
    type: 'phosphor', 
    icon: PhosphorIcons.Bed,
    weight: 'fill'
  });
  
  iconMap.set('shopping-phosphor', { 
    type: 'phosphor', 
    icon: PhosphorIcons.ShoppingCart,
    weight: 'duotone'
  });
  
  return iconMap;
};

/**
 * Exemple de fonction pour récupérer une icône par son ID
 */
export const getIconById = (iconId: string, options: { className?: string; color?: string; size?: number } = {}) => {
  const iconMap = createIconMap();
  const icon = iconMap.get(iconId);
  
  if (!icon) return null;
  
  return (
    <IconRenderer 
      icon={icon} 
      className={options.className}
      color={options.color}
      size={options.size}
    />
  );
};
