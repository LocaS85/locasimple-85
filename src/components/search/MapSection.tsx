
import React, { useState, useEffect } from 'react';
import { MapDisplay } from './MapDisplay';
import ResultsPopup from './ResultsPopup';
import ResultDetail from './ResultDetail';
import RouteDisplayContainer from './RouteDisplayContainer';
import NoResultsMessage from './NoResultsMessage';
import MapKeyWarning from './MapKeyWarning';
import CategorySubcategoriesScroller from './map/CategorySubcategoriesScroller';
import { CATEGORIES } from '@/types/categories';

interface MapSectionProps {
  userLocation?: [number, number];
  selectedPlaceId?: string;
  places?: any[];
  loading?: boolean;
  showRoutes?: boolean;
  transportMode?: string;
  selectedCategory?: string | null;
  radiusType?: 'distance' | 'time';
  radius?: number;
  distanceUnit?: 'km' | 'mi';
  onPlaceSelect?: (placeId: string) => void;
  onClosePopup?: () => void;
  showNoMapboxTokenWarning?: boolean;
  onSetMapboxToken?: (token: string) => boolean;
}

export const MapSection = ({
  userLocation,
  selectedPlaceId,
  places = [],
  loading = false,
  showRoutes = false,
  transportMode = 'driving',
  selectedCategory = null,
  radiusType = 'distance',
  radius = 5,
  distanceUnit = 'km',
  onPlaceSelect = () => {},
  onClosePopup = () => {},
  showNoMapboxTokenWarning = false,
  onSetMapboxToken = () => false,
}: MapSectionProps) => {
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  
  useEffect(() => {
    if (selectedPlaceId && places.length > 0) {
      const place = places.find(p => p.id === selectedPlaceId);
      setSelectedPlace(place || null);
    } else {
      setSelectedPlace(null);
    }
  }, [selectedPlaceId, places]);

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategoryId)) {
        return prev.filter(id => id !== subcategoryId);
      } else {
        return [...prev, subcategoryId];
      }
    });
  };

  useEffect(() => {
    setSelectedSubcategories([]);
  }, [selectedCategory]);

  const subcategories = selectedCategory 
    ? CATEGORIES.find(c => c.id === selectedCategory)?.subCategories || []
    : [];

  const handleClearFilters = () => {
    setSelectedSubcategories([]);
  };

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {showNoMapboxTokenWarning ? (
        <MapKeyWarning onSetMapboxToken={onSetMapboxToken} />
      ) : (
        <>
          <MapDisplay
            places={places}
            userLocation={userLocation}
            selectedPlaceId={selectedPlaceId}
            onPlaceSelect={onPlaceSelect}
            loading={loading}
            radiusType={radiusType}
            radius={radius}
            distanceUnit={distanceUnit}
            transportMode={transportMode}
            selectedCategory={selectedCategory}
            selectedSubcategories={selectedSubcategories}
          />
          
          {selectedCategory && subcategories.length > 0 && (
            <CategorySubcategoriesScroller
              subcategories={subcategories}
              selectedSubcategories={selectedSubcategories}
              onSubcategorySelect={handleSubcategorySelect}
              parentCategoryId={selectedCategory}
            />
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="p-4 bg-white rounded-md shadow-lg">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Chargement des résultats...</p>
              </div>
            </div>
          )}

          {!loading && places.length === 0 && (
            <NoResultsMessage 
              searchQuery=""
              loading={loading}
              clearFilters={handleClearFilters}
            />
          )}

          {selectedPlace && (
            <ResultDetail
              place={selectedPlace}
              onClose={onClosePopup}
              transportMode={transportMode}
              userLocation={userLocation}
              showRoutes={showRoutes}
            />
          )}

          {showRoutes && selectedPlace && userLocation && (
            <RouteDisplayContainer
              destinations={[selectedPlace.longitude, selectedPlace.latitude]}
              origin={userLocation}
              transportMode={transportMode}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MapSection;
