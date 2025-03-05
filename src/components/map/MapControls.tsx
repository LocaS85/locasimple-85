
import React from 'react';
import { Button } from '@/components/ui/button';
import { Layers, Map as MapIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockCategories } from '@/data/mockCategories';
import { cn } from '@/lib/utils';
import { getCategoryColor, getHoverColor } from '@/utils/categoryColors';

interface MapControlsProps {
  mapStyle: string;
  onStyleChange: (style: string) => void;
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
    <div className="absolute top-0 right-0 z-10 flex flex-col">
      {/* We add a custom control group to match Mapbox's style */}
      <div className="mapboxgl-ctrl mapboxgl-ctrl-group map-custom-controls">
        {/* Category Button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="map-ctrl-btn"
            >
              {selectedCategory ? 
                mockCategories.find(c => c.id === selectedCategory)?.icon : 
                <Layers className="h-4 w-4" />
              }
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
        
        {/* Map Style Button */}
        <Button
          variant="outline"
          size="icon"
          className="map-ctrl-btn"
          onClick={() => {
            const nextStyle = mapStyle === 'streets' ? 'satellite' :
                             mapStyle === 'satellite' ? 'terrain' : 'streets';
            onStyleChange(nextStyle);
          }}
        >
          <MapIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MapControls;
