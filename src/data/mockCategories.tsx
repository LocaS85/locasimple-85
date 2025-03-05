
import React from 'react';
import { 
  Utensils, 
  Beer, 
  Coffee, 
  ShoppingBag, 
  Hotel, 
  Film, 
  Stethoscope, 
  Wrench, 
  GraduationCap, 
  Bus,
  Layers
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

export const mockCategories: Category[] = [
  { id: 'restaurants', name: 'Restaurants', icon: <Utensils className="h-4 w-4" /> },
  { id: 'bars', name: 'Bars', icon: <Beer className="h-4 w-4" /> },
  { id: 'cafes', name: 'Cafés', icon: <Coffee className="h-4 w-4" /> },
  { id: 'shopping', name: 'Shopping', icon: <ShoppingBag className="h-4 w-4" /> },
  { id: 'hotels', name: 'Hôtels', icon: <Hotel className="h-4 w-4" /> },
  { id: 'entertainment', name: 'Divertissement', icon: <Film className="h-4 w-4" /> },
  { id: 'health', name: 'Santé', icon: <Stethoscope className="h-4 w-4" /> },
  { id: 'services', name: 'Services', icon: <Wrench className="h-4 w-4" /> },
  { id: 'education', name: 'Éducation', icon: <GraduationCap className="h-4 w-4" /> },
  { id: 'transport', name: 'Transport', icon: <Bus className="h-4 w-4" /> },
];
