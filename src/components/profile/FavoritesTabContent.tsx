
import { Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FavoritesTabContent = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const favoriteLocations = [1, 2, 3]; // Mock data

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('favorites')}</CardTitle>
        <CardDescription>
          {t('favoritesDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {favoriteLocations.map((i) => (
            <div 
              key={i} 
              className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" 
              onClick={() => handleNavigation(`/place/${i}`)}
            >
              <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                <MapPin className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{`Restaurant Exemple ${i}`}</h3>
                <p className="text-sm text-muted-foreground">
                  {`${123 + i} rue de la Paix, Paris`}
                </p>
              </div>
              <Heart className="text-red-500 h-5 w-5" />
            </div>
          ))}
          
          {favoriteLocations.length === 0 && (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">{t('noFavorites')}</h3>
              <p className="text-gray-500 mb-4">{t('noFavoritesDescription')}</p>
              <Button onClick={() => handleNavigation("/search")}>
                <Search className="mr-2 h-4 w-4" />
                {t('searchPlaces')}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoritesTabContent;
