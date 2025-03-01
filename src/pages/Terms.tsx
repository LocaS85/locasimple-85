
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-12 px-4">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('back')}
      </Button>

      <div className="text-center mb-12">
        <FileText className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-4">{t('termsConditions')}</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">1. {t('acceptTerms').split('.')[0]}</h2>
            <p className="text-gray-600 mb-4">
              {t('acceptTerms')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">2. {t('serviceDescription').split(' ')[0]}</h2>
            <p className="text-gray-600 mb-4">
              {t('serviceDescription')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">3. {t('termsOfService')}</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              {t('termsOfServiceDetails').split('\n').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">4. {t('intellectualProperty')}</h2>
            <p className="text-gray-600 mb-4">
              {t('intellectualPropertyDetails')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
