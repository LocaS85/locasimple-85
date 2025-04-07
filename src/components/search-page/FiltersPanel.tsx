
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp } from 'lucide-react';
import SearchBox from '@/components/search/SearchBox';
import { CategoriesFilter } from '@/components/search/CategoriesFilter';
import { TransportModeFilter } from '@/components/search/TransportModeFilter';
import { DistanceFilter } from '@/components/search/DistanceFilter';
import { DurationFilter } from '@/components/search/DurationFilter';

interface FiltersPanelProps {
  isMenuCollapsed: boolean;
  handleToggleMenu: () => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  performSearch: () => void;
  resetSearch: () => void;
  handleLocationClick: () => void;
  isLocationActive: boolean;
  loading: boolean;
  selectedCategory: string | null;
  handleCategoryToggle: (categoryId: string | null) => void;
  transportMode: string;
  setTransportMode: (value: string) => void;
  distanceFilter: {
    distance: number;
    unit: 'km' | 'mi';
  };
  handleDistanceChange: (value: number) => void;
  handleUnitChange: (value: 'km' | 'mi') => void;
  durationFilter: {
    duration: number;
    timeUnit: 'minutes' | 'hours';
  };
  handleDurationChange: (value: number) => void;
  toggleRoutes: () => void;
  generatePDF: () => void;
  userLocation?: [number, number];
  places: any[];
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  isMenuCollapsed,
  handleToggleMenu,
  searchQuery,
  setSearchQuery,
  performSearch,
  resetSearch,
  handleLocationClick,
  isLocationActive,
  loading,
  selectedCategory,
  handleCategoryToggle,
  transportMode,
  setTransportMode,
  distanceFilter,
  handleDistanceChange,
  handleUnitChange,
  durationFilter,
  handleDurationChange,
  toggleRoutes,
  generatePDF,
  userLocation,
  places
}) => {
  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-md p-4 transition-all duration-300 ${
        isMenuCollapsed ? 'md:col-span-3 lg:col-span-2' : 'md:col-span-4 lg:col-span-3'
      } ${isMenuCollapsed && 'md:hidden'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filtres</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleToggleMenu} 
          className="md:hidden"
        >
          {isMenuCollapsed ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
        </Button>
      </div>
      
      {!isMenuCollapsed && (
        <div className="space-y-4">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={performSearch}
            onReset={resetSearch}
            onLocationClick={handleLocationClick}
            isLocationActive={isLocationActive}
            loading={loading}
          />
          
          <CategoriesFilter 
            selectedCategory={selectedCategory} 
            onCategorySelect={handleCategoryToggle}
          />
          
          <TransportModeFilter
            selectedMode={transportMode}
            onModeChange={setTransportMode}
          />
          
          <DistanceFilter
            selectedDistance={distanceFilter.distance}
            distanceUnit={distanceFilter.unit}
            onDistanceChange={handleDistanceChange}
            onDistanceUnitChange={handleUnitChange}
          />
          
          <DurationFilter
            selectedDuration={durationFilter.duration}
            onDurationChange={handleDurationChange}
          />
          
          <div className="pt-2 grid grid-cols-2 gap-2">
            <Button 
              variant="outline"
              onClick={toggleRoutes}
              disabled={!userLocation || places.length === 0}
            >
              Itinéraires
            </Button>
            
            <Button 
              variant="outline"
              onClick={generatePDF}
              disabled={places.length === 0}
            >
              Export PDF
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FiltersPanel;
