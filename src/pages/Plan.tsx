
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

const Plan = () => {
  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      description: "Parfait pour découvrir l'application",
      features: [
        "3 recherches par jour",
        "Accès aux catégories de base",
        "Itinéraires simples",
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
        "Toutes les catégories disponibles",
        "Itinéraires optimisés",
        "Favoris illimités",
        "Pas de publicités",
      ],
      buttonText: "Essayer 14 jours gratuits",
      popular: true,
      link: "/register?plan=premium",
    },
    {
      name: "Pro",
      price: "19,99€/mois",
      description: "Pour les professionnels",
      features: [
        "Toutes les fonctionnalités Premium",
        "API d'accès pour intégration",
        "Support prioritaire",
        "Analyses détaillées",
        "Itinéraires multi-stops avancés",
        "Personnalisation avancée",
      ],
      buttonText: "Contactez-nous",
      popular: false,
      link: "/contact?plan=pro",
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
            Choisissez le plan qui correspond le mieux à vos besoins pour optimiser vos déplacements
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
                
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
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
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Vous avez des questions sur nos plans ?</p>
          <Button asChild variant="outline">
            <Link to="/contact">Contactez notre équipe</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Plan;
