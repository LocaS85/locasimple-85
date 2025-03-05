
import { useState } from "react";
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
import { Home, Search } from "lucide-react";
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

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
}

const ProfileTabContent = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Form state for profile
  const [profile, setProfile] = useState<ProfileFormData>({
    firstName: "John",
    lastName: "Doe",
    email: "john@exemple.com",
    phone: "+33 6 12 34 56 78",
    address: "123 rue de la Paix",
    postalCode: "75000",
    city: "Paris"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
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
            <Label htmlFor="firstName">{t('firstName')}</Label>
            <Input 
              id="firstName" 
              value={profile.firstName} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t('lastName')}</Label>
            <Input 
              id="lastName" 
              value={profile.lastName} 
              onChange={handleInputChange} 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input 
            id="email" 
            type="email" 
            value={profile.email} 
            onChange={handleInputChange} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t('phone')}</Label>
          <Input 
            id="phone" 
            value={profile.phone} 
            onChange={handleInputChange} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">{t('postalAddress')}</Label>
          <Input 
            id="address" 
            value={profile.address} 
            onChange={handleInputChange} 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">{t('postalCode')}</Label>
            <Input 
              id="postalCode" 
              value={profile.postalCode} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="city">{t('city')}</Label>
            <Input 
              id="city" 
              value={profile.city} 
              onChange={handleInputChange} 
            />
          </div>
        </div>
        <Button onClick={handleSaveChanges}>{t('saveChanges')}</Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => handleNavigation("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            {t('backToHome')}
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => handleNavigation("/search")}
          >
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
  );
};

export default ProfileTabContent;
