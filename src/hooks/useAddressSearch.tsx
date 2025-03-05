
import { toast } from 'sonner';
import { MAPBOX_TOKEN } from '@/config/environment';

interface UseAddressSearchProps {
  setLoading: (loading: boolean) => void;
  setIsLocationActive: (active: boolean) => void;
  setUserLocation: (location: [number, number]) => void;
}

export const useAddressSearch = ({
  setLoading,
  setIsLocationActive,
  setUserLocation,
}: UseAddressSearchProps) => {
  const searchAddress = async (address: string) => {
    if (!address.trim()) {
      toast.error('Veuillez entrer une adresse');
      return;
    }
    
    if (!MAPBOX_TOKEN) {
      toast.error('Configuration manquante pour la recherche d\'adresse');
      console.error('Missing Mapbox token for address search');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1`);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        setUserLocation([longitude, latitude]);
        setIsLocationActive(true);
        toast.success('Adresse trouvée');
      } else {
        toast.error('Adresse non trouvée');
      }
    } catch (error) {
      console.error('Error searching address:', error);
      toast.error('Erreur lors de la recherche d\'adresse');
    } finally {
      setLoading(false);
    }
  };

  return { searchAddress };
};

export default useAddressSearch;
