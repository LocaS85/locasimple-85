
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import RadiusCircle from './RadiusCircle';
import MapMarkers from './MapMarkers';
import { SearchInput } from '../search/SearchInput';
import type { Result } from '../ResultsList';
import { MAPBOX_TOKEN } from '@/config/environment';
import MapStyleSelector, { MapStyle } from './MapStyleSelector';
import { MapPin } from 'lucide-react';
import { mockCategories } from '@/data/mockCategories';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';

interface MapContainerProps {
  results: Result[];
  center: [number, number];
  radius?: number;
  radiusUnit?: 'km' | 'miles';
  radiusType?: 'distance' | 'duration';
  duration?: number;
  timeUnit?: 'minutes' | 'hours';
  transportMode?: string;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  isRecording?: boolean;
  onMicClick?: () => void;
  onLocationClick?: () => void;
  isLocationActive?: boolean;
  loading?: boolean;
  showRoutes?: boolean;
  onSearch?: () => void;
  selectedResultId?: string;
  onResultClick?: (result: Result) => void;
  selectedCategory?: string | null;
  onCategorySelect?: (categoryId: string | null) => void;
}

// Map style URLs for Mapbox
const MAP_STYLE_URLS = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  terrain: 'mapbox://styles/mapbox/outdoors-v12'
};

const MapContainer: React.FC<MapContainerProps> = ({ 
  results, 
  center, 
  radius = 5, 
  radiusUnit = 'km', 
  radiusType = 'distance',
  duration = 15,
  timeUnit = 'minutes',
  transportMode = 'driving',
  searchQuery = '',
  onSearchChange = () => {},
  isRecording = false,
  onMicClick = () => {},
  onLocationClick = () => {},
  isLocationActive = false,
  loading = false,
  showRoutes = false,
  onSearch = () => {},
  selectedResultId,
  onResultClick,
  selectedCategory = null,
  onCategorySelect = () => {}
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const centerMarker = useRef<mapboxgl.Marker | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyle>('streets');
  
  useEffect(() => {
    if (!mapContainer.current || isMapInitialized) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAP_STYLE_URLS[mapStyle],
        center: center,
        zoom: 13,
      });

      map.current.on('load', () => {
        setIsMapInitialized(true);
        
        map.current?.addControl(
          new mapboxgl.NavigationControl(),
          'top-right'
        );
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [mapContainer, center, isMapInitialized, mapStyle]);

  // Update map style when it changes
  useEffect(() => {
    if (!map.current || !isMapInitialized) return;
    map.current.setStyle(MAP_STYLE_URLS[mapStyle]);
  }, [mapStyle, isMapInitialized]);

  // Update center when coordinates change
  useEffect(() => {
    if (!map.current || !isMapInitialized) return;
    
    // Update map center
    map.current.flyTo({
      center: center,
      zoom: map.current.getZoom(),
      speed: 1.5,
      curve: 1,
      essential: true
    });
    
    // Add or update center marker if location is active
    if (isLocationActive) {
      if (centerMarker.current) {
        centerMarker.current.setLngLat(center);
      } else {
        // Create a custom marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'center-marker';
        markerEl.innerHTML = `
          <div class="relative">
            <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            <div class="absolute -inset-2 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
          </div>
        `;
        
        centerMarker.current = new mapboxgl.Marker(markerEl)
          .setLngLat(center)
          .addTo(map.current);
      }
    } else if (centerMarker.current) {
      // Remove center marker if location is not active
      centerMarker.current.remove();
      centerMarker.current = null;
    }
  }, [center, isMapInitialized, isLocationActive]);

  // Handle map style change
  const handleStyleChange = (newStyle: MapStyle) => {
    setMapStyle(newStyle);
  };

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

  useEffect(() => {
    return () => {
      map.current?.remove();
      centerMarker.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-auto">
        <SearchInput
          searchQuery={searchQuery}
          isRecording={isRecording}
          isLocationActive={isLocationActive}
          loading={loading}
          onSearchChange={onSearchChange}
          onMicClick={onMicClick}
          onLocationClick={onLocationClick}
          onSearch={onSearch}
        />
      </div>
      
      {/* Control buttons - stacked vertically */}
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
        
        {/* Map Style Selector - now below the category button */}
        <MapStyleSelector 
          onStyleChange={handleStyleChange}
          currentStyle={mapStyle}
        />
      </div>
      
      {isMapInitialized && map.current && (
        <>
          <RadiusCircle
            map={map.current}
            center={center}
            radius={radius}
            radiusUnit={radiusUnit}
            radiusType={radiusType}
            duration={duration}
            timeUnit={timeUnit}
            transportMode={transportMode}
          />
          
          <MapMarkers
            map={map.current}
            results={results}
            center={center}
            transportMode={transportMode}
            showRoutes={showRoutes}
            selectedResultId={selectedResultId}
            onResultClick={onResultClick}
          />
        </>
      )}
      
      {/* Results Counter */}
      {results.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-sm font-medium">
          {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default MapContainer;
