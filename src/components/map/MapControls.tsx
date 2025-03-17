
import React from 'react';
import { Button } from '@/components/ui/button';
import { Layers, Map as MapIcon, Plus, Minus, CompassIcon, Filter, Navigation } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockCategories } from '@/data/mockCategories';
import { cn } from '@/lib/utils';
import { getCategoryColor, getHoverColor } from '@/utils/categoryColors';
import mapboxgl from 'mapbox-gl';

interface MapControlsProps {
  mapStyle: string;
  onStyleChange: (style: string) => void;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  map: mapboxgl.Map | null;
  minimal?: boolean; // Add minimal as an optional prop
  onTransportModeClick?: () => void;
  onFiltersClick?: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  mapStyle,
  onStyleChange,
  selectedCategory,
  onCategorySelect,
  map,
  minimal = false, // Default to false
  onTransportModeClick,
  onFiltersClick
}) => {
  // Function to handle zoom in
  const handleZoomIn = () => {
    if (map) {
      map.zoomIn();
    }
  };

  // Function to handle zoom out
  const handleZoomOut = () => {
    if (map) {
      map.zoomOut();
    }
  };

  // Function to reset bearing to north
  const handleResetNorth = () => {
    if (map) {
      map.resetNorth();
    }
  };

  // Function to handle find my location
  const handleFindMyLocation = () => {
    if (map) {
      // Try to get the user's current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          map.flyTo({
            center: [position.coords.longitude, position.coords.latitude],
            zoom: 15,
            essential: true
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

  return (
    <div className="absolute top-4 right-0 z-10 flex flex-col mr-4">
      {/* Custom Map Control Group */}
      <div className="mapboxgl-ctrl mapboxgl-ctrl-group map-custom-controls">
        {/* Zoom in button */}
        <Button
          variant="outline"
          size="icon"
          className="map-ctrl-btn"
          onClick={handleZoomIn}
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        {/* Zoom out button */}
        <Button
          variant="outline"
          size="icon"
          className="map-ctrl-btn"
          onClick={handleZoomOut}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        {/* Compass button */}
        <Button
          variant="outline"
          size="icon"
          className="map-ctrl-btn"
          onClick={handleResetNorth}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4">
            <polygon points="6,9 10,1 14,9" />
            <polygon points="6,11 10,19 14,11" />
          </svg>
        </Button>
        
        {/* Find my location button */}
        <Button
          variant="outline"
          size="icon"
          className="map-ctrl-btn"
          onClick={handleFindMyLocation}
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Gap between control groups */}
      <div className="h-4"></div>
      
      {/* Transport modes button */}
      <div className="mapboxgl-ctrl mapboxgl-ctrl-group map-custom-controls">
        <Button
          variant="outline"
          size="icon"
          className="map-ctrl-btn"
          onClick={onTransportModeClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.1c-.5-.3-1.1-.5-1.8-.5H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
            <circle cx="7" cy="17" r="2"></circle>
            <path d="M9 17h6"></path>
            <circle cx="17" cy="17" r="2"></circle>
          </svg>
        </Button>
      </div>
      
      {/* Gap between control groups */}
      <div className="h-4"></div>
      
      {/* Filters button */}
      <div className="mapboxgl-ctrl mapboxgl-ctrl-group map-custom-controls">
        <Button
          variant="outline"
          size="icon"
          className="map-ctrl-btn"
          onClick={onFiltersClick}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Gap between control groups */}
      <div className="h-4"></div>
      
      {/* Categories and Map Style Controls */}
      {!minimal && (
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
      )}
      
      {/* Always show map style control even in minimal mode */}
      {minimal && (
        <div className="mapboxgl-ctrl mapboxgl-ctrl-group map-custom-controls">
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
      )}
    </div>
  );
};

export default MapControls;
