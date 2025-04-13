
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Clock, MapPin } from 'lucide-react';
import { DistanceUnit } from '@/types/categoryTypes';

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
        
        <ToggleGroup 
          type="single" 
          value={radiusType}
          onValueChange={(value) => value && handleRadiusTypeChange(value as 'time' | 'distance')}
          className="border rounded-md"
        >
          <ToggleGroupItem value="time" aria-label="Par temps">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-xs">Minutes</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="distance" aria-label="Par distance">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-xs">Distance</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="px-2">
        <Slider
          min={radiusType === 'time' ? 5 : 1}
          max={radiusType === 'time' ? 180 : 50}
          step={radiusType === 'time' ? 5 : 1}
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
          {radiusType === 'time' 
            ? `${radiusValue} minutes` 
            : `${radiusValue} ${unit}`}
        </span>
        
        {radiusType === 'distance' && (
          <ToggleGroup 
            type="single" 
            value={unit}
            onValueChange={(value) => value && handleUnitChange(value as DistanceUnit)}
            className="border rounded-md"
          >
            <ToggleGroupItem value="km" className="text-xs px-2 py-1" aria-label="Kilomètres">
              km
            </ToggleGroupItem>
            <ToggleGroupItem value="mi" className="text-xs px-2 py-1" aria-label="Miles">
              mi
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      </div>
    </div>
  );
};

export default RadiusFilter;
