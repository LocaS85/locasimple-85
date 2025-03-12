
import { useEffect } from 'react';
import { toast } from 'sonner';
import { generateFilteredMockResults } from '@/data/mockSearchResults';

interface UseSearchInitializationProps {
  userLocation: [number, number];
  resultsCount: number;
  setUserLocation: (location: [number, number]) => void;
  setIsLocationActive: (isActive: boolean) => void;
  setSearchResults: (results: any[]) => void;
}

export const useSearchInitialization = ({
  userLocation,
  resultsCount,
  setUserLocation,
  setIsLocationActive,
  setSearchResults
}: UseSearchInitializationProps) => {
  
  useEffect(() => {
    // Initialize geolocation if available
    if (navigator.geolocation) {
      navigator.permissions && navigator.permissions.query({name: 'geolocation'})
        .then(permission => {
          if (permission.state === 'granted') {
            toast.info('Accès à la géolocalisation accordé');
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setUserLocation([position.coords.longitude, position.coords.latitude]);
                setIsLocationActive(true);
              },
              (error) => {
                console.error('Error getting location:', error);
              }
            );
          } else if (permission.state === 'prompt') {
            toast.info('Cliquez sur "Ma position" pour activer la géolocalisation');
          } else if (permission.state === 'denied') {
            toast.error('Accès à la géolocalisation refusé. Veuillez l\'activer dans vos paramètres');
          }
          
          permission.addEventListener('change', () => {
            if (permission.state === 'granted') {
              toast.success('Accès à la géolocalisation accordé');
            } else if (permission.state === 'denied') {
              toast.error('Accès à la géolocalisation refusé');
              setIsLocationActive(false);
            }
          });
        })
        .catch(error => {
          console.error('Error checking geolocation permission:', error);
        });
    }
    
    // Initialize with some default results
    const initialResults = generateFilteredMockResults('', userLocation, {}, resultsCount);
    setSearchResults(initialResults);
  }, []);
  
  return {};
};

export default useSearchInitialization;
