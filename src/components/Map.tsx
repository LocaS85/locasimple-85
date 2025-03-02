
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Result } from './ResultsList';

interface MapProps {
  results: Result[];
  center: [number, number];
  radius?: number;
  radiusUnit?: 'km' | 'miles';
  radiusType?: 'distance' | 'duration';
  duration?: number;
  timeUnit?: 'minutes' | 'hours';
  transportMode?: string;
}

const Map = ({ 
  results, 
  center, 
  radius = 5, 
  radiusUnit = 'km', 
  radiusType = 'distance',
  duration = 15,
  timeUnit = 'minutes',
  transportMode = 'driving'
}: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const routesRef = useRef<string[]>([]);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  
  // Token Mapbox intégré directement
  const mapboxToken = 'pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbTdwMTZmZXAwZ3Q4MmtyM3U1bG8weng3In0.38X4Wh5p8tTmfNQj1rqutw';

  const addRoute = async (start: [number, number], end: [number, number], color: string) => {
    if (!map.current || !mapboxToken) return;

    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxToken}`
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };

      const sourceId = `route-${color}`;
      const layerId = `route-${color}`;

      // Si la source existe déjà, mettre à jour les données
      if (map.current.getSource(sourceId)) {
        const source = map.current.getSource(sourceId) as mapboxgl.GeoJSONSource;
        source.setData(geojson as any);
      } else {
        // Sinon, ajouter une nouvelle source et une nouvelle couche
        map.current.addSource(sourceId, {
          type: 'geojson',
          data: geojson as any
        });

        map.current.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': color,
            'line-width': 4,
            'line-opacity': 0.75
          }
        });

        // Ajouter l'ID de la couche à routesRef pour le nettoyage
        routesRef.current.push(layerId);
      }
    } catch (error) {
      console.error('Error adding route:', error);
    }
  };

  // Convertir km en mètres pour le rayon
  const getRadiusInMeters = () => {
    const radiusValue = radius;
    // Convertir en mètres
    if (radiusUnit === 'km') {
      return radiusValue * 1000;
    } else {
      // Miles en mètres (1 mile = 1609.34 mètres)
      return radiusValue * 1609.34;
    }
  };

  // Dessiner le cercle de rayon
  const drawRadiusCircle = () => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // Supprimer l'ancien cercle s'il existe
    if (map.current.getSource('radius-circle')) {
      if (map.current.getLayer('radius-circle-fill')) {
        map.current.removeLayer('radius-circle-fill');
      }
      if (map.current.getLayer('radius-circle-outline')) {
        map.current.removeLayer('radius-circle-outline');
      }
      map.current.removeSource('radius-circle');
    }

    // Si type distance, afficher un cercle normal
    if (radiusType === 'distance') {
      // Créer un cercle avec turf.js
      const radiusInMeters = getRadiusInMeters();
      
      // Ajouter le cercle comme une source GeoJSON
      map.current.addSource('radius-circle', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center
          },
          properties: {
            radius: radiusInMeters,
            lat: center[1]
          }
        }
      });
      
      // Ajouter la couche pour le cercle
      map.current.addLayer({
        id: 'radius-circle-outline',
        type: 'circle',
        source: 'radius-circle',
        paint: {
          'circle-radius': ['/', ['get', 'radius'], ['cos', ['*', ['get', 'lat'], 0.0174532925]]],
          'circle-opacity': 0,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#2563eb',
          'circle-stroke-opacity': 0.8,
          'circle-pitch-scale': 'map',
          'circle-pitch-alignment': 'map'
        }
      });
      
      map.current.addLayer({
        id: 'radius-circle-fill',
        type: 'circle',
        source: 'radius-circle',
        paint: {
          'circle-radius': ['/', ['get', 'radius'], ['cos', ['*', ['get', 'lat'], 0.0174532925]]],
          'circle-color': '#2563eb',
          'circle-opacity': 0.1,
          'circle-pitch-scale': 'map',
          'circle-pitch-alignment': 'map'
        }
      });
    } else {
      // Pour la durée, on utiliserait idealement une API isochrone
      // Cette partie serait implémentée avec une API comme l'API Isochrone de Mapbox
      // Pour l'instant, on montre un cercle simplifié avec une couleur différente
      
      // Créer un cercle approximatif basé sur la durée
      // Cette approximation est très simplifiée, en réalité ça dépendrait du réseau routier
      let estimatedRadius;
      
      if (timeUnit === 'minutes') {
        // Estimation très simplifiée: 1 minute ~ 1km en voiture urbaine
        estimatedRadius = (transportMode === 'driving' ? 1000 : 
                          transportMode === 'cycling' ? 300 : 
                          transportMode === 'walking' ? 80 : 800) * duration;
      } else {
        // Pour les heures, multiplier par 60
        estimatedRadius = (transportMode === 'driving' ? 60000 : 
                          transportMode === 'cycling' ? 18000 : 
                          transportMode === 'walking' ? 4800 : 48000) * duration;
      }
      
      // Ajouter le cercle comme une source GeoJSON
      map.current.addSource('radius-circle', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center
          },
          properties: {
            radius: estimatedRadius,
            lat: center[1]
          }
        }
      });
      
      // Ajouter la couche pour le cercle avec une couleur différente pour la durée
      map.current.addLayer({
        id: 'radius-circle-outline',
        type: 'circle',
        source: 'radius-circle',
        paint: {
          'circle-radius': ['/', ['get', 'radius'], ['cos', ['*', ['get', 'lat'], 0.0174532925]]],
          'circle-opacity': 0,
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#f97316', // Orange pour la durée
          'circle-stroke-opacity': 0.8,
          'circle-pitch-scale': 'map',
          'circle-pitch-alignment': 'map'
        }
      });
      
      map.current.addLayer({
        id: 'radius-circle-fill',
        type: 'circle',
        source: 'radius-circle',
        paint: {
          'circle-radius': ['/', ['get', 'radius'], ['cos', ['*', ['get', 'lat'], 0.0174532925]]],
          'circle-color': '#f97316', // Orange pour la durée
          'circle-opacity': 0.15,
          'circle-pitch-scale': 'map',
          'circle-pitch-alignment': 'map'
        }
      });
    }
  };

  // Initialiser la carte automatiquement au chargement du composant
  useEffect(() => {
    if (!mapContainer.current || isMapInitialized) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: center,
        zoom: 13,
      });

      map.current.on('load', () => {
        setIsMapInitialized(true);
        
        // Ajouter les contrôles une fois la carte chargée
        map.current?.addControl(
          new mapboxgl.NavigationControl(),
          'top-right'
        );
        
        // Dessiner le cercle et mettre à jour les marqueurs une fois la carte chargée
        drawRadiusCircle();
        updateMarkersAndRoutes();
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [mapContainer, center]);

  // Effectuer le dessin du rayon quand les paramètres changent
  useEffect(() => {
    if (!map.current || !isMapInitialized) return;
    
    // Attendre que le style soit chargé avant de dessiner le cercle
    if (map.current.isStyleLoaded()) {
      drawRadiusCircle();
    } else {
      map.current.once('style.load', () => {
        drawRadiusCircle();
      });
    }
  }, [radius, radiusUnit, radiusType, duration, timeUnit, transportMode, center, isMapInitialized]);

  // Fonction pour mettre à jour les marqueurs et les routes
  const updateMarkersAndRoutes = () => {
    if (!map.current || !isMapInitialized) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Clean up existing routes
    routesRef.current.forEach((routeId) => {
      if (map.current?.getLayer(routeId)) {
        map.current.removeLayer(routeId);
        map.current.removeSource(routeId.replace('route-', 'source-'));
      }
    });
    routesRef.current = [];

    // Add new markers and routes
    results.forEach((result, index) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.innerHTML = `<div class="bg-white rounded-full p-2 shadow-lg">
        <span class="font-bold text-${result.color}-500">${index + 1}</span>
      </div>`;
      el.style.width = '30px';
      el.style.height = '30px';
      
      // Add popup with details
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${result.name}</h3>
            <p class="text-xs text-gray-500">${result.address}</p>
            <div class="flex items-center gap-2 mt-1 text-xs">
              <span>${result.distance.toFixed(1)} km</span>
              <span>·</span>
              <span>${result.duration} min</span>
            </div>
          </div>
        `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([result.longitude, result.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);

      // Add route from center to this result
      const routeColor = getColorForResult(result.color);
      addRoute(center, [result.longitude, result.latitude], routeColor);
    });

    // Fit bounds to show all markers if there are any
    if (results.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(center);
      results.forEach(result => {
        bounds.extend([result.longitude, result.latitude]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  };

  // Convertir le nom de couleur en valeur hexadécimale
  const getColorForResult = (color: string): string => {
    const colorMap: Record<string, string> = {
      'primary': '#2563eb',
      'red': '#ef4444',
      'green': '#10b981',
      'blue': '#3b82f6',
      'orange': '#f97316',
      'purple': '#8b5cf6',
      'pink': '#ec4899'
    };
    
    return colorMap[color] || '#3b82f6';
  };

  // Mettre à jour les marqueurs et routes quand les résultats changent
  useEffect(() => {
    if (!map.current || !isMapInitialized) return;
    
    // Attendre que le style soit chargé avant de mettre à jour les marqueurs
    if (map.current.isStyleLoaded()) {
      updateMarkersAndRoutes();
    } else {
      map.current.once('style.load', () => {
        updateMarkersAndRoutes();
      });
    }
  }, [results, isMapInitialized, center, transportMode]);

  // Cleanup
  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
    </div>
  );
};

export default Map;
