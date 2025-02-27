
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
}

const SearchFilters = ({ 
  distanceUnit, 
  onDistanceUnitChange,
  selectedDistance,
  selectedDuration 
}: SearchFiltersProps) => {
  const [kmRadius, setKmRadius] = useState(5);
  const [timeRadius, setTimeRadius] = useState(30);
  
  const handleKmRadiusChange = (value: number[]) => {
    setKmRadius(value[0]);
  };
  
  const handleTimeRadiusChange = (value: number[]) => {
    setTimeRadius(value[0]);
  };
  
  return (
    <div className="px-4 py-3">
      <div className="flex justify-between gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-1/2 rounded-full border-2 border-black bg-white text-black hover:bg-gray-100 justify-between">
              <span>Nombre autour de moi</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <div className="grid grid-cols-5 gap-1 p-2">
              {Array.from({ length: 10 }, (_, i) => (
                <Button 
                  key={`nbr-${i+1}`} 
                  variant="outline"
                  className="h-10 w-10"
                >
                  {i+1}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-1/2 rounded-full border-2 border-black bg-white text-black hover:bg-gray-100 justify-between">
              <span>Distance</span>
              <div className="flex items-center">
                <Tabs value={distanceUnit} onValueChange={onDistanceUnitChange} className="ml-1">
                  <TabsList className="h-6 px-1">
                    <TabsTrigger 
                      value="km" 
                      className={`px-1 text-xs h-5 ${
                        distanceUnit === 'km' ? 'bg-blue-500 text-white' : ''
                      }`}
                    >
                      km
                    </TabsTrigger>
                    <TabsTrigger 
                      value="mi" 
                      className={`px-1 text-xs h-5 ${
                        distanceUnit === 'mi' ? 'bg-orange-500 text-white' : ''
                      }`}
                    >
                      mi
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Distance ({distanceUnit === 'km' ? 
                  (kmRadius < 1 ? `${kmRadius * 1000} m` : `${kmRadius} km`) : 
                  `${(kmRadius * 0.621371).toFixed(1)} mi`})</h4>
                <Slider 
                  defaultValue={[5]} 
                  max={100} 
                  step={kmRadius < 1 ? 0.1 : 1}
                  min={0.1} 
                  onValueChange={handleKmRadiusChange}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>100m</span>
                  <span>50km</span>
                  <span>100km</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Durée ({timeRadius} min)</h4>
                <Slider 
                  defaultValue={[30]} 
                  max={300} 
                  step={timeRadius < 60 ? 5 : 15} 
                  min={5} 
                  onValueChange={handleTimeRadiusChange}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5min</span>
                  <span>1h</span>
                  <span>5h</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-4 bg-gray-100 rounded-lg p-3">
        <h3 className="font-bold mb-2 text-center">Résultats :</h3>
        <div className="flex flex-wrap gap-2">
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
