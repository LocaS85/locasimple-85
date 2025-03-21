
import React, { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MapPin, Search, X, Menu, Car, Bike, PersonStanding, Bus } from 'lucide-react';

interface TransparentSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  isRecording: boolean;
  onMicClick: () => void;
  isLocationActive?: boolean;
  onLocationClick?: () => void;
  loading?: boolean;
  transportMode?: string;
  onTransportModeChange?: (mode: string) => void;
  onMenuClick?: () => void;
}

const TransparentSearchBar: React.FC<TransparentSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
  isRecording,
  onMicClick,
  isLocationActive = false,
  onLocationClick,
  loading = false,
  transportMode = 'driving',
  onTransportModeChange,
  onMenuClick
}) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const transportModes = [
    { id: 'driving', icon: Car, label: 'Voiture' },
    { id: 'walking', icon: PersonStanding, label: 'À pied' },
    { id: 'cycling', icon: Bike, label: 'Vélo' },
    { id: 'transit', icon: Bus, label: 'Transport' }
  ];

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md border border-gray-200">
          {/* Bouton Menu */}
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={onMenuClick}
            className="rounded-full"
          >
            <Menu className="h-5 w-5 text-gray-500" />
          </Button>
          
          {/* Champ de recherche */}
          <Input
            type="text"
            placeholder="Rechercher un lieu..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          
          {/* Bouton de réinitialisation */}
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => onSearchChange('')}
              className="rounded-full"
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
          
          {/* Bouton Microphone */}
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={onMicClick}
            className={`rounded-full ${isRecording ? 'text-red-500' : 'text-gray-500'}`}
          >
            <Mic className={`h-5 w-5 ${isRecording && 'animate-pulse'}`} />
          </Button>
          
          {/* Bouton Localisation */}
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={onLocationClick}
            className={`rounded-full ${isLocationActive ? 'text-blue-500' : 'text-gray-500'}`}
          >
            <MapPin className="h-5 w-5" />
          </Button>
          
          {/* Bouton Recherche */}
          <Button
            variant="default"
            size="icon"
            type="submit"
            className="rounded-full bg-blue-500 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
      
      {/* Modes de transport */}
      <div className="flex items-center justify-center gap-1 mt-2">
        {transportModes.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={transportMode === id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTransportModeChange && onTransportModeChange(id)}
            className={`rounded-full px-3 py-1 h-8 ${
              transportMode === id ? 'bg-blue-500 text-white' : 'bg-white/80'
            }`}
          >
            <Icon className="h-3 w-3 mr-1" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TransparentSearchBar;
