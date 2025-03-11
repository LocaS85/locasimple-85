
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Star, Search, X, Pin } from 'lucide-react';

interface SearchHistoryProps {
  history: string[];
  savedSearches: string[];
  onHistoryItemClick: (query: string) => void;
  onSaveSearch: (query: string) => void;
  onRemoveSavedSearch: (query: string) => void;
  onClearHistory?: () => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  savedSearches,
  onHistoryItemClick,
  onSaveSearch,
  onRemoveSavedSearch,
  onClearHistory
}) => {
  return (
    <Card className="w-full">
      <Tabs defaultValue="history">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Recherches</CardTitle>
            {onClearHistory && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onClearHistory}
              >
                Effacer
              </Button>
            )}
          </div>
          <TabsList className="grid w-full grid-cols-2 mt-2">
            <TabsTrigger value="history" className="flex items-center justify-center">
              <Clock className="mr-2 h-4 w-4" />
              Récentes
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center justify-center">
              <Star className="mr-2 h-4 w-4" />
              Sauvegardées
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="pt-4">
          <TabsContent value="history" className="space-y-1">
            {history.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Search className="mx-auto h-8 w-8 mb-2 opacity-30" />
                <p>Aucune recherche récente</p>
              </div>
            ) : (
              history.map((query, index) => (
                <div 
                  key={`${query}-${index}`}
                  className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100"
                >
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-2 h-auto text-sm"
                    onClick={() => onHistoryItemClick(query)}
                  >
                    <Search className="mr-2 h-4 w-4 text-gray-400" />
                    {query}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onSaveSearch(query)}
                    className="h-8 w-8"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="space-y-1">
            {savedSearches.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Star className="mx-auto h-8 w-8 mb-2 opacity-30" />
                <p>Aucune recherche sauvegardée</p>
                <p className="text-xs mt-1">Cliquez sur l'étoile pour sauvegarder</p>
              </div>
            ) : (
              savedSearches.map((query, index) => (
                <div 
                  key={`${query}-${index}`}
                  className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100"
                >
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-2 h-auto text-sm"
                    onClick={() => onHistoryItemClick(query)}
                  >
                    <Pin className="mr-2 h-4 w-4 text-amber-400" />
                    {query}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onRemoveSavedSearch(query)}
                    className="h-8 w-8 text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default SearchHistory;
