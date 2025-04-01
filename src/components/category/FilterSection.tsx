
import React from 'react';
import { useCategory } from '../CategoryContext';
import { AnimatePresence, motion } from 'framer-motion';
import FilterPanel from '@/components/FilterPanel';
import CategoryLegend from '@/components/CategoryLegend';
import SearchButton from './SearchButton';

interface FilterSectionProps {
  selectedCategory: string;
  radius: number;
  setRadius: React.Dispatch<React.SetStateAction<number>>;
  transportMode: string;
  setTransportMode: React.Dispatch<React.SetStateAction<string>>;
  resultsCount: number;
  setResultsCount: React.Dispatch<React.SetStateAction<number>>;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  selectedCategory,
  radius,
  setRadius,
  transportMode,
  setTransportMode,
  resultsCount,
  setResultsCount,
  duration,
  setDuration
}) => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <FilterPanel
        radius={radius}
        onRadiusChange={setRadius}
        transportMode={transportMode}
        onTransportModeChange={setTransportMode}
        resultsCount={resultsCount}
        onResultsCountChange={setResultsCount}
        duration={duration}
        onDurationChange={setDuration}
      />

      <CategoryLegend />

      <SearchButton 
        selectedCategory={selectedCategory}
        radius={radius}
        transportMode={transportMode}
        resultsCount={resultsCount}
        duration={duration}
      />
    </motion.div>
  );
};

export default FilterSection;
