
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadiusSelector } from '@/components/menu/RadiusSelector';
import { TransportModeSelector } from '@/components/menu/TransportModeSelector';
import { ResultsCountSelector } from '@/components/menu/ResultsCountSelector';
import { CategoriesSelector } from '@/components/menu/CategoriesSelector';

interface InteractiveMenuProps {
  onFilterChange: (filters: {
    radius: number;
    unit: 'km' | 'miles';
    duration: number;
    timeUnit: 'minutes' | 'hours';
    resultsCount: number;
    transportMode: string;
    radiusType: 'distance' | 'duration';
  }) => void;
}

const InteractiveMenu: React.FC<InteractiveMenuProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [radius, setRadius] = useState(5);
  const [unit, setUnit] = useState<'km' | 'miles'>('km');
  const [duration, setDuration] = useState(15);
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours'>('minutes');
  const [radiusType, setRadiusType] = useState<'distance' | 'duration'>('distance');
  const [resultsCount, setResultsCount] = useState(5);
  const [transportMode, setTransportMode] = useState('driving');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleFiltersChange = () => {
    onFilterChange({
      radius,
      unit,
      duration,
      timeUnit,
      resultsCount,
      transportMode,
      radiusType,
    });
    setIsOpen(false);
  };

  return (
    <div className="relative z-10">
      <div className="flex justify-end mb-2">
        <Button 
          onClick={toggleMenu}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          <span>Filtres</span>
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 w-full md:w-96 bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Filtres</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleMenu}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <CategoriesSelector />
              
              <RadiusSelector 
                radius={radius}
                unit={unit}
                radiusType={radiusType}
                duration={duration}
                timeUnit={timeUnit}
                onRadiusChange={setRadius}
                onUnitChange={setUnit}
                onRadiusTypeChange={setRadiusType}
                onDurationChange={setDuration}
                onTimeUnitChange={setTimeUnit}
              />
              
              <TransportModeSelector 
                transportMode={transportMode}
                onTransportModeChange={setTransportMode}
              />
              
              <ResultsCountSelector 
                resultsCount={resultsCount}
                onResultsCountChange={setResultsCount}
              />
              
              <Button 
                onClick={handleFiltersChange}
                className="w-full"
              >
                Appliquer les filtres
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveMenu;
