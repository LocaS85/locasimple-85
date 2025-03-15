
import React from 'react';
import { Button } from '@/components/ui/button';
import { mockCategories } from '@/data/mockCategories';

interface CategoryButtonProps {
  categoryId: string;
  isActive: boolean;
  onClick: (categoryId: string) => void;
  className?: string;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  categoryId,
  isActive,
  onClick,
  className = ''
}) => {
  // Find the category from mockCategories
  const category = mockCategories.find(cat => cat.id === categoryId);
  
  if (!category) {
    return null;
  }
  
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={`flex items-center justify-center p-2 ${className} ${
        isActive ? 'bg-primary text-white' : 'bg-white text-gray-700 border-gray-200'
      }`}
      onClick={() => onClick(categoryId)}
    >
      <div className="flex items-center space-x-2">
        {category.icon}
        <span className="text-xs font-medium">{category.name}</span>
      </div>
    </Button>
  );
};

export default CategoryButton;
