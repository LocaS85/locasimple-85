
import React from 'react';
import { Printer, Settings, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchFooterProps {
  generatePDF: () => void;
  toggleRoutes: () => void;
  showRoutes: boolean;
  openFilters?: () => void;
}

export const SearchFooter: React.FC<SearchFooterProps> = ({
  generatePDF,
  toggleRoutes,
  showRoutes,
  openFilters
}) => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-20">
      <div className="flex flex-col gap-2 items-end">
        {openFilters && (
          <Button 
            variant="outline" 
            size="icon"
            onClick={openFilters}
            className="bg-white shadow-md rounded-full h-10 w-10"
          >
            <Filter className="w-5 h-5" />
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={generatePDF}
          className="bg-white shadow-md rounded-full h-10 w-10"
        >
          <Printer className="w-5 h-5" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleRoutes} 
          className={`${showRoutes ? 'bg-blue-100' : 'bg-white'} shadow-md rounded-full h-10 w-10`}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default SearchFooter;
