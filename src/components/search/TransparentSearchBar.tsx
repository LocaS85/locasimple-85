
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mic, MapPin, Menu, X } from 'lucide-react';

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

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="h-12 w-12 flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-gray-200 text-primary hover:bg-primary hover:text-white transition-colors"
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
              className="pl-10 pr-10 py-3 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-md w-full focus:ring-2 focus:ring-primary focus:border-primary"
            />
            
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className={`h-12 w-12 flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-gray-200 ${isRecording ? 'text-red-500 bg-red-50' : 'text-orange-500 hover:bg-orange-50'} transition-colors`}
            onClick={onMicClick}
            aria-label="Voice search"
          >
            <Mic className="h-5 w-5" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-12 w-12 flex-shrink-0 rounded-full shadow-md border border-gray-200 transition-colors ${
              isLocationActive ? 'bg-blue-500 text-white' : 'bg-white/80 backdrop-blur-sm text-blue-500 hover:bg-blue-50'
            }`}
            onClick={onLocationClick}
            aria-label="My location"
          >
            <MapPin className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransparentSearchBar;
