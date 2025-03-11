
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search as SearchIcon, 
  MapPin, 
  X, 
  Building,
  Home,
  MapPinned,
  Navigation,
  Store
} from 'lucide-react';
import { SearchResult, SearchOptions } from '@/services/mapboxService';
import { mapboxService } from '@/services/mapboxService';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onResultSelect: (result: SearchResult) => void;
  onClear?: () => void;
  placeholder?: string;
  userLocation?: [number, number];
  className?: string;
  autoFocus?: boolean;
}

// Helper pour déterminer l'icône en fonction du type de résultat
const getResultIcon = (result: SearchResult) => {
  const type = result.type;
  const properties = result.properties || {};
  
  if (type === 'poi') {
    if (properties.category === 'food') return <Store className="h-4 w-4" />;
    if (properties.category === 'lodging') return <Building className="h-4 w-4" />;
    return <MapPinned className="h-4 w-4" />;
  }
  
  if (type === 'address') return <Home className="h-4 w-4" />;
  if (type === 'place') return <Navigation className="h-4 w-4" />;
  
  return <MapPin className="h-4 w-4" />;
};

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  value,
  onChange,
  onSearch,
  onResultSelect,
  onClear,
  placeholder = "Rechercher un lieu...",
  userLocation,
  className = "",
  autoFocus = false
}) => {
  const { language } = useLanguage();
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Mettre à jour la valeur interne quand la prop change
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Gérer les clics à l'extérieur pour fermer les suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Charger les suggestions d'autocomplétion
  useEffect(() => {
    if (!inputValue || inputValue.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const options: SearchOptions = {
          query: inputValue,
          limit: 5,
          autocomplete: true,
          types: ['poi', 'address', 'place'],
          language
        };

        if (userLocation) {
          options.proximity = userLocation;
        }

        const results = await mapboxService.searchPlaces(options);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Erreur lors du chargement des suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, userLocation, language]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (onClear) onClear();
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchResult) => {
    // Fix: Use place_name instead of text for primary display
    setInputValue(suggestion.place_name);
    onChange(suggestion.place_name);
    setShowSuggestions(false);
    onResultSelect(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3 text-gray-400">
            <SearchIcon className="h-5 w-5" />
          </div>
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`pl-10 pr-10 py-2 ${
              isLoading ? 'bg-gray-50' : ''
            }`}
            autoFocus={autoFocus}
          />
          {inputValue && (
            <div className="absolute right-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleClear}
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          )}
        </div>
      </form>

      {/* Suggestions d'autocomplétion */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg max-h-80 overflow-y-auto divide-y divide-gray-100 border border-gray-200"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 text-gray-400 mt-0.5 mr-2">
                  {getResultIcon(suggestion)}
                </div>
                <div>
                  {/* Fix: Use place_name for the primary text display */}
                  <div className="font-medium text-sm">{suggestion.place_name.split(',')[0]}</div>
                  <div className="text-xs text-gray-500 line-clamp-1">
                    {suggestion.place_name.includes(',') ? 
                      suggestion.place_name.substring(suggestion.place_name.indexOf(',') + 2) : 
                      ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
