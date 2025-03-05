
import React from 'react';
import { Button } from '@/components/ui/button';
import { Layers, Map as MapIcon, Plus, Minus } from 'lucide-react';
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
    <div className="absolute top-10 right-0 z-10 flex flex-col mr-4">
      {/* Custom Map Control Group */}
      <div className="mapboxgl-ctrl mapboxgl-ctrl-group map-custom-controls">
        {/* Zoom in button */}
        <Button
          variant="outline"
          size="icon"
          className="map-ctrl-btn"
          onClick={() => {
            // Find the mapbox zoom in button and click it
            const zoomInBtn = document.querySelector('.mapboxgl-ctrl-zoom-in') as HTMLButtonElement;
            if (zoomInBtn) zoomInBtn.click();
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        {/* Zoom out button */}
        <Button
          variant="outline"
          size="icon"
          className="map-ctrl-btn"
          onClick={() => {
            // Find the mapbox zoom out button and click it
            const zoomOutBtn = document.querySelector('.mapboxgl-ctrl-zoom-out') as HTMLButtonElement;
            if (zoomOutBtn) zoomOutBtn.click();
          }}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        {/* Compass button */}
        <Button
          variant="outline"
          size="icon"
          className="map-ctrl-btn"
          onClick={() => {
            // Find the mapbox compass button and click it
            const compassBtn = document.querySelector('.mapboxgl-ctrl-compass') as HTMLButtonElement;
            if (compassBtn) compassBtn.click();
          }}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4">
            <polygon points="6,9 10,1 14,9" />
            <polygon points="6,11 10,19 14,11" />
          </svg>
        </Button>
      </div>
      
      {/* Gap between control groups */}
      <div className="h-4"></div>
      
      {/* Categories and Map Style Controls */}
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
