
import React from 'react';
import { SearchContext, LocationSuggestion } from '@/types/search';
import { MapPin, Navigation, Building, Map } from 'lucide-react';

interface SearchContextPreviewProps {
  context?: SearchContext;
}

const SuggestionItem = ({ suggestion }: { suggestion: LocationSuggestion }) => {
  const getIcon = () => {
    switch (suggestion.type) {
      case 'address':
        return <MapPin className="h-4 w-4 text-blue-500" />;
      case 'poi':
        return <Navigation className="h-4 w-4 text-amber-500" />;
      case 'city':
        return <Building className="h-4 w-4 text-green-500" />;
      case 'region':
        return <Map className="h-4 w-4 text-purple-500" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
      <div className="mr-2">{getIcon()}</div>
      <div>
        <div className="font-medium">{suggestion.name}</div>
        {suggestion.address && (
          <div className="text-sm text-gray-500">{suggestion.address}</div>
        )}
      </div>
    </div>
  );
};

export const SearchContextPreview: React.FC<SearchContextPreviewProps> = ({ context }) => {
  if (!context || !context.suggestions?.length) return null;

  return (
    <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-lg border border-gray-200 w-full max-w-xl overflow-hidden">
      {context.userIntent?.type === 'LOCATION' && context.userIntent.confidence > 0.7 && (
        <div className="px-3 py-2 bg-blue-50 text-blue-700 text-sm">
          Recherche de lieux autour de "{context.userIntent.extracted?.location}"
        </div>
      )}
      
      <div className="max-h-60 overflow-y-auto p-2">
        {context.suggestions.map((suggestion) => (
          <SuggestionItem key={suggestion.id} suggestion={suggestion} />
        ))}
      </div>
      
      {context.recentSearches && context.recentSearches.length > 0 && (
        <div className="border-t border-gray-200">
          <div className="px-3 py-1 text-xs font-semibold text-gray-500">Recherches récentes</div>
          <div className="p-2">
            {context.recentSearches.map((search, index) => (
              <div key={index} className="px-2 py-1 text-sm hover:bg-gray-50 rounded cursor-pointer">
                {search}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
