
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SubcategoryType {
  id: string;
  name: string;
}

interface CategorySubcategoriesScrollerProps {
  subcategories: SubcategoryType[];
  selectedSubcategories: string[];
  onSubcategorySelect: (subcategoryId: string) => void;
  parentCategoryId: string;
}

const CategorySubcategoriesScroller: React.FC<CategorySubcategoriesScrollerProps> = ({
  subcategories,
  selectedSubcategories,
  onSubcategorySelect,
  parentCategoryId
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Check scroll position
  const checkScrollPosition = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };
  
  // Add scroll event listener
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [subcategories]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Scroll functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  // Don't render if no subcategories
  if (!subcategories || subcategories.length === 0) {
    return null;
  }
  
  return (
    <div className="absolute top-2 left-0 right-0 z-10 px-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-md">
        <div className="flex items-center">
          {showLeftArrow && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full flex-shrink-0" 
              onClick={scrollLeft}
            >
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            </Button>
          )}
          
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto hide-scrollbar py-1 gap-2 flex-1 snap-x"
          >
            {subcategories.map((subcategory) => {
              const isSelected = selectedSubcategories.includes(subcategory.id);
              
              return (
                <motion.div
                  key={subcategory.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="snap-start"
                >
                  <Button 
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "rounded-full whitespace-nowrap px-3 py-1 h-7 flex-shrink-0 text-xs transition-colors",
                      isSelected 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-white text-foreground border-muted"
                    )}
                    onClick={() => onSubcategorySelect(subcategory.id)}
                  >
                    <span>{subcategory.name}</span>
                  </Button>
                </motion.div>
              );
            })}
          </div>
          
          {showRightArrow && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full flex-shrink-0" 
              onClick={scrollRight}
            >
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySubcategoriesScroller;
