
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
import { useLanguage } from '@/contexts/LanguageContext';

const Pricing = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const getLocalizedFeatures = (planId: string) => {
    if (planId === 'premium') {
      return [
        t('premiumFeature1') || 'Recherches illimitées',
        t('premiumFeature2') || 'Rayon de recherche jusqu\'à 25 km',
        t('premiumFeature3') || 'Filtres avancés (durée et distance)',
        t('premiumFeature4') || 'Jusqu\'à 10 résultats par recherche'
      ];
    } else {
      return [
        t('proFeature1') || 'Toutes les fonctionnalités Premium',
        t('proFeature2') || 'Rayon de recherche illimité',
        t('proFeature3') || 'Filtres personnalisables',
        t('proFeature4') || 'Résultats illimités par recherche',
        t('proFeature5') || 'Support prioritaire'
      ];
    }
  };

  const plans = [
    {
      id: 'premium',
      name: t('premium') || 'Premium',
      price: '9,99€',
      period: t('perMonth') || '/mois',
      description: t('forRegularUsers') || 'Pour utilisateurs réguliers',
      features: getLocalizedFeatures('premium')
    },
    {
      id: 'pro',
      name: t('pro') || 'Pro',
      price: '19,99€',
      period: t('perMonth') || '/mois',
      description: t('forProfessionals') || 'Pour professionnels',
      features: getLocalizedFeatures('pro'),
      popular: true
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('simplePricing') || 'Tarifs simples'}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('choosePlan') || 'Choisissez votre plan'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id} className={`border ${plan.popular ? 'border-primary shadow-lg relative' : 'border-gray-200'}`}>
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
                {t('popular') || 'Populaire'}
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
                {t('choosePlan') || 'Choisir ce plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">{t('specificNeeds') || 'Besoins spécifiques?'}</h2>
        <p className="text-lg text-gray-600 mb-6">
          {t('contactForCustomPlan') || 'Contactez-nous pour un plan personnalisé'}
        </p>
        <Button variant="outline" onClick={() => navigate('/contact')}>
          {t('contactUs') || 'Contactez-nous'}
        </Button>
      </div>
    </div>
  );
};

export default Pricing;
