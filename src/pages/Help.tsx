
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
        Retour
      </Button>

      <div className="text-center mb-12">
        <HelpCircle className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-4">Centre d'aide</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Trouvez des réponses à vos questions
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex gap-2">
          <Input placeholder="Rechercher dans l'aide" />
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
              Pour créer un compte, cliquez sur le bouton "S'inscrire" en haut à droite de la page d'accueil. Remplissez ensuite le formulaire avec vos informations personnelles et suivez les instructions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Comment rechercher un lieu ?</AccordionTrigger>
            <AccordionContent>
              Pour rechercher un lieu, rendez-vous sur la page de recherche et saisissez le nom du lieu ou le type d'établissement que vous recherchez. Vous pouvez ensuite filtrer les résultats par distance, durée ou catégorie.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Comment enregistrer des favoris ?</AccordionTrigger>
            <AccordionContent>
              Pour enregistrer un lieu en favori, cliquez sur l'icône en forme de cœur à côté du résultat de recherche ou sur la page de détail du lieu. Vous pouvez consulter vos favoris dans la section "Favoris" de votre profil.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Comment optimiser un itinéraire ?</AccordionTrigger>
            <AccordionContent>
              Pour optimiser un itinéraire avec plusieurs arrêts, sélectionnez d'abord tous les lieux que vous souhaitez visiter, puis cliquez sur le bouton "Optimiser l'itinéraire". L'application calculera automatiquement le trajet le plus efficace.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-4">Vous ne trouvez pas de réponse ?</h3>
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
