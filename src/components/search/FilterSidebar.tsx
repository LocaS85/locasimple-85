
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Car, User, Bicycle, Filter, X } from 'lucide-react';
import ResultsCountSlider from './ResultsCountSlider';

interface FilterSidebarProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  resultsCount: number;
  onResultsCountChange: (count: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  radius,
  onRadiusChange,
  transportMode,
  onTransportModeChange,
  resultsCount,
  onResultsCountChange,
  isOpen,
  onClose
}) => {
  const handleRadiusChange = (values: number[]) => {
    onRadiusChange(values[0]);
  };

  return (
    <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      fixed top-0 left-0 h-full w-64 md:w-80 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out p-4 overflow-y-auto`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <Filter size={18} className="mr-2" />
          Filtres
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Transport mode */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Mode de transport</Label>
          <div className="flex space-x-2">
            <Button
              variant={transportMode === 'driving' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => onTransportModeChange('driving')}
            >
              <Car size={18} className="mr-2" />
              Voiture
            </Button>
            <Button
              variant={transportMode === 'walking' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => onTransportModeChange('walking')}
            >
              <User size={18} className="mr-2" />
              À pied
            </Button>
            <Button
              variant={transportMode === 'cycling' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => onTransportModeChange('cycling')}
            >
              <Bicycle size={18} className="mr-2" />
              Vélo
            </Button>
          </div>
        </div>

        {/* Radius slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Rayon de recherche</Label>
            <span className="text-sm font-medium text-blue-600">{radius} km</span>
          </div>
          
          <Slider
            value={[radius]}
            min={1}
            max={50}
            step={1}
            onValueChange={handleRadiusChange}
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Number of results */}
        <ResultsCountSlider 
          count={resultsCount}
          onChange={onResultsCountChange}
        />
      </div>
    </div>
  );
};

export default FilterSidebar;
