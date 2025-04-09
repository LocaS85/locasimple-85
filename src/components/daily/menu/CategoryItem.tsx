
import React from 'react';
import { Button } from '@/components/ui/button';
import { DailyCategory } from '@/types/dailyCategories';

interface CategoryItemProps {
  itemId: string;
  category: DailyCategory | { id: null; name: string; color: string; };
  isActive: boolean;
  onClick: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ 
  itemId, 
  category, 
  isActive, 
  onClick 
}) => {
  return (
    <div className="mx-2" key={itemId}>
      <Button 
        variant={isActive ? "default" : "outline"}
        size="sm"
        onClick={onClick}
        className={`flex-shrink-0 whitespace-nowrap px-4 min-w-20 transition-all ${
          isActive ? 'shadow-md' : 'hover:shadow-sm'
        }`}
        style={category.id ? { borderLeft: `3px solid ${category.color}` } : {}}
      >
        {category.name}
      </Button>
    </div>
  );
};

export default CategoryItem;
