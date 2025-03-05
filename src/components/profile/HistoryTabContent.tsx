
import { Clock, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const HistoryTabContent = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const searchHistory = [1, 2, 3, 4]; // Mock data

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('searchHistory')}</CardTitle>
        <CardDescription>
          {t('searchHistoryDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {searchHistory.map((i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
              <Clock className="text-muted-foreground h-5 w-5" />
              <div>
                <h3 className="font-medium">{`Recherche: ${i === 1 ? 'Restaurants à Paris' : i === 2 ? 'Hôtels à Lyon' : i === 3 ? 'Cafés à Marseille' : 'Musées à Toulouse'}`}</h3>
                <p className="text-sm text-muted-foreground">{t('daysAgo')} {i} {i > 1 ? t('days') : t('day')}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto" 
                onClick={() => handleNavigation("/search")}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryTabContent;
