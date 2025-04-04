
import { useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config/environment';
import type { Result } from '@/components/ResultsList';

export const useResultHandling = (
  places: Result[],
  setSelectedPlaceId: (id: string | null) => void,
  setPopupInfo: (info: any | null) => void,
  setViewport: (viewport: any) => void,
  setLoading: (loading: boolean) => void,
  setShowRoutes: (show: boolean) => void
) => {
  // Category handling
  const handleCategoryToggle = useCallback((category: string) => {
    // This will be implemented in the main hook to maintain state reference
  }, []);

  const clearFilters = useCallback(() => {
    // This will be implemented in the main hook to maintain state reference
    toast.info('Tous les filtres ont été effacés');
  }, []);

  // Result handling
  const handleResultClick = useCallback((place: any) => {
    setSelectedPlaceId(place.id);
    setPopupInfo(place);
    setViewport({
      latitude: place.lat,
      longitude: place.lon,
      zoom: 14
    });
  }, [setSelectedPlaceId, setPopupInfo, setViewport]);

  // PDF Generation
  const generatePDF = useCallback(async () => {
    if (places.length === 0) {
      toast.error('Aucun résultat à exporter');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/generate_pdf`, { places });
      toast.success('PDF généré avec succès');
      
      window.open('resultats.pdf');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setLoading(false);
    }
  }, [places, setLoading]);

  // Routes display toggle
  const toggleRoutes = useCallback(() => {
    setShowRoutes(prev => !prev);
  }, [setShowRoutes]);

  return {
    handleCategoryToggle,
    clearFilters,
    handleResultClick,
    generatePDF,
    toggleRoutes
  };
};

export default useResultHandling;
