
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mic, MapPin, Menu, X } from 'lucide-react';
import { CategoryMenu } from './CategoryMenu';
import { mockCategories } from '@/data/mockCategories';
import { toast } from 'sonner';

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
  showCategoryMenu?: boolean;
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
  showCategoryMenu = false,
  onMenuClick = () => {}
}) => {
  const [showCategories, setShowCategories] = useState(showCategoryMenu);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowCategories(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="h-12 w-12 flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-gray-200 text-primary"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="relative flex-grow">
            <div className="absolute left-3 text-gray-400 z-10">
              <Search className="h-5 w-5" />
            </div>
            
            <Input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un lieu, une entreprise..."
              className="pl-10 pr-10 py-3 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-md w-full"
            />
            
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className={`h-12 w-12 flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-gray-200 ${isRecording ? 'text-highlight' : 'text-secondary'}`}
            onClick={onMicClick}
          >
            <Mic className="h-5 w-5" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-12 w-12 flex-shrink-0 rounded-full shadow-md border border-gray-200 ${
              isLocationActive ? 'bg-primary text-white' : 'bg-white/80 backdrop-blur-sm text-accent'
            }`}
            onClick={onLocationClick}
          >
            <MapPin className="h-5 w-5" />
          </Button>
        </div>
      </form>

      {/* Category Menu */}
      <div 
        ref={menuRef} 
        className={`absolute left-0 right-0 mt-2 z-20 ${showCategories ? 'block' : 'hidden'}`}
      >
        <CategoryMenu 
          categories={mockCategories} 
          transportMode={transportMode} 
          onTransportModeChange={onTransportModeChange} 
        />
      </div>
    </div>
  );
};

export default TransparentSearchBar;
