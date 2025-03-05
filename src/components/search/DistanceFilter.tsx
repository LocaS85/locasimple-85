
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
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface DistanceFilterProps {
  selectedDistance: number | null;
  distanceUnit: 'km' | 'miles';
  onDistanceChange: (distance: number) => void;
  onDistanceUnitChange: (unit: 'km' | 'miles') => void;
}

export const DistanceFilter: React.FC<DistanceFilterProps> = ({
  selectedDistance,
  distanceUnit,
  onDistanceChange,
  onDistanceUnitChange
}) => {
  const { t } = useLanguage();

  const meterDistances = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  
  const generateKilometerDistances = () => {
    return Array.from({ length: 100 }, (_, i) => i + 1);
  };

  // Function to get the active color based on distance unit
  const getUnitColor = (unit: 'km' | 'miles') => {
    return unit === 'km' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-purple-500 text-white hover:bg-purple-600';
  };

  // Format distance for display
  const formatSelectedDistance = () => {
    if (!selectedDistance) return t('distance');
    
    if (selectedDistance < 1) {
      // Convert to meters
      return `${selectedDistance * 1000} m`;
    } else if (distanceUnit === 'km') {
      return `${selectedDistance} km`;
    } else {
      return `${(selectedDistance * 0.621371).toFixed(1)} mi`;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          className={`w-full rounded-full border text-xs h-7 px-2 ${
            selectedDistance 
              ? distanceUnit === 'km' 
                ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-600" 
                : "border-purple-500 bg-purple-500 text-white hover:bg-purple-600"
              : "border-black bg-gray-50 text-black hover:bg-gray-100"
          } justify-between`}
        >
          <span className="text-xs">{formatSelectedDistance()}</span>
          <div className="flex items-center">
            <Tabs 
              value={distanceUnit} 
              onValueChange={(value) => onDistanceUnitChange(value as 'km' | 'miles')} 
              className="ml-1"
            >
              <TabsList className="h-4 px-0.5 bg-transparent">
                <TabsTrigger 
                  value="km" 
                  className={cn(
                    "px-1 text-[10px] h-3",
                    distanceUnit === 'km' ? "bg-blue-500 text-white" : "bg-transparent text-gray-600"
                  )}
                >
                  km
                </TabsTrigger>
                <TabsTrigger 
                  value="miles" 
                  className={cn(
                    "px-1 text-[10px] h-3",
                    distanceUnit === 'miles' ? "bg-purple-500 text-white" : "bg-transparent text-gray-600"
                  )}
                >
                  mi
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0 bg-white">
        <div className="p-2">
          <h3 className="font-bold mb-1 text-sm">Mètres</h3>
          <div className="grid grid-cols-3 gap-1 mb-3">
            {meterDistances.map((meter) => (
              <Button 
                key={`meter-${meter}`} 
                variant="outline"
                className={cn(
                  "text-xs py-0 h-6",
                  selectedDistance === meter / 1000 && (
                    distanceUnit === 'km' 
                      ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600" 
                      : "bg-purple-500 text-white border-purple-500 hover:bg-purple-600"
                  )
                )}
                onClick={() => onDistanceChange(meter / 1000)}
              >
                {meter} m
              </Button>
            ))}
          </div>
          <h3 className="font-bold mb-1 text-sm">{distanceUnit === 'km' ? 'Kilomètres' : 'Miles'}</h3>
          <div className="grid grid-cols-4 gap-1 h-36 overflow-y-auto">
            {generateKilometerDistances().map((km) => (
              <Button 
                key={`km-${km}`} 
                variant="outline"
                className={cn(
                  "text-xs py-0 h-6",
                  selectedDistance === km && (
                    distanceUnit === 'km' 
                      ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600" 
                      : "bg-purple-500 text-white border-purple-500 hover:bg-purple-600"
                  )
                )}
                onClick={() => onDistanceChange(km)}
              >
                {distanceUnit === 'km' ? `${km} km` : `${(km * 0.621371).toFixed(1)} mi`}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
