
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mic, X, Map, Loader2 } from 'lucide-react';

export interface SearchBoxProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query?: string) => void;
  onReset?: () => void;
  onLocationClick?: () => void;
  isLocationActive?: boolean;
  loading?: boolean;
  placeholder?: string;
  isRecording?: boolean;
  onMicClick?: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  value = '',
  onChange = () => {},
  onSearch = () => {},
  onReset = () => {},
  onLocationClick = () => {},
  isLocationActive = false,
  loading = false,
  placeholder = 'Rechercher...',
  isRecording = false,
  onMicClick = () => {}
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    onReset();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-9 pr-8 py-2 h-9 text-sm"
          disabled={loading}
        />
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <Button
        type="button"
        size="icon"
        variant={isLocationActive ? "default" : "outline"}
        className="h-9 w-9 shrink-0"
        onClick={onLocationClick}
        title={isLocationActive ? "Désactiver la localisation" : "Utiliser ma position"}
      >
        <Map className="h-4 w-4" />
      </Button>
      
      <Button
        type="button" 
        size="icon"
        variant={isRecording ? "destructive" : "outline"}
        className="h-9 w-9 shrink-0"
        onClick={onMicClick}
        title={isRecording ? "Arrêter l'enregistrement" : "Recherche vocale"}
      >
        <Mic className="h-4 w-4" />
      </Button>
      
      <Button 
        type="submit"
        disabled={loading || value.trim() === ''}
        size="sm"
        className="h-9 px-3"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
        <span className="ml-1.5">Rechercher</span>
      </Button>
    </form>
  );
};

export default SearchBox;
