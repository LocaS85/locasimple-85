
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ResultsCountSliderProps {
  count: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const ResultsCountSlider: React.FC<ResultsCountSliderProps> = ({
  count,
  onChange,
  min = 5,
  max = 25
}) => {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">Nombre de résultats</Label>
        <span className="text-sm font-medium text-blue-600">{count}</span>
      </div>
      
      <Slider
        value={[count]}
        min={min}
        max={max}
        step={5}
        onValueChange={handleSliderChange}
      />
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default ResultsCountSlider;
