
import React, { useState, useCallback } from 'react';
import { Search, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AddressSearch from './AddressSearch';

export interface GeoSearcherProps {
  modes: string[];
  onResult: (result: any) => void;
  placeholder?: string;
  enableVoice?: boolean;
  onSearch?: (query: string) => void;
}

const GeoSearcher: React.FC<GeoSearcherProps> = ({
  modes,
  onResult,
  placeholder = 'Rechercher un lieu...',
  enableVoice = false,
  onSearch
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleAddressSelect = (result: any) => {
    if (onResult) {
      onResult(result);
    }
    
    if (onSearch) {
      onSearch(result.name || '');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    if (onSearch) {
      onSearch(value);
    }
  };

  const startVoiceRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('La reconnaissance vocale n\'est pas supportée par votre navigateur');
      return;
    }

    setIsListening(true);

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      toast.info('Écoutez...');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchInput(transcript);
      
      if (onSearch) {
        onSearch(transcript);
      }
      
      toast.success(`Recherche: ${transcript}`);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      toast.error('Erreur de reconnaissance vocale');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [onSearch]);

  return (
    <div className="flex w-full items-center gap-2">
      <div className="relative flex-1">
        {modes.includes('address') && (
          <AddressSearch
            onAddressSelect={handleAddressSelect}
            placeholder={placeholder}
            value={searchInput}
            onChange={handleInputChange}
          />
        )}
      </div>
      
      {enableVoice && (
        <Button
          onClick={startVoiceRecognition}
          disabled={isListening}
          variant="outline"
          size="icon"
          className="flex-shrink-0 rounded-full"
          title="Recherche vocale"
        >
          <Mic className={isListening ? "text-primary animate-pulse" : ""} size={18} />
        </Button>
      )}
    </div>
  );
};

export default GeoSearcher;
