import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import CategorySelector from '@/components/CategorySelector';
import FilterPanel from '@/components/FilterPanel';
import ResultsList from '@/components/ResultsList';
import Map from '@/components/Map';
import { Button } from '@/components/ui/button';
import type { Category } from '@/components/CategorySelector';
import type { Result } from '@/components/ResultsList';
import { motion } from 'framer-motion';

const categories: Category[] = [
  { id: 'restaurant', name: 'Restaurants', icon: '🍽️', color: 'primary' },
  { id: 'bar', name: 'Bars', icon: '🍺', color: 'secondary' },
  { id: 'park', name: 'Parcs', icon: '🌳', color: 'success' },
  { id: 'shop', name: 'Commerces', icon: '🛍️', color: 'accent' },
  { id: 'culture', name: 'Culture', icon: '🎭', color: 'highlight' },
];

const Index = () => {
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [radius, setRadius] = useState(5);
  const [transportMode, setTransportMode] = useState('driving');
  const [resultsCount, setResultsCount] = useState(5);
  const [results, setResults] = useState<Result[]>([]);

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
      <section className="bg-white py-10 md:py-20 px-4 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">LocaSimple</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 px-4">Simplifiez vos trajets, optimisez votre temps</p>
          <div className="space-y-4">
            <Button asChild size="lg" className="w-full sm:w-auto mb-4">
              <Link to="/register">Essayer maintenant</Link>
            </Button>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/pricing" className="text-primary hover:underline">
                Voir nos plans d'abonnement
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Search Section */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-20rem)]">
        <div className="w-full lg:w-96 h-full flex flex-col p-4 space-y-4 border-b lg:border-b-0 lg:border-r bg-white">
          <SearchBar onSearch={(query) => console.log('Searching:', query)} />
          <CategorySelector
            categories={categories}
            selectedCategories={selectedCategories}
            onSelect={(categoryId) => setSelectedCategories(prev =>
              prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
            )}
          />
          <FilterPanel
            radius={radius}
            onRadiusChange={setRadius}
            transportMode={transportMode}
            onTransportModeChange={setTransportMode}
            resultsCount={resultsCount}
            onResultsCountChange={setResultsCount}
          />
          <div className="flex-1 overflow-auto">
            <ResultsList
              results={results}
              onResultClick={(result) => console.log('Clicked:', result)}
            />
          </div>
        </div>

        <div className="flex-1 relative min-h-[300px] lg:min-h-0">
          <Map
            results={results}
            center={[2.3522, 48.8566]} // Paris coordinates
          />
        </div>
      </div>

      {/* Features Section */}
      <section className="py-10 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Fonctionnalités principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center p-4 md:p-6"
            >
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Recherche multi-catégories</h3>
              <p className="text-gray-600">Trouvez plusieurs types de lieux en une seule recherche</p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-4 md:p-6"
            >
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Itinéraires optimisés</h3>
              <p className="text-gray-600">Calculez les meilleurs trajets selon vos préférences</p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center p-4 md:p-6"
            >
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Favoris personnalisés</h3>
              <p className="text-gray-600">Enregistrez vos lieux préférés pour y accéder rapidement</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">À propos</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-gray-300">À propos de nous</Link></li>
                <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="hover:text-gray-300">Conditions d'utilisation</Link></li>
                <li><Link to="/privacy" className="hover:text-gray-300">Politique de confidentialité</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/faq" className="hover:text-gray-300">FAQ</Link></li>
                <li><Link to="/help" className="hover:text-gray-300">Aide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suivez-nous</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-gray-300">Twitter</a>
                <a href="#" className="hover:text-gray-300">Facebook</a>
                <a href="#" className="hover:text-gray-300">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
