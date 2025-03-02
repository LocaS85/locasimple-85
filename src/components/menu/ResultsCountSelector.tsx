
import React from 'react';
import { ResultsCountSlider } from './ResultsCountSlider';

interface ResultsCountSelectorProps {
  resultsCount: number;
  onResultsCountChange: (count: number) => void;
}

export const ResultsCountSelector: React.FC<ResultsCountSelectorProps> = ({
  resultsCount,
  onResultsCountChange
}) => {
  return (
    <>
      <h3 className="text-sm font-medium mb-2">Nombre autour de moi: {resultsCount}</h3>
      <ResultsCountSlider 
        resultsCount={resultsCount}
        onResultsCountChange={onResultsCountChange}
      />
    </>
  );
};
