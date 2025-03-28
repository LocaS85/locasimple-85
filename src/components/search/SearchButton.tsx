
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

interface SearchButtonProps {
  loading: boolean;
  onClick: () => void;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ loading, onClick }) => {
  // Return null to hide the component completely
  return null;
};

export default SearchButton;
