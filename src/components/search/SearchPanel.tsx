
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mic, MapPin, Menu, Send, FileText } from 'lucide-react';
import type { Result } from '@/components/ResultsList';

interface SearchPanelProps {
  query: string;
  setQuery: (query: string) => void;
  search: (query: string) => void;
  isRecording?: boolean;
  onMicClick?: () => void;
  isLocationActive?: boolean;
  onLocationClick?: () => void;
  loading?: boolean;
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  onMenuClick?: () => void;
  onResultSelect?: (result: Result) => void;
  resetSearch?: () => void;
  showHistory?: boolean;
  setShowHistory?: (show: boolean) => void;
  searchHistory?: string[];
  savedSearches?: string[];
  onHistoryItemClick?: (query: string) => void;
  onSaveSearch?: (query: string) => void;
  onRemoveSavedSearch?: (query: string) => void;
  userLocation?: [number, number];
  generatePDF?: () => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  query,
  setQuery,
  search,
  isRecording = false,
  onMicClick = () => {},
  isLocationActive = false,
  onLocationClick = () => {},
  loading = false,
  transportMode,
  onTransportModeChange,
  onMenuClick = () => {},
  onResultSelect = () => {},
  resetSearch = () => {},
  showHistory = false,
  setShowHistory = () => {},
  searchHistory = [],
  savedSearches = [],
  onHistoryItemClick = () => {},
  onSaveSearch = () => {},
  onRemoveSavedSearch = () => {},
  userLocation,
  generatePDF = () => {}
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-10 px-4">
      <div className="bg-white rounded-full shadow-lg">
        <form onSubmit={handleSubmit} className="flex items-center">
          <Input
            type="text"
            placeholder="Rechercher un lieu, une entreprise..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-none flex-1 py-6 px-6 rounded-l-full focus:ring-0"
          />
          
          <div className="flex items-center pr-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onMicClick}
              className={`rounded-full ${isRecording ? 'text-red-500' : ''}`}
            >
              <Mic size={20} />
            </Button>
            
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onLocationClick}
              className={`rounded-full ${isLocationActive ? 'text-blue-500' : ''}`}
            >
              <MapPin size={20} />
            </Button>
            
            <Button
              type="submit"
              size="icon"
              variant="default"
              className="rounded-full"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Search size={20} />
              )}
            </Button>
          </div>
        </form>
      </div>
      
      {showHistory && searchHistory.length > 0 && (
        <div className="mt-2 bg-white rounded-lg shadow-lg p-2">
          <h3 className="text-sm font-medium px-3 py-1">Recherches récentes</h3>
          <ul className="divide-y divide-gray-100">
            {searchHistory.map((item) => (
              <li 
                key={item} 
                className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                onClick={() => onHistoryItemClick(item)}
              >
                <span className="text-sm">{item}</span>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSaveSearch(item);
                  }}
                >
                  Sauvegarder
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* PDF Generation Button */}
      <div className="absolute top-0 right-[-70px]">
        <Button
          size="icon"
          variant="outline"
          onClick={generatePDF}
          disabled={loading}
          title="Générer un PDF"
          className="bg-white shadow-md"
        >
          <FileText size={18} />
        </Button>
      </div>
    </div>
  );
};

export default SearchPanel;
