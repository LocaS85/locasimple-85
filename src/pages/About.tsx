import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Users, Building } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto py-12 px-4">
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

      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-6">Nos Valeurs</h2>
        <p className="text-gray-600 mb-8">
          Nous croyons en la simplicité, l'efficacité et l'innovation. Notre objectif est de rendre la technologie accessible à tous et de contribuer à une meilleure organisation du quotidien.
        </p>
      </div>
    </div>
  );
};

export default About;