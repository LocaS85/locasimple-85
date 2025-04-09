
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddCategoryItemProps {
  itemId: string;
  onClick: () => void;
}

const AddCategoryItem: React.FC<AddCategoryItemProps> = ({ itemId, onClick }) => {
  return (
    <div className="mx-2" key={itemId}>
      <Button 
        variant="outline"
        size="sm"
        onClick={onClick}
        className="flex-shrink-0 whitespace-nowrap min-w-28 bg-white/70 hover:bg-white/90 transition-all"
      >
        <Plus className="h-4 w-4 mr-1" />
        Nouveau groupe
      </Button>
    </div>
  );
};

export default AddCategoryItem;
