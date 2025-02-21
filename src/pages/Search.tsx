
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { History, Star, Search as SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Map from '@/components/Map';
import type { Result } from '@/components/ResultsList';
import { toast } from 'sonner';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    distance: "10",
    transport: "car",
    radius: "10",
  });
  const [history, setHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [results, setResults] = useState<Result[]>([]);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setHistory([...history, searchQuery]);
      console.log("Recherche pour :", searchQuery, filters);
      
      // Simule des résultats de recherche
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
      toast.success(`${mockResults.length} résultats trouvés`);
    }
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
            {/* Search Input */}
            <div className="flex space-x-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une adresse ou un lieu..."
                className="w-full"
              />
              <Button onClick={handleSearch}>
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={filters.transport}
                onValueChange={(value) => setFilters({ ...filters, transport: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Transport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Voiture</SelectItem>
                  <SelectItem value="walk">À pied</SelectItem>
                  <SelectItem value="bike">Vélo</SelectItem>
                  <SelectItem value="transit">Transport en commun</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.radius}
                onValueChange={(value) => setFilters({ ...filters, radius: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rayon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 km</SelectItem>
                  <SelectItem value="10">10 km</SelectItem>
                  <SelectItem value="15">15 km</SelectItem>
                  <SelectItem value="20">20 km</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count selector */}
            <Select
              value={filters.distance}
              onValueChange={(value) => setFilters({ ...filters, distance: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Nombre de résultats" />
              </SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} résultats
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* History and Favorites Buttons */}
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => console.log("Historique")} className="flex-1">
                <History className="mr-2 h-4 w-4" />
                Historique
              </Button>
              <Button variant="outline" onClick={() => console.log("Favoris")} className="flex-1">
                <Star className="mr-2 h-4 w-4" />
                Favoris
              </Button>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-auto">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => console.log('Selected:', result)}
                >
                  <h3 className="font-medium">{result.name}</h3>
                  <p className="text-sm text-gray-500">{result.address}</p>
                  <div className="text-sm text-gray-500 mt-1">
                    {result.distance} km • {result.duration} min
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative">
            <Map
              results={results}
              center={[2.3522, 48.8566]}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Search;
