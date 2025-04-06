import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import type { Result } from '../ResultsList';
import RouteLayer from './RouteLayer';
import useMapMarkers from '@/hooks/useMapMarkers';
import useMapBounds from '@/hooks/useMapBounds';
import { getColorForResult } from '@/utils/mapColors';
import { getTransportModeColor } from '@/data/transportModes';

export interface MapMarkersProps {
  map: mapboxgl.Map | null;
  places?: any[];
  results?: Result[];
  center: [number, number];
  transportMode?: string;
  onMarkersReady?: () => void;
  showRoutes?: boolean;
  selectedPlaceId?: string;
  selectedResultId?: string;
  onResultClick?: (result: Result) => void;
  popupInfo?: any;
  setPopupInfo?: (info: any) => void;
  handleMarkerClick?: (place: any) => void;
  userLocation?: [number, number];
}

const MapMarkers: React.FC<MapMarkersProps> = ({ 
  map, 
  results = [], 
  places = [],
  center,
  transportMode = 'driving',
  onMarkersReady,
  showRoutes = false,
  selectedResultId,
  selectedPlaceId,
  onResultClick,
  popupInfo,
  setPopupInfo,
  handleMarkerClick,
  userLocation
}) => {
  const navigate = useNavigate();
  const [mapReady, setMapReady] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null);

  // Use results if provided, otherwise use places
  const itemsToDisplay = results.length > 0 ? results : places;

  // Vérifier quand la carte est prête à recevoir des marqueurs
  useEffect(() => {
    if (!map) return;
    
    const checkMapReady = () => {
      if (map.isStyleLoaded() && map.getContainer()) {
        console.log("Map is ready for markers");
        setMapReady(true);
      } else {
        console.log("Map not ready yet, waiting...");
        setTimeout(checkMapReady, 100);
      }
    };
    
    const handleStyleLoad = () => {
      console.log("Style loaded event triggered");
      checkMapReady();
    };
    
    map.on('load', handleStyleLoad);
    map.on('style.load', handleStyleLoad);
    
    // Vérification initiale
    checkMapReady();
    
    return () => {
      map.off('load', handleStyleLoad);
      map.off('style.load', handleStyleLoad);
    };
  }, [map]);
  
  // Utiliser des hooks personnalisés pour la gestion des marqueurs et des limites
  const { markers, popups } = useMapMarkers({
    map,
    results,
    mapReady,
    selectedResultId,
    onResultClick
  });
  
  useMapBounds({
    map,
    results,
    center,
    mapReady,
    onMarkersReady
  });

  // Créer et mettre à jour le marqueur de position utilisateur
  useEffect(() => {
    if (!map || !mapReady) return;
    
    // Supprimer le marqueur existant s'il y en a un
    if (userMarker) {
      userMarker.remove();
    }
    
    // Créer un élément HTML personnalisé pour le marqueur utilisateur
    const el = document.createElement('div');
    el.className = 'user-location-marker';
    el.innerHTML = `
      <div class="relative">
        <div class="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-ping"></div>
        <div class="relative bg-blue-500 border-2 border-white w-4 h-4 rounded-full"></div>
      </div>
    `;
    
    // Créer le nouveau marqueur à l'emplacement du centre
    const marker = new mapboxgl.Marker(el)
      .setLngLat(center)
      .addTo(map);
    
    setUserMarker(marker);
    
    // Nettoyer le marqueur au démontage
    return () => {
      marker.remove();
    };
  }, [map, mapReady, center]);

  // Animation quand un résultat est sélectionné
  useEffect(() => {
    if (selectedResultId && map) {
      // Trouver le résultat sélectionné
      const selectedResult = results.find(r => r.id === selectedResultId);
      if (selectedResult) {
        setAnimating(true);
        
        // Zoom et vol vers la sélection avec animation
        map.flyTo({
          center: [selectedResult.longitude, selectedResult.latitude],
          zoom: 14,
          speed: 1,
          curve: 1.5,
          essential: true
        });
        
        // Réinitialiser l'état d'animation après la transition
        setTimeout(() => {
          setAnimating(false);
        }, 1500);
      }
    }
  }, [selectedResultId, map, results]);

  // Obtenir la couleur du mode de transport pour les itinéraires
  const transportModeColor = getTransportModeColor(transportMode);

  // Affichage des itinéraires pour le résultat sélectionné ou tous les résultats
  const routesToShow = selectedResultId 
    ? results.filter(r => r.id === selectedResultId)
    : (showRoutes ? results : []);

  // Gérer le début de la navigation
  const handleStartNavigation = (result: Result) => {
    navigate('/navigation', {
      state: {
        start: center,
        end: [result.longitude, result.latitude],
        placeName: result.name,
        transportMode: transportMode
      }
    });
  };

  // Ajouter le gestionnaire de démarrage de navigation à chaque popup
  useEffect(() => {
    if (!mapReady) return;

    // Ajouter des écouteurs d'événements à tous les boutons "Démarrer la navigation" dans les popups
    const addNavigationListeners = () => {
      document.querySelectorAll('.start-navigation-btn').forEach(btn => {
        const resultId = btn.getAttribute('data-id');
        if (resultId) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const result = results.find(r => r.id === resultId);
            if (result) {
              handleStartNavigation(result);
            }
          });
        }
      });
    };

    // Exécuter initialement et chaque fois que les popups changent
    addNavigationListeners();

    // Vérifier les nouveaux popups toutes les secondes (puisqu'ils sont créés dynamiquement)
    const interval = setInterval(addNavigationListeners, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [mapReady, results, center, transportMode]);

  return (
    <>
      {mapReady && routesToShow.map((result) => (
        <React.Fragment key={result.id}>
          {map && (
            <RouteLayer
              map={map}
              start={center}
              end={[result.longitude, result.latitude]}
              color={getColorForResult(result.color)}
              transportMode={transportMode}
              placeName={result.name}
              showDistance={true}
              showDuration={true}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default MapMarkers;
