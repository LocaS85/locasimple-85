
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, MapPin, MapPinCheck } from 'lucide-react';

interface SearchInputProps {
  searchQuery: string;
  isRecording: boolean;
  isLocationActive?: boolean;
  onSearchChange: (value: string) => void;
  onMicClick: () => void;
  onLocationClick?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  isRecording,
  isLocationActive = false,
  onSearchChange,
  onMicClick,
  onLocationClick = () => {}
}) => {
  return (
    <div className="relative w-full max-w-[280px] mx-auto">
      <div className="relative flex items-center w-full">
        <Input 
          type="text" 
          placeholder="Recherche"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-full border-2 border-black pr-20 h-10 text-sm" 
        />
        <div className="absolute right-1 flex items-center gap-1">
          <Button 
            onClick={onMicClick}
            className={`${isRecording ? 'text-red-500' : 'text-gray-500'} bg-transparent hover:bg-transparent p-1`}
            aria-label="Activer la recherche vocale"
          >
            <Mic className="h-3.5 w-3.5" />
          </Button>
          <Button 
            onClick={onLocationClick}
            className={`rounded-full p-1 ${isLocationActive 
              ? "bg-primary text-white hover:bg-primary/90" 
              : "bg-white text-black hover:bg-gray-100"}`}
            aria-pressed={isLocationActive}
            aria-label="Utiliser ma position"
          >
            {isLocationActive ? (
              <MapPinCheck className="h-3.5 w-3.5" />
            ) : (
              <MapPin className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
