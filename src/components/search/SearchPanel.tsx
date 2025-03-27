
import React from 'react';
import { Search, Map, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from './SearchInput';

interface SearchPanelProps {
  query: string;
  setQuery: (query: string) => void;
  search: (query: string) => void;
  isLocationActive: boolean;
  onLocationClick: () => void;
  loading: boolean;
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  userLocation: [number, number];
  generatePDF: () => void;
  limit: number;
  setLimit: (limit: number) => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  query,
  setQuery,
  search,
  isLocationActive,
  onLocationClick,
  loading,
  transportMode,
  onTransportModeChange,
  userLocation,
  generatePDF,
  limit,
  setLimit
}) => {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="absolute top-2 left-0 right-0 px-4 z-10">
      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-1">
        <div className="flex gap-2">
          <div className="flex-grow">
            <SearchInput
              searchQuery={query}
              onSearchChange={setQuery}
              isRecording={false}
              onMicClick={() => {}}
              isLocationActive={isLocationActive}
              onLocationClick={onLocationClick}
              loading={loading}
              transportMode={transportMode}
              onTransportModeChange={onTransportModeChange}
              userLocation={userLocation}
            />
          </div>
          
          <Button 
            type="submit"
            variant="default"
            size="icon"
            className="bg-blue-500 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchPanel;
