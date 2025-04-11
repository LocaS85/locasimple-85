
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { DailyCategory, DailySubcategory } from '@/types/dailyCategories';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryAccordionProps {
  categories: DailyCategory[];
  selectionMode?: 'single' | 'multiple' | 'hierarchical';
  onCategorySelect?: (categoryId: string, subcategoryId?: string) => void;
  selectedCategory?: string;
  selectedSubcategory?: string;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  categories,
  selectionMode = 'hierarchical',
  onCategorySelect,
  selectedCategory,
  selectedSubcategory
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string, subcategoryId?: string) => {
    if (selectionMode === 'hierarchical' && !subcategoryId) {
      // Toggle expanded state for the category
      setExpandedCategories(prev => ({
        ...prev,
        [categoryId]: !prev[categoryId]
      }));
    }
    
    if (onCategorySelect) {
      onCategorySelect(categoryId, subcategoryId);
    }
  };

  const isCategorySelected = (categoryId: string) => {
    return selectedCategory === categoryId;
  };

  const isSubcategorySelected = (categoryId: string, subcategoryId: string) => {
    return selectedCategory === categoryId && selectedSubcategory === subcategoryId;
  };

  const isCategoryExpanded = (categoryId: string) => {
    return expandedCategories[categoryId];
  };

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <button 
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">Catégories</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isOpen && (
        <ScrollArea className="max-h-[300px] overflow-y-auto">
          <div className="p-2">
            <div className="space-y-1">
              {categories.map(category => (
                <div key={category.id} className="overflow-hidden">
                  <button
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 ${
                      isCategorySelected(category.id) && !selectedSubcategory ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center">
                      <span 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }}
                      ></span>
                      <span>{category.name}</span>
                    </div>
                    {category.subcategories && category.subcategories.length > 0 && (
                      isCategoryExpanded(category.id) ? 
                        <ChevronDown size={16} /> : 
                        <ChevronRight size={16} />
                    )}
                  </button>
                  
                  {category.subcategories && isCategoryExpanded(category.id) && (
                    <div className="ml-5 pl-2 border-l border-gray-200 mt-1 space-y-1">
                      {category.subcategories.map(subcategory => (
                        <button 
                          key={subcategory.id}
                          className={`w-full flex items-center px-3 py-1.5 rounded-md hover:bg-gray-100 ${
                            isSubcategorySelected(category.id, subcategory.id) ? 'bg-blue-50 text-blue-700' : ''
                          }`}
                          onClick={() => toggleCategory(category.id, subcategory.id)}
                        >
                          <span>{subcategory.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default CategoryAccordion;
