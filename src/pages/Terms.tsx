
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
        Retour
      </Button>

      <div className="text-center mb-12">
        <FileText className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-4">Conditions d'utilisation</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">1. Acceptation des Conditions</h2>
            <p className="text-gray-600 mb-4">
              En utilisant notre service, vous acceptez nos conditions d'utilisation.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">2. Description</h2>
            <p className="text-gray-600 mb-4">
              Notre service vous permet de trouver facilement des lieux à proximité.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">3. Conditions de service</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Vous êtes responsable de vos actions sur la plateforme.</li>
              <li>Vous ne devez pas utiliser nos services à des fins illégales.</li>
              <li>Nous nous réservons le droit de modifier ces conditions.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">4. Propriété intellectuelle</h2>
            <p className="text-gray-600 mb-4">
              Tous les contenus présents sur notre plateforme sont protégés par le droit d'auteur.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
