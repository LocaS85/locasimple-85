
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FilterStackProps {
  children: React.ReactNode;
  title?: string;
}

const FilterStack: React.FC<FilterStackProps> = ({ 
  children,
  title = 'Filtres de recherche' 
}) => {
  return (
    <div className="p-4 space-y-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ScrollArea className="max-h-[calc(100vh-240px)]">
        <div className="space-y-4 pr-2">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FilterStack;
