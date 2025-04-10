
import React from 'react';

interface FilterStackProps {
  children: React.ReactNode;
}

const FilterStack: React.FC<FilterStackProps> = ({ children }) => {
  return (
    <div className="p-4 space-y-6">
      {children}
    </div>
  );
};

export default FilterStack;
