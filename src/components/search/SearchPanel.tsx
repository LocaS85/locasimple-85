
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
  limit?: number;
  setLimit?: (limit: number) => void;
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
  generatePDF = () => {},
  limit = 3,
  setLimit = () => {}
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-10 px-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Rechercher un lieu, une entreprise..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 py-2 px-4 rounded-l-lg focus:ring-0"
            />
            
            <Button
              type="submit"
              variant="default"
              className="rounded-r-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Search size={20} />
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label htmlFor="mode" className="text-sm">Mode de transport :</label>
              <select 
                id="mode"
                value={transportMode}
                onChange={(e) => onTransportModeChange(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="driving">Voiture</option>
                <option value="walking">Marche</option>
                <option value="cycling">Vélo</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label htmlFor="limit" className="text-sm">Résultats :</label>
              <input 
                type="number" 
                id="limit" 
                min="1" 
                max="10" 
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border border-gray-300 rounded w-12 px-2 py-1 text-sm"
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onMicClick}
              className={`rounded-full ${isRecording ? 'text-red-500' : ''}`}
            >
              <Mic size={18} />
              <span className="text-xs">Voix</span>
            </Button>
            
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onLocationClick}
              className={`rounded-full ${isLocationActive ? 'text-blue-500' : ''}`}
            >
              <MapPin size={18} />
              <span className="text-xs">Position</span>
            </Button>
            
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={generatePDF}
              disabled={loading}
              title="Générer un PDF"
            >
              <FileText size={18} />
              <span className="text-xs">PDF</span>
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
    </div>
  );
};

export default SearchPanel;
