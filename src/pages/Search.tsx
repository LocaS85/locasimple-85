
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { MapPin, Search as SearchIcon, List, MapIcon, Plus, Minus } from 'lucide-react';
import Map from '@/components/Map';
import ResultsList from '@/components/ResultsList';
import type { Result } from '@/components/ResultsList';

const Search = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  
  // User location (Paris by default)
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  
  const form = useForm({
    defaultValues: {
      category: 'all',
      sortBy: 'distance',
      radius: '5',
    },
  });

  // Get query params from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [location]);

  // Get user location if possible
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      // For demo, generate mock results
      const mockResults = generateMockResults(query, userLocation, form.getValues());
      setResults(mockResults);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockResults = (
    query: string, 
    location: [number, number], 
    filters: { category: string; sortBy: string; radius: string }
  ): Result[] => {
    // Generate random coordinates within radius
    const radius = parseInt(filters.radius);
    const count = Math.floor(Math.random() * 10) + 5; // 5-15 results
    
    const colors = ['primary', 'secondary', 'success', 'accent', 'highlight'];
    
    const results: Result[] = Array.from({ length: count }, (_, i) => {
      // Random offset within radius (in degrees, rough approximation)
      const randomAngle = Math.random() * Math.PI * 2;
      const randomDistance = Math.random() * radius * 0.01; // ~1km per 0.01 degree
      
      const longitude = location[0] + randomDistance * Math.cos(randomAngle);
      const latitude = location[1] + randomDistance * Math.sin(randomAngle);
      
      // Calculate actual distance (simplified)
      const distance = calculateDistance(location[1], location[0], latitude, longitude);
      
      return {
        id: `result-${i}`,
        name: `${query} Place ${i + 1}`,
        address: `${i + 100} ${query.charAt(0).toUpperCase() + query.slice(1)} Street`,
        category: ['restaurant', 'cafe', 'store', 'service', 'entertainment'][Math.floor(Math.random() * 5)],
        distance: distance,
        duration: Math.floor(distance * 3), // ~20km/h walking speed
        color: colors[i % colors.length],
        latitude,
        longitude,
        rating: Math.floor(Math.random() * 5) + 1,
        openingHours: '9:00 - 18:00',
      };
    });
    
    // Sort results
    if (filters.sortBy === 'distance') {
      results.sort((a, b) => a.distance - b.distance);
    } else if (filters.sortBy === 'rating') {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    
    return results;
  };
  
  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return Math.round(distance * 10) / 10;
  };
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };

  const handleResultClick = (result: Result) => {
    setSelectedResult(result);
  };

  const handleSubmit = form.handleSubmit((data) => {
    handleSearch(searchQuery);
  });

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">{t('search_title')}</h1>
      
      {/* Search bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Input
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        </div>
        <Button onClick={() => handleSearch(searchQuery)}>
          {t('search')}
        </Button>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters panel */}
        <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg mb-4">{t('filters')}</h2>
          
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('category')}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('select_category')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">{t('all_categories')}</SelectItem>
                        <SelectItem value="restaurant">{t('restaurants')}</SelectItem>
                        <SelectItem value="cafe">{t('cafes')}</SelectItem>
                        <SelectItem value="store">{t('stores')}</SelectItem>
                        <SelectItem value="service">{t('services')}</SelectItem>
                        <SelectItem value="entertainment">{t('entertainment')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="radius"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('radius')} (km)</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          const currentValue = parseInt(field.value);
                          if (currentValue > 1) {
                            field.onChange((currentValue - 1).toString());
                          }
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <FormControl>
                        <Input {...field} type="number" min="1" max="50" />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          const currentValue = parseInt(field.value);
                          if (currentValue < 50) {
                            field.onChange((currentValue + 1).toString());
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sortBy"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{t('sort_by')}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="distance" id="distance" />
                          <FormLabel htmlFor="distance" className="font-normal cursor-pointer">
                            {t('distance')}
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="rating" id="rating" />
                          <FormLabel htmlFor="rating" className="font-normal cursor-pointer">
                            {t('rating')}
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                {t('apply_filters')}
              </Button>
            </form>
          </Form>
        </div>
        
        {/* Results section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Toggle view buttons (visible only on mobile) */}
          <div className="flex justify-center lg:hidden mb-4 bg-white rounded-lg shadow-sm p-2">
            <div className="inline-flex rounded-md shadow-sm">
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                className="rounded-l-md rounded-r-none"
                onClick={() => setView('list')}
              >
                <List className="h-4 w-4 mr-2" />
                {t('list_view')}
              </Button>
              <Button
                variant={view === 'map' ? 'default' : 'outline'}
                className="rounded-r-md rounded-l-none"
                onClick={() => setView('map')}
              >
                <MapIcon className="h-4 w-4 mr-2" />
                {t('map_view')}
              </Button>
            </div>
          </div>
          
          {/* Results count */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">
              {loading ? (
                <span>{t('searching')}...</span>
              ) : (
                <span>{results.length} {t('results_found')}</span>
              )}
            </h2>
          </div>
          
          {/* Map and list views */}
          <div className={`lg:grid lg:grid-cols-2 gap-4 ${view === 'map' ? 'block' : 'hidden'} lg:block`}>
            {/* Map view - full width on mobile when selected, half width on desktop */}
            <div className="lg:col-span-1 h-[500px] mb-4 lg:mb-0">
              <Map results={results} center={userLocation} />
            </div>
            
            {/* List view - hidden on mobile when map is selected, always visible on desktop */}
            <div className={`lg:col-span-1 ${view === 'list' ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm h-[500px] overflow-y-auto">
                <ResultsList results={results} onResultClick={handleResultClick} />
              </div>
            </div>
          </div>
          
          {/* List-only view (mobile) */}
          <div className={`${view === 'list' ? 'block' : 'hidden'} lg:hidden`}>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm h-[500px] overflow-y-auto">
              <ResultsList results={results} onResultClick={handleResultClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
