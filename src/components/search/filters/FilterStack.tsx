
import React from 'react';

interface FilterStackProps {
  children: React.ReactNode;
}

const FilterStack: React.FC<FilterStackProps> = ({ children }) => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-4">Filtres de recherche</h2>
      {children}
    </div>
  );
};

export default FilterStack;
