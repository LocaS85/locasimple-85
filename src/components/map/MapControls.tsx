
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockCategories } from '@/data/mockCategories';
import MapStyleSelector, { MapStyle } from './MapStyleSelector';
import { cn } from '@/lib/utils';

interface MapControlsProps {
  mapStyle: MapStyle;
  onStyleChange: (style: MapStyle) => void;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  mapStyle,
  onStyleChange,
  selectedCategory,
  onCategorySelect
}) => {
  // Category colors
  const getCategoryColor = (categoryId: string) => {
    switch(categoryId) {
      case 'restaurants': return 'bg-red-500 text-white border-red-500';
      case 'bars': return 'bg-orange-500 text-white border-orange-500';
      case 'cafes': return 'bg-amber-500 text-white border-amber-500';
      case 'shopping': return 'bg-yellow-500 text-white border-yellow-500';
      case 'hotels': return 'bg-lime-500 text-white border-lime-500';
      case 'entertainment': return 'bg-green-500 text-white border-green-500';
      case 'health': return 'bg-teal-500 text-white border-teal-500';
      case 'services': return 'bg-cyan-500 text-white border-cyan-500';
      case 'education': return 'bg-blue-500 text-white border-blue-500';
      case 'transport': return 'bg-indigo-500 text-white border-indigo-500';
      default: return 'bg-black text-white border-black';
    }
  };
  
  const getHoverColor = (categoryId: string) => {
    switch(categoryId) {
      case 'restaurants': return 'hover:bg-red-200 hover:text-red-700 hover:border-red-500';
      case 'bars': return 'hover:bg-orange-200 hover:text-orange-700 hover:border-orange-500';
      case 'cafes': return 'hover:bg-amber-200 hover:text-amber-700 hover:border-amber-500';
      case 'shopping': return 'hover:bg-yellow-200 hover:text-yellow-700 hover:border-yellow-500';
      case 'hotels': return 'hover:bg-lime-200 hover:text-lime-700 hover:border-lime-500';
      case 'entertainment': return 'hover:bg-green-200 hover:text-green-700 hover:border-green-500';
      case 'health': return 'hover:bg-teal-200 hover:text-teal-700 hover:border-teal-500';
      case 'services': return 'hover:bg-cyan-200 hover:text-cyan-700 hover:border-cyan-500';
      case 'education': return 'hover:bg-blue-200 hover:text-blue-700 hover:border-blue-500';
      case 'transport': return 'hover:bg-indigo-200 hover:text-indigo-700 hover:border-indigo-500';
      default: return 'hover:bg-gray-200 hover:text-gray-700 hover:border-gray-500';
    }
  };

  return (
    <div className="absolute top-20 right-4 z-10 flex flex-col gap-2">
      {/* Category Button */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm shadow-md flex items-center gap-2 h-9 px-3 w-[120px]"
          >
            <MapPin className="h-4 w-4" />
            <span>Catégorie</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2" align="end">
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
            {mockCategories.map((category) => {
              const isSelected = category.id === selectedCategory;
              
              return (
                <Button 
                  key={category.id} 
                  className={cn(
                    "rounded-full border whitespace-nowrap px-2 py-0.5 h-7 flex-shrink-0 text-xs transition-colors",
                    isSelected 
                      ? getCategoryColor(category.id)
                      : `bg-white text-black border-black ${getHoverColor(category.id)}`
                  )}
                  onClick={() => onCategorySelect(category.id === selectedCategory ? null : category.id)}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Map Style Selector */}
      <MapStyleSelector 
        onStyleChange={onStyleChange}
        currentStyle={mapStyle}
      />
    </div>
  );
};

export default MapControls;
