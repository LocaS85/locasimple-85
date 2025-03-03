
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, MapPinCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LocationButtonProps {
  onLocationClick: () => void;
  isLocationActive: boolean;
}

export const LocationButton: React.FC<LocationButtonProps> = ({
  onLocationClick,
  isLocationActive
}) => {
  const { t } = useLanguage();
  
  return (
    <Button 
      className={`rounded-full border-2 px-4 py-2 shadow-md
      ${isLocationActive 
        ? "border-primary bg-primary text-white hover:bg-primary/90" 
        : "border-black bg-white text-black hover:bg-gray-100"
      }`}
      onClick={onLocationClick}
      aria-pressed={isLocationActive}
    >
      {isLocationActive ? (
        <MapPinCheck className="mr-2 h-4 w-4" />
      ) : (
        <MapPin className="mr-2 h-4 w-4" />
      )}
      Ma position
    </Button>
  );
};
