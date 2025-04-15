
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface ResultsCountSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const ResultsCountSlider: React.FC<ResultsCountSliderProps> = ({
  value,
  onChange,
  min = 1,
  max = 10
}) => {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="w-60">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Résultats à afficher</span>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
          {value}
        </span>
      </div>
      
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={handleSliderChange}
        className="py-1"
      />
      
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">{min}</span>
        <span className="text-xs text-gray-500">{max}</span>
      </div>
    </div>
  );
};

export default ResultsCountSlider;
