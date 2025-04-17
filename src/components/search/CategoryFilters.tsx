
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Category } from '@/types/categoryTypes';
import { getCategoryIcon } from '@/utils/categoryIcons';

interface CategoryFiltersProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  const getCategoryColor = (categoryId: string): string => {
    // Map category IDs to colors (customize as needed)
    const colorMap: Record<string, string> = {
      'alimentation': '#f59e0b', // Amber
      'shopping': '#3b82f6', // Blue
      'services': '#10b981', // Emerald
      'sante': '#ef4444', // Red
      'divertissement': '#8b5cf6', // Violet
      'hebergement': '#f97316', // Orange
      'quotidien': '#6366f1', // Indigo
    };

    return colorMap[categoryId] || '#6b7280'; // Gray fallback
  };

  return (
    <ScrollArea className="w-full" type="scroll" scrollHideDelay={400}>
      <div className="flex gap-2 py-1 pr-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className="flex-shrink-0 h-9 px-3 flex items-center gap-1.5"
            onClick={() => onCategorySelect(category.id)}
            style={{
              backgroundColor: selectedCategory === category.id ? getCategoryColor(category.id) : 'transparent',
              borderColor: selectedCategory === category.id ? 'transparent' : getCategoryColor(category.id),
              color: selectedCategory === category.id ? 'white' : getCategoryColor(category.id),
            }}
          >
            {getCategoryIcon(category.id, 'h-4 w-4')}
            <span className="text-sm">{category.name}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CategoryFilters;
