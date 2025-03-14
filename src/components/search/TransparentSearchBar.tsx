
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mic, MapPin, X } from 'lucide-react';
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
  showCategoryMenu = false
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
        <div className="relative flex items-center">
          <div className="absolute left-3 text-gray-400 z-10">
            <Search className="h-5 w-5" />
          </div>
          
          <Input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un lieu, une entreprise..."
            className="pl-10 pr-20 py-3 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-md"
          />
          
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-16 h-8 w-8 text-gray-400 hover:text-gray-600"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <div className="absolute right-2 flex items-center gap-1">
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${isRecording ? 'text-red-500' : 'text-gray-500'}`}
              onClick={onMicClick}
            >
              <Mic className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full ${
                isLocationActive ? 'bg-blue-100 text-blue-600' : 'text-gray-500'
              }`}
              onClick={onLocationClick}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
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
      
      {/* Removed the toggle categories button */}
    </div>
  );
};

export default TransparentSearchBar;
