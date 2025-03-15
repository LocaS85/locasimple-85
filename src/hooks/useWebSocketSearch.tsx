
import { useState, useEffect, useCallback } from 'react';
import { Result } from '@/components/ResultsList';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

interface UseWebSocketSearchProps {
  userLocation: [number, number];
  enabled?: boolean;
}

interface SearchParams {
  category?: string | null;
  distance?: number | null;
  distanceUnit?: 'km' | 'miles';
  duration?: number | null;
  transportMode?: string;
}

export const useWebSocketSearch = ({
  userLocation,
  enabled = false
}: UseWebSocketSearchProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');
  const [lastParams, setLastParams] = useState<SearchParams>({});

  // Initialisation de la connexion WebSocket ou simulation via API
  useEffect(() => {
    if (!enabled) return;

    // Dans une vraie application, nous connecterions à un WebSocket
    // Pour l'instant, nous allons simuler cela en utilisant un état "connecté"
    console.log('Web Socket search would initialize here in a real app');
    
    // Simuler l'état connecté
    setConnected(true);
    
    return () => {
      // Fonction de nettoyage
      setConnected(false);
      if (socket) {
        socket.close();
      }
    };
  }, [enabled]);

  // Fonction pour effectuer une recherche de lieux proches
  const search = useCallback(async (query: string, params: SearchParams = {}) => {
    if (!connected) {
      console.log('WebSocket not connected, cannot perform real-time search');
      return;
    }
    
    // Stocker la dernière requête et paramètres
    setLastQuery(query);
    setLastParams(params);
    
    console.log(`WebSocket would search for "${query}" with params:`, params);
    
    // En attendant une vraie implémentation WebSocket, on utilise l'API Mapbox
    if (MAPBOX_TOKEN && userLocation) {
      try {
        // Construire l'URL avec tous les paramètres pertinents
        let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?`;
        
        // Ajouter les paramètres
        const searchParams = new URLSearchParams({
          access_token: MAPBOX_TOKEN,
          limit: '10',
          language: 'fr',
          types: 'poi,address,place',
          proximity: `${userLocation[0]},${userLocation[1]}` // Prioriser les résultats proches
        });
        
        // Ajouter la catégorie si spécifiée
        if (params.category) {
          searchParams.append('categories', params.category);
        }
        
        // Si une distance est spécifiée, l'ajouter comme limite (approximative)
        if (params.distance) {
          const radiusInKm = params.distance * (params.distanceUnit === 'miles' ? 1.60934 : 1);
          // Note: Mapbox n'a pas de paramètre de rayon direct, mais on peut le simuler avec le bias
          searchParams.append('proximity_bias', 'true');
        }
        
        url += searchParams.toString();
        
        // Effectuer la requête
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          // Transformer les résultats au format interne
          const newResults: Result[] = data.features.map((feature: any, index: number) => {
            // Calculer la distance approximative (Mapbox ne fournit pas la distance directement)
            const [longitude, latitude] = feature.center;
            
            return {
              id: feature.id || `result-${index}`,
              name: feature.text || feature.place_name.split(',')[0],
              address: feature.place_name,
              latitude,
              longitude,
              category: feature.properties?.category || 'other',
              distanceInMeters: calculateDistanceInMeters(
                userLocation[1], userLocation[0],
                latitude, longitude
              ),
              durationInSeconds: params.transportMode 
                ? estimateTravelTime(calculateDistanceInMeters(
                    userLocation[1], userLocation[0], 
                    latitude, longitude
                  ), params.transportMode)
                : undefined,
              // Convertir pour affichage
              distance: Math.round(calculateDistanceInMeters(
                userLocation[1], userLocation[0],
                latitude, longitude
              ) / 100) / 10, // Convertir en km avec 1 décimale
              duration: params.transportMode 
                ? Math.round(estimateTravelTime(calculateDistanceInMeters(
                    userLocation[1], userLocation[0], 
                    latitude, longitude
                  ), params.transportMode) / 60) // Convertir secondes en minutes
                : undefined
            };
          });
          
          console.log(`Real-time search found ${newResults.length} results`);
          setResults(newResults);
        } else {
          console.log('No real-time results found');
          setResults([]);
        }
      } catch (error) {
        console.error('Error in real-time search:', error);
        setError('Erreur lors de la recherche en temps réel');
      }
    } else {
      // Simuler une réponse pour les tests
      setTimeout(() => {
        const simulatedResults: Result[] = Array(5).fill(0).map((_, i) => ({
          id: `simulated-${i}`,
          name: `${query} - Résultat ${i+1}`,
          latitude: userLocation[1] + (Math.random() - 0.5) * 0.02,
          longitude: userLocation[0] + (Math.random() - 0.5) * 0.02,
          distance: Math.round(Math.random() * 30) / 10,
          duration: Math.round(Math.random() * 15)
        }));
        
        setResults(simulatedResults);
        console.log('Simulated real-time results:', simulatedResults);
      }, 300);
    }
  }, [connected, userLocation]);

  // Fonction utilitaire pour calculer la distance approximative
  const calculateDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // rayon de la Terre en mètres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // distance en mètres
  };

  // Fonction pour estimer le temps de trajet en fonction du mode de transport
  const estimateTravelTime = (distanceInMeters: number, transportMode: string): number => {
    // Vitesses moyennes approximatives en m/s
    const speeds: Record<string, number> = {
      'driving': 13.9, // ~50 km/h
      'walking': 1.4,  // ~5 km/h
      'cycling': 4.2,  // ~15 km/h
      'driving-traffic': 8.3, // ~30 km/h (avec trafic)
      'transit': 8.3   // ~30 km/h (moyenne bus/métro)
    };
    
    const speed = speeds[transportMode] || speeds['driving'];
    return distanceInMeters / speed; // temps en secondes
  };

  // Mise à jour automatique quand la position change
  useEffect(() => {
    if (connected && lastQuery && userLocation) {
      // Si l'utilisateur a déjà effectué une recherche et que sa position change
      // on met à jour les résultats en fonction de sa nouvelle position
      search(lastQuery, lastParams);
    }
  }, [userLocation, connected]);

  return {
    connected,
    search,
    results,
    error
  };
};

export default useWebSocketSearch;
