
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: 'premium',
      name: 'Premium',
      price: '9,99€',
      period: 'par mois',
      description: 'Pour les utilisateurs réguliers',
      features: [
        'Recherches illimitées',
        'Rayon de recherche jusqu\'à 25 km',
        'Filtres avancés (durée et distance)',
        'Jusqu\'à 10 résultats par recherche'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '19,99€',
      period: 'par mois',
      description: 'Pour les professionnels',
      features: [
        'Toutes les fonctionnalités Premium',
        'Rayon de recherche illimité',
        'Filtres personnalisables',
        'Résultats illimités par recherche',
        'Support prioritaire'
      ],
      popular: true
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Tarifs simples et transparents</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choisissez le plan qui correspond à vos besoins. Tous nos plans incluent une période d'essai de 7 jours.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id} className={`border ${plan.popular ? 'border-primary shadow-lg relative' : 'border-gray-200'}`}>
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
                Populaire
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-500 ml-1">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${plan.popular ? '' : 'bg-gray-800 hover:bg-gray-700'}`}
                onClick={() => navigate(`/payment?plan=${plan.id}`)}
              >
                Choisir ce plan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Vous avez des besoins particuliers ?</h2>
        <p className="text-lg text-gray-600 mb-6">
          Contactez-nous pour obtenir un plan personnalisé adapté à vos besoins spécifiques.
        </p>
        <Button variant="outline" onClick={() => navigate('/contact')}>
          Nous contacter
        </Button>
      </div>
    </div>
  );
};

export default Pricing;
