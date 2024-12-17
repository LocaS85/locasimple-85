import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import CategorySelector from '@/components/CategorySelector';
import FilterPanel from '@/components/FilterPanel';
import ResultsList from '@/components/ResultsList';
import Map from '@/components/Map';
import { Button } from '@/components/ui/button';
import type { Category } from '@/components/CategorySelector';
import type { Result } from '@/components/ResultsList';

const categories: Category[] = [
  { id: 'restaurant', name: 'Restaurants', icon: '🍽️', color: 'primary' },
  { id: 'bar', name: 'Bars', icon: '🍺', color: 'secondary' },
  { id: 'park', name: 'Parcs', icon: '🌳', color: 'success' },
  { id: 'shop', name: 'Commerces', icon: '🛍️', color: 'accent' },
  { id: 'culture', name: 'Culture', icon: '🎭', color: 'highlight' },
];

const Index = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [radius, setRadius] = useState(5);
  const [transportMode, setTransportMode] = useState('driving');
  const [resultsCount, setResultsCount] = useState(5);
  const [results, setResults] = useState<Result[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">LocaSimple</h1>
        <p className="text-xl text-gray-600 mb-8">Simplifiez vos trajets, optimisez votre temps</p>
        <Button asChild size="lg" className="mb-8">
          <Link to="/register">Essayer maintenant</Link>
        </Button>
      </section>

      {/* Search Section */}
      <div className="flex h-[calc(100vh-20rem)] bg-gray-50">
        <div className="w-96 h-full flex flex-col p-4 space-y-4 border-r bg-white">
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

        <div className="flex-1 relative">
          <Map
            results={results}
            center={[2.3522, 48.8566]} // Paris coordinates
          />
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">Recherche multi-catégories</h3>
              <p className="text-gray-600">Trouvez plusieurs types de lieux en une seule recherche</p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">Itinéraires optimisés</h3>
              <p className="text-gray-600">Calculez les meilleurs trajets selon vos préférences</p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-4">Favoris personnalisés</h3>
              <p className="text-gray-600">Enregistrez vos lieux préférés pour y accéder rapidement</p>
            </div>
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
                <li><Link to="/about">À propos de nous</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms">Conditions d'utilisation</Link></li>
                <li><Link to="/privacy">Politique de confidentialité</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/help">Aide</Link></li>
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