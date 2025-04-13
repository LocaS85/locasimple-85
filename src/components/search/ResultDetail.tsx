
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCategoryColorClass, getCategoryTextColor } from '@/utils/categoryColors';
import { getCategoryIcon } from '@/utils/categoryIcons';

export interface ResultDetailProps {
  place: any;
  onClose: () => void;
  transportMode: string;
  userLocation?: [number, number];
  showRoutes?: boolean;
}

const ResultDetail: React.FC<ResultDetailProps> = ({
  place,
  onClose,
  transportMode,
  userLocation,
  showRoutes = false
}) => {
  if (!place) return null;

  const getDistance = () => {
    if (place.distance) {
      return place.distance < 1 
        ? `${Math.round(place.distance * 1000)} m` 
        : `${place.distance.toFixed(1)} km`;
    }
    return '';
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg z-20 max-h-[70vh] overflow-y-auto">
      <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-bold">{place.name || 'Détails du lieu'}</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
          <X size={18} />
        </Button>
      </div>
      
      <div className="p-4 space-y-4">
        {place.category && (
          <div className="flex items-center gap-2">
            <span className={`flex items-center justify-center w-8 h-8 rounded-full ${getCategoryColorClass(place.category)}`}>
              {getCategoryIcon(place.category, "w-4 h-4")}
            </span>
            <span className={`font-medium ${getCategoryTextColor(place.category)}`}>{place.category}</span>
          </div>
        )}
        
        {place.address && (
          <div className="text-gray-700">
            <p>{place.address}</p>
          </div>
        )}
        
        {getDistance() && (
          <div className="text-sm text-gray-600">
            Distance: {getDistance()}
          </div>
        )}
        
        {place.description && (
          <div className="text-gray-600 mt-2">
            <p>{place.description}</p>
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button className="flex-1">Appeler</Button>
          <Button className="flex-1" variant="outline">Site Web</Button>
        </div>
        
        {userLocation && (
          <Button className="w-full mt-2" variant="default">
            Itinéraire {transportMode === 'driving' ? 'en voiture' : 
                       transportMode === 'walking' ? 'à pied' : 
                       transportMode === 'cycling' ? 'à vélo' : 
                       'en transport'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResultDetail;
