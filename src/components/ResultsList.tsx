
import React from 'react';
import { MapPin, Navigation, Clock, Star, Clock2, Tag } from 'lucide-react';

export interface Result {
  id: string;
  name: string;
  address: string;
  distance: number;
  duration: number;
  category: string;
  color: string;
  latitude: number;
  longitude: number;
  description?: string;
  rating?: number;
  openingHours?: string;
}

interface ResultsListProps {
  results: Result[];
  onResultClick: (result: Result) => void;
  selectedResultId?: string;
}

const ResultsList = ({ results, onResultClick, selectedResultId }: ResultsListProps) => {
  return (
    <div className="space-y-2">
      {results.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Aucun résultat trouvé</p>
          <p className="text-sm">Essayez d'ajuster vos filtres</p>
        </div>
      ) : (
        results.map((result) => (
          <div
            key={result.id}
            onClick={() => onResultClick(result)}
            className={`p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${
              selectedResultId === result.id 
                ? `border-${result.color}-500 shadow-md bg-${result.color}-50` 
                : `border-transparent`
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full bg-${result.color}-500${selectedResultId === result.id ? '' : '/10'}`}>
                <MapPin className={`w-5 h-5 ${selectedResultId === result.id ? 'text-white' : `text-${result.color}-500`}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{result.name}</h3>
                  <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
                    <Tag className="w-3 h-3" />
                    <span>{result.category}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{result.address}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Navigation className="w-4 h-4" />
                    <span>{result.distance.toFixed(1)} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{result.duration} min</span>
                  </div>
                  {result.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400" />
                      <span>{result.rating}</span>
                    </div>
                  )}
                </div>
                {result.openingHours && (
                  <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    <Clock2 className="w-3 h-3" />
                    <span>{result.openingHours}</span>
                  </div>
                )}
                {result.description && (
                  <div className="mt-1 text-xs text-gray-600">
                    {result.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResultsList;
