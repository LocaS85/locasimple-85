import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
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
        <FileText className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-4">Conditions Générales d'Utilisation</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">1. Acceptation des conditions</h2>
            <p className="text-gray-600 mb-4">
              En accédant et en utilisant LocaSimple, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">2. Description du service</h2>
            <p className="text-gray-600 mb-4">
              LocaSimple est une plateforme de recherche et d'optimisation d'itinéraires qui permet aux utilisateurs de trouver et d'organiser leurs déplacements de manière efficace.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">3. Conditions d'utilisation</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Vous devez avoir au moins 18 ans pour utiliser ce service</li>
              <li>Vous êtes responsable de maintenir la confidentialité de votre compte</li>
              <li>Vous acceptez de ne pas utiliser le service à des fins illégales</li>
              <li>Vous acceptez de ne pas perturber ou interrompre le service</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">4. Propriété intellectuelle</h2>
            <p className="text-gray-600 mb-4">
              Tout le contenu présent sur LocaSimple est protégé par les droits d'auteur et autres lois sur la propriété intellectuelle. Vous n'êtes pas autorisé à reproduire, distribuer ou créer des œuvres dérivées sans notre autorisation écrite.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
