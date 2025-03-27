
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '@/config/environment';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Place {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  category?: string;
}

interface MapDisplayProps {
  viewport: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  setViewport: (viewport: any) => void;
  places: Place[];
  resultsCount: number;
  selectedPlaceId: string | null;
  popupInfo: any;
  setPopupInfo: (info: any) => void;
  handleResultClick: (place: any) => void;
  isLocationActive: boolean;
  userLocation?: [number, number];
  loading: boolean;
  handleLocationClick: () => void;
  transportMode: string;
  setMap?: (map: mapboxgl.Map) => void;
}

const MapDisplay: React.FC<MapDisplayProps> = ({
  viewport,
  setViewport,
  places,
  resultsCount,
  selectedPlaceId,
  popupInfo,
  setPopupInfo,
  handleResultClick,
  isLocationActive,
  userLocation,
  loading,
  handleLocationClick,
  transportMode,
  setMap
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null);
  const [popups, setPopups] = useState<mapboxgl.Popup[]>([]);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;
    
    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token is missing');
      toast.error('Le token Mapbox est manquant, la carte ne peut pas être chargée');
      return;
    }
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom
    });
    
    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Handle map move
    map.current.on('moveend', () => {
      if (!map.current) return;
      
      const center = map.current.getCenter();
      setViewport({
        latitude: center.lat,
        longitude: center.lng,
        zoom: map.current.getZoom()
      });
    });
    
    // Share map reference via prop if provided
    if (setMap) {
      setMap(map.current);
    }
    
    return () => {
      // Clean up markers and popups
      markers.forEach(marker => marker.remove());
      popups.forEach(popup => popup.remove());
      if (userMarker) userMarker.remove();
      
      // Clean up map
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update map center when viewport changes
  useEffect(() => {
    if (!map.current) return;
    
    map.current.flyTo({
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
      essential: true
    });
  }, [viewport]);

  // Add user location marker
  useEffect(() => {
    if (!map.current || !userLocation) return;
    
    // Remove previous user marker
    if (userMarker) {
      userMarker.remove();
    }
    
    // Create user marker element
    const userEl = document.createElement('div');
    userEl.className = 'user-marker';
    userEl.innerHTML = `
      <div class="relative">
        <div class="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></div>
        <div class="relative bg-blue-500 border-2 border-white w-4 h-4 rounded-full shadow-md"></div>
      </div>
    `;
    
    // Create marker and add to map
    const marker = new mapboxgl.Marker(userEl)
      .setLngLat([userLocation[0], userLocation[1]])
      .addTo(map.current);
    
    setUserMarker(marker);
  }, [userLocation, map.current]);

  // Add place markers and popups
  useEffect(() => {
    if (!map.current) return;
    
    // Remove existing markers and popups
    markers.forEach(marker => marker.remove());
    popups.forEach(popup => popup.remove());
    
    const newMarkers: mapboxgl.Marker[] = [];
    const newPopups: mapboxgl.Popup[] = [];
    
    // Create markers for each place
    places.forEach((place, index) => {
      // Create marker element
      const el = document.createElement('div');
      el.className = `place-marker ${selectedPlaceId === place.id ? 'selected' : ''}`;
      el.innerHTML = `
        <div class="bg-white rounded-full shadow-md border-2 border-blue-500 w-6 h-6 flex items-center justify-center text-xs font-bold">
          ${index + 1}
        </div>
      `;
      
      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: true
      }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm">${place.name}</h3>
          ${place.address ? `<p class="text-xs text-gray-500">${place.address}</p>` : ''}
          <button class="start-navigation-btn mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded" data-id="${place.id}">
            Itinéraire
          </button>
        </div>
      `);
      
      // Create marker and add to map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([place.lon, place.lat])
        .setPopup(popup)
        .addTo(map.current!);
      
      // Add click event to marker
      el.addEventListener('click', () => {
        handleResultClick(place);
      });
      
      newMarkers.push(marker);
      newPopups.push(popup);
    });
    
    setMarkers(newMarkers);
    setPopups(newPopups);
    
    // Fit map bounds to include all markers if there are markers
    if (newMarkers.length > 0 && userLocation) {
      const bounds = new mapboxgl.LngLatBounds();
      
      // Add user location to bounds
      bounds.extend(userLocation);
      
      // Add all places to bounds
      places.forEach(place => {
        bounds.extend([place.lon, place.lat]);
      });
      
      // Fit map to bounds with padding
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [places, selectedPlaceId, map.current]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-20">
          <div className="bg-white p-3 rounded-full shadow-lg">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        </div>
      )}
      
      {/* Map attribution */}
      <div className="absolute bottom-0 right-0 bg-white/80 text-xs p-1 rounded-tl">
        © <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500">Mapbox</a>
      </div>
    </div>
  );
};

export default MapDisplay;
