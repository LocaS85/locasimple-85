
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { MAPBOX_TOKEN } from '@/config/environment';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ResultsCountPopover } from '@/components/search/ResultsCountPopover';
import { DurationFilter } from '@/components/search/DurationFilter';
import { DistanceFilter } from '@/components/search/DistanceFilter';

interface Place {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

const SearchPage = () => {
  const { t } = useLanguage();
  const [places, setPlaces] = useState<Place[]>([]);
  const [resultsCount, setResultsCount] = useState<number>(5);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(15);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(5);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [viewport, setViewport] = useState({
    latitude: 48.8566, // Paris par défaut
    longitude: 2.3522,
    zoom: 12
  });

  useEffect(() => {
    // Vérifier le token Mapbox
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === '') {
      toast.error('Token Mapbox manquant. La carte ne fonctionnera pas correctement.');
    } else {
      console.log('SearchPage loaded with Mapbox token available');
      
      // Simuler la récupération des lieux selon une catégorie
      setPlaces([
        { id: '1', name: "Restaurant A", lat: 48.857, lon: 2.353 },
        { id: '2', name: "Restaurant B", lat: 48.858, lon: 2.354 },
        { id: '3', name: "Café C", lat: 48.856, lon: 2.351 },
        { id: '4', name: "Magasin D", lat: 48.855, lon: 2.356 },
        { id: '5', name: "Bar E", lat: 48.859, lon: 2.358 },
      ]);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="p-4 flex justify-between items-center bg-white shadow-sm z-10">
        <h1 className="text-xl font-bold">{t('search')}</h1>
        <div className="flex gap-2">
          <ResultsCountPopover 
            resultsCount={resultsCount} 
            onResultsCountChange={setResultsCount} 
          />
          <DurationFilter 
            selectedDuration={selectedDuration} 
            onDurationChange={setSelectedDuration} 
          />
          <DistanceFilter 
            selectedDistance={selectedDistance} 
            distanceUnit={distanceUnit} 
            onDistanceChange={setSelectedDistance} 
            onDistanceUnitChange={setDistanceUnit} 
          />
        </div>
      </div>
      
      <div className="flex-grow relative">
        {MAPBOX_TOKEN ? (
          <Map
            initialViewState={viewport}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            onMove={evt => setViewport(evt.viewState)}
          >
            {places.slice(0, resultsCount).map((place) => (
              <Marker 
                key={place.id} 
                latitude={place.lat} 
                longitude={place.lon} 
                anchor="bottom"
              >
                <div className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm shadow-md">
                  {place.name}
                </div>
              </Marker>
            ))}
          </Map>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <p className="text-red-500">{t('mapbox_token_missing')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
