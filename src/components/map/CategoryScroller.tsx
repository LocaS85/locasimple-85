
import React from 'react';
import { mockCategories } from '@/data/mockCategories';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getCategoryColorClass, getHoverColor } from '@/utils/categoryColors';
import { useLanguage } from '@/contexts/LanguageContext';
import { Category } from '@/types/categories';

export interface CategoryScrollerProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  categories?: any[]; // This allows the prop but doesn't require it
}

const CategoryScroller: React.FC<CategoryScrollerProps> = ({
  selectedCategory,
  onCategorySelect,
  categories = mockCategories // Default to mockCategories if not provided
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="absolute top-20 left-0 right-0 z-10 px-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md">
        <div className="flex overflow-x-auto scrollbar-hide py-1 gap-2">
          {categories.map((category) => {
            const isSelected = category.id === selectedCategory;
            
            return (
              <Button 
                key={category.id} 
                className={cn(
                  "rounded-full whitespace-nowrap px-3 py-1 h-8 flex-shrink-0 text-xs transition-colors",
                  isSelected 
                    ? getCategoryColorClass(category.id)
                    : `bg-white text-black border-gray-300 border ${getHoverColor(category.id)}`
                )}
                onClick={() => onCategorySelect(category.id === selectedCategory ? null : category.id)}
              >
                {category.icon}
                <span className="ml-1">{t(category.id) || category.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryScroller;
