
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { DailyCategory } from '@/types/dailyCategories';

interface CategoryAccordionProps {
  categories: DailyCategory[];
  selectedCategory: string | null;
  onSelectCategory?: (categoryId: string) => void;
  onCategorySelect?: (categoryId: string) => void; // Alternative name for the same function
  onSelectSubcategory?: (subcategoryId: string) => void;
  selectedSubcategories?: string[];
  selectedSubcategory?: string;
  selectionMode?: 'single' | 'multiple' | 'hierarchical';
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onCategorySelect,
  onSelectSubcategory,
  selectedSubcategories = [],
  selectedSubcategory,
  selectionMode = 'single'
}) => {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    } else if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
  };

  const toggleCategory = (categoryId: string) => {
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null);
    } else {
      setExpandedCategoryId(categoryId);
      handleCategorySelect(categoryId);
    }
  };

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <div key={category.id} className="border rounded-lg overflow-hidden">
          <button
            className={`w-full p-3 flex justify-between items-center text-left ${
              selectedCategory === category.id ? 'bg-primary/10' : 'bg-white'
            }`}
            onClick={() => toggleCategory(category.id)}
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="font-medium">{category.name}</span>
            </div>
            <motion.div
              animate={{ rotate: expandedCategoryId === category.id ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={18} />
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedCategoryId === category.id && category.subCategories && category.subCategories.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-2 bg-gray-50 border-t">
                  <div className="grid grid-cols-2 gap-2">
                    {category.subCategories.map((subcategory) => (
                      <button
                        key={subcategory.id}
                        className={`px-3 py-2 rounded text-sm text-left ${
                          (selectedSubcategories.includes(subcategory.id) || selectedSubcategory === subcategory.id)
                            ? 'bg-primary/20 font-medium'
                            : 'bg-white hover:bg-gray-100'
                        }`}
                        onClick={() => onSelectSubcategory?.(subcategory.id)}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default CategoryAccordion;
