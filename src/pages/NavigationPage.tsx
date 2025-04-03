
import React from 'react';
import MapComponent from '@/components/map/MapComponent';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const NavigationPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col h-screen">
      <div className="absolute top-0 left-0 z-10 p-4">
        <Button 
          variant="outline"
          size="icon"
          className="bg-white/80 backdrop-blur-sm rounded-full h-8 w-8 shadow-md"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 text-app-dark" />
        </Button>
      </div>
      <div className="flex-grow">
        <MapComponent />
      </div>
    </div>
  );
};

export default NavigationPage;
