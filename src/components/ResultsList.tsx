import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export interface Result {
  id: string;
  name: string;
  address: string;
  distance: number;
  duration: number;
  category: string;
  color: string;
}

interface ResultsListProps {
  results: Result[];
  onResultClick: (result: Result) => void;
}

const ResultsList = ({ results, onResultClick }: ResultsListProps) => {
  return (
    <div className="space-y-2">
      {results.map((result) => (
        <div
          key={result.id}
          onClick={() => onResultClick(result)}
          className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full bg-${result.color}/10`}>
                <MapPin className={`w-5 h-5 text-${result.color}`} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{result.name}</h3>
                <p className="text-sm text-gray-500">{result.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Navigation className="w-4 h-4" />
              <span>{result.distance}km</span>
              <span>•</span>
              <span>{result.duration} min</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsList;