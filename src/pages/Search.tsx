
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon, List, MapIcon } from 'lucide-react';
import Map from '@/components/Map';
import ResultsList from '@/components/ResultsList';
import InteractiveMenu from '@/components/InteractiveMenu';
import type { Result } from '@/components/ResultsList';

const Search = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [userLocation, setUserLocation] = useState<[number, number]>([2.3522, 48.8566]);
  const [radius, setRadius] = useState(5);
  const [radiusUnit, setRadiusUnit] = useState<'km' | 'miles'>('km');
  const [duration, setDuration] = useState(15);
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours'>('minutes');
  const [resultsCount, setResultsCount] = useState(5);
  const [transportMode, setTransportMode] = useState('driving');
  const [radiusType, setRadiusType] = useState<'distance' | 'duration'>('distance');
  
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'distance',
    radius: '5',
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [location]);

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
      const mockResults = generateMockResults(query, userLocation, filters, resultsCount);
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
    filters: { category: string; sortBy: string; radius: string },
    count: number
  ): Result[] => {
    const radius = parseInt(filters.radius);
    
    const colors = ['primary', 'red', 'green', 'blue', 'orange', 'purple', 'pink', 'indigo', 'yellow', 'teal'];
    
    const results: Result[] = Array.from({ length: count }, (_, i) => {
      const randomAngle = Math.random() * Math.PI * 2;
      const randomDistance = Math.random() * radius * 0.01;
      
      const longitude = location[0] + randomDistance * Math.cos(randomAngle);
      const latitude = location[1] + randomDistance * Math.sin(randomAngle);
      
      const distance = calculateDistance(location[1], location[0], latitude, longitude);
      
      return {
        id: `result-${i}`,
        name: `${query} Place ${i + 1}`,
        address: `${i + 100} ${query.charAt(0).toUpperCase() + query.slice(1)} Street`,
        category: ['restaurant', 'cafe', 'store', 'service', 'entertainment'][Math.floor(Math.random() * 5)],
        distance: distance,
        duration: Math.floor(distance * 3),
        color: colors[i % colors.length],
        latitude,
        longitude,
        rating: Math.floor(Math.random() * 5) + 1,
        openingHours: '9:00 - 18:00',
      };
    });
    
    if (filters.sortBy === 'distance') {
      results.sort((a, b) => a.distance - b.distance);
    } else if (filters.sortBy === 'rating') {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    
    return results;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c;
    return Math.round(distance * 10) / 10;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };

  const handleResultClick = (result: Result) => {
    setSelectedResult(result);
  };

  const handleFilterChange = (newFilters: {
    radius: number;
    unit: 'km' | 'miles';
    duration: number;
    timeUnit: 'minutes' | 'hours';
    resultsCount: number;
    transportMode: string;
    radiusType: 'distance' | 'duration';
  }) => {
    setRadius(newFilters.radius);
    setRadiusUnit(newFilters.unit);
    setDuration(newFilters.duration);
    setTimeUnit(newFilters.timeUnit);
    setResultsCount(newFilters.resultsCount);
    setTransportMode(newFilters.transportMode);
    setRadiusType(newFilters.radiusType);
    
    // Mettre à jour les filtres pour la recherche
    setFilters({
      ...filters,
      radius: newFilters.radius.toString(),
    });
    
    // Relancer la recherche avec les nouveaux paramètres
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">{t('search_title')}</h1>
      
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
      
      {/* Map area */}
      <div className="mb-0">
        <div className="h-[400px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
          <Map 
            results={results} 
            center={userLocation} 
            radius={radius}
            radiusUnit={radiusUnit}
            radiusType={radiusType}
            duration={duration}
            timeUnit={timeUnit}
            transportMode={transportMode}
          />
        </div>
      </div>
      
      {/* Interactive Menu */}
      <div className="mb-6">
        <InteractiveMenu onFilterChange={handleFilterChange} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg mb-4">{t('results')}</h2>
          <div className="bg-gray-50 p-4 rounded-lg h-[500px] overflow-y-auto">
            <ResultsList 
              results={results} 
              onResultClick={handleResultClick} 
              selectedResultId={selectedResult?.id}
            />
          </div>
        </div>
        
        <div className="lg:col-span-3 space-y-4">
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
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">
              {loading ? (
                <span>{t('searching')}...</span>
              ) : (
                <span>{results.length} {t('results_found')}</span>
              )}
            </h2>
            
            {selectedResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-lg">{selectedResult.name}</h3>
                <p className="text-gray-600">{selectedResult.address}</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-500">{t('distance')}:</span> 
                    <span className="font-medium ml-1">{selectedResult.distance.toFixed(1)} km</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('duration')}:</span> 
                    <span className="font-medium ml-1">{selectedResult.duration} min</span>
                  </div>
                  {selectedResult.rating && (
                    <div>
                      <span className="text-gray-500">{t('rating')}:</span> 
                      <span className="font-medium ml-1">{selectedResult.rating}/5</span>
                    </div>
                  )}
                  {selectedResult.openingHours && (
                    <div>
                      <span className="text-gray-500">{t('opening_hours')}:</span> 
                      <span className="font-medium ml-1">{selectedResult.openingHours}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    {t('get_directions')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
