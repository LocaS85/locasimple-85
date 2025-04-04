
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchHeaderProps {
  title?: string;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ title = "Recherche" }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white py-3 px-4 shadow-sm flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-app-dark">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  );
};

export default SearchHeader;
