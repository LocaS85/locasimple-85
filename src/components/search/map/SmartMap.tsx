
import React, { useRef, useState, useEffect } from 'react';
import { Compass, Layers, Map3D, Locate, Loader2 } from 'lucide-react';
import Map from '@/components/Map';
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
      <Map
        results={[]}
        center={mapCenter}
        radius={filters?.radius || 5}
        radiusUnit="km"
        transportMode={filters?.transport || "driving"}
        isLocationActive={true}
        userLocation={origin?.coordinates}
        selectedCategory={filters?.categories?.length ? filters.categories[0] : null}
      />
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {controls.includes('3d-toggle') && (
          <button 
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
            onClick={toggle3DMode}
            title={`Mode ${mapMode === '2d' ? '3D' : '2D'}`}
          >
            <Map3D size={20} />
          </button>
        )}
        
        {controls.includes('layer-switcher') && (
          <div className="relative">
            <button 
              className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
              onClick={toggleLayerSelector}
              title="Changer de couche"
            >
              <Layers size={20} />
            </button>
            
            {/* Layer selector dropdown */}
            {showLayerSelector && (
              <div className="absolute top-12 right-0 bg-white rounded-md shadow-lg p-2 w-40">
                {layers.map(layer => (
                  <button
                    key={layer}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      activeLayer === layer ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
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
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
            title="Réorienter la carte vers le nord"
          >
            <Compass size={20} />
          </button>
        )}
        
        {controls.includes('geolocate') && (
          <button 
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
            title="Me localiser"
          >
            <Locate size={20} />
          </button>
        )}
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-20">
          <div className="bg-white p-3 rounded-full shadow-lg">
            <Loader2 size={24} className="animate-spin text-blue-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartMap;
