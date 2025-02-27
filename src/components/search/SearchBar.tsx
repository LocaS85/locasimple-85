
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic, MapPin } from 'lucide-react';

interface SearchBarProps {
  isRecording: boolean;
  onMicClick: () => void;
  onLocationClick?: () => void;
}

const SearchBar = ({ isRecording, onMicClick, onLocationClick }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative flex items-center w-full">
        <Input 
          type="text" 
          placeholder="Rechercher un lieu..." 
          className="w-full rounded-full border-2 border-black pr-20 pl-4 py-6" 
        />
        <div className="absolute right-2 flex space-x-1">
          <Button 
            onClick={onLocationClick}
            className="bg-transparent hover:bg-gray-100 text-gray-500 p-1"
            title="Utiliser ma position"
          >
            <MapPin className="h-5 w-5" />
          </Button>
          <Button 
            onClick={onMicClick}
            className={`${isRecording ? 'text-red-500' : 'text-gray-500'} bg-transparent hover:bg-gray-100 p-1`}
            title="Recherche vocale"
          >
            <Mic className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
