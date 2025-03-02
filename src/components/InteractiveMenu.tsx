
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoriesSelector } from './menu/CategoriesSelector';
import { RadiusSelector } from './menu/RadiusSelector';
import { DurationSelector } from './menu/DurationSelector';
import { ResultsCountSelector } from './menu/ResultsCountSelector';
import { TransportModeSelector } from './menu/TransportModeSelector';

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
  const [isOpen, setIsOpen] = useState(true);
  const [radius, setRadius] = useState(5);
  const [unit, setUnit] = useState<'km' | 'miles'>('km');
  const [duration, setDuration] = useState(15);
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours'>('minutes');
  const [resultsCount, setResultsCount] = useState(5);
  const [transportMode, setTransportMode] = useState('driving');
  const [radiusType, setRadiusType] = useState<'distance' | 'duration'>('distance');

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const triggerFilterChange = (changedValues: Partial<{
    radius: number;
    unit: 'km' | 'miles';
    duration: number;
    timeUnit: 'minutes' | 'hours';
    resultsCount: number;
    transportMode: string;
    radiusType: 'distance' | 'duration';
  }> = {}) => {
    onFilterChange({
      radius: changedValues.radius !== undefined ? changedValues.radius : radius,
      unit: changedValues.unit || unit,
      duration: changedValues.duration !== undefined ? changedValues.duration : duration,
      timeUnit: changedValues.timeUnit || timeUnit,
      resultsCount: changedValues.resultsCount !== undefined ? changedValues.resultsCount : resultsCount,
      transportMode: changedValues.transportMode || transportMode,
      radiusType: changedValues.radiusType || radiusType,
    });
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    triggerFilterChange({ radius: newRadius });
  };

  const handleUnitChange = (newUnit: 'km' | 'miles') => {
    setUnit(newUnit);
    triggerFilterChange({ unit: newUnit });
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    triggerFilterChange({ duration: newDuration });
  };

  const handleTimeUnitChange = (newTimeUnit: 'minutes' | 'hours') => {
    setTimeUnit(newTimeUnit);
    triggerFilterChange({ timeUnit: newTimeUnit });
  };

  const handleResultsCountChange = (newCount: number) => {
    setResultsCount(newCount);
    triggerFilterChange({ resultsCount: newCount });
  };

  const handleTransportModeChange = (newMode: string) => {
    setTransportMode(newMode);
    triggerFilterChange({ transportMode: newMode });
  };

  const handleRadiusTypeChange = (newType: 'distance' | 'duration') => {
    setRadiusType(newType);
    triggerFilterChange({ radiusType: newType });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg transition-all duration-300 transform relative">
      <div 
        className="flex justify-center items-center py-2 cursor-pointer hover:bg-gray-50 rounded-t-lg"
        onClick={handleToggleMenu}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronUp className="h-6 w-6 text-primary" />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Categories Selector */}
            <CategoriesSelector />
            
            {/* Radius/Duration Selector */}
            <div className="px-4 py-4 border-t">
              <RadiusSelector 
                radius={radius}
                unit={unit}
                radiusType={radiusType}
                onRadiusChange={handleRadiusChange}
                onUnitChange={handleUnitChange}
                onRadiusTypeChange={handleRadiusTypeChange}
              />
              
              <DurationSelector 
                duration={duration}
                timeUnit={timeUnit}
                radiusType={radiusType}
                onDurationChange={handleDurationChange}
                onTimeUnitChange={handleTimeUnitChange}
              />
            </div>
            
            {/* Number of results */}
            <div className="px-4 py-4 border-t">
              <ResultsCountSelector 
                resultsCount={resultsCount}
                onResultsCountChange={handleResultsCountChange}
              />
            </div>
            
            {/* Transport modes */}
            <div className="px-4 py-4 border-t">
              <TransportModeSelector 
                transportMode={transportMode}
                onTransportModeChange={handleTransportModeChange}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveMenu;
