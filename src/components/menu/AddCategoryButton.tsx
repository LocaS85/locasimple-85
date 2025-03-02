
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddCategoryButtonProps {
  onClick?: () => void;
}

export const AddCategoryButton: React.FC<AddCategoryButtonProps> = ({
  onClick
}) => {
  return (
    <Button 
      variant="outline" 
      className="flex-shrink-0 rounded-full p-2"
      onClick={onClick}
    >
      <Plus className="h-5 w-5" />
    </Button>
  );
};
