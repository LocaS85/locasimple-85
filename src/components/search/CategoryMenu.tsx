
import React from 'react';
import { Category } from '@/data/mockCategories';
import { transportModes } from '@/data/transportModes';
import { Car, PersonStanding, Bike, Bus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryMenuProps {
  categories: Category[];
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  onCategorySelect?: (categoryId: string) => void;
  selectedCategory?: string | null;
}

export const CategoryMenu: React.FC<CategoryMenuProps> = ({
  categories,
  transportMode,
  onTransportModeChange,
  onCategorySelect,
  selectedCategory
}) => {
  // Get icon for transport mode
  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'driving':
        return <Car className="h-4 w-4" />;
      case 'walking':
        return <PersonStanding className="h-4 w-4" />;
      case 'cycling':
        return <Bike className="h-4 w-4" />;
      case 'transit':
        return <Bus className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200 animate-fade-in">
      <div className="grid grid-cols-3 gap-2 mb-3">
        {categories.slice(0, 9).map((category) => (
          <button
            key={category.id}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-lg bg-white/90 hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm",
              selectedCategory === category.id && "ring-2 ring-primary"
            )}
            onClick={() => onCategorySelect && onCategorySelect(category.id)}
          >
            <div className="mb-1 text-gray-600">
              {category.icon}
            </div>
            <span className="text-xs font-medium">{category.name}</span>
          </button>
        ))}
      </div>
      
      {/* Transport modes section */}
      <div className="mt-3 border-t pt-3 border-gray-200">
        <div className="flex justify-around space-x-2">
          {transportModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onTransportModeChange(mode.id)}
              className={`flex items-center justify-center px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                transportMode === mode.id
                  ? `bg-${mode.color} text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{ 
                backgroundColor: transportMode === mode.id ? mode.color : undefined,
                color: transportMode === mode.id ? 'white' : undefined
              }}
            >
              <span className="mr-1">{getTransportIcon(mode.id)}</span>
              {mode.name}
            </button>
          ))}
          <button className="flex items-center justify-center px-3 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-medium">
            <Plus className="h-4 w-4 mr-1" />
            Plus
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;
