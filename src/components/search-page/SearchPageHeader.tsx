
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import FlaskServerStatus from '@/components/search/FlaskServerStatus';

interface SearchPageHeaderProps {
  title: string;
  isMenuCollapsed: boolean;
  handleToggleMenu: () => void;
}

export const SearchPageHeader: React.FC<SearchPageHeaderProps> = ({
  title,
  isMenuCollapsed,
  handleToggleMenu
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center">
        <FlaskServerStatus className="mr-2" />
        <Button 
          variant="outline" 
          size="icon" 
          className="md:hidden"
          onClick={handleToggleMenu}
        >
          {isMenuCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default SearchPageHeader;
