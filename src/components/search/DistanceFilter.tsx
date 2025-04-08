
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface DistanceFilterProps {
  selectedDistance: number;
  distanceUnit: "km" | "mi";
  onDistanceChange: (value: number) => void;
  onDistanceUnitChange: (value: "km" | "mi") => void;
}

export const DistanceFilter: React.FC<DistanceFilterProps> = ({
  selectedDistance = 5,
  distanceUnit = 'km',
  onDistanceChange = () => {},
  onDistanceUnitChange = () => {}
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label className="text-sm font-medium text-gray-700">Distance maximale</Label>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-600">{selectedDistance}</span>
          <Select 
            value={distanceUnit} 
            onValueChange={(value: 'km' | 'mi') => onDistanceUnitChange(value)}
          >
            <SelectTrigger className="h-6 w-14 text-xs border-none">
              <SelectValue placeholder={distanceUnit} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="km">km</SelectItem>
              <SelectItem value="mi">mi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Slider
        value={[selectedDistance]}
        min={1}
        max={50}
        step={1}
        onValueChange={(values) => onDistanceChange(values[0])}
      />
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>1 {distanceUnit}</span>
        <span>50 {distanceUnit}</span>
      </div>
    </div>
  );
};

export default DistanceFilter;
