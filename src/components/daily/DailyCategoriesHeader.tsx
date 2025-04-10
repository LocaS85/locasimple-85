
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Star, StarOff } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface DailyCategoriesHeaderProps {
  showOnlyFavorites: boolean;
  showMap: boolean;
  setShowOnlyFavorites: (value: boolean) => void;
  setShowMap: (value: boolean) => void;
}

const DailyCategoriesHeader: React.FC<DailyCategoriesHeaderProps> = ({
  showOnlyFavorites,
  showMap,
  setShowOnlyFavorites,
  setShowMap
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/categories');
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBack} 
        className="mb-4 flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>

      <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6 gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">Quotidien</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          >
            {showOnlyFavorites ? <StarOff className="h-4 w-4 mr-1" /> : <Star className="h-4 w-4 mr-1" />}
            {showOnlyFavorites ? "Tous" : "Favoris"}
          </Button>
          
          <Button 
            variant={showMap ? "secondary" : "outline"} 
            size="sm"
            onClick={() => setShowMap(!showMap)}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Carte
          </Button>
        </div>
      </div>
    </>
  );
};

export default DailyCategoriesHeader;
