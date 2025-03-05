
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Clock, Heart, ArrowLeft, Home, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleDeleteAccount = () => {
    toast.success(t('accountDeleted') || "Votre compte a été supprimé avec succès");
    navigate("/");
  };

  const handleSaveChanges = () => {
    toast.success(t('changesSaved') || "Modifications enregistrées avec succès");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('back')}
      </Button>

      <div className="flex items-center space-x-4 p-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t('myProfile')}</h1>
          <p className="text-muted-foreground">{t('updatePersonalInfo')}</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
          <TabsTrigger value="favorites">{t('favorites')}</TabsTrigger>
          <TabsTrigger value="history">{t('history')}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t('personalInfo')}</CardTitle>
              <CardDescription>
                {t('updatePersonalInfo')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">{t('firstName')}</Label>
                  <Input id="firstname" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">{t('lastName')}</Label>
                  <Input id="name" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input id="email" type="email" placeholder="john@exemple.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('phone')}</Label>
                <Input id="phone" placeholder="+33 6 12 34 56 78" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">{t('postalAddress')}</Label>
                <Input id="address" placeholder="123 rue de la Paix" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal-code">{t('postalCode')}</Label>
                  <Input id="postal-code" placeholder="75000" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="city">{t('city')}</Label>
                  <Input id="city" placeholder="Paris" />
                </div>
              </div>
              <Button onClick={handleSaveChanges}>{t('saveChanges')}</Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                <Button variant="outline" className="w-full" onClick={() => handleNavigation("/")}>
                  <Home className="mr-2 h-4 w-4" />
                  {t('backToHome')}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleNavigation("/search")}>
                  <Search className="mr-2 h-4 w-4" />
                  {t('search')}
                </Button>
              </div>

              <div className="pt-6 border-t mt-6">
                <h3 className="text-lg font-semibold text-destructive mb-4">{t('dangerZone')}</h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      {t('deleteAccount')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('deleteConfirmDescription')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {t('confirmDelete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>{t('favorites')}</CardTitle>
              <CardDescription>
                {t('favoritesDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleNavigation(`/place/${i}`)}>
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
                
                {[1, 2, 3].length === 0 && (
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
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{t('searchHistory')}</CardTitle>
              <CardDescription>
                {t('searchHistoryDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Clock className="text-muted-foreground h-5 w-5" />
                    <div>
                      <h3 className="font-medium">{`Recherche: ${i === 1 ? 'Restaurants à Paris' : i === 2 ? 'Hôtels à Lyon' : i === 3 ? 'Cafés à Marseille' : 'Musées à Toulouse'}`}</h3>
                      <p className="text-sm text-muted-foreground">{t('daysAgo')} {i} {i > 1 ? t('days') : t('day')}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto" onClick={() => handleNavigation("/search")}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
