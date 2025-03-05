
import { User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileHeader = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <>
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
    </>
  );
};

export default ProfileHeader;
