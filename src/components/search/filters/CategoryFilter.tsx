
import React, { useState, useEffect } from 'react';
import { Category } from '@/types/categoryTypes';
import { ScrollableSubcategories } from './ScrollableSubcategories';
import { getCategoryColorClass, getCategoryTextColor } from '@/utils/categoryColors';
import { cn } from '@/lib/utils';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { CATEGORIES } from '@/types/categories';

interface CategoryFilterProps {
  categories?: Category[]; // Structure : { id, name, icon, subcategories[] }
  onSubcategorySelect: (subcategories: string[]) => void;
  selectedCategory?: string | null;
  onCategorySelect?: (categoryId: string) => void;
}

const CategoryFilter = ({ 
  categories = CATEGORIES, 
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

  // Function to provide tactile feedback
  const provideTactileFeedback = () => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(20); // Subtle vibration
      } catch (e) {
        console.log('Vibration not supported');
      }
    }
  };

  return (
    <div className="category-filter space-y-4">
      {/* Catégories principales */}
      <div className="main-categories flex flex-wrap gap-2">
        {categories.map((category) => {
          // Get the category icon
          const iconComponent = typeof category.icon === 'string' 
            ? category.icon 
            : getCategoryIcon(category.id);
          
          return (
            <button 
              key={category.id}
              onClick={() => {
                provideTactileFeedback();
                handleCategoryClick(category.id);
              }}
              className={cn(
                "category-btn flex items-center gap-2 px-3 py-2 rounded-full transition-all", 
                selectedCategory === category.id 
                  ? getCategoryColorClass(category.id)
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              )}
            >
              <span className="category-icon w-5 h-5 flex items-center justify-center">
                {typeof iconComponent === 'string' ? (
                  <span className="text-lg">{iconComponent}</span>
                ) : React.isValidElement(iconComponent) ? (
                  iconComponent
                ) : typeof iconComponent === 'function' ? (
                  React.createElement(iconComponent as React.ComponentType, {})
                ) : (
                  getCategoryIcon(category.id, "w-5 h-5")
                )}
              </span>
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
