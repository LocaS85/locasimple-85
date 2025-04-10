
import React, { useRef, useState } from 'react';
import { Compass, Layers, Map as MapIcon, Locate, Loader2 } from 'lucide-react';
import MapComponent from '@/components/Map';
import { toast } from 'sonner';

interface SmartMapProps {
  layers?: string[];
  controls?: string[];
  origin?: any;
  destinations?: any[];
  filters?: {
    radius: number;
    categories: string[];
    transport: string;
  };
  isLoading?: boolean;
}

const SmartMap: React.FC<SmartMapProps> = ({
  layers = ['base-map'],
  controls = [],
  origin,
  destinations = [],
  filters,
  isLoading = false
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapMode, setMapMode] = useState('2d');
  const [activeLayer, setActiveLayer] = useState(layers[0]);
  const [showLayerSelector, setShowLayerSelector] = useState(false);
  
  // Calculate map center based on origin or first destination
  const mapCenter: [number, number] = origin?.coordinates || (destinations[0]?.coordinates) || [2.3522, 48.8566];
  
  const toggleLayerSelector = () => {
    setShowLayerSelector(!showLayerSelector);
  };
  
  const handleLayerChange = (layer: string) => {
    setActiveLayer(layer);
    setShowLayerSelector(false);
    toast.success(`Couche "${layer}" activée`);
  };
  
  const toggle3DMode = () => {
    setMapMode(prev => prev === '2d' ? '3d' : '2d');
    toast.success(`Mode ${mapMode === '2d' ? '3D' : '2D'} activé`);
  };

  return (
    <div className="relative w-full h-full">
      {/* Map component */}
      <MapComponent
        results={[]}
        center={mapCenter}
        radius={filters?.radius || 5}
        radiusUnit="km"
        transportMode={filters?.transport || "driving"}
        isLocationActive={Boolean(origin)}
        userLocation={origin?.coordinates}
        selectedCategory={filters?.categories?.length ? filters.categories[0] : null}
      />
      
      {/* Map controls with improved styling */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {controls.includes('3d-toggle') && (
          <button 
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
            onClick={toggle3DMode}
            title={`Mode ${mapMode === '2d' ? '3D' : '2D'}`}
          >
            <MapIcon size={20} className="text-gray-700" />
          </button>
        )}
        
        {controls.includes('layer-switcher') && (
          <div className="relative">
            <button 
              className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
              onClick={toggleLayerSelector}
              title="Changer de couche"
            >
              <Layers size={20} className="text-gray-700" />
            </button>
            
            {/* Layer selector dropdown with improved styling */}
            {showLayerSelector && (
              <div className="absolute top-12 right-0 bg-white rounded-md shadow-lg p-2 w-40 border border-gray-100">
                {layers.map(layer => (
                  <button
                    key={layer}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      activeLayer === layer ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    } transition-colors`}
                    onClick={() => handleLayerChange(layer)}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {controls.includes('compass') && (
          <button 
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
            title="Réorienter la carte vers le nord"
          >
            <Compass size={20} className="text-gray-700" />
          </button>
        )}
        
        {controls.includes('geolocate') && (
          <button 
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
            title="Me localiser"
          >
            <Locate size={20} className="text-gray-700" />
          </button>
        )}
      </div>
      
      {/* Loading overlay with improved styling */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-20 backdrop-blur-sm">
          <div className="bg-white p-4 rounded-full shadow-lg">
            <Loader2 size={24} className="animate-spin text-blue-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartMap;
