
import React, { useState } from 'react';
import { Category } from '@/types/categoryTypes';
import { ScrollableSubcategories } from './ScrollableSubcategories';
import { getCategoryColorClass, getCategoryTextColor } from '@/utils/categoryColors';
import { cn } from '@/lib/utils';

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
          // Support both string and component icons
          const iconComponent = category.icon;
          
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
                  ? getCategoryColor(category.id)
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
                  null
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

// Helper function to get category color class
function getCategoryColor(categoryId: string): string {
  switch(categoryId) {
    case 'restaurants': return 'bg-red-500 hover:bg-red-600 text-white';
    case 'bars': return 'bg-orange-500 hover:bg-orange-600 text-white';
    case 'cafes': return 'bg-amber-500 hover:bg-amber-600 text-white';
    case 'shopping': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
    case 'hotels': return 'bg-lime-500 hover:bg-lime-600 text-white';
    case 'entertainment': return 'bg-green-500 hover:bg-green-600 text-white';
    case 'health': return 'bg-teal-500 hover:bg-teal-600 text-white';
    case 'services': return 'bg-cyan-500 hover:bg-cyan-600 text-white';
    case 'education': return 'bg-blue-500 hover:bg-blue-600 text-white';
    case 'transport': return 'bg-indigo-500 hover:bg-indigo-600 text-white';
    case 'alimentation': return 'bg-red-500 hover:bg-red-600 text-white';
    case 'achat': return 'bg-purple-500 hover:bg-purple-600 text-white';
    case 'sante': return 'bg-teal-500 hover:bg-teal-600 text-white';
    case 'divertissement': return 'bg-green-500 hover:bg-green-600 text-white';
    case 'hebergement': return 'bg-lime-500 hover:bg-lime-600 text-white';
    case 'quotidien': return 'bg-blue-500 hover:bg-blue-600 text-white';
    default: return 'bg-slate-500 hover:bg-slate-600 text-white';
  }
}

export default CategoryFilter;
