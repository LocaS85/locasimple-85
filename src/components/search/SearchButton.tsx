
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

interface SearchButtonProps {
  loading: boolean;
  onClick: () => void;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ loading, onClick }) => {
  return (
    <div className="absolute bottom-24 left-4 z-10">
      <Button
        onClick={onClick}
        className="rounded-full h-14 w-14 shadow-lg transition-all hover:scale-105 bg-primary text-white border-2 border-white hover:bg-primary/90"
        disabled={loading}
        aria-label="Rechercher"
      >
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Search className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default SearchButton;
