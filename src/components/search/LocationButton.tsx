
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
    <div className="absolute bottom-24 right-4 z-10">
      <Button
        onClick={onClick}
        className={`rounded-full h-14 w-14 ${isLocationActive ? 'bg-secondary shadow-lg' : 'bg-white'} backdrop-blur-sm text-${isLocationActive ? 'white' : 'primary'} shadow-lg transition-all hover:scale-105`}
        disabled={loading}
        aria-label="Ma position"
      >
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <MapPin className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default LocationButton;
