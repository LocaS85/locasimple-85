
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Search, MessageCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Help = () => {
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
        <HelpCircle className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-4">{t('helpCenter')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('helpCenterDescription')}
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex gap-2">
          <Input placeholder={t('searchHelp')} />
          <Button>
            <Search className="w-4 h-4 mr-2" />
            {t('search')}
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">{t('faq')}</h2>
        
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>{t('howToCreateAccount')}</AccordionTrigger>
            <AccordionContent>
              {t('howToCreateAccountAnswer')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>{t('howToSearchPlace')}</AccordionTrigger>
            <AccordionContent>
              {t('howToSearchPlaceAnswer')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>{t('howToSaveFavorites')}</AccordionTrigger>
            <AccordionContent>
              {t('howToSaveFavoritesAnswer')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>{t('howToOptimizeRoute')}</AccordionTrigger>
            <AccordionContent>
              {t('howToOptimizeRouteAnswer')}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-4">{t('cantFindHelp')}</h3>
          <p className="text-gray-600 mb-6">
            {t('supportTeamHelp')}
          </p>
          <Button>
            <MessageCircle className="w-4 h-4 mr-2" />
            {t('contactSupport')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Help;
