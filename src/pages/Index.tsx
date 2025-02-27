
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, Navigation, MapPin, Info, Phone } from 'lucide-react';

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

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
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
