import React from 'react';
import { Check } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategories: string[];
  onSelect: (categoryId: string) => void;
}

const CategorySelector = ({ categories, selectedCategories, onSelect }: CategorySelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            selectedCategories.includes(category.id)
              ? `bg-${category.color} text-white`
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
          {selectedCategories.includes(category.id) && (
            <Check className="w-4 h-4" />
          )}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;