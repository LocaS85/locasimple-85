
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface DurationFilterProps {
  selectedDuration: number;
  timeUnit?: 'minutes' | 'hours';
  onDurationChange: (value: number) => void;
  onTimeUnitChange?: (value: 'minutes' | 'hours') => void;
}

export const DurationFilter: React.FC<DurationFilterProps> = ({
  selectedDuration = 15,
  timeUnit = 'minutes',
  onDurationChange = () => {},
  onTimeUnitChange = () => {}
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label className="text-sm font-medium text-gray-700">Durée maximale</Label>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-600">{selectedDuration}</span>
          <span className="text-xs text-gray-600">
            {timeUnit === 'minutes' ? 'min' : 'h'}
          </span>
        </div>
      </div>
      
      <Slider
        value={[selectedDuration]}
        min={timeUnit === 'minutes' ? 5 : 1}
        max={timeUnit === 'minutes' ? 120 : 8}
        step={timeUnit === 'minutes' ? 5 : 0.5}
        onValueChange={(values) => onDurationChange(values[0])}
      />
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{timeUnit === 'minutes' ? '5 min' : '1 h'}</span>
        <span>{timeUnit === 'minutes' ? '120 min' : '8 h'}</span>
      </div>
    </div>
  );
};

export default DurationFilter;
