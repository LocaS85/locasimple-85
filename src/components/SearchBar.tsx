
import React, { useRef, useEffect } from 'react';
import { MAPBOX_TOKEN } from '@/config/environment';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl from 'mapbox-gl';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelectLocation?: (result: any) => void;
}

const SearchBar = ({ onSearch, onSelectLocation }: SearchBarProps) => {
  const geocoderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!geocoderContainerRef.current || !MAPBOX_TOKEN) return;
    
    // Clean up any existing geocoder
    if (geocoderContainerRef.current.firstChild) {
      geocoderContainerRef.current.removeChild(geocoderContainerRef.current.firstChild);
    }
    
    // Create the geocoder control
    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      mapboxgl: mapboxgl,
      placeholder: 'Rechercher un lieu...',
      countries: 'fr', // Filtre sur la France
      types: 'poi,place,address', // Recherche d'adresses et de points d'intérêt
      marker: false, // Désactiver le marqueur automatique
      language: 'fr'
    });

    // Add geocoder to the container
    geocoderContainerRef.current.appendChild(geocoder.onAdd({} as any));
    
    // Handle geocoder results
    geocoder.on('result', (e: any) => {
      const result = e.result;
      onSearch(result.place_name);
      
      if (onSelectLocation) {
        onSelectLocation(result);
      }
    });

    return () => {
      // Clean up geocoder when component unmounts
      if (geocoderContainerRef.current?.firstChild) {
        geocoderContainerRef.current.removeChild(geocoderContainerRef.current.firstChild);
      }
    };
  }, [MAPBOX_TOKEN, onSearch, onSelectLocation]);

  return (
    <div className="w-full max-w-xl">
      <div ref={geocoderContainerRef} className="geocoder-container" />
    </div>
  );
};

export default SearchBar;
