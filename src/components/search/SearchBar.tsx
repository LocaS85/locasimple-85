
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
    <div className="relative w-full sm:w-1/2">
      <div className="relative flex items-center w-full">
        <Input 
          type="text" 
          placeholder="Recherche" 
          className="w-full rounded-full border-2 border-black pr-20" 
        />
        <div className="absolute right-2 flex space-x-1">
          <Button 
            onClick={onLocationClick}
            className="bg-transparent hover:bg-gray-100 text-gray-500 p-1"
          >
            <MapPin className="h-4 w-4" />
          </Button>
          <Button 
            onClick={onMicClick}
            className={`${isRecording ? 'text-red-500' : 'text-gray-500'} bg-transparent hover:bg-gray-100 p-1`}
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
