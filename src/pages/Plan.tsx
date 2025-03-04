
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Map, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Plan = () => {
  const { t } = useLanguage();

  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      description: "Parfait pour découvrir l'application",
      features: [
        "3 recherches par jour",
        "Rayon de recherche jusqu'à 5 km",
        "Filtre par distance uniquement",
        "Max 3 résultats par recherche",
        "Accès aux catégories de base",
        "Itinéraires simples",
      ],
      limitations: [
        "Pas de filtres par durée",
        "Pas d'itinéraires optimisés",
        "Nombre limité de favoris",
      ],
      buttonText: "Commencer gratuitement",
      popular: false,
      link: "/register",
    },
    {
      name: "Premium",
      price: "9,99€/mois",
      description: "Pour les utilisateurs réguliers",
      features: [
        "Recherches illimitées",
        "Rayon de recherche jusqu'à 25 km",
        "Filtres avancés (durée et distance)",
        "Jusqu'à 10 résultats par recherche",
        "Toutes les catégories disponibles",
        "Itinéraires optimisés",
        "Favoris illimités",
        "Pas de publicités",
      ],
      limitations: [
        "Pas d'analyses détaillées",
        "Support standard",
      ],
      buttonText: "Essayer 14 jours",
      popular: true,
      link: "/payment?plan=premium",
    },
    {
      name: "Pro",
      price: "19,99€/mois",
      description: "Pour les professionnels",
      features: [
        "Toutes les fonctionnalités Premium",
        "Rayon de recherche illimité",
        "Filtres personnalisables",
        "Résultats illimités par recherche",
        "API d'accès pour intégration",
        "Support prioritaire",
        "Analyses détaillées",
        "Itinéraires multi-stops avancés",
        "Personnalisation avancée",
      ],
      limitations: [],
      buttonText: "Nous contacter",
      popular: false,
      link: "/payment?plan=pro",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
            <Map className="mr-2 h-8 w-8" />
            Nos Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez le plan qui correspond le mieux à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 ${
                plan.popular ? 'border-2 border-primary ring-2 ring-primary/20 relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                  Populaire
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-4">{plan.price}</div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-2">Fonctionnalités</h4>
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {plan.limitations.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-lg mb-2">Limitations</h4>
                    <div className="space-y-3">
                      {plan.limitations.map((limitation, idx) => (
                        <div key={idx} className="flex items-center">
                          <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  asChild 
                  className={`w-full ${
                    plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                  size="lg"
                >
                  <Link to={plan.link}>
                    {plan.buttonText}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 space-y-8">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Comparaison des filtres</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="pb-4 pr-6">Fonctionnalité</th>
                    <th className="pb-4 px-4 text-center">Gratuit</th>
                    <th className="pb-4 px-4 text-center">Premium</th>
                    <th className="pb-4 px-4 text-center">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 pr-6 font-medium">Rayon de recherche</td>
                    <td className="py-3 px-4 text-center">Jusqu'à 5 km</td>
                    <td className="py-3 px-4 text-center">Jusqu'à 25 km</td>
                    <td className="py-3 px-4 text-center">Illimité</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 pr-6 font-medium">Filtre par distance</td>
                    <td className="py-3 px-4 text-center">Basique</td>
                    <td className="py-3 px-4 text-center">Avancé</td>
                    <td className="py-3 px-4 text-center">Personnalisable</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 pr-6 font-medium">Filtre par durée</td>
                    <td className="py-3 px-4 text-center">Non</td>
                    <td className="py-3 px-4 text-center">Jusqu'à 2 heures</td>
                    <td className="py-3 px-4 text-center">Illimité</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 pr-6 font-medium">Nombre de résultats</td>
                    <td className="py-3 px-4 text-center">Max 3</td>
                    <td className="py-3 px-4 text-center">Max 10</td>
                    <td className="py-3 px-4 text-center">Illimité</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 pr-6 font-medium">Filtres multi-critères</td>
                    <td className="py-3 px-4 text-center">Non</td>
                    <td className="py-3 px-4 text-center">Basique</td>
                    <td className="py-3 px-4 text-center">Avancé</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-6 font-medium">Modes de transport</td>
                    <td className="py-3 px-4 text-center">2 modes</td>
                    <td className="py-3 px-4 text-center">Tous les modes</td>
                    <td className="py-3 px-4 text-center">Tous les modes+</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">Des questions sur nos plans ?</p>
            <Button asChild variant="outline">
              <Link to="/contact">Contacter notre équipe</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan;
