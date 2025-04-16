
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface NoResultsMessageProps {
  searchQuery: string;
  loading: boolean;
  clearFilters: () => void;
}

const NoResultsMessage: React.FC<NoResultsMessageProps> = ({ 
  searchQuery,
  loading,
  clearFilters
}) => {
  if (loading || searchQuery.trim() === '') return null;

  return (
    <motion.div 
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center py-10 text-gray-500 bg-white/80 rounded-lg p-6 shadow-sm z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <p className="text-sm">Aucun résultat trouvé</p>
      <p className="text-xs mt-1">Essayez de modifier votre recherche ou vos filtres</p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-3" 
        onClick={clearFilters}
      >
        Réinitialiser
      </Button>
    </motion.div>
  );
};

export default NoResultsMessage;
