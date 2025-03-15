
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockCategories } from '@/data/mockCategories';
import { Button } from '@/components/ui/button';

interface CategoryMenuProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ 
  selectedCategory, 
  onCategorySelect 
}) => {
  return (
    <div className="w-full">
      <ScrollArea className="w-full">
        <div className="flex space-x-2 p-2 overflow-x-auto">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            className="flex items-center justify-center whitespace-nowrap"
            onClick={() => onCategorySelect(null)}
          >
            <span className="text-xs">Tous</span>
          </Button>
          
          {mockCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="flex items-center justify-center space-x-1 whitespace-nowrap"
              onClick={() => onCategorySelect(category.id)}
            >
              {category.icon}
              <span className="text-xs">{category.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryMenu;
