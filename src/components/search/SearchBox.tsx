
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mic, MapPin } from 'lucide-react';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onLocationClick: () => void;
  isLocationActive: boolean;
  loading: boolean;
  isRecording: boolean;
  onMicClick: () => void;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  onSearch,
  onLocationClick,
  isLocationActive,
  loading,
  isRecording,
  onMicClick,
  placeholder = 'Rechercher...'
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative flex items-center mb-4">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-20 py-6 rounded-lg shadow-sm"
        onKeyPress={handleKeyPress}
      />
      <div className="absolute right-2 flex items-center space-x-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onMicClick}
          className={`h-8 w-8 ${isRecording ? 'text-red-500' : ''}`}
          disabled={loading}
        >
          <Mic size={18} />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onLocationClick}
          className={`h-8 w-8 ${isLocationActive ? 'text-blue-500' : ''}`}
          disabled={loading}
        >
          <MapPin size={18} />
        </Button>
        <Button
          type="button"
          size="icon"
          onClick={onSearch}
          className="h-8 w-8 bg-primary text-white hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? (
            <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin" />
          ) : (
            <Search size={18} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default SearchBox;
