
import { useState, useEffect, useCallback } from 'react';
import { useMapboxRoutes, TransportMode } from '@/hooks/useMapboxRoutes';
import { Result } from '@/components/ResultsList';
import { toast } from 'sonner';

interface UseRouteDisplayProps {
  userLocation?: [number, number];
  searchResults: Result[];
  selectedResultId?: string;
  transportMode: string;
}

export const useRouteDisplay = ({
  userLocation,
  searchResults,
  selectedResultId,
  transportMode
}: UseRouteDisplayProps) => {
  const {
    from,
    setFrom,
    to,
    setTo,
    routes,
    activeMode,
    setActiveMode,
    calculateAllRoutes,
    loading
  } = useMapboxRoutes();

  const [alternativeRoutes, setAlternativeRoutes] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [savedRoutes, setSavedRoutes] = useState<any[]>([]);

  // Mise à jour des coordonnées from/to lorsque userLocation ou le résultat sélectionné change
  useEffect(() => {
    if (userLocation) {
      setFrom(userLocation);
    }
  }, [userLocation, setFrom]);

  useEffect(() => {
    if (selectedResultId) {
      const selectedResult = searchResults.find(
        r => r.id === selectedResultId
      );
      if (selectedResult) {
        setTo([selectedResult.longitude, selectedResult.latitude]);
      }
    }
  }, [selectedResultId, searchResults, setTo]);

  // Calculer les itinéraires lorsque from et to sont définis
  useEffect(() => {
    if (from && to && selectedResultId) {
      calculateAllRoutes();
    }
  }, [from, to, selectedResultId, transportMode, calculateAllRoutes]);

  // Récupérer les itinéraires alternatifs
  const fetchAlternativeRoutes = useCallback(async () => {
    if (!from || !to) return;
    
    try {
      // Code pour récupérer des itinéraires alternatifs
      // Dans une implémentation réelle, on ferait appel à Mapbox Directions API
      // avec le paramètre alternatives=true
      
      // Pour l'instant, simulons avec des données d'exemple
      const mockAlternatives = [
        {
          id: 'alt-1',
          name: 'Itinéraire principal',
          distance: routes[activeMode].distance,
          duration: routes[activeMode].duration,
          description: 'Le plus rapide'
        },
        {
          id: 'alt-2',
          name: 'Itinéraire alternatif',
          distance: routes[activeMode].distance * 1.1, // Légèrement plus long
          duration: routes[activeMode].duration * 1.2,
          description: 'Moins de trafic'
        },
        {
          id: 'alt-3',
          name: 'Itinéraire économique',
          distance: routes[activeMode].distance * 1.05,
          duration: routes[activeMode].duration * 1.15,
          description: 'Sans péage'
        }
      ];
      
      setAlternativeRoutes(mockAlternatives);
      setSelectedRoute(mockAlternatives[0]);
    } catch (error) {
      console.error('Erreur lors de la récupération des itinéraires alternatifs:', error);
      toast.error('Impossible de récupérer les itinéraires alternatifs');
    }
  }, [from, to, routes, activeMode]);

  // Charger les itinéraires alternatifs lorsqu'un itinéraire est calculé
  useEffect(() => {
    if (routes[activeMode]?.geometry && from && to) {
      fetchAlternativeRoutes();
    }
  }, [routes, activeMode, from, to, fetchAlternativeRoutes]);

  // Fonction pour enregistrer un itinéraire
  const saveRoute = useCallback((route: any, mode: string) => {
    const selectedResult = searchResults.find(r => r.id === selectedResultId);
    if (!selectedResult) return;
    
    const savedRoute = {
      id: `saved-${Date.now()}`,
      destination: selectedResult.name,
      mode,
      distance: route.distance,
      duration: route.duration,
      start: from,
      end: to,
      date: new Date().toISOString()
    };
    
    setSavedRoutes(prev => {
      const newSavedRoutes = [...prev, savedRoute];
      // Stocker en localStorage
      try {
        localStorage.setItem('saved_routes', JSON.stringify(newSavedRoutes));
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement des itinéraires:', error);
      }
      return newSavedRoutes;
    });
    
    toast.success(`Itinéraire vers ${selectedResult.name} enregistré`);
  }, [from, to, selectedResultId, searchResults]);

  // Charger les itinéraires enregistrés depuis localStorage au montage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('saved_routes');
      if (saved) {
        setSavedRoutes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des itinéraires enregistrés:', error);
    }
  }, []);

  return {
    from,
    to,
    routes,
    activeMode,
    setActiveMode,
    alternativeRoutes,
    selectedRoute,
    setSelectedRoute,
    saveRoute,
    savedRoutes,
    loading
  };
};

export default useRouteDisplay;
