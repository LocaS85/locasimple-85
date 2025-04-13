
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '@/config/environment';

interface Place {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  category?: string;
  distance?: number;
  duration?: number;
  color?: string;
}

interface MapDisplayProps {
  viewport: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  setViewport: (viewport: any) => void;
  places: Place[];
  selectedPlaceId: string | null;
  resultsCount: number;
  popupInfo: any;
  setPopupInfo: (info: any) => void;
  handleResultClick: (place: Place) => void;
  isLocationActive?: boolean;
  userLocation?: [number, number];
  loading?: boolean;
  handleLocationClick?: () => void;
  transportMode?: string;
  setMap?: (map: mapboxgl.Map) => void;
  showRoutes?: boolean;
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  viewport,
  setViewport,
  places,
  selectedPlaceId,
  resultsCount,
  popupInfo,
  setPopupInfo,
  handleResultClick,
  isLocationActive = false,
  userLocation,
  loading = false,
  handleLocationClick,
  transportMode = 'driving',
  setMap,
  showRoutes = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token is missing');
      return;
    }
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom
    });
    
    // Add navigation controls
    newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Set map ref
    map.current = newMap;
    
    // Wait for map to load
    newMap.on('load', () => {
      if (setMap) setMap(newMap);
      
      // Add user location marker if available
      if (userLocation) {
        new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat([userLocation[0], userLocation[1]])
          .addTo(newMap);
      }
    });
    
    return () => {
      newMap.remove();
      map.current = null;
    };
  }, [mapContainer]);

  // Update viewport when map moves
  useEffect(() => {
    if (!map.current) return;
    
    const moveEndHandler = () => {
      if (!map.current) return;
      const center = map.current.getCenter();
      setViewport({
        latitude: center.lat,
        longitude: center.lng,
        zoom: map.current.getZoom()
      });
    };
    
    map.current.on('moveend', moveEndHandler);
    
    return () => {
      if (map.current) {
        map.current.off('moveend', moveEndHandler);
      }
    };
  }, [setViewport]);

  // Update map center when viewport changes
  useEffect(() => {
    if (!map.current) return;
    
    map.current.flyTo({
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
      essential: true
    });
  }, [viewport.latitude, viewport.longitude, viewport.zoom]);

  // Add markers for places
  useEffect(() => {
    if (!map.current) return;
    
    // Remove previous markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    
    // Add new markers
    places.forEach(place => {
      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '28px';
      el.style.height = '28px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      
      // Set color based on selection or category
      if (selectedPlaceId === place.id) {
        el.style.backgroundColor = '#3b82f6';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 0 0 2px #3b82f6';
      } else {
        el.style.backgroundColor = place.color || '#ef4444';
        el.style.border = '2px solid white';
      }
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold">${place.name}</h3>
          ${place.address ? `<p class="text-sm">${place.address}</p>` : ''}
          ${place.category ? `<p class="text-xs text-gray-500">${place.category}</p>` : ''}
          ${place.distance ? `<p class="text-xs">Distance: ${place.distance.toFixed(1)} km</p>` : ''}
          ${place.duration ? `<p class="text-xs">Durée: ${place.duration.toFixed(0)} min</p>` : ''}
        </div>
      `);
      
      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([place.lon, place.lat])
        .setPopup(popup)
        .addTo(map.current!);
      
      // Add click event
      el.addEventListener('click', () => {
        handleResultClick(place);
      });
      
      // Store marker reference
      markersRef.current[place.id] = marker;
    });
  }, [places, selectedPlaceId, handleResultClick]);

  // Show popup for selected place
  useEffect(() => {
    if (!map.current || !selectedPlaceId) return;
    
    const marker = markersRef.current[selectedPlaceId];
    if (marker) {
      marker.togglePopup();
    }
  }, [selectedPlaceId]);

  return (
    <div className="map-container relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-center">Chargement...</p>
          </div>
        </div>
      )}
      
      {/* User location button */}
      <button
        onClick={handleLocationClick}
        className={`absolute bottom-4 right-4 p-3 rounded-full shadow-md ${
          isLocationActive ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
        }`}
        title="Ma position"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      
      {/* Results count */}
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-2 text-center text-sm">
        {places.length > 0 ? 
          `${places.length} résultats trouvés` : 
          loading ? 'Recherche en cours...' : 'Aucun résultat'
        }
      </div>
    </div>
  );
};

export default MapDisplay;
