
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, ClockIcon, XIcon } from 'lucide-react';

interface HistoryPanelProps {
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  searchHistory: string[];
  savedSearches: string[];
  onHistoryItemClick: (query: string) => void;
  onSaveSearch: (query: string) => void;
  onRemoveSavedSearch: (query: string) => void;
  searchQuery: string;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  showHistory,
  setShowHistory,
  searchHistory,
  savedSearches,
  onHistoryItemClick,
  onSaveSearch,
  onRemoveSavedSearch,
  searchQuery
}) => {
  if (!showHistory) return null;

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md z-20 px-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Historique & Favoris</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowHistory(false)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Recent searches */}
        {searchHistory.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm text-gray-500 mb-2 flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              Recherches récentes
            </h4>
            <div className="space-y-2">
              {searchHistory.map((query, index) => (
                <div 
                  key={`history-${index}`} 
                  className="p-2 bg-gray-50 rounded flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => onHistoryItemClick(query)}
                >
                  <span className="text-sm">{query}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSaveSearch(query);
                    }}
                  >
                    <BookmarkIcon className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Saved searches */}
        {savedSearches.length > 0 && (
          <div>
            <h4 className="text-sm text-gray-500 mb-2 flex items-center">
              <BookmarkIcon className="h-4 w-4 mr-1" />
              Recherches sauvegardées
            </h4>
            <div className="space-y-2">
              {savedSearches.map((query, index) => (
                <div 
                  key={`saved-${index}`} 
                  className="p-2 bg-gray-50 rounded flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  onClick={() => onHistoryItemClick(query)}
                >
                  <span className="text-sm">{query}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSavedSearch(query);
                    }}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Save current search */}
        {searchQuery && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full"
              onClick={() => onSaveSearch(searchQuery)}
            >
              <BookmarkIcon className="h-4 w-4 mr-2" />
              Sauvegarder la recherche actuelle
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
