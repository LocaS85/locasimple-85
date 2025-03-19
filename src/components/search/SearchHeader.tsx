
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
    <div className="bg-white shadow-sm p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">Recherche de lieux</h1>
      </div>
    </div>
  );
};

export default SearchHeader;
