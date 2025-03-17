
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MapPin, Loader2, Search, X, Menu, Car, Bike, Bus } from 'lucide-react';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import TransparentSearchBar from './TransparentSearchBar';

interface SearchInputProps {
  searchQuery: string;
  isRecording: boolean;
  isLocationActive?: boolean;
  loading?: boolean;
  onSearchChange: (value: string) => void;
  onMicClick: () => void;
  onLocationClick?: () => void;
  onSearch?: () => void;
  onClear?: () => void;
  userLocation?: [number, number];
  transportMode?: string;
  onTransportModeChange?: (mode: string) => void;
  onMenuClick?: () => void;
}

interface AddressSuggestion {
  id: string;
  place_name: string;
  center: [number, number];
}

export const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  isRecording,
  isLocationActive = false,
  loading = false,
  onSearchChange,
  onMicClick,
  onLocationClick = () => {},
  onSearch = () => {},
  onClear,
  userLocation = [2.3522, 48.8566],
  transportMode = 'driving',
  onTransportModeChange = () => {},
  onMenuClick = () => {}
}) => {
  const { language } = useLanguage();
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery || searchQuery.length < 2 || !MAPBOX_TOKEN) return;

      try {
        const proximityParam = userLocation
          ? `&proximity=${userLocation[0]},${userLocation[1]}`
          : '';

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&limit=5${proximityParam}&types=place,address,poi&language=${language}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }

        const data = await response.json();
        setSuggestions(data.features);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        toast.error("Impossible de charger les suggestions");
      }
    };

    // Add debounce to prevent too many API calls
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, userLocation, language]);

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    onSearchChange(suggestion.place_name);
    setShowSuggestions(false);
    setTimeout(() => {
      onSearch();
    }, 100);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <TransparentSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearch={onSearch}
        isRecording={isRecording}
        onMicClick={onMicClick}
        isLocationActive={isLocationActive}
        onLocationClick={onLocationClick}
        loading={loading}
        transportMode={transportMode}
        onTransportModeChange={onTransportModeChange}
        onMenuClick={onMenuClick}
      />

      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-20 w-full mt-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200 animate-fade-in"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start border-b border-gray-100 last:border-b-0"
            >
              <MapPin className="h-4 w-4 mt-1 mr-2 flex-shrink-0 text-gray-500" />
              <div>
                <div className="text-sm font-medium">{suggestion.place_name.split(',')[0]}</div>
                <div className="text-xs text-gray-500">
                  {suggestion.place_name.substring(suggestion.place_name.indexOf(',') + 1).trim()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
