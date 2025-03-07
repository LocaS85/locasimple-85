
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationContainer from '@/components/navigation/NavigationContainer';
import { toast } from 'sonner';
import { MAPBOX_TOKEN } from '@/config/environment';

const NavigationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    start: [number, number];
    end: [number, number];
    placeName: string;
    transportMode: string;
  } | null;

  useEffect(() => {
    // Verify Mapbox token on component mount
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === '') {
      toast.error('Token Mapbox manquant. La navigation ne fonctionnera pas correctement.');
    } 
    
    // Verify navigation data
    if (!state || !state.start || !state.end) {
      toast.error('Données de navigation manquantes');
      navigate('/search');
    }
  }, [state, navigate]);

  const handleBack = () => {
    navigate('/search');
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {state ? (
        <NavigationContainer
          start={state.start}
          end={state.end}
          placeName={state.placeName}
          transportMode={state.transportMode}
          onBack={handleBack}
        />
      ) : (
        <div className="flex-grow flex items-center justify-center text-white">
          <p>Données de navigation manquantes</p>
        </div>
      )}
    </div>
  );
};

export default NavigationPage;
