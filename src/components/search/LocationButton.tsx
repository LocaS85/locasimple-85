
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LocationButtonProps {
  onLocationClick: () => void;
}

export const LocationButton: React.FC<LocationButtonProps> = ({
  onLocationClick
}) => {
  const { t } = useLanguage();
  
  return (
    <Button 
      className="w-full sm:w-auto rounded-full border-2 border-black bg-white text-black hover:bg-gray-100"
      onClick={onLocationClick}
    >
      <MapPin className="mr-2 h-4 w-4" />
      {t('my_position') || 'Ma position'}
    </Button>
  );
};
