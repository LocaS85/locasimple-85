
import React, { useRef } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

const mockCategories: Category[] = [
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

export const CategoriesSelector: React.FC = () => {
  const categoriesRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="px-4 pb-2 relative">
      <div 
        ref={categoriesRef}
        className="flex items-center overflow-x-auto pb-2 gap-2 scrollbar-hide"
      >
        {mockCategories.map((category) => (
          <Button 
            key={category.id} 
            variant="outline" 
            className="flex-shrink-0 whitespace-nowrap"
          >
            {category.icon}
            <span>{category.name}</span>
          </Button>
        ))}
        <Button variant="outline" className="flex-shrink-0 rounded-full p-2">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
