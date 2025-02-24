
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Index = () => {
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLaunchScreen(false);
    }, 3000);

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
            className="text-6xl font-bold mb-4"
          >
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
      <section className="bg-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">LocaSimple</h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Simplifiez vos trajets, optimisez votre temps
        </p>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto aspect-video bg-black rounded-lg overflow-hidden">
            <video
              className="w-full h-full object-cover"
              controls
              poster="/placeholder.svg"
            >
              <source src="/demo.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
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
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">
                Recherche multi-catégories
              </h3>
              <p className="text-gray-600">
                Trouvez plusieurs types de lieux en une seule recherche
              </p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">
                Itinéraires optimisés
              </h3>
              <p className="text-gray-600">
                Calculez les meilleurs trajets selon vos préférences
              </p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">
                Favoris personnalisés
              </h3>
              <p className="text-gray-600">
                Enregistrez vos lieux préférés pour y accéder rapidement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Abonnement</h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h3 className="text-2xl font-semibold mb-4">Commencez gratuitement</h3>
              <p className="text-gray-600 mb-8">
                Essayez toutes nos fonctionnalités pendant 14 jours
              </p>
              <Button asChild size="lg">
                <Link to="/register">Essayer maintenant</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
