
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchAutocomplete from './SearchAutocomplete';

interface SearchHeaderProps {
  title?: string;
  onSearch?: (query: string) => void;
  onResultSelect?: (result: any) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  userLocation?: [number, number];
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ 
  title = "Recherche", 
  onSearch = () => {},
  onResultSelect = () => {},
  searchQuery = '',
  setSearchQuery = () => {},
  userLocation
}) => {
  const navigate = useNavigate();
  const [showSearchInput, setShowSearchInput] = useState(false);
  
  const handleBackClick = () => {
    if (showSearchInput) {
      setShowSearchInput(false);
    } else {
      navigate(-1);
    }
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
  };

  return (
    <div className="bg-white py-3 px-4 shadow-sm flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={handleBackClick} className="text-app-dark">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      {showSearchInput ? (
        <div className="flex-1 mx-2">
          <SearchAutocomplete 
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={onSearch}
            onResultSelect={onResultSelect}
            placeholder="Rechercher..."
            userLocation={userLocation}
            autoFocus={true}
          />
        </div>
      ) : (
        <h1 className="text-lg font-semibold flex-1">{title}</h1>
      )}
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSearchInput} 
        className="text-app-dark"
      >
        {showSearchInput ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default SearchHeader;
