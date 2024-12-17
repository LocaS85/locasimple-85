import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Search, MessageCircle } from "lucide-react";

const Help = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <HelpCircle className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-4">Centre d'aide</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Trouvez rapidement des réponses à vos questions et apprenez à utiliser toutes les fonctionnalités de LocaSimple
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex gap-2">
          <Input placeholder="Rechercher une aide..." />
          <Button>
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Questions fréquentes</h2>
        
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>Comment créer un compte ?</AccordionTrigger>
            <AccordionContent>
              Pour créer un compte, cliquez sur le bouton "S'inscrire" en haut à droite de la page. 
              Vous pouvez vous inscrire avec votre email, ou utiliser vos comptes Google ou Facebook.
              Suivez simplement les étapes indiquées pour finaliser votre inscription.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Comment rechercher un lieu ?</AccordionTrigger>
            <AccordionContent>
              Sur la page d'accueil, utilisez la barre de recherche principale.
              Vous pouvez entrer une adresse, un nom de lieu ou une catégorie.
              Utilisez les filtres pour affiner votre recherche selon vos besoins.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Comment sauvegarder mes lieux favoris ?</AccordionTrigger>
            <AccordionContent>
              Pour sauvegarder un lieu en favori, cliquez sur l'icône en forme de cœur 
              à côté du lieu que vous souhaitez sauvegarder. Vous retrouverez tous vos 
              favoris dans votre profil, dans l'onglet "Favoris".
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Comment optimiser mon itinéraire ?</AccordionTrigger>
            <AccordionContent>
              Lors de votre recherche, sélectionnez plusieurs lieux que vous souhaitez visiter.
              LocaSimple calculera automatiquement l'itinéraire le plus optimal en fonction
              de vos préférences de transport et de temps.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-4">Vous ne trouvez pas ce que vous cherchez ?</h3>
          <p className="text-gray-600 mb-6">
            Notre équipe de support est là pour vous aider
          </p>
          <Button>
            <MessageCircle className="w-4 h-4 mr-2" />
            Contacter le support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Help;