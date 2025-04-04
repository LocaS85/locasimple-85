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
  mapboxToken?: string;
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
  setMap,
  mapboxToken = MAPBOX_TOKEN
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null);
  const [popups, setPopups] = useState<mapboxgl.Popup[]>([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    const token = mapboxToken || MAPBOX_TOKEN;
    
    if (!token) {
      console.error('Mapbox token is missing');
      toast.error('Le token Mapbox est manquant, la carte ne peut pas être chargée');
      return;
    }
    
    mapboxgl.accessToken = token;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [viewport.longitude, viewport.latitude],
        zoom: viewport.zoom
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      map.current.on('moveend', () => {
        if (!map.current) return;
        
        const center = map.current.getCenter();
        setViewport({
          latitude: center.lat,
          longitude: center.lng,
          zoom: map.current.getZoom()
        });
      });
      
      map.current.on('load', () => {
        setMapReady(true);
        console.log('Map loaded successfully');
      });
      
      if (setMap && map.current) {
        setMap(map.current);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error('Erreur lors de l\'initialisation de la carte');
    }
    
    return () => {
      markers.forEach(marker => marker.remove());
      popups.forEach(popup => popup.remove());
      if (userMarker) userMarker.remove();
      
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current) return;
    
    map.current.flyTo({
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom,
      essential: true
    });
  }, [viewport]);

  useEffect(() => {
    if (!map.current || !userLocation) return;
    
    if (userMarker) {
      userMarker.remove();
    }
    
    const userEl = document.createElement('div');
    userEl.className = 'user-marker';
    userEl.innerHTML = `
      <div class="relative">
        <div class="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></div>
        <div class="relative bg-blue-500 border-2 border-white w-4 h-4 rounded-full shadow-md"></div>
      </div>
    `;
    
    const marker = new mapboxgl.Marker(userEl)
      .setLngLat([userLocation[0], userLocation[1]])
      .addTo(map.current);
    
    setUserMarker(marker);
  }, [userLocation, map.current]);

  useEffect(() => {
    if (!map.current) return;
    
    markers.forEach(marker => marker.remove());
    popups.forEach(popup => popup.remove());
    
    const newMarkers: mapboxgl.Marker[] = [];
    const newPopups: mapboxgl.Popup[] = [];
    
    places.forEach((place, index) => {
      const el = document.createElement('div');
      el.className = `place-marker ${selectedPlaceId === place.id ? 'selected' : ''}`;
      el.innerHTML = `
        <div class="bg-white rounded-full shadow-md border-2 border-blue-500 w-6 h-6 flex items-center justify-center text-xs font-bold">
          ${index + 1}
        </div>
      `;
      
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
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([place.lon, place.lat])
        .setPopup(popup)
        .addTo(map.current!);
      
      el.addEventListener('click', () => {
        handleResultClick(place);
      });
      
      newMarkers.push(marker);
      newPopups.push(popup);
    });
    
    setMarkers(newMarkers);
    setPopups(newPopups);
    
    if (newMarkers.length > 0 && userLocation) {
      const bounds = new mapboxgl.LngLatBounds();
      
      bounds.extend(userLocation);
      
      places.forEach(place => {
        bounds.extend([place.lon, place.lat]);
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [places, selectedPlaceId, map.current]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-20">
          <div className="bg-white p-3 rounded-full shadow-lg">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        </div>
      )}
      
      <div className="absolute bottom-0 right-0 bg-white/80 text-xs p-1 rounded-tl">
        © <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500">Mapbox</a>
      </div>
      
      {!mapboxToken && !MAPBOX_TOKEN && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
            <h3 className="text-lg font-semibold text-red-600">Token Mapbox manquant</h3>
            <p className="mt-2 text-sm text-gray-700">
              Veuillez configurer votre token Mapbox dans le fichier .env pour afficher la carte.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;
