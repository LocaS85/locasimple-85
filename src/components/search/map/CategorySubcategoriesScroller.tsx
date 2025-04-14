
import React, { useRef, useEffect } from 'react';
import { SubCategory } from '@/types/categoryTypes';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategoryColorClass, getCategoryTextColor } from '@/utils/categoryColors';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { motion } from 'framer-motion';

interface CategorySubcategoriesScrollerProps {
  subcategories: SubCategory[];
  selectedSubcategories: string[];
  onSubcategorySelect: (id: string) => void;
  parentCategoryId: string;
}

const CategorySubcategoriesScroller = ({
  subcategories,
  selectedSubcategories,
  onSubcategorySelect,
  parentCategoryId,
}: CategorySubcategoriesScrollerProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
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

  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="absolute top-2 left-0 right-0 z-10 px-4">
      <motion.div 
        className="relative bg-white rounded-md shadow-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 ml-1 hover:bg-gray-100 transition-colors"
          aria-label="Défiler à gauche"
        >
          <ChevronLeft size={18} />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto py-2 px-8 gap-2 scroll-smooth hide-scrollbar"
        >
          {subcategories.map((subcategory) => {
            const isSelected = selectedSubcategories.includes(subcategory.id);
            
            // Determine the correct background and text colors based on category
            let bgClass = isSelected
              ? `bg-${parentCategoryId === 'shopping' ? 'blue' : 
                   parentCategoryId === 'restaurants' ? 'orange' : 
                   parentCategoryId === 'loisirs' ? 'pink' : 
                   parentCategoryId === 'services' ? 'emerald' : 
                   'primary'}-100`
              : "bg-gray-50";
            
            let borderClass = isSelected
              ? `border-${parentCategoryId === 'shopping' ? 'blue' : 
                   parentCategoryId === 'restaurants' ? 'orange' : 
                   parentCategoryId === 'loisirs' ? 'pink' : 
                   parentCategoryId === 'services' ? 'emerald' : 
                   'primary'}-200`
              : "border-gray-200";
            
            let textColorClass = isSelected
              ? getCategoryTextColor(parentCategoryId)
              : "text-gray-700";
              
            return (
              <motion.button
                key={subcategory.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  provideTactileFeedback();
                  onSubcategorySelect(subcategory.id);
                }}
                className={cn(
                  "whitespace-nowrap px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 flex-shrink-0 transition-all",
                  bgClass,
                  textColorClass,
                  "border",
                  borderClass,
                  !isSelected && "hover:bg-gray-100"
                )}
              >
                <span className="flex items-center justify-center w-4 h-4">
                  {typeof subcategory.icon === 'string' ? (
                    <span>{subcategory.icon}</span>
                  ) : React.isValidElement(subcategory.icon) ? (
                    subcategory.icon
                  ) : typeof subcategory.icon === 'function' ? (
                    React.createElement(subcategory.icon as React.ComponentType, {})
                  ) : (
                    getCategoryIcon(subcategory.id, "w-3.5 h-3.5")
                  )}
                </span>
                {subcategory.name}
              </motion.button>
            );
          })}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 mr-1 hover:bg-gray-100 transition-colors"
          aria-label="Défiler à droite"
        >
          <ChevronRight size={18} />
        </button>
      </motion.div>
    </div>
  );
};

export default CategorySubcategoriesScroller;
