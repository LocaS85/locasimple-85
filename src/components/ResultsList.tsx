
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, MapPin } from 'lucide-react';

export interface Result {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance?: number;
  duration?: number;
  address?: string;
  category?: string;
  color?: string;
}

interface ResultsListProps {
  results: Result[];
  onResultClick?: (result: Result) => void;
  selectedResultId?: string;
}

const ResultsList: React.FC<ResultsListProps> = ({ 
  results, 
  onResultClick,
  selectedResultId
}) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Aucun résultat trouvé
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {results.map((result) => (
        <Card 
          key={result.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedResultId === result.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onResultClick?.(result)}
        >
          <CardContent className="p-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-sm">{result.name}</h3>
                {result.address && (
                  <div className="text-xs text-gray-500 flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {result.address}
                  </div>
                )}
              </div>
              {result.category && (
                <Badge className="ml-2" variant="outline">
                  {result.category}
                </Badge>
              )}
            </div>
            
            {(result.distance !== undefined || result.duration !== undefined) && (
              <div className="flex items-center mt-2 text-xs text-gray-600">
                {result.distance !== undefined && (
                  <div className="mr-3">
                    <ExternalLink className="h-3 w-3 inline mr-1" />
                    {result.distance} km
                  </div>
                )}
                {result.duration !== undefined && (
                  <div>
                    <Clock className="h-3 w-3 inline mr-1" />
                    {result.duration} min
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ResultsList;
