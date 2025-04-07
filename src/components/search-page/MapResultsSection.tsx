
import React from 'react';
import { motion } from 'framer-motion';
import MapContainer from '@/components/map/MapContainer';
import ResultsList, { Result } from '@/components/ResultsList';

interface MapResultsSectionProps {
  places: Result[];
  userLocation?: [number, number];
  handleLocationClick: () => void;
  isLocationActive: boolean;
  loading: boolean;
  showRoutes: boolean;
  performSearch: () => void;
  handleResultClick: (result: Result) => void;
  selectedCategory: string | null;
  handleCategoryToggle: (categoryId: string | null) => void;
  transportMode: string;
}

export const MapResultsSection: React.FC<MapResultsSectionProps> = ({
  places,
  userLocation,
  handleLocationClick,
  isLocationActive,
  loading,
  showRoutes,
  performSearch,
  handleResultClick,
  selectedCategory,
  handleCategoryToggle,
  transportMode
}) => {
  return (
    <motion.div 
      className="md:col-span-8 lg:col-span-9"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <div className="h-[60vh] md:h-[500px]">
          <MapContainer 
            results={places}
            center={userLocation || [2.3488, 48.8534]}
            onLocationClick={handleLocationClick}
            isLocationActive={isLocationActive}
            loading={loading}
            showRoutes={showRoutes}
            onSearch={performSearch}
            onResultClick={handleResultClick}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategoryToggle}
            userLocation={userLocation}
            transportMode={transportMode}
          />
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mb-16 md:mb-6"
      >
        <ResultsList 
          results={places}
          loading={loading}
          onResultClick={handleResultClick}
          userLocation={userLocation}
        />
      </motion.div>
    </motion.div>
  );
};

export default MapResultsSection;
