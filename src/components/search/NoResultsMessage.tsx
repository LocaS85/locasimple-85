
import React from 'react';
import { Button } from '@/components/ui/button';

export interface NoResultsMessageProps {
  searchQuery?: string;
  loading?: boolean;
  clearFilters?: () => void;
}

const NoResultsMessage: React.FC<NoResultsMessageProps> = ({ 
  searchQuery = '',
  loading = false,
  clearFilters = () => {}
}) => {
  if (loading) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
        <h3 className="text-xl font-semibold mb-2">Aucun résultat trouvé</h3>
        <p className="text-gray-600 mb-4">
          {searchQuery 
            ? `Aucun résultat ne correspond à "${searchQuery}".`
            : "Aucun résultat ne correspond à vos critères de recherche."}
        </p>
        <Button onClick={clearFilters} variant="outline">
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );
};

export default NoResultsMessage;
