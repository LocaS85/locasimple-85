
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabContent from "@/components/profile/ProfileTabContent";
import FavoritesTabContent from "@/components/profile/FavoritesTabContent";
import HistoryTabContent from "@/components/profile/HistoryTabContent";

const Profile = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Check if we're coming from another route and should show a specific tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['profile', 'favorites', 'history'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <ProfileHeader />

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
          <TabsTrigger value="favorites">{t('favorites')}</TabsTrigger>
          <TabsTrigger value="history">{t('history')}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTabContent />
        </TabsContent>

        <TabsContent value="favorites">
          <FavoritesTabContent />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
