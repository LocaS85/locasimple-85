
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
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative flex items-center w-full bg-white rounded-full border-2 border-black shadow-sm overflow-hidden">
        <Input 
          type="text" 
          placeholder="Recherche"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full border-0 rounded-l-full h-12 text-base pl-4 focus-visible:ring-0 focus-visible:ring-offset-0" 
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
            className={`h-full rounded-none px-4 ${isLocationActive 
              ? "bg-secondary text-white hover:bg-secondary/90" 
              : "bg-transparent text-black hover:bg-gray-100"}`}
            aria-pressed={isLocationActive}
            aria-label="Utiliser ma position"
            variant="ghost"
          >
            {isLocationActive ? (
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
