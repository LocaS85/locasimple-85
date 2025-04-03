
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Users, Building, Heart, Lightbulb, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
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

      <h1 className="text-4xl font-bold text-center mb-12">À propos de LocaSimple</h1>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <Card>
          <CardHeader>
            <Info className="w-12 h-12 text-primary mb-4" />
            <CardTitle>Notre Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              LocaSimple a pour mission de simplifier la recherche de lieux et l'optimisation des trajets pour tous. Notre plateforme innovante permet aux utilisateurs de trouver facilement les meilleurs itinéraires et points d'intérêt.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="w-12 h-12 text-secondary mb-4" />
            <CardTitle>Notre Équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Notre équipe passionnée combine expertise technique et connaissance approfondie des besoins des utilisateurs pour créer la meilleure expérience de navigation possible.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Building className="w-12 h-12 text-accent mb-4" />
            <CardTitle>Notre Histoire</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Fondée en 2024, LocaSimple est née de la volonté de simplifier la vie quotidienne en proposant une solution intuitive pour la recherche de lieux et l'optimisation des trajets.
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-3xl font-semibold text-center mb-8">Nos Valeurs</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <Card>
          <CardHeader>
            <Heart className="w-12 h-12 text-highlight mb-4" />
            <CardTitle>Accessibilité</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Nous croyons que la technologie doit être accessible à tous. Notre interface est conçue pour être simple et intuitive, permettant à chacun de trouver facilement ce qu'il cherche.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Lightbulb className="w-12 h-12 text-success mb-4" />
            <CardTitle>Innovation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              L'innovation est au cœur de notre approche. Nous développons constamment de nouvelles fonctionnalités pour améliorer l'expérience utilisateur et faciliter la recherche de lieux.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="w-12 h-12 text-primary mb-4" />
            <CardTitle>Fiabilité</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              La fiabilité est notre priorité. Nous nous engageons à fournir des informations précises et à jour pour garantir la meilleure expérience possible à nos utilisateurs.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-6">Notre Engagement</h2>
        <p className="text-gray-600 mb-8">
          Nous nous engageons à maintenir les plus hauts standards de qualité et d'éthique dans tout ce que nous faisons. Notre objectif est de créer une communauté où chacun peut facilement trouver et partager les meilleurs endroits à découvrir.
        </p>
      </div>
    </div>
  );
};

export default About;
