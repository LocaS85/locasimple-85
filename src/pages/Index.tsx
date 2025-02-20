
import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import SearchSection from '@/components/home/SearchSection';
import FeaturesSection from '@/components/home/FeaturesSection';
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
      <HeroSection />
      <SearchSection
        categories={categories}
        selectedCategories={selectedCategories}
        onCategorySelect={(categoryId) => setSelectedCategories(prev =>
          prev.includes(categoryId)
            ? prev.filter(id => id !== categoryId)
            : [...prev, categoryId]
        )}
        radius={radius}
        onRadiusChange={setRadius}
        transportMode={transportMode}
        onTransportModeChange={setTransportMode}
        resultsCount={resultsCount}
        onResultsCountChange={setResultsCount}
        results={results}
      />
      <FeaturesSection />
    </div>
  );
};

export default Index;
