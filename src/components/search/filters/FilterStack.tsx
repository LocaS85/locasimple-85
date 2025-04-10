
import React from 'react';

interface FilterStackProps {
  children: React.ReactNode;
}

const FilterStack: React.FC<FilterStackProps> = ({ children }) => {
  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">Filtres de recherche</h2>
      {children}
    </div>
  );
};

export default FilterStack;
