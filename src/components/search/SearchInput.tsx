
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, MapPin, MapPinCheck, Loader2, Search } from 'lucide-react';
import { MAPBOX_TOKEN } from '@/config/environment';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t, language } = useLanguage();
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

        if (!response.ok) throw new Error('Failed to fetch suggestions');

        const data = await response.json();
        setSuggestions(data.features);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, userLocation, language]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      onSearch();
    }
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    onSearchChange(suggestion.place_name);
    setShowSuggestions(false);
    setTimeout(() => {
      onSearch();
    }, 100);
  };

  const placeholderText = isLocationActive 
    ? t('useMyLocation') || "Rechercher un lieu autour de ma position (ex: IKEA)..." 
    : t('searchPlaceholder') || "Rechercher un lieu...";

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative flex items-center w-full bg-white rounded-full shadow-md overflow-hidden">
        <div className="flex items-center pl-4 text-gray-400">
          <Search className="h-5 w-5" />
        </div>
        <Input 
          ref={inputRef}
          type="text" 
          placeholder={placeholderText}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(searchQuery.length >= 2 && suggestions.length > 0)}
          className="w-full border-0 h-12 text-base pl-2 bg-transparent text-black focus-visible:ring-0 focus-visible:ring-offset-0" 
        />
        <div className="flex items-center h-full">
          <Button 
            onClick={onMicClick}
            className={`${isRecording ? 'text-red-500' : 'text-gray-500'} bg-transparent hover:bg-transparent p-2 rounded-none`}
            aria-label={t('voiceSearch') || "Activer la recherche vocale"}
            variant="ghost"
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button 
            onClick={onLocationClick}
            className={`h-12 w-12 p-0 rounded-full ${isLocationActive 
              ? "bg-primary text-white hover:bg-primary/80" 
              : "bg-transparent text-gray-500 hover:bg-gray-100/30"}`}
            aria-pressed={isLocationActive}
            aria-label={t('useMyLocation') || "Utiliser ma position"}
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
