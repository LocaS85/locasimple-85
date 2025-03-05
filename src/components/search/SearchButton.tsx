
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

interface SearchButtonProps {
  loading: boolean;
  onClick: () => void;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ loading, onClick }) => {
  return (
    <div className="absolute bottom-24 right-4 z-10">
      <Button
        onClick={onClick}
        className="rounded-full h-14 w-14 bg-primary/70 backdrop-blur-sm text-white shadow-lg"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <SearchIcon className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default SearchButton;
