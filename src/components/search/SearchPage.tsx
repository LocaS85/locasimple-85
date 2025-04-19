
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mapService } from '@/utils/search';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const initializeMap = async () => {
      try {
        await mapService.initMap('map');
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initializeMap();
  }, []);

  const handleLocationClick = async () => {
    try {
      setLoading(true);
      await mapService.getUserLocation();
    } catch (error) {
      console.error('Location error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Simulate search results
    const mockResults = Array.from({ length: 5 }, (_, i) => ({
      lng: 2.3488 + (Math.random() - 0.5) * 0.02,
      lat: 48.8534 + (Math.random() - 0.5) * 0.02,
      name: `${searchQuery} Result ${i + 1}`,
      category: 'Sample Category',
      distance: Math.random() * 5
    }));

    mapService.displayResults(mockResults);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-white shadow-sm">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            type="text"
            placeholder="Rechercher un lieu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleLocationClick} variant="outline">
            <MapPin className="h-4 w-4" />
          </Button>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 relative">
        <div 
          id="map" 
          className="absolute inset-0"
          style={{ visibility: loading ? 'hidden' : 'visible' }}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
