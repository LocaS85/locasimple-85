
import React from 'react';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockCategories } from '@/data/mockCategories';
import MapStyleSelector, { MapStyle } from './MapStyleSelector';
import { cn } from '@/lib/utils';
import { getCategoryColor, getHoverColor } from '@/utils/categoryColors';

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
  return (
    <div className="absolute top-0 right-0 z-10 pt-[110px] pr-4 flex flex-col gap-2">
      {/* Category Button */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm shadow-md flex items-center gap-2 h-9 px-3 w-[120px]"
          >
            {selectedCategory ? 
              mockCategories.find(c => c.id === selectedCategory)?.icon : 
              <Layers className="h-4 w-4" />
            }
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
                  {category.icon}
                  <span className="ml-1">{category.name}</span>
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
