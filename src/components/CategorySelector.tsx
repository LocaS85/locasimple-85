
import React from 'react';
import { Check } from 'lucide-react';
import { categories as appCategories } from '@/data/categories';

// Updated interface to match the structure from data/categories.ts
export interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color?: string; // Making color optional
}

interface CategorySelectorProps {
  categories: typeof appCategories;
  selectedCategories: string[];
  onSelect: (categoryId: string) => void;
}

const CategorySelector = ({ categories, selectedCategories, onSelect }: CategorySelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-2">
      {categories.map((category) => {
        // Determine background color based on selection state
        const bgClass = selectedCategories.includes(category.id)
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
        
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${bgClass}`}
          >
            {React.createElement(category.icon, { className: "h-4 w-4" })}
            <span>{category.name}</span>
            {selectedCategories.includes(category.id) && (
              <Check className="w-4 h-4" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CategorySelector;
