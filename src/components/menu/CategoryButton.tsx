
import React from 'react';
import { Button } from '@/components/ui/button';
import type { Category } from '@/data/mockCategories';

interface CategoryButtonProps {
  category: Category;
  isSelected?: boolean;
  onClick?: () => void;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
  category,
  isSelected = false,
  onClick
}) => {
  return (
    <Button 
      variant="outline" 
      className="flex-shrink-0 whitespace-nowrap"
      onClick={onClick}
    >
      {category.icon}
      <span>{category.name}</span>
    </Button>
  );
};
