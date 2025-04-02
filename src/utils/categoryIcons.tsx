
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

interface CategoryIconOptions {
  className?: string;
  color?: string;
  hoverColor?: string;
}

export const getCategoryIcon = (
  categoryId: string, 
  options: CategoryIconOptions | string = {}
) => {
  // Handle legacy format where options is just a className string
  let className = typeof options === 'string' ? options : options.className || "h-12 w-12";
  let color = typeof options === 'object' ? options.color : undefined;
  
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
  
  const transportIcon = getTransportIcon(categoryId, className);
  if (transportIcon) return colorizeIcon(transportIcon, color);
  
  // Default icon if no category matches
  return <MapPin className={`${className} ${color ? '' : 'text-gray-500'}`} style={color ? { color } : undefined} />;
};

// Helper function to add color to an icon
export const colorizeIcon = (icon: React.ReactElement, color?: string) => {
  if (!color) return icon;
  
  return React.cloneElement(icon, {
    style: { ...icon.props.style, color },
    className: icon.props.className?.replace(/text-[a-z]+-[0-9]+/g, '')
  });
};
