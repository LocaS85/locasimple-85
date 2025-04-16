
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { DailyCategory } from '@/types/dailyCategories';

interface CategoryAccordionProps {
  categories: DailyCategory[];
  selectionMode?: 'single' | 'multi-level';
  onCategorySelect?: (selectedCategories: string[]) => void;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  categories,
  selectionMode = 'multi-level',
  onCategorySelect
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    let newSelected;
    
    if (selectedCategories.includes(categoryId)) {
      newSelected = selectedCategories.filter(id => id !== categoryId);
    } else {
      // If single selection mode, replace the selection
      if (selectionMode === 'single') {
        newSelected = [categoryId];
      } else {
        // If multi-level, add to the selection
        newSelected = [...selectedCategories, categoryId];
      }
    }
    
    setSelectedCategories(newSelected);
    if (onCategorySelect) {
      onCategorySelect(newSelected);
    }
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
        <div className="p-2 max-h-60 overflow-y-auto">
          <div className="space-y-1">
            {categories.map(category => (
              <div key={category.id}>
                <button
                  className={`w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-100 ${
                    selectedCategories.includes(category.id) ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  <span 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  ></span>
                  <span>{category.name}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryAccordion;
