
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
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
        <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-4">Politique de confidentialité</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comment nous protégeons vos données personnelles
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <Lock className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Collecte de données</h2>
            </div>
            <p className="text-gray-600">
              Nous collectons certaines données personnelles pour améliorer votre expérience sur notre plateforme.
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
              <li>Informations de profil</li>
              <li>Données de localisation</li>
              <li>Historique de recherche</li>
              <li>Préférences de navigation</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <Eye className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-semibold">Utilisation des données</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Les données collectées sont utilisées pour personnaliser votre expérience et améliorer nos services.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Personnaliser votre expérience</li>
              <li>Améliorer nos services</li>
              <li>Envoyer des notifications</li>
              <li>Sécurité de votre compte</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-semibold">Protection des données</h2>
            </div>
            <p className="text-gray-600">
              Nous mettons en œuvre des mesures de sécurité pour protéger vos données personnelles.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
