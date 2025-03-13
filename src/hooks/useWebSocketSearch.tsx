
import { useState, useEffect, useCallback } from 'react';
import { websocketService } from '@/services/websocketService';
import type { Result } from '@/components/ResultsList';
import { toast } from 'sonner';

interface UseWebSocketSearchProps {
  userLocation?: [number, number];
  enabled?: boolean;
}

export const useWebSocketSearch = ({
  userLocation,
  enabled = true
}: UseWebSocketSearchProps = {}) => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialiser la connexion WebSocket
  useEffect(() => {
    if (!enabled) return;
    
    const initWebSocket = async () => {
      try {
        // Dans un environnement de production, vous connecteriez à un vrai serveur WebSocket
        // Pour cette démo, nous simulons un serveur WebSocket avec un fallback
        const wsUrl = 'wss://echo.websocket.org'; // Service d'écho pour tester
        const isConnected = await websocketService.connect(wsUrl);
        
        if (isConnected) {
          setConnected(true);
          toast.success('Connexion en temps réel établie');
        } else {
          console.log('WebSocket connection failed, using fallback');
          setError('Connexion WebSocket non disponible, utilisation du mode standard');
        }
      } catch (error) {
        console.error('Error initializing WebSocket:', error);
        setError('Erreur de connexion au serveur en temps réel');
      }
    };
    
    initWebSocket();
    
    return () => {
      websocketService.disconnect();
    };
  }, [enabled]);

  // S'abonner aux mises à jour de résultats
  useEffect(() => {
    if (!enabled || !connected) return;
    
    const handleSearchResults = (data: any) => {
      if (Array.isArray(data)) {
        setResults(data);
        setLoading(false);
      }
    };
    
    websocketService.on('search_results', handleSearchResults);
    
    return () => {
      websocketService.off('search_results', handleSearchResults);
    };
  }, [connected, enabled]);

  // Fonction pour effectuer une recherche via WebSocket
  const search = useCallback((query: string, filters: any = {}) => {
    setLoading(true);
    setError(null);
    
    if (connected) {
      // Envoyer la requête via WebSocket
      const success = websocketService.send('search_request', {
        query,
        filters,
        location: userLocation,
      });
      
      if (!success) {
        // Fallback en cas d'échec d'envoi
        simulateSearch(query, filters);
      }
    } else {
      // Utiliser le fallback si WebSocket n'est pas connecté
      simulateSearch(query, filters);
    }
  }, [connected, userLocation]);

  // Fonction de fallback pour simuler une recherche sans WebSocket
  const simulateSearch = useCallback((query: string, filters: any = {}) => {
    setLoading(true);
    
    // Simuler un délai réseau
    setTimeout(() => {
      // Générer des résultats factices basés sur la requête
      const mockResults: Result[] = Array.from({ length: 5 }, (_, i) => ({
        id: `result-${i}-${Date.now()}`,
        name: `${query} Résultat ${i + 1}`,
        address: `Adresse du résultat ${i + 1}`,
        distance: Math.random() * 10,
        duration: Math.floor(Math.random() * 60),
        category: ['restaurants', 'commerces', 'services'][Math.floor(Math.random() * 3)] || 'autre',
        color: ['blue', 'green', 'red', 'purple'][Math.floor(Math.random() * 4)] || 'blue',
        latitude: userLocation ? userLocation[1] + (Math.random() - 0.5) * 0.1 : 48.8566 + (Math.random() - 0.5) * 0.1,
        longitude: userLocation ? userLocation[0] + (Math.random() - 0.5) * 0.1 : 2.3522 + (Math.random() - 0.5) * 0.1,
        description: `Description générée pour ${query}`,
      }));
      
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, [userLocation]);

  return {
    connected,
    loading,
    results,
    error,
    search,
  };
};

export default useWebSocketSearch;
