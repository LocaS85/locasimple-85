
import React from 'react';

interface SearchHeaderProps {
  resultsCount: number;
  setResultsCount: (count: number) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ 
  resultsCount,
  setResultsCount,
}) => {
  return (
    <div className="bg-white shadow-sm p-2">
      <div className="container mx-auto flex items-center justify-between">
        <h2 className="text-base font-normal">Recherche de lieux</h2>
      </div>
    </div>
  );
};

export default SearchHeader;
