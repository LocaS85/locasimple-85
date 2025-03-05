
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, MapPin, MapPinCheck, Loader2 } from 'lucide-react';

interface SearchInputProps {
  searchQuery: string;
  isRecording: boolean;
  isLocationActive?: boolean;
  loading?: boolean;
  onSearchChange: (value: string) => void;
  onMicClick: () => void;
  onLocationClick?: () => void;
  onSearch?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  isRecording,
  isLocationActive = false,
  loading = false,
  onSearchChange,
  onMicClick,
  onLocationClick = () => {},
  onSearch = () => {}
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const placeholderText = isLocationActive 
    ? "Rechercher autour de ma position..." 
    : "Rechercher un lieu...";

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative flex items-center w-full bg-white/30 backdrop-blur-sm rounded-full border-2 border-black/50 shadow-sm overflow-hidden">
        <Input 
          type="text" 
          placeholder={placeholderText}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
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
    </div>
  );
};
