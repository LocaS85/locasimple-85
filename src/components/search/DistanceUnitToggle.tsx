
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DistanceUnit } from '@/types/categoryTypes';

interface DistanceUnitToggleProps {
  value: DistanceUnit;
  onChange: (value: DistanceUnit) => void;
}

const DistanceUnitToggle: React.FC<DistanceUnitToggleProps> = ({
  value,
  onChange
}) => {
  return (
    <ToggleGroup 
      type="single" 
      value={value} 
      onValueChange={(val) => {
        if (val) onChange(val as DistanceUnit);
      }}
      className="border rounded-md overflow-hidden"
    >
      <ToggleGroupItem 
        value="km" 
        className="px-2 py-1 text-xs h-auto data-[state=on]:bg-blue-600 data-[state=on]:text-white"
      >
        km
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="mi" 
        className="px-2 py-1 text-xs h-auto data-[state=on]:bg-blue-600 data-[state=on]:text-white"
      >
        mi
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default DistanceUnitToggle;
