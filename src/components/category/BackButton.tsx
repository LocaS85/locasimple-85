
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <Button 
      variant="outline" 
      onClick={onClick} 
      className="mb-4 hover:scale-105 transform transition-all"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Retour aux catégories
    </Button>
  );
};

export default BackButton;
