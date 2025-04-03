
import React from 'react';
import { MapPin } from 'lucide-react';
import { getMainCategoryIcon } from './icons/mainIcons';
import { getFoodCategoryIcon } from './icons/foodIcons';
import { getShoppingCategoryIcon } from './icons/shoppingIcons';
import { getServicesIcon } from './icons/servicesIcons';
import { getHealthIcon } from './icons/healthIcons';
import { getEntertainmentIcon } from './icons/entertainmentIcons';
import { getAccommodationIcon } from './icons/accommodationIcons';
import { getTransportIcon } from './icons/transportIcons';
import { useIconTheme } from '@/hooks/useIconTheme';
import * as PhosphorIcons from '@phosphor-icons/react';

interface CategoryIconOptions {
  className?: string;
  color?: string;
  hoverColor?: string;
  iconSet?: 'lucide' | 'phosphor';
}

export const getCategoryIcon = (
  categoryId: string, 
  options: CategoryIconOptions | string = {}
) => {
  // Handle legacy format where options is just a className string
  let className = typeof options === 'string' ? options : options.className || "h-12 w-12";
  let color = typeof options === 'object' ? options.color : undefined;
  let iconSet = typeof options === 'object' ? options.iconSet || 'lucide' : 'lucide';
  
  // If phosphor is requested, try to get phosphor icon first
  if (iconSet === 'phosphor') {
    const phosphorIcon = getPhosphorIcon(categoryId, className, color);
    if (phosphorIcon) return phosphorIcon;
  }
  
  // Try to get icon from each category module
  const mainIcon = getMainCategoryIcon(categoryId, className, color);
  if (mainIcon) return mainIcon;
  
  const foodIcon = getFoodCategoryIcon(categoryId, className, color);
  if (foodIcon) return foodIcon;
  
  const shoppingIcon = getShoppingCategoryIcon(categoryId, className, color);
  if (shoppingIcon) return shoppingIcon;
  
  const servicesIcon = getServicesIcon(categoryId, className, color);
  if (servicesIcon) return servicesIcon;
  
  const healthIcon = getHealthIcon(categoryId, className, color);
  if (healthIcon) return healthIcon;
  
  const entertainmentIcon = getEntertainmentIcon(categoryId, className, color);
  if (entertainmentIcon) return entertainmentIcon;
  
  const accommodationIcon = getAccommodationIcon(categoryId, className, color);
  if (accommodationIcon) return accommodationIcon;
  
  const transportIcon = getTransportIcon(categoryId, className, color);
  if (transportIcon) return transportIcon;
  
  // Default icon if no category matches
  return <MapPin className={`${className} ${color ? '' : 'text-gray-500'}`} style={color ? { color } : undefined} />;
};

// Helper function for Phosphor icons
const getPhosphorIcon = (categoryId: string, className: string, color?: string) => {
  let Icon: React.FC<PhosphorIcons.IconProps> | null = null;
  let weight: PhosphorIcons.IconWeight = 'regular';
  
  switch (categoryId) {
    // Main categories
    case 'alimentation':
      Icon = PhosphorIcons.ForkKnife;
      break;
    case 'divertissement':
      Icon = PhosphorIcons.FilmStrip;
      break;
    case 'sante':
      Icon = PhosphorIcons.HeartStraight;
      break;
    case 'travail':
      Icon = PhosphorIcons.Briefcase;
      break;
    case 'shopping':
      Icon = PhosphorIcons.ShoppingBag;
      break;
    case 'education':
      Icon = PhosphorIcons.GraduationCap;
      break;
    case 'home':
      Icon = PhosphorIcons.House;
      break;
    case 'hotel':
      Icon = PhosphorIcons.Bed;
      weight = 'fill';
      break;
    case 'transport':
      Icon = PhosphorIcons.Bus;
      break;
    // Sub-categories
    case 'restaurants':
      Icon = PhosphorIcons.ForkKnife;
      weight = 'fill';
      break;
    case 'cafes':
      Icon = PhosphorIcons.Coffee;
      break;
    case 'bars':
      Icon = PhosphorIcons.BeerStein;
      break;
    case 'hopitaux':
      Icon = PhosphorIcons.FirstAid;
      break;
    case 'pharmacies':
      Icon = PhosphorIcons.Pill;
      break;
    // Default for unmapped categories
    default:
      return null;
  }
  
  if (Icon) {
    return (
      <Icon 
        className={className} 
        style={color ? { color } : undefined} 
        weight={weight}
      />
    );
  }
  
  return null;
};

// Helper function to add color to an icon
export const colorizeIcon = (icon: React.ReactElement, color?: string) => {
  if (!color) return icon;
  
  return React.cloneElement(icon, {
    style: { ...icon.props.style, color },
    className: icon.props.className?.replace(/text-[a-z]+-[0-9]+/g, '')
  });
};
