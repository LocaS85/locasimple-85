
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface ResultsCountSelectorProps {
  resultsCount: number;
  onResultsCountChange: (count: number) => void;
}

export const ResultsCountSelector: React.FC<ResultsCountSelectorProps> = ({
  resultsCount,
  onResultsCountChange
}) => {
  const handleResultsCountChange = (value: number[]) => {
    onResultsCountChange(value[0]);
  };

  return (
    <>
      <h3 className="text-sm font-medium mb-2">Nombre autour de moi: {resultsCount}</h3>
      <Slider
        value={[resultsCount]}
        min={1}
        max={10}
        step={1}
        onValueChange={handleResultsCountChange}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
    </>
  );
};
