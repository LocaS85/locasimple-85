
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
        Retour
      </Button>
      
      <div className="text-center mb-12">
        <HelpCircle className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-4">Foire aux questions</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Les réponses aux questions fréquemment posées
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>Comment fonctionne LocaSimple ?</AccordionTrigger>
            <AccordionContent>
              LocaSimple utilise votre position et vos préférences pour vous montrer les lieux qui correspondent à vos besoins dans un rayon que vous définissez. Vous pouvez filtrer par type de lieu, distance, durée et mode de transport.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>L'application est-elle gratuite ?</AccordionTrigger>
            <AccordionContent>
              Oui, l'application de base est gratuite. Nous proposons également des plans premium avec des fonctionnalités supplémentaires pour répondre aux besoins des utilisateurs les plus exigeants.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Comment créer un compte ?</AccordionTrigger>
            <AccordionContent>
              Pour créer un compte, cliquez sur le bouton "S'inscrire" dans le menu. Vous pouvez vous inscrire avec votre adresse e-mail ou via Google ou Facebook.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Quels types de lieux puis-je rechercher ?</AccordionTrigger>
            <AccordionContent>
              Vous pouvez rechercher une grande variété de lieux, y compris des restaurants, des magasins, des services, des attractions touristiques, et bien plus encore.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Comment fonctionne la recherche multi-destinations ?</AccordionTrigger>
            <AccordionContent>
              La recherche multi-destinations vous permet de planifier un itinéraire avec plusieurs arrêts. Vous pouvez ajouter jusqu'à 10 destinations et l'application calculera l'itinéraire le plus efficace.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
