
import React, { useState } from 'react';
import { Category } from '@/types/categoryTypes';
import { ScrollableSubcategories } from './ScrollableSubcategories';

interface CategoryFilterProps {
  categories: Category[]; // Structure : { id, name, icon, subcategories[] }
  onSubcategorySelect: (subcategories: string[]) => void;
  selectedCategory?: string | null;
  onCategorySelect?: (categoryId: string) => void;
}

const CategoryFilter = ({ 
  categories, 
  onSubcategorySelect, 
  selectedCategory: externalSelectedCategory, 
  onCategorySelect 
}: CategoryFilterProps) => {
  const [internalSelectedCategory, setInternalSelectedCategory] = useState<string>("");
  
  // Use external value if controlled component, otherwise use internal state
  const selectedCategory = externalSelectedCategory !== undefined ? externalSelectedCategory : internalSelectedCategory;

  const handleCategoryClick = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    } else {
      setInternalSelectedCategory(categoryId === selectedCategory ? "" : categoryId);
    }
  };

  return (
    <div className="category-filter space-y-4">
      {/* Catégories principales */}
      <div className="main-categories flex flex-wrap gap-2">
        {categories.map((category) => {
          // Handle both string and React component icons
          const IconComponent = typeof category.icon === 'string' 
            ? null 
            : category.icon;
          
          return (
            <button 
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`category-btn flex items-center gap-2 px-3 py-2 rounded-full 
                ${selectedCategory === category.id 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              {typeof category.icon === 'string' ? (
                <span className="category-icon text-lg">{category.icon}</span>
              ) : IconComponent ? (
                <IconComponent className="category-icon w-5 h-5" />
              ) : null}
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Sous-catégories scrollables */}
      {selectedCategory && (
        <ScrollableSubcategories 
          subcategories={categories.find(c => c.id === selectedCategory)?.subCategories || []}
          onSelect={onSubcategorySelect}
        />
      )}
    </div>
  );
};

export default CategoryFilter;
