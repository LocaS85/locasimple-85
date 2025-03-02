
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface DurationSliderProps {
  duration: number;
  timeUnit: 'minutes' | 'hours';
  onDurationChange: (value: number) => void;
}

export const DurationSlider: React.FC<DurationSliderProps> = ({
  duration,
  timeUnit,
  onDurationChange
}) => {
  const handleDurationChange = (value: number[]) => {
    onDurationChange(value[0]);
  };

  return (
    <>
      <Slider
        value={[duration]}
        min={timeUnit === 'minutes' ? 5 : 1}
        max={timeUnit === 'minutes' ? 60 : 5}
        step={timeUnit === 'minutes' ? 5 : 1}
        onValueChange={handleDurationChange}
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{timeUnit === 'minutes' ? '5 min' : '1 h'}</span>
        <span>{timeUnit === 'minutes' ? '30 min' : '3 h'}</span>
        <span>{timeUnit === 'minutes' ? '60 min' : '5 h'}</span>
      </div>
    </>
  );
};
