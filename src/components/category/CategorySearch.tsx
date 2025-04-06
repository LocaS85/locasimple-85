
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DAILY_SEARCH_CATEGORIES, SearchFilters } from '@/types/dailySearchCategories';
import EnhancedMapComponent from '../map/EnhancedMapComponent';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MapLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
}

const CategorySearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchParams] = useState(new URLSearchParams(location.search));
  const categoryId = searchParams.get('category') || '';
  const subcategoryId = searchParams.get('subcategory') || '';
  
  const [filters, setFilters] = useState<SearchFilters>({
    radius: Number(searchParams.get('radius')) || 5,
    unit: (searchParams.get('unit') as 'km' | 'mi') || 'km',
    transport: (searchParams.get('transport') as 'driving' | 'walking' | 'bicycling' | 'transit') || 'driving',
    openNow: searchParams.get('openNow') === 'true'
  });
  
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MapLocation[]>([]);

  // Get geolocation hook with correct typing
  const { activateGeolocation, isWatching } = useGeolocation({
    setLoading: setLoading,
    setIsLocationActive: () => {}, // Placeholder
    setUserLocation: (location) => setUserLocation(location),
    onLocationUpdate: (location) => setUserLocation(location)
  });
  
  // Find the current category and subcategory
  const currentCategory = DAILY_SEARCH_CATEGORIES.find(cat => cat.id === categoryId);
  const currentSubcategory = currentCategory?.subcategories.find(sub => sub.id === subcategoryId);
  
  // Get user location on mount
  useEffect(() => {
    const getLocation = async () => {
      try {
        setLoading(true);
        // Use the proper method from useGeolocation
        activateGeolocation();
      } catch (error) {
        console.error('Error getting user location:', error);
        toast.error('Impossible d\'obtenir votre position');
        setLoading(false);
      }
    };
    
    getLocation();
  }, []);
  
  // Perform search when params change
  useEffect(() => {
    if (categoryId && subcategoryId) {
      performSearch();
    }
  }, [categoryId, subcategoryId, userLocation]);
  
  const performSearch = async () => {
    if (!currentSubcategory) return;
    
    setLoading(true);
    
    try {
      // Mock search results for now
      const mockResults: MapLocation[] = [
        {
          id: '1',
          name: 'Place 1',
          latitude: userLocation[1] + 0.01,
          longitude: userLocation[0] + 0.01,
          category: currentCategory?.name || '',
          address: '123 Test Street'
        },
        {
          id: '2',
          name: 'Place 2',
          latitude: userLocation[1] - 0.01,
          longitude: userLocation[0] - 0.01,
          category: currentCategory?.name || '',
          address: '456 Example Avenue'
        }
      ];
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResults(mockResults);
      toast.success(`${mockResults.length} résultats trouvés`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateFilters = () => {
    performSearch();
  };
  
  if (!currentCategory || !currentSubcategory) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Paramètres de recherche invalides</p>
        <Button onClick={() => navigate('/categories')}>
          Retour aux catégories
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <button 
          onClick={() => navigate(`/categories/${categoryId}`)}
          className="text-blue-500 flex items-center gap-2 mb-4"
        >
          &larr; Retour aux sous-catégories
        </button>
        
        <h1 className="text-2xl font-bold mb-2" style={{ color: currentCategory.color }}>
          Recherche: {currentSubcategory.name}
        </h1>
      </header>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtres</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2 block">Rayon de recherche ({filters.radius} {filters.unit})</Label>
            <Slider 
              value={[filters.radius]} 
              min={1}
              max={50}
              step={1}
              onValueChange={(values) => setFilters({...filters, radius: values[0]})}
              className="mb-6"
            />
            
            <div className="flex items-center justify-between mb-4">
              <Label>Unité de distance</Label>
              <Select 
                value={filters.unit}
                onValueChange={(value: 'km' | 'mi') => setFilters({...filters, unit: value})}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Unité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">Kilomètres</SelectItem>
                  <SelectItem value="mi">Miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <Label>Mode de transport</Label>
              <Select 
                value={filters.transport}
                onValueChange={(value: 'driving' | 'walking' | 'bicycling' | 'transit') => 
                  setFilters({...filters, transport: value})}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Transport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driving">Voiture</SelectItem>
                  <SelectItem value="walking">Marche</SelectItem>
                  <SelectItem value="bicycling">Vélo</SelectItem>
                  <SelectItem value="transit">Transport public</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="open-now" 
                checked={filters.openNow}
                onCheckedChange={(checked) => setFilters({...filters, openNow: checked})}
              />
              <Label htmlFor="open-now">Ouvert maintenant</Label>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center">
          <Button onClick={handleUpdateFilters}>
            Appliquer les filtres
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Résultats ({loading ? '...' : results.length})
          </h2>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
              <p className="mt-2">Recherche en cours...</p>
            </div>
          )}
          
          {!loading && results.length === 0 && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">Aucun résultat trouvé</p>
            </div>
          )}
          
          {!loading && results.length > 0 && (
            <div className="space-y-4">
              {results.map(result => (
                <div key={result.id} className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold">{result.name}</h3>
                  <p className="text-gray-600 text-sm">{result.address}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="h-[500px] bg-gray-100 rounded-lg overflow-hidden">
          <EnhancedMapComponent 
            selectedLocations={results}
            userLocation={userLocation}
            filters={filters}
            selectedCategory={subcategoryId}
          />
        </div>
      </div>
    </div>
  );
};

export default CategorySearch;
