
import React from 'react';
import { Button } from '@/components/ui/button';
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
        </Popover>
      </div>

      <div className="mt-4 bg-gray-100 rounded-lg p-3">
        <h3 className="font-bold mb-2">Résultats :</h3>
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
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
