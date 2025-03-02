
import React from 'react';
import { MapPin } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

export const mockCategories: Category[] = [
  { id: 'restaurants', name: 'Restaurants', icon: <MapPin className="h-4 w-4" /> },
  { id: 'bars', name: 'Bars', icon: <MapPin className="h-4 w-4" /> },
  { id: 'cafes', name: 'Cafés', icon: <MapPin className="h-4 w-4" /> },
  { id: 'shopping', name: 'Shopping', icon: <MapPin className="h-4 w-4" /> },
  { id: 'hotels', name: 'Hôtels', icon: <MapPin className="h-4 w-4" /> },
  { id: 'entertainment', name: 'Divertissement', icon: <MapPin className="h-4 w-4" /> },
  { id: 'health', name: 'Santé', icon: <MapPin className="h-4 w-4" /> },
  { id: 'services', name: 'Services', icon: <MapPin className="h-4 w-4" /> },
  { id: 'education', name: 'Éducation', icon: <MapPin className="h-4 w-4" /> },
  { id: 'transport', name: 'Transport', icon: <MapPin className="h-4 w-4" /> },
];
