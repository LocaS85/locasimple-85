
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CategoryTabsProps {
  selectedCategory: string | null;
  handleCategoryToggle: (category: string) => void;
  clearFilters: () => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  handleCategoryToggle,
  clearFilters
}) => {
  const categories = ['restaurants', 'shopping', 'entertainment', 'culture', 'sports'];

  return (
    <div className="bg-white px-3 py-2 flex space-x-2 overflow-x-auto scrollbar-hide border-b border-gray-100">
      {categories.map((category) => (
        <motion.div
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={selectedCategory === category ? "default" : "outline"}
            className={`rounded-full text-xs py-1 px-3 h-auto ${
              selectedCategory === category 
                ? `bg-app-${category === 'restaurants' ? 'secondary' : category === 'shopping' ? 'primary' : 'gray'}`
                : "border-gray-200 text-gray-600"
            }`}
            onClick={() => handleCategoryToggle(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        </motion.div>
      ))}
      
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-xs py-1 px-2 h-auto text-gray-500 flex items-center"
            onClick={clearFilters}
          >
            Effacer <X className="ml-1 h-3 w-3" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default CategoryTabs;
