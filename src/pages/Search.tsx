
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchHeader from '@/components/search/SearchHeader';
import MapSection from '@/components/search/MapSection';
import ResultsSection from '@/components/search/ResultsSection';
import { generateMockResults } from '@/utils/locationUtils';
import type { Result } from '@/components/ResultsList';

const Search = () => {
  const { t } = useLanguage();
  const location = useLocation();
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
    
    // Update filters for search
    setFilters({
      ...filters,
      radius: newFilters.radius.toString(),
    });
    
    // Relaunch search with new parameters
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <SearchHeader 
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={handleSearch}
      />
      
      <MapSection 
        results={results}
        userLocation={userLocation}
        radius={radius}
        radiusUnit={radiusUnit}
        radiusType={radiusType}
        duration={duration}
        timeUnit={timeUnit}
        transportMode={transportMode}
        onFilterChange={handleFilterChange}
      />
      
      <ResultsSection 
        results={results}
        loading={loading}
        selectedResult={selectedResult}
        onResultClick={handleResultClick}
      />
    </div>
  );
};

export default Search;
