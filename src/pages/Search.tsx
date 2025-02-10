
import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import ResultsList from '@/components/ResultsList';
import Map from '@/components/Map';
import { Button } from '@/components/ui/button';
import { History, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Result } from '@/components/ResultsList';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [radius, setRadius] = useState(5);
  const [transportMode, setTransportMode] = useState('driving');
  const [resultsCount, setResultsCount] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [results, setResults] = useState<Result[]>([]);

  const handleSearch = (query: string) => {
    // Simulate search results for now
    const mockResults: Result[] = [
      {
        id: '1',
        name: 'Restaurant Le Français',
        address: '123 Rue de Paris',
        distance: 0.5,
        duration: 10,
        category: 'restaurant',
        color: 'primary',
        latitude: 48.8584,
        longitude: 2.2945
      },
      {
        id: '2',
        name: 'Café de la Place',
        address: '45 Avenue des Champs-Élysées',
        distance: 1.2,
        duration: 15,
        category: 'bar',
        color: 'secondary',
        latitude: 48.8738,
        longitude: 2.3012
      }
    ];
    setResults(mockResults);
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto p-4"
      >
        <div className="flex h-[calc(100vh-2rem)] bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Left Panel */}
          <div className="w-96 h-full flex flex-col p-4 space-y-4 border-r">
            <SearchBar onSearch={handleSearch} />
            
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <History className="mr-2 h-4 w-4" />
                Historique
              </Button>
              <Button variant="outline" className="flex-1">
                <Star className="mr-2 h-4 w-4" />
                Favoris
              </Button>
            </div>

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
                onResultClick={(result) => {
                  console.log('Selected result:', result);
                }}
              />
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative">
            <Map
              results={results}
              center={[2.3522, 48.8566]} // Paris coordinates
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Search;
