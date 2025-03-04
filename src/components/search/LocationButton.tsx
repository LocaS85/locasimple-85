
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationButtonProps {
  loading: boolean;
  isLocationActive: boolean;
  onClick: () => void;
}

export const LocationButton: React.FC<LocationButtonProps> = ({ loading, isLocationActive, onClick }) => {
  return (
    <div className="absolute bottom-20 left-4 z-10">
      <Button
        onClick={onClick}
        className={`rounded-full h-12 w-12 ${isLocationActive ? 'bg-secondary' : 'bg-primary'} text-white shadow-lg transition-colors`}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <MapPin className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default LocationButton;
