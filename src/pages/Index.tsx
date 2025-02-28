
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, Navigation, MapPin, Info, Phone, Map } from 'lucide-react';

const Index = () => {
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLaunchScreen(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showLaunchScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-white"
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-6xl font-bold mb-4 flex items-center justify-center"
          >
            <MapPin className="mr-2 h-10 w-10" />
            LocaSimple
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl mb-8"
          >
            Simplifiez vos trajets, optimisez votre temps
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">LocaSimple</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Simplifiez vos trajets, optimisez votre temps
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/search" className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Commencer la recherche
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/categories" className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Explorer les catégories
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Fonctionnalités principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all"
            >
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Recherche multi-catégories
              </h3>
              <p className="text-gray-600">
                Trouvez plusieurs types de lieux en une seule recherche
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all"
            >
              <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Itinéraires optimisés
              </h3>
              <p className="text-gray-600">
                Calculez les meilleurs trajets selon vos préférences
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all"
            >
              <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Favoris personnalisés
              </h3>
              <p className="text-gray-600">
                Enregistrez vos lieux préférés pour y accéder rapidement
              </p>
            </motion.div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild>
              <Link to="/about" className="flex items-center">
                <Info className="mr-2 h-4 w-4" />
                En savoir plus
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Nos plans
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Choisissez l'offre qui correspond le mieux à vos besoins
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all"
            >
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold">Gratuit</h3>
                <p className="text-3xl font-bold my-4">0€</p>
                <p className="text-gray-600 mb-4">Parfait pour découvrir l'application</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>3 recherches par jour</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Catégories de base</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Itinéraires simples</span>
                </li>
              </ul>
              <Button asChild className="w-full" variant="outline">
                <Link to="/register">
                  Commencer gratuitement
                </Link>
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md p-6 border-2 border-primary relative hover:shadow-lg transition-all"
            >
              <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
                Populaire
              </div>
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold">Premium</h3>
                <p className="text-3xl font-bold my-4">9,99€<span className="text-lg font-normal">/mois</span></p>
                <p className="text-gray-600 mb-4">Pour les utilisateurs réguliers</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Recherches illimitées</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Toutes les catégories</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Itinéraires optimisés</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Favoris illimités</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/register?plan=premium">
                  Essayer 14 jours gratuits
                </Link>
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all"
            >
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold">Pro</h3>
                <p className="text-3xl font-bold my-4">19,99€<span className="text-lg font-normal">/mois</span></p>
                <p className="text-gray-600 mb-4">Pour les professionnels</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Tout Premium +</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>API d'accès</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Support prioritaire</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Analyses détaillées</span>
                </li>
              </ul>
              <Button asChild className="w-full" variant="outline">
                <Link to="/contact?plan=pro">
                  Contactez-nous
                </Link>
              </Button>
            </motion.div>
          </div>
          
          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link to="/plan" className="flex items-center">
                <Map className="mr-2 h-5 w-5" />
                Voir tous les détails des plans
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-lg shadow-lg p-8 text-center">
              <h3 className="text-2xl font-semibold mb-4">Prêt à simplifier vos déplacements ?</h3>
              <p className="text-gray-600 mb-8">
                Inscrivez-vous gratuitement et commencez à explorer
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/register">Créer un compte</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/contact" className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
