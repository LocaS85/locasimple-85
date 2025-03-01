
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

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
        <h1 className="text-4xl font-bold mb-4">{t('faq')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('faqDescription')}
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>{t('howLocaSimpleWorks')}</AccordionTrigger>
            <AccordionContent>
              {t('howLocaSimpleWorksAnswer')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>{t('isAppFree')}</AccordionTrigger>
            <AccordionContent>
              {t('isAppFreeAnswer')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>{t('howToCreateAccount')}</AccordionTrigger>
            <AccordionContent>
              {t('howToCreateAccountAnswer')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>{t('whatPlacesCanISearch')}</AccordionTrigger>
            <AccordionContent>
              {t('whatPlacesCanISearchAnswer')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>{t('howMultiDestinationsWork')}</AccordionTrigger>
            <AccordionContent>
              {t('howMultiDestinationsWorkAnswer')}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
