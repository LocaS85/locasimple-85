
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mic, MapPin, Menu, X, ZoomIn, ZoomOut, Car, Bus, Bike } from 'lucide-react';
import { ResultsCountPopover } from '@/components/search/ResultsCountPopover';
import { DurationFilter } from '@/components/search/DurationFilter';
import { DistanceFilter } from '@/components/search/DistanceFilter';

interface TransparentSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: (query: string) => void;
  isRecording?: boolean;
  onMicClick?: () => void;
  isLocationActive?: boolean;
  onLocationClick?: () => void;
  loading?: boolean;
  transportMode: string;
  onTransportModeChange: (mode: string) => void;
  onMenuClick?: () => void;
}

export const TransparentSearchBar: React.FC<TransparentSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
  isRecording = false,
  onMicClick = () => {},
  isLocationActive = false,
  onLocationClick = () => {},
  loading = false,
  transportMode,
  onTransportModeChange,
  onMenuClick = () => {}
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [resultsCount, setResultsCount] = useState(5);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(15);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(5);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClearSearch = () => {
    onSearchChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-gray-200 px-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="h-10 w-10 flex-shrink-0 text-primary hover:bg-primary/10 rounded-full"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="relative flex-grow">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
              <Search className="h-5 w-5" />
            </div>
            
            <Input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un lieu, une entreprise..."
              className="pl-10 pr-2 py-2 h-10 border-0 shadow-none bg-transparent focus:ring-0 w-full"
            />
            
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Transport mode buttons in the same bar */}
          <div className="flex items-center space-x-1">
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 rounded-full ${transportMode === 'driving' ? 'text-blue-500 bg-blue-50' : 'text-gray-500'}`}
              onClick={() => onTransportModeChange('driving')}
              aria-label="Driving"
            >
              <Car className="h-4 w-4" />
            </Button>
            
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 rounded-full ${transportMode === 'transit' ? 'text-green-500 bg-green-50' : 'text-gray-500'}`}
              onClick={() => onTransportModeChange('transit')}
              aria-label="Transit"
            >
              <Bus className="h-4 w-4" />
            </Button>
            
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 rounded-full ${transportMode === 'walking' ? 'text-orange-500 bg-orange-50' : 'text-gray-500'}`}
              onClick={() => onTransportModeChange('walking')}
              aria-label="Walking"
            >
              {/* Replace Walk with PersonStanding */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M14 11h1.86a2 2 0 0 1 1.8 1.67L19 19"/>
                <path d="M5 19v-2a4 4 0 0 1 4-4h4.5"/>
                <circle cx="12" cy="5" r="2"/>
              </svg>
            </Button>
            
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 rounded-full ${transportMode === 'cycling' ? 'text-purple-500 bg-purple-50' : 'text-gray-500'}`}
              onClick={() => onTransportModeChange('cycling')}
              aria-label="Cycling"
            >
              <Bike className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className={`h-10 w-10 flex-shrink-0 rounded-full ${isRecording ? 'text-red-500 bg-red-50' : 'text-orange-500 hover:bg-orange-50'}`}
            onClick={onMicClick}
            aria-label="Voice search"
          >
            <Mic className="h-5 w-5" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-10 w-10 flex-shrink-0 rounded-full ${
              isLocationActive ? 'text-blue-500 bg-blue-50' : 'text-blue-500 hover:bg-blue-50'
            }`}
            onClick={onLocationClick}
            aria-label="My location"
          >
            <MapPin className="h-5 w-5" />
          </Button>
        </div>
      </form>

      {/* Filters toggle button */}
      <div className="flex justify-center mt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleFilters}
          className="rounded-full text-xs flex items-center gap-1 bg-white/90 backdrop-blur-sm"
        >
          {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
          {showFilters ? <ZoomOut className="h-3 w-3" /> : <ZoomIn className="h-3 w-3" />}
        </Button>
      </div>
      
      {/* Filters section below */}
      {showFilters && (
        <div className="mt-2 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 space-y-2">
          <div className="flex flex-wrap gap-2 justify-between">
            <ResultsCountPopover 
              resultsCount={resultsCount} 
              onResultsCountChange={setResultsCount} 
            />
            
            <DurationFilter 
              selectedDuration={selectedDuration} 
              onDurationChange={setSelectedDuration} 
            />
            
            <DistanceFilter 
              selectedDistance={selectedDistance} 
              distanceUnit={distanceUnit} 
              onDistanceChange={setSelectedDistance} 
              onDistanceUnitChange={setDistanceUnit} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransparentSearchBar;
