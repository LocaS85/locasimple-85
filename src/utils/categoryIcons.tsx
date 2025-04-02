
import React from 'react';
import { MapPin } from 'lucide-react';
import { getMainCategoryIcon } from './icons/mainIcons';
import { getFoodCategoryIcon } from './icons/foodIcons';
import { getShoppingCategoryIcon } from './icons/shoppingIcons';
import { getServicesIcon } from './icons/servicesIcons';
import { getHealthIcon } from './icons/healthIcons';
import { getEntertainmentIcon } from './icons/entertainmentIcons';
import { getAccommodationIcon } from './icons/accommodationIcons';

export const getCategoryIcon = (categoryId: string, className = "h-12 w-12") => {
  // Try to get icon from each category module
  const mainIcon = getMainCategoryIcon(categoryId, className);
  if (mainIcon) return mainIcon;
  
  const foodIcon = getFoodCategoryIcon(categoryId, className);
  if (foodIcon) return foodIcon;
  
  const shoppingIcon = getShoppingCategoryIcon(categoryId, className);
  if (shoppingIcon) return shoppingIcon;
  
  const servicesIcon = getServicesIcon(categoryId, className);
  if (servicesIcon) return servicesIcon;
  
  const healthIcon = getHealthIcon(categoryId, className);
  if (healthIcon) return healthIcon;
  
  const entertainmentIcon = getEntertainmentIcon(categoryId, className);
  if (entertainmentIcon) return entertainmentIcon;
  
  const accommodationIcon = getAccommodationIcon(categoryId, className);
  if (accommodationIcon) return accommodationIcon;
  
  // Default icon if no category matches
  return <MapPin className={`${className} text-gray-500`} />;
};
