
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import SubCategoryTile from '@/components/category/SubCategoryTile';
import EnhancedMapComponent from '@/components/map/EnhancedMapComponent';
import { DAILY_SEARCH_CATEGORIES, SearchFilters } from '@/types/dailySearchCategories';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';

const CategorySearch = () => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    radius: 5,
    unit: 'km',
    transport: 'driving',
    openNow: false
  });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]); // Default to Paris
  
  // Get current location
  const handleGetLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          toast.success('Position actualisée');
          setLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Impossible de récupérer votre position');
          setLoading(false);
        }
      );
    } else {
      toast.error('La géolocalisation n\'est pas supportée par votre navigateur');
      setLoading(false);
    }
  };
  
  // Search places based on selected subcategory and filters
  const handleSearch = () => {
    if (!selectedSubcategory) {
      toast.error('Veuillez sélectionner une sous-catégorie');
      return;
    }
    
    setLoading(true);
    
    // In a real app, this would call an API to get search results
    // For now, just simulate with fake data
    setTimeout(() => {
      const mockResults = Array.from({ length: 5 }, (_, i) => ({
        id: `place-${i}`,
        name: `Place ${i + 1}`,
        latitude: userLocation[1] + (Math.random() * 0.02 - 0.01),
        longitude: userLocation[0] + (Math.random() * 0.02 - 0.01),
        category: selectedSubcategory,
        address: `${i + 1} Rue de Paris, 75001 Paris`,
        isFavorite: Math.random() > 0.7,
      }));
      
      setResults(mockResults);
      setLoading(false);
      toast.success(`${mockResults.length} résultats trouvés`);
    }, 1500);
  };
  
  const getSelectedSubcategoryName = () => {
    if (!selectedSubcategory) return '';
    
    for (const category of DAILY_SEARCH_CATEGORIES) {
      for (const sub of category.subcategories) {
        if (sub.id === selectedSubcategory) {
          return sub.name;
        }
      }
    }
    return '';
  };
  
  // Format a result for display
  const formatResult = (result: any, index: number) => (
    <div 
      key={result.id} 
      className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-3"
      onClick={() => {
        // Handle result click
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{result.name}</h3>
          <p className="text-sm text-gray-500">{result.address}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
          {index + 1}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Recherche de proximité</h1>
        
        {/* Filtres principaux */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Label>Rayon :</Label>
            <Input 
              type="number" 
              value={filters.radius}
              onChange={(e) => setFilters({...filters, radius: Number(e.target.value)})}
              className="w-20"
            />
            <Select
              value={filters.unit}
              onValueChange={(v) => setFilters({...filters, unit: v as 'km' | 'mi'})}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km">Kilomètres</SelectItem>
                <SelectItem value="mi">Miles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label>Transport :</Label>
            <Select
              value={filters.transport}
              onValueChange={(v) => setFilters({...filters, transport: v as 'driving' | 'walking' | 'bicycling' | 'transit'})}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="driving">Voiture</SelectItem>
                <SelectItem value="walking">Marche</SelectItem>
                <SelectItem value="bicycling">Vélo</SelectItem>
                <SelectItem value="transit">Transport</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="openNow"
              checked={filters.openNow}
              onCheckedChange={(checked) => setFilters({...filters, openNow: !!checked})}
            />
            <Label htmlFor="openNow">Ouvert maintenant</Label>
          </div>
          
          <div className="ml-auto">
            <Button 
              variant="outline"
              onClick={handleGetLocation}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Ma position
            </Button>
          </div>
        </div>

        {/* Navigation par catégories */}
        <Tabs defaultValue={DAILY_SEARCH_CATEGORIES[0].id}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-2 rounded-lg">
            {DAILY_SEARCH_CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">{category.icon}</span>
                  <span>{category.name}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {DAILY_SEARCH_CATEGORIES.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
                {category.subcategories.map((sub) => (
                  <SubCategoryTile
                    key={sub.id}
                    subcategory={sub}
                    isSelected={selectedSubcategory === sub.id}
                    onSelect={setSelectedSubcategory}
                  />
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={handleSearch}
                  disabled={!selectedSubcategory || loading}
                  className="px-8"
                >
                  {loading ? 'Recherche...' : 'Rechercher'}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Résultats et carte */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {results.length > 0 
              ? `Résultats (${results.length}) - ${getSelectedSubcategoryName()}`
              : 'Sélectionnez une sous-catégorie et lancez votre recherche'}
          </h2>
          
          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Recherche en cours...</p>
              </div>
            ) : (
              results.map((result, index) => formatResult(result, index))
            )}
          </div>
        </div>
        
        <div className="h-[600px] rounded-xl overflow-hidden shadow-lg">
          <EnhancedMapComponent 
            filters={filters}
            selectedCategory={selectedSubcategory}
            userLocation={userLocation}
            selectedLocations={results}
          />
        </div>
      </div>
    </div>
  );
};

export default CategorySearch;
