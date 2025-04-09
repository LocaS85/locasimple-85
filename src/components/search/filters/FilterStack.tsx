
import React, { ReactNode } from 'react';

interface FilterStackProps {
  children: ReactNode;
}

const FilterStack: React.FC<FilterStackProps> = ({ children }) => {
  return (
    <div className="filter-stack p-4 space-y-4">
      <h2 className="text-lg font-semibold">Filtres</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FilterStack;
