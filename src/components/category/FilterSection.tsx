
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FilterPanel from '@/components/FilterPanel';

interface FilterSectionProps {
  selectedCategory: string;
  radius: number;
  setRadius: (value: number) => void;
  transportMode: string;
  setTransportMode: (value: string) => void;
  resultsCount: number;
  setResultsCount: (value: number) => void;
  duration: number;
  setDuration: (value: number) => void;
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FilterSection;
