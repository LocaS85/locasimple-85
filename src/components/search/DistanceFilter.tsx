
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          className={`w-full rounded-full border text-xs h-8 px-2 ${
            selectedDistance 
              ? "border-primary bg-primary text-white hover:bg-primary/90" 
              : "border-black bg-gray-100 text-black hover:bg-gray-200"
          } justify-between`}
        >
          <span>{t('distance')}</span>
          <div className="flex items-center">
            <Tabs 
              value={distanceUnit} 
              onValueChange={(value) => onDistanceUnitChange(value as 'km' | 'miles')} 
              className="ml-1"
            >
              <TabsList className="h-5 px-1">
                <TabsTrigger value="km" className="px-1 text-xs h-4">km</TabsTrigger>
                <TabsTrigger value="miles" className="px-1 text-xs h-4">mi</TabsTrigger>
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
                variant={selectedDistance === meter / 1000 ? "default" : "outline"}
                className="text-xs py-0 h-7"
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
                variant={selectedDistance === km ? "default" : "outline"}
                className="text-xs py-0 h-7"
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
