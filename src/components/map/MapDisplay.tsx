
import React, { useRef, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '@/config/environment';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import * as mapboxgl from 'mapbox-gl';

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
  popupInfo: Place | null;
  setPopupInfo: (place: Place | null) => void;
  handleResultClick: (place: Place) => void;
  isLocationActive: boolean;
  userLocation?: [number, number];
  loading: boolean;
  handleLocationClick: () => void;
  transportMode: string;
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
  transportMode
}) => {
  const mapRef = useRef<any>(null);
  const geocoderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !geocoderContainerRef.current || !MAPBOX_TOKEN) return;
    
    // Clean up any existing geocoder
    if (geocoderContainerRef.current.firstChild) {
      geocoderContainerRef.current.removeChild(geocoderContainerRef.current.firstChild);
    }
    
    // Create the geocoder control
    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      mapboxgl: mapboxgl as any,
      placeholder: 'Rechercher un lieu, une entreprise...',
      countries: 'fr', // Filtre sur la France
      types: 'poi,place,address', // Recherche d'adresses et de points d'intérêt
      marker: false, // Désactiver le marqueur automatique
      language: 'fr'
    });

    // Add geocoder to the container
    geocoderContainerRef.current.appendChild(geocoder.onAdd(mapRef.current.getMap()));
    
    // Handle geocoder results
    geocoder.on('result', (e: any) => {
      const result = e.result;
      // Set viewport to the selected location
      setViewport({
        latitude: result.center[1],
        longitude: result.center[0],
        zoom: 14
      });
      
      // Create a place object from the result
      const place: Place = {
        id: result.id,
        name: result.text,
        lat: result.center[1],
        lon: result.center[0],
        address: result.place_name
      };
      
      // Handle the selected place
      handleResultClick(place);
    });

    return () => {
      // Clean up geocoder when component unmounts
      if (geocoderContainerRef.current?.firstChild) {
        geocoderContainerRef.current.removeChild(geocoderContainerRef.current.firstChild);
      }
    };
  }, [mapRef.current, MAPBOX_TOKEN]);

  return (
    <>
      {MAPBOX_TOKEN ? (
        <div className="relative w-full h-full">
          <div ref={geocoderContainerRef} className="geocoder-container" />
          
          <Map
            ref={mapRef}
            {...viewport}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            onMove={evt => setViewport(evt.viewState)}
            reuseMaps
          >
            <GeolocateControl position="top-right" />
            <NavigationControl position="top-right" />
            
            {places.slice(0, resultsCount).map((place) => (
              <Marker 
                key={place.id} 
                latitude={place.lat} 
                longitude={place.lon} 
                anchor="bottom"
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  handleResultClick(place);
                }}
              >
                <div className={`bg-blue-500 text-white px-2 py-1 rounded-md text-sm shadow-md cursor-pointer ${selectedPlaceId === place.id ? 'ring-2 ring-yellow-400' : ''}`}>
                  {place.name}
                </div>
              </Marker>
            ))}
            
            {popupInfo && (
              <Popup
                latitude={popupInfo.lat}
                longitude={popupInfo.lon}
                anchor="bottom"
                onClose={() => setPopupInfo(null)}
                closeButton={true}
                closeOnClick={false}
                className="z-20"
              >
                <div className="p-2">
                  <h3 className="font-bold">{popupInfo.name}</h3>
                  {popupInfo.address && (
                    <p className="text-sm text-gray-600">{popupInfo.address}</p>
                  )}
                  {popupInfo.category && (
                    <p className="text-xs text-gray-500 mt-1">Catégorie: {popupInfo.category}</p>
                  )}
                  <div className="mt-2 flex space-x-2">
                    <button 
                      className="bg-blue-500 text-white text-xs px-3 py-1 rounded"
                      onClick={() => {
                        alert(`Itinéraire vers ${popupInfo.name} (${transportMode})`);
                      }}
                    >
                      Itinéraire
                    </button>
                    <button 
                      className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded"
                      onClick={() => {
                        alert(`Partage de ${popupInfo.name}`);
                      }}
                    >
                      Partager
                    </button>
                  </div>
                </div>
              </Popup>
            )}
            
            {/* User location marker */}
            {isLocationActive && userLocation && (
              <Marker 
                latitude={userLocation[1]} 
                longitude={userLocation[0]} 
                anchor="center"
              >
                <div className="relative">
                  <div className="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping" />
                  <div className="relative bg-blue-500 border-2 border-white w-6 h-6 rounded-full" />
                </div>
              </Marker>
            )}
          </Map>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <p className="text-red-500">Token Mapbox manquant</p>
        </div>
      )}
    </>
  );
};

export default MapDisplay;
