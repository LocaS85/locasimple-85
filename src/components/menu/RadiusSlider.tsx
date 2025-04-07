
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { DistanceUnit } from '@/types/categoryTypes';

interface RadiusSliderProps {
  radius: number;
  unit: DistanceUnit;
  onRadiusChange: (value: number) => void;
}

export const RadiusSlider: React.FC<RadiusSliderProps> = ({
  radius,
  unit,
  onRadiusChange
}) => {
  const handleRadiusChange = (value: number[]) => {
    onRadiusChange(value[0]);
  };

  return (
    <>
      <Slider
        value={[radius]}
        min={1}
        max={100}
        step={1}
        onValueChange={handleRadiusChange}
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>1 {unit}</span>
        <span>50 {unit}</span>
        <span>100 {unit}</span>
      </div>
    </>
  );
};
