
import React from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';

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
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-full bg-${result.color}/10`}>
              <MapPin className={`w-5 h-5 text-${result.color}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{result.name}</h3>
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
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsList;
