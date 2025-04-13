import React, { useRef, useEffect, useState } from 'react';
import Map, { Marker, Popup, NavigationControl, Source, Layer } from 'react-map-gl';
import { MAPBOX_TOKEN } from '@/config/environment';
import { convertDistance } from '@/lib/utils';
import { getColorForCategory, getColorForResult } from '@/utils/mapColors';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { DistanceUnit } from '@/types/categoryTypes';
import 'mapbox-gl/dist/mapbox-gl.css';

// Je garde la définition existante de MapDisplay et j'ajoute deux nouvelles props:
// selectedCategory et selectedSubcategories
interface MapDisplayProps {
  places: any[];
  userLocation?: [number, number];
  selectedPlaceId?: string;
  onPlaceSelect: (placeId: string) => void;
  loading: boolean;
  radiusType: 'time' | 'distance';
  radius: number;
  distanceUnit: 'km' | 'mi';
  transportMode: string;
  selectedCategory: string | null;
  selectedSubcategories: string[];
}

export const MapDisplay = ({
  places, 
  userLocation, 
  selectedPlaceId, 
  onPlaceSelect, 
  loading, 
  radiusType, 
  radius, 
  distanceUnit, 
  transportMode,
  selectedCategory,
  selectedSubcategories
}: MapDisplayProps) => {
  const mapRef = useRef<any>(null);
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const [viewport, setViewport] = useState({
    latitude: userLocation ? userLocation[1] : 48.8566,
    longitude: userLocation ? userLocation[0] : 2.3522,
    zoom: 12
  });

  // Filter places by selected subcategories if any are selected
  const filteredPlaces = selectedSubcategories.length > 0
    ? places.filter(place => {
        // Check if the place has a subcategory that matches one of the selected ones
        return selectedSubcategories.includes(place.subcategoryId);
      })
    : places;

  // Update viewport when user location changes
  useEffect(() => {
    if (userLocation) {
      setViewport({
        latitude: userLocation[1],
        longitude: userLocation[0],
        zoom: 13
      });
    }
  }, [userLocation]);

  // Update viewport to fit all markers
  useEffect(() => {
    if (places.length > 0 && mapRef.current && !loading) {
      const map = mapRef.current.getMap();
      
      const bounds = new window.mapboxgl.LngLatBounds();
      
      // Add user location to bounds if available
      if (userLocation) {
        bounds.extend([userLocation[0], userLocation[1]]);
      }
      
      // Add all places to bounds
      places.forEach(place => {
        bounds.extend([place.longitude, place.latitude]);
      });
      
      map.fitBounds(bounds, {
        padding: 100,
        maxZoom: 15
      });
    }
  }, [places, userLocation, loading]);

  // Show popup for selected place
  useEffect(() => {
    if (selectedPlaceId) {
      const selectedPlace = places.find(place => place.id === selectedPlaceId);
      if (selectedPlace) {
        setPopupInfo(selectedPlace);
        
        setViewport({
          latitude: selectedPlace.latitude,
          longitude: selectedPlace.longitude,
          zoom: 15
        });
      }
    } else {
      setPopupInfo(null);
    }
  }, [selectedPlaceId, places]);

  // Create circle layer for radius visualization
  const circleLayer = userLocation ? {
    id: 'radius-circle',
    type: 'fill',
    paint: {
      'fill-color': '#3b82f6',
      'fill-opacity': 0.1,
      'fill-outline-color': '#3b82f6'
    }
  } : null;

  // Create circle source for radius visualization
  const circleSource = userLocation ? {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          createCirclePoints(
            userLocation[0], 
            userLocation[1], 
            radiusType === 'distance' 
              ? convertDistance(radius, distanceUnit, 'km') 
              : 2 // Default radius for time-based search
          )
        ]
      }
    }
  } : null;

  // Create circle points for radius visualization
  function createCirclePoints(centerLng: number, centerLat: number, radiusKm: number, points = 64) {
    const coords = [];
    const distanceX = radiusKm / (111.32 * Math.cos(centerLat * (Math.PI / 180)));
    const distanceY = radiusKm / 110.574;

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * (2 * Math.PI);
      const x = centerLng + distanceX * Math.cos(angle);
      const y = centerLat + distanceY * Math.sin(angle);
      coords.push([x, y]);
    }
    
    // Close the circle
    coords.push(coords[0]);
    
    return coords;
  }

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN || (window as any).TEMPORARY_MAPBOX_TOKEN}
      initialViewState={viewport}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      {/* Navigation controls */}
      <NavigationControl position="top-right" />
      
      {/* User location marker */}
      {userLocation && (
        <Marker 
          longitude={userLocation[0]} 
          latitude={userLocation[1]}
          anchor="center"
        >
          <div className="w-6 h-6 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </Marker>
      )}
      
      {/* Radius circle */}
      {userLocation && circleSource && circleLayer && (
        <Source id="radius-circle-source" {...circleSource}>
          <Layer {...circleLayer as any} />
        </Source>
      )}
      
      {/* Place markers */}
      {filteredPlaces.map(place => {
        const isSelected = selectedPlaceId === place.id;
        const color = getColorForResult(place.color || getColorForCategory(place.category || 'default'));
        
        return (
          <Marker
            key={place.id}
            longitude={place.longitude}
            latitude={place.latitude}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              onPlaceSelect(place.id);
            }}
          >
            <div className={`
              marker-container 
              transition-all 
              duration-300 
              transform 
              ${isSelected ? 'scale-125' : 'scale-100'}
              cursor-pointer
            `}>
              <div 
                className={`
                  w-8 h-8 
                  rounded-full 
                  flex items-center justify-center
                  shadow-md
                  ${isSelected ? 'ring-2 ring-white' : ''}
                `}
                style={{ backgroundColor: color }}
              >
                {place.category && getCategoryIcon(place.category, 'w-4 h-4 text-white')}
              </div>
              <div 
                className="w-2 h-2 
                  bg-white 
                  rotate-45 
                  absolute 
                  -bottom-1 
                  left-1/2 
                  transform 
                  -translate-x-1/2"
              ></div>
            </div>
          </Marker>
        );
      })}
      
      {/* Popup for selected place */}
      {popupInfo && (
        <Popup
          anchor="bottom"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => setPopupInfo(null)}
          closeButton={false}
          closeOnClick={false}
          className="map-popup"
        >
          <div className="p-2 max-w-xs">
            <h3 className="font-bold text-sm">{popupInfo.name}</h3>
            {popupInfo.address && (
              <p className="text-xs text-gray-600 mt-1">{popupInfo.address}</p>
            )}
            {popupInfo.distance && (
              <p className="text-xs font-medium mt-1">
                {popupInfo.distance.toFixed(1)} {distanceUnit}
              </p>
            )}
          </div>
        </Popup>
      )}
    </Map>
  );
};
