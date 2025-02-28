
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

interface SearchFiltersProps {
  distanceUnit: string;
  onDistanceUnitChange: (unit: string) => void;
  selectedDistance: number | null;
  selectedDuration: number | null;
  onDistanceChange?: (value: number | null) => void;
  onDurationChange?: (value: number | null) => void;
}

const SearchFilters = ({ 
  distanceUnit, 
  onDistanceUnitChange,
  selectedDistance,
  selectedDuration,
  onDistanceChange,
  onDurationChange
}: SearchFiltersProps) => {
  const [kmRadius, setKmRadius] = useState(selectedDistance || 5);
  const [timeRadius, setTimeRadius] = useState(selectedDuration || 30);
  const [filterType, setFilterType] = useState<'distance' | 'duration'>(selectedDistance ? 'distance' : 'duration');
  const [showFilter, setShowFilter] = useState(true);
  const [resultsCount, setResultsCount] = useState(5);
  
  const handleKmRadiusChange = (value: number[]) => {
    setKmRadius(value[0]);
    if (onDistanceChange) {
      onDistanceChange(value[0]);
    }
  };
  
  const handleTimeRadiusChange = (value: number[]) => {
    setTimeRadius(value[0]);
    if (onDurationChange) {
      onDurationChange(value[0]);
    }
  };

  const handleFilterTypeChange = (type: 'distance' | 'duration') => {
    setFilterType(type);
    setShowFilter(true);
    
    // Mettre à jour le filtre sélectionné en fonction du type
    if (type === 'distance') {
      if (onDistanceChange) onDistanceChange(kmRadius);
      if (onDurationChange) onDurationChange(null);
    } else {
      if (onDistanceChange) onDistanceChange(null);
      if (onDurationChange) onDurationChange(timeRadius);
    }
  };

  const handleResultsCountChange = (count: number) => {
    setResultsCount(count);
  };
  
  return (
    <div className="px-4 py-3">
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-full border-2 border-black overflow-hidden">
          <Button
            type="button"
            onClick={() => handleFilterTypeChange('distance')}
            className={`px-6 py-2 transition-colors rounded-none ${
              filterType === 'distance' 
                ? 'bg-blue-600 text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            Distance
          </Button>
          <Button
            type="button"
            onClick={() => handleFilterTypeChange('duration')}
            className={`px-6 py-2 transition-colors rounded-none ${
              filterType === 'duration' 
                ? 'bg-purple-600 text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            Durée
          </Button>
        </div>
      </div>

      {showFilter && (
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          {filterType === 'distance' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Distance</h4>
                <Tabs value={distanceUnit} onValueChange={onDistanceUnitChange} className="ml-1">
                  <TabsList className="h-6 px-1">
                    <TabsTrigger 
                      value="km" 
                      className={`px-1 text-xs h-5 ${
                        distanceUnit === 'km' ? 'bg-blue-600 text-white font-bold' : ''
                      }`}
                    >
                      km
                    </TabsTrigger>
                    <TabsTrigger 
                      value="mi" 
                      className={`px-1 text-xs h-5 ${
                        distanceUnit === 'mi' ? 'bg-orange-600 text-white font-bold' : ''
                      }`}
                    >
                      mi
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="space-y-2">
                <div className="text-center">
                  {distanceUnit === 'km' ? 
                    (kmRadius < 1 ? `${(kmRadius * 1000).toFixed(0)} m` : `${kmRadius} km`) : 
                    `${(kmRadius * 0.621371).toFixed(1)} mi`}
                </div>
                <Slider 
                  defaultValue={[kmRadius]} 
                  max={100} 
                  step={kmRadius < 1 ? 0.1 : 1}
                  min={0.1} 
                  value={[kmRadius]}
                  onValueChange={handleKmRadiusChange}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>100m</span>
                  <span>50km</span>
                  <span>100km</span>
                </div>
              </div>
            </div>
          )}

          {filterType === 'duration' && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Durée</h4>
              <div className="space-y-2">
                <div className="text-center">
                  {timeRadius < 60 
                    ? `${timeRadius} minutes` 
                    : `${Math.floor(timeRadius / 60)}h${timeRadius % 60 ? ` ${timeRadius % 60}min` : ''}`}
                </div>
                <Slider 
                  defaultValue={[timeRadius]} 
                  max={300} 
                  step={timeRadius < 60 ? 5 : 15} 
                  min={5} 
                  value={[timeRadius]}
                  onValueChange={handleTimeRadiusChange}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5min</span>
                  <span>1h</span>
                  <span>5h</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="rounded-full border-2 border-black bg-white text-black hover:bg-gray-100">
              Nombre de résultats: {resultsCount}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <div className="grid grid-cols-5 gap-1 p-2">
              {Array.from({ length: 10 }, (_, i) => (
                <Button 
                  key={`nbr-${i+1}`} 
                  variant="outline"
                  className={`h-10 w-10 ${resultsCount === i+1 ? 'bg-blue-100' : ''}`}
                  onClick={() => handleResultsCountChange(i+1)}
                >
                  {i+1}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-4 bg-gray-100 rounded-lg p-3">
        <h3 className="font-bold mb-2 text-center">Résultats :</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {selectedDuration && (
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {selectedDuration} min
            </div>
          )}
          {selectedDistance && (
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              {distanceUnit === 'km' ? 
                (selectedDistance < 1 ? `${selectedDistance * 1000} m` : `${selectedDistance} km`) : 
                `${(selectedDistance * 0.621371).toFixed(1)} mi`}
            </div>
          )}
          {!selectedDistance && !selectedDuration && (
            <div className="text-gray-500 text-sm text-center w-full">
              Aucun filtre appliqué
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
