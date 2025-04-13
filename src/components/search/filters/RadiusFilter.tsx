
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, MapPin } from 'lucide-react';
import { DistanceUnit } from '@/types/categoryTypes';
import { Button } from '@/components/ui/button';

interface RadiusFilterProps {
  onRadiusChange: (value: number) => void;
  onRadiusTypeChange: (type: 'time' | 'distance') => void;
  onDistanceUnitChange?: (unit: DistanceUnit) => void;
  transportMode?: string;
  defaultValue?: number;
  defaultType?: 'time' | 'distance';
  distanceUnit?: DistanceUnit;
}

const RadiusFilter = ({
  onRadiusChange,
  onRadiusTypeChange,
  onDistanceUnitChange,
  transportMode = 'driving',
  defaultValue = 15,
  defaultType = 'time',
  distanceUnit = 'km',
}: RadiusFilterProps) => {
  const [radiusType, setRadiusType] = useState<'time' | 'distance'>(defaultType);
  const [radiusValue, setRadiusValue] = useState<number>(defaultValue);
  const [unit, setUnit] = useState<DistanceUnit>(distanceUnit);

  // Speed estimations based on transport mode (km/h)
  const speedMap: Record<string, number> = {
    driving: 50,
    cycling: 15,
    walking: 5,
    transit: 30,
    boat: 20,
    train: 60,
  };

  // Convert between time and distance
  const convertRadius = (value: number, type: 'time' | 'distance', mode: string): number => {
    const speed = speedMap[mode] || speedMap.driving;
    if (type === 'time') {
      // Convert minutes to km
      return Math.round((value * speed) / 60);
    } else {
      // Convert km to minutes
      return Math.round((value / speed) * 60);
    }
  };

  // Handle radius type change
  const handleRadiusTypeChange = (newType: 'time' | 'distance') => {
    if (newType !== radiusType) {
      // Convert current value to the new type
      const convertedValue = convertRadius(radiusValue, radiusType, transportMode);
      
      setRadiusType(newType);
      setRadiusValue(convertedValue);
      onRadiusTypeChange(newType);
      onRadiusChange(convertedValue);
    }
  };

  // Handle unit change
  const handleUnitChange = (newUnit: DistanceUnit) => {
    // Convert value between km and miles
    const convertedValue = newUnit === 'km' 
      ? Math.round(radiusValue * 1.60934) 
      : Math.round(radiusValue / 1.60934);
    
    setUnit(newUnit);
    setRadiusValue(convertedValue);
    
    if (onDistanceUnitChange) {
      onDistanceUnitChange(newUnit);
    }
    onRadiusChange(convertedValue);
  };

  // Update on transport mode change
  useEffect(() => {
    if (radiusType === 'time') {
      const distanceValue = convertRadius(radiusValue, 'time', transportMode);
      onRadiusChange(distanceValue);
    }
  }, [transportMode]);

  return (
    <div className="radius-filter space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Rayon de recherche</h3>
        
        <Tabs
          defaultValue={radiusType}
          onValueChange={(v) => handleRadiusTypeChange(v as 'time' | 'distance')}
        >
          <TabsList>
            <TabsTrigger value="time" className="flex gap-1 items-center">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Minutes</span>
            </TabsTrigger>
            <TabsTrigger value="distance" className="flex gap-1 items-center">
              <MapPin className="h-4 w-4" />
              <span className="text-xs">Distance</span>
            </TabsTrigger>
          </TabsList>
      
          <TabsContent value="time" className="space-y-4">
            <div className="px-2">
              <Slider
                min={5}
                max={180}
                step={5}
                value={[radiusValue]}
                onValueChange={(values) => {
                  const val = values[0];
                  setRadiusValue(val);
                  onRadiusChange(convertRadius(val, 'time', transportMode));
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="radius-display text-sm font-medium">
                {radiusValue} minutes
              </span>
            </div>
          </TabsContent>
      
          <TabsContent value="distance" className="space-y-4">
            <div className="px-2">
              <Slider
                min={1}
                max={50}
                step={1}
                value={[radiusValue]}
                onValueChange={(values) => {
                  const val = values[0];
                  setRadiusValue(val);
                  onRadiusChange(val);
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="radius-display text-sm font-medium">
                {radiusValue} {unit}
              </span>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={unit === 'km' ? 'default' : 'outline'} 
                  onClick={() => handleUnitChange('km')}
                  className="px-2 py-1 h-8"
                >
                  km
                </Button>
                <Button 
                  size="sm" 
                  variant={unit === 'mi' ? 'default' : 'outline'} 
                  onClick={() => handleUnitChange('mi')}
                  className="px-2 py-1 h-8"
                >
                  mi
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RadiusFilter;
