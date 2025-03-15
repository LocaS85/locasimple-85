
import React from 'react';
import { 
  Coffee, 
  ShoppingBag, 
  Utensils, 
  Building2, 
  Landmark, 
  Hotel, 
  GraduationCap, 
  Bus, 
  Building, 
  Heart, 
  Dumbbell
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const mockCategories: Category[] = [
  {
    id: 'restaurant',
    name: 'Restaurants',
    icon: React.createElement(Utensils, { size: 16 })
  },
  {
    id: 'cafe',
    name: 'Cafés',
    icon: React.createElement(Coffee, { size: 16 })
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: React.createElement(ShoppingBag, { size: 16 })
  },
  {
    id: 'hotel',
    name: 'Hôtels',
    icon: React.createElement(Hotel, { size: 16 })
  },
  {
    id: 'attraction',
    name: 'Attractions',
    icon: React.createElement(Landmark, { size: 16 })
  },
  {
    id: 'education',
    name: 'Education',
    icon: React.createElement(GraduationCap, { size: 16 })
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: React.createElement(Bus, { size: 16 })
  },
  {
    id: 'business',
    name: 'Entreprises',
    icon: React.createElement(Building, { size: 16 })
  },
  {
    id: 'health',
    name: 'Santé',
    icon: React.createElement(Heart, { size: 16 })
  },
  {
    id: 'sport',
    name: 'Sport',
    icon: React.createElement(Dumbbell, { size: 16 })
  }
];
