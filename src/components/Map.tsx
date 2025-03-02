
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
  const routesRef = useRef<mapboxgl.Map[]>([]);
  const circleRef = useRef<any>(null);
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

      // Si la source existe déjà, mettre à jour les données
      if (map.current.getSource(`route-${color}`)) {
        const source = map.current.getSource(`route-${color}`) as mapboxgl.GeoJSONSource;
        source.setData(geojson as any);
      } else {
        // Sinon, ajouter une nouvelle source et une nouvelle couche
        map.current.addSource(`route-${color}`, {
          type: 'geojson',
          data: geojson as any
        });

        map.current.addLayer({
          id: `route-${color}`,
          type: 'line',
          source: `route-${color}`,
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
    if (!map.current) return;

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
      
      // Créer un point central
      const point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: center
        },
        properties: {}
      };
      
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
            radius: radiusInMeters
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
      
      // Mettre à jour les propriétés de la source
      if (map.current.getSource('radius-circle')) {
        const source = map.current.getSource('radius-circle') as mapboxgl.GeoJSONSource;
        const data = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center
          },
          properties: {
            radius: radiusInMeters,
            lat: center[1]
          }
        };
        source.setData(data as any);
      }
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
            radius: estimatedRadius
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
          'circle-stroke-width': 2,
          'circle-stroke-color': '#f97316', // Orange pour la durée
          'circle-stroke-opacity': 0.8,
          'circle-stroke-dasharray': [2, 2], // Ligne pointillée pour la durée
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
          'circle-opacity': 0.1,
          'circle-pitch-scale': 'map',
          'circle-pitch-alignment': 'map'
        }
      });
      
      // Mettre à jour les propriétés de la source
      if (map.current.getSource('radius-circle')) {
        const source = map.current.getSource('radius-circle') as mapboxgl.GeoJSONSource;
        const data = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center
          },
          properties: {
            radius: estimatedRadius,
            lat: center[1]
          }
        };
        source.setData(data as any);
      }
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

      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      setIsMapInitialized(true);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [mapContainer, center, isMapInitialized]);

  // Effectuer le dessin du rayon
  useEffect(() => {
    if (!map.current || !isMapInitialized) return;
    drawRadiusCircle();
  }, [radius, radiusUnit, radiusType, duration, timeUnit, transportMode, center, isMapInitialized]);

  useEffect(() => {
    if (!map.current || !isMapInitialized) return;

    // Clear existing markers and routes
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    routesRef.current.forEach((route: any) => {
      if (map.current?.getLayer(route)) {
        map.current.removeLayer(route);
        map.current.removeSource(route);
      }
    });
    routesRef.current = [];

    // Add new markers and routes
    results.forEach((result, index) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.innerHTML = `<div class="bg-white rounded-full p-2 shadow-lg">
        <span class="font-bold">${index + 1}</span>
      </div>`;
      el.style.width = '30px';
      el.style.height = '30px';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([result.longitude, result.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <h3 class="font-bold">${result.name}</h3>
              <p>${result.address}</p>
              <p class="text-sm text-gray-500">${result.distance.toFixed(1)} km - ${result.duration} min</p>
            `)
        )
        .addTo(map.current);

      markersRef.current.push(marker);

      // Add route from center to this result
      addRoute(center, [result.longitude, result.latitude], result.color);
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
