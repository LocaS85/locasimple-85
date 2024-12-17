import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <HelpCircle className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-4">Foire Aux Questions</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Trouvez rapidement des réponses aux questions les plus fréquemment posées sur LocaSimple.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>Comment fonctionne LocaSimple ?</AccordionTrigger>
            <AccordionContent>
              LocaSimple est une plateforme qui vous permet de rechercher et d'optimiser vos trajets en fonction de vos besoins. Entrez simplement votre destination et vos préférences, et nous vous proposerons les meilleurs itinéraires.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>L'application est-elle gratuite ?</AccordionTrigger>
            <AccordionContent>
              LocaSimple propose une version gratuite avec des fonctionnalités de base et des forfaits premium pour accéder à des fonctionnalités avancées. Consultez notre page de tarification pour plus de détails.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Comment puis-je créer un compte ?</AccordionTrigger>
            <AccordionContent>
              La création d'un compte est simple et rapide. Cliquez sur le bouton "S'inscrire", remplissez le formulaire avec vos informations et validez votre email. Vous pouvez aussi vous connecter avec Google ou Facebook.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Quels types de lieux puis-je rechercher ?</AccordionTrigger>
            <AccordionContent>
              Vous pouvez rechercher une grande variété de lieux : restaurants, bars, parcs, commerces, lieux culturels, et bien plus encore. Nos filtres vous permettent d'affiner votre recherche selon vos préférences.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Comment fonctionne la recherche multi-destinations ?</AccordionTrigger>
            <AccordionContent>
              La recherche multi-destinations vous permet d'optimiser vos trajets entre plusieurs points d'intérêt. Ajoutez simplement toutes vos destinations, et nous calculerons l'itinéraire le plus efficace.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;