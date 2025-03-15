
import React from 'react';

export interface Result {
  id: string;
  name: string;
  address?: string;
  category?: string;
  categories?: string[];
  distance: number;
  duration: number;
  latitude: number;
  longitude: number;
  distanceInMeters?: number;
  durationInSeconds?: number;
  rating?: number;
  openingHours?: string;
  color?: string;
  phoneNumber?: string;
  website?: string;
  isFavorite?: boolean;
  description?: string;
}

interface ResultsListProps {
  results: Result[];
  onResultClick?: (result: Result) => void;
  selectedResultId?: string;
  selectedCategory?: string;
  selectedDuration?: number;
  selectedDistance?: number;
  transportMode?: string;
}

export const ResultsList: React.FC<ResultsListProps> = ({
  results,
  onResultClick,
  selectedResultId
}) => {
  if (results.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Aucun résultat trouvé
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {results.map((result) => (
        <div
          key={result.id}
          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
            selectedResultId === result.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          }`}
          onClick={() => onResultClick && onResultClick(result)}
        >
          <h3 className="text-lg font-medium">{result.name}</h3>
          {result.address && (
            <p className="text-sm text-gray-600 mt-1">{result.address}</p>
          )}
          <div className="flex items-center justify-between mt-2 text-sm">
            <div className="flex items-center space-x-4">
              {result.category && (
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600">
                  {result.category}
                </span>
              )}
              {result.isFavorite && (
                <span className="text-amber-500">★ Favori</span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <span>{result.distance.toFixed(1)} km</span>
              <span>•</span>
              <span>{result.duration} min</span>
            </div>
          </div>
          {result.description && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{result.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResultsList;
