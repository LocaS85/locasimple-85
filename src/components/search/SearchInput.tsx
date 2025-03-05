
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, MapPin, MapPinCheck, Loader2 } from 'lucide-react';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';

interface SearchInputProps {
  searchQuery: string;
  isRecording: boolean;
  isLocationActive?: boolean;
  loading?: boolean;
  onSearchChange: (value: string) => void;
  onMicClick: () => void;
  onLocationClick?: () => void;
  onSearch?: () => void;
  userLocation?: [number, number];
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
  userLocation = [2.3522, 48.8566]
}) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle outside click to close suggestions
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

  // Fetch suggestions from Mapbox
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery || searchQuery.length < 3 || !MAPBOX_TOKEN) return;

      try {
        // Use proximity to prioritize results near user location
        const proximityParam = userLocation
          ? `&proximity=${userLocation[0]},${userLocation[1]}`
          : '';

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&limit=5${proximityParam}&types=place,address,poi`
        );

        if (!response.ok) throw new Error('Failed to fetch suggestions');

        const data = await response.json();
        setSuggestions(data.features);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    // Debounce fetch requests
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, userLocation]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      onSearch();
    }
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    onSearchChange(suggestion.place_name);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const placeholderText = isLocationActive 
    ? "Rechercher autour de ma position..." 
    : "Rechercher un lieu...";

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative flex items-center w-full bg-white/30 backdrop-blur-sm rounded-full border-2 border-black/50 shadow-sm overflow-hidden">
        <Input 
          ref={inputRef}
          type="text" 
          placeholder={placeholderText}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(searchQuery.length >= 3 && suggestions.length > 0)}
          className="w-full border-0 rounded-l-full h-12 text-base pl-4 bg-transparent text-black focus-visible:ring-0 focus-visible:ring-offset-0" 
        />
        <div className="flex items-center h-full">
          <Button 
            onClick={onMicClick}
            className={`${isRecording ? 'text-red-500' : 'text-gray-500'} bg-transparent hover:bg-transparent p-2 rounded-none`}
            aria-label="Activer la recherche vocale"
            variant="ghost"
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button 
            onClick={onLocationClick}
            className={`h-full rounded-r-full px-4 ${isLocationActive 
              ? "bg-secondary/60 text-white hover:bg-secondary/80" 
              : "bg-transparent text-black hover:bg-gray-100/30"}`}
            aria-pressed={isLocationActive}
            aria-label="Utiliser ma position"
            disabled={loading}
            variant="ghost"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isLocationActive ? (
              <MapPinCheck className="h-5 w-5" />
            ) : (
              <MapPin className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-start"
            >
              <MapPin className="h-4 w-4 mt-1 mr-2 flex-shrink-0 text-gray-500" />
              <span className="text-sm">{suggestion.place_name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
