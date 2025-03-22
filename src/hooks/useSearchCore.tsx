
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { mapboxService } from '@/services/mapboxService';

// Core search state without UI-specific logic
export const useSearchCore = () => {
  const [places, setPlaces] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [transportMode, setTransportMode] = useState('driving');
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  const [resultsCount, setResultsCount] = useState<number>(5);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Search function that connects to the Flask API
  const performSearch = useCallback(async (query: string = searchQuery) => {
    if (!query.trim()) {
      toast.error('Veuillez entrer une recherche');
      return;
    }

    setLoading(true);
    try {
      // Connect to Flask API for search
      const response = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(query)}&mode=${transportMode}&lat=${userLocation[1]}&lon=${userLocation[0]}&limit=${resultsCount}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }
      
      const results = await response.json();
      console.log('API search results:', results);
      
      // Transform to Place objects
      const searchResults = results.map((result: any, index: number) => ({
        id: `place-${index}`,
        name: result.name,
        lat: result.lat,
        lon: result.lon,
        duration: result.duration,
        distance: result.distance
      }));
      
      setPlaces(searchResults);
      setSearchPerformed(true);
      
      if (searchResults.length === 0) {
        toast.info('Aucun résultat trouvé');
      } else {
        toast.success(`${searchResults.length} résultats trouvés`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Erreur lors de la recherche. Vérifiez que le serveur Flask est en cours d\'exécution.');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, transportMode, userLocation, resultsCount]);

  // PDF generation function
  const generatePDF = useCallback(async () => {
    if (places.length === 0) {
      toast.error('Aucun résultat à exporter');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/generate_pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ places }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la génération du PDF');
      }
      
      const result = await response.json();
      toast.success('PDF généré avec succès');
      console.log('PDF result:', result);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setLoading(false);
    }
  }, [places]);

  return {
    places,
    setPlaces,
    searchQuery,
    setSearchQuery,
    loading,
    setLoading,
    transportMode,
    setTransportMode,
    userLocation,
    setUserLocation,
    resultsCount,
    setResultsCount,
    searchPerformed,
    setSearchPerformed,
    performSearch,
    generatePDF
  };
};

export default useSearchCore;
