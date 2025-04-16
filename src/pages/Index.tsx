
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MAPBOX_TOKEN } from '@/config/environment';

const Index = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [currentRadius, setCurrentRadius] = useState<any>(null);
  const [unit, setUnitState] = useState<'km' | 'mi'>('km');
  const [radiusValue, setRadiusValue] = useState<number>(5);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || map) return;

    // Check if we're in a browser environment with Leaflet available
    if (typeof window !== 'undefined' && 'L' in window) {
      const L = (window as any).L;
      
      const newMap = L.map(mapContainerRef.current, { 
        zoomControl: false 
      }).setView([48.8566, 2.3522], 13);
      
      L.control.zoom({ position: 'bottomright' }).addTo(newMap);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(newMap);
      
      setMap(newMap);
      
      // Initial radius circle
      updateRadiusCircle(radiusValue, newMap);
    }
    
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Update radius when changed
  useEffect(() => {
    if (map) {
      updateRadiusCircle(radiusValue, map);
    }
  }, [radiusValue, unit, map]);

  // Function to update radius circle on map
  const updateRadiusCircle = (radius: number, mapInstance: any) => {
    if (currentRadius) {
      mapInstance.removeLayer(currentRadius);
    }
    
    const radiusInMeters = unit === 'km' ? radius * 1000 : radius * 1609.34;
    
    const newRadius = (window as any).L.circle(mapInstance.getCenter(), {
      radius: radiusInMeters,
      color: '#2A5C82',
      fillOpacity: 0.1
    }).addTo(mapInstance);
    
    setCurrentRadius(newRadius);
  };

  const handleUnitChange = (selected: 'km' | 'mi') => {
    setUnitState(selected);
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadiusValue(Number(e.target.value));
  };

  const showSubcategories = (value: string) => {
    // This would be implemented to show subcategories based on the selected category
    console.log("Selected category:", value);
  };

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen">
      <div className="filters-panel bg-white p-5 shadow-md overflow-y-auto z-[1001]">
        <div className="search-bar flex gap-2.5 mb-5">
          <input 
            type="text" 
            id="searchInput" 
            placeholder="Rechercher..." 
            className="flex-1 py-3 px-3 border border-gray-300 rounded-3xl"
          />
          <button 
            className="voice-search bg-[#2A5C82] text-white border-none rounded-full w-[45px] h-[45px] cursor-pointer hover:bg-[#5BA4E6]"
            title="Recherche vocale"
          >
            <i className="fas fa-microphone"></i>
          </button>
        </div>

        <div className="filter-group my-5">
          <h4>Catégorie</h4>
          <select 
            onChange={(e) => showSubcategories(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Choisir</option>
            <option value="Adresse principale">Adresse principale</option>
            <option value="Famille">Famille</option>
            <option value="Travail">Travail</option>
            <option value="École">École</option>
            <option value="Alimentation et Boissons">Alimentation et Boissons</option>
            <option value="Achats">Achats</option>
            <option value="Services">Services</option>
            <option value="Santé et Bien-être">Santé et Bien-être</option>
            <option value="Divertissement et Loisirs">Divertissement et Loisirs</option>
            <option value="Hébergement">Hébergement</option>
          </select>
        </div>

        <div className="filter-group my-5">
          <div id="subcategories" className="subcategories-scroll flex overflow-x-auto gap-[15px] py-2.5"></div>
        </div>

        <div className="filter-group my-5">
          <h4>Nombre de résultats</h4>
          <input 
            type="range" 
            min="1" 
            max="10" 
            defaultValue="5" 
            id="resultRange"
            className="w-full" 
          />
        </div>

        <div className="filter-group my-5">
          <h4>Rayon de recherche</h4>
          <div className="distance-filter flex items-center gap-2.5">
            <Button 
              onClick={() => handleUnitChange('km')}
              variant={unit === 'km' ? 'default' : 'outline'}
              size="sm"
            >
              km
            </Button>
            <Button 
              onClick={() => handleUnitChange('mi')}
              variant={unit === 'mi' ? 'default' : 'outline'}
              size="sm"
            >
              mi
            </Button>
            <input 
              type="number" 
              id="distanceInput" 
              value={radiusValue} 
              onChange={handleRadiusChange}
              className="w-20 p-2 border border-gray-300 rounded" 
            />
          </div>
        </div>

        <div className="filter-group my-5">
          <h4>Mode de transport</h4>
          <div className="transport-filter flex flex-wrap gap-2">
            <button className="transport-btn" style={{ background: '#FF6B6B' }}>
              <i className="fas fa-car"></i> Voiture
            </button>
            <button className="transport-btn" style={{ background: '#4ECDC4' }}>
              <i className="fas fa-walking"></i> À pied
            </button>
            <button className="transport-btn" style={{ background: '#45B7D1' }}>
              <i className="fas fa-bicycle"></i> Vélo
            </button>
            <button className="transport-btn" style={{ background: '#96CEB4' }}>
              <i className="fas fa-bus"></i> Transports
            </button>
            <button className="transport-btn" style={{ background: '#FFEEAD' }}>
              <i className="fas fa-train"></i> Train
            </button>
            <button className="transport-btn" style={{ background: '#D4A5A5' }}>
              <i className="fas fa-ship"></i> Bateau
            </button>
            <button className="transport-btn" style={{ background: '#774F38' }}>
              <i className="fas fa-users"></i> Co-voiturage
            </button>
            <button className="transport-btn" style={{ background: '#8E44AD' }}>
              <i className="fas fa-plane"></i> Avion
            </button>
          </div>
        </div>
      </div>

      <div ref={mapContainerRef} id="map" className="h-screen"></div>
    </div>
  );
};

export default Index;
