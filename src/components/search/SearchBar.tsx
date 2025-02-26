
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

interface SearchBarProps {
  isRecording: boolean;
  onMicClick: () => void;
}

const SearchBar = ({ isRecording, onMicClick }: SearchBarProps) => {
  return (
    <div className="relative w-full sm:w-1/2">
      <div className="relative flex items-center w-full">
        <Input 
          type="text" 
          placeholder="Recherche" 
          className="w-full rounded-full border-2 border-black pr-10" 
        />
        <Button 
          onClick={onMicClick}
          className={`absolute right-2 ${isRecording ? 'text-red-500' : 'text-gray-500'} bg-transparent hover:bg-transparent p-1`}
        >
          <Mic className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
