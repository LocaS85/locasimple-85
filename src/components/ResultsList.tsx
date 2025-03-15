
import React from 'react';

export interface Result {
  id: string;
  name: string;
  address?: string;
  category?: string;
  categories?: string[];
  distance?: number;
  duration?: number;
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
}

interface ResultsListProps {
  results: Result[];
  onResultClick?: (result: Result) => void;
  selectedResultId?: string;
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
              {result.distance !== undefined && (
                <span className="text-gray-600">{result.distance} km</span>
              )}
              {result.duration !== undefined && (
                <span className="text-gray-600">{result.duration} min</span>
              )}
            </div>
            {result.rating !== undefined && (
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1">{result.rating}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsList;
