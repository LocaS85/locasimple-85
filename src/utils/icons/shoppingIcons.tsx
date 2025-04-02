
import React from 'react';
import { 
  ShoppingBag,
  Shirt,
  Smartphone,
  Laptop,
  Tv,
  BookOpen,
  Baby,
  Pill,
  Sparkles,
  Glasses,
  Heart,
  Scissors,
  Car,
  BatteryCharging,
  Fuel,
  CreditCard
} from 'lucide-react';

export const getShoppingCategoryIcon = (categoryId: string, className: string) => {
  switch (categoryId) {
    // Main shopping category
    case 'achats':
      return <ShoppingBag className={`${className} text-blue-500`} />;
    
    // Shopping subcategories
    case 'vetements':
      return <Shirt className={`${className}`} />;
    case 'pret-a-porter':
      return <Shirt className={`${className}`} />;
    case 'boutiques-luxe':
      return <Shirt className={`${className}`} />;
    case 'chaussures':
      return <ShoppingBag className={`${className}`} />;
    case 'accessoires':
      return <ShoppingBag className={`${className}`} />;
    case 'electronique':
      return <Smartphone className={`${className}`} />;
    case 'telephonie':
      return <Smartphone className={`${className}`} />;
    case 'informatique':
      return <Laptop className={`${className}`} />;
    case 'electromenager':
      return <Tv className={`${className}`} />;
    case 'bibliotheques':
      return <BookOpen className={`${className}`} />;
    case 'generalistes':
      return <BookOpen className={`${className}`} />;
    case 'specialisees':
      return <BookOpen className={`${className}`} />;
    case 'occasion':
      return <BookOpen className={`${className}`} />;
    case 'jouets':
      return <Baby className={`${className}`} />;
    case 'pharmacies':
      return <Pill className={`${className}`} />;
    case 'parfumeries':
      return <Sparkles className={`${className}`} />;
    case 'bijouteries':
      return <Sparkles className={`${className}`} />;
    case 'opticiens':
      return <Glasses className={`${className}`} />;
    case 'sport':
      return <Heart className={`${className}`} />;
    case 'fleuristes':
      return <Sparkles className={`${className}`} />;
    case 'coiffeurs':
      return <Scissors className={`${className}`} />;
    case 'hommes':
      return <Scissors className={`${className}`} />;
    case 'femmes':
      return <Scissors className={`${className}`} />;
    case 'barbiers':
      return <Scissors className={`${className}`} />;
    case 'beaute':
      return <Sparkles className={`${className}`} />;
    case 'salon-beaute':
      return <Sparkles className={`${className}`} />;
    case 'esthetique':
      return <Sparkles className={`${className}`} />;
    case 'ongleries':
      return <Scissors className={`${className}`} />;
    case 'spa':
      return <Heart className={`${className}`} />;
    case 'pressing':
      return <Shirt className={`${className}`} />;
    case 'automobile':
      return <Car className={`${className}`} />;
    case 'lavage-auto':
      return <Car className={`${className}`} />;
    case 'reparation-auto':
      return <Car className={`${className}`} />;
    case 'localisation-auto':
      return <Car className={`${className}`} />;
    case 'garages':
      return <Car className={`${className}`} />;
    case 'parking':
      return <Car className={`${className}`} />;
    case 'bornes-recharge':
      return <BatteryCharging className={`${className}`} />;
    case 'stations-service':
      return <Fuel className={`${className}`} />;
    case 'banques':
      return <CreditCard className={`${className}`} />;
    default:
      return null;
  }
};
