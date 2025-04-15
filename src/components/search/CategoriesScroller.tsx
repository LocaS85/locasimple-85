
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/types/categories';
import { DAILY_CATEGORIES } from '@/types/dailyCategories';
import { getCategoryIcon } from '@/utils/categoryIcons';

interface CategoriesScrollerProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

const CategoriesScroller: React.FC<CategoriesScrollerProps> = ({
  selectedCategory,
  onCategorySelect
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10); // 10px buffer
  };
  
  // Set up scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Scroll left/right functions
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

  return (
    <div className="relative px-2 py-3 overflow-hidden">
      {showLeftArrow && (
        <Button
          onClick={scrollLeft}
          size="icon"
          variant="ghost"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm"
        >
          <ChevronLeft size={18} />
        </Button>
      )}
      
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-2 px-2 pb-1 snap-x"
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          const IconComponent = typeof category.icon === 'function' 
            ? category.icon 
            : getCategoryIcon(category.id);
            
          return (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="snap-start"
            >
              <Button
                onClick={() => onCategorySelect(category.id)}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "flex flex-col items-center justify-center h-20 min-w-[90px] px-2 py-3 gap-2 rounded-xl transition-all duration-200",
                  isSelected ? "bg-primary text-primary-foreground shadow-md" : "bg-white text-gray-700 hover:bg-gray-100"
                )}
              >
                <div className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full",
                  isSelected ? "text-primary-foreground" : "text-primary"
                )}>
                  {React.isValidElement(IconComponent) ? (
                    IconComponent
                  ) : typeof IconComponent === 'function' ? (
                    <IconComponent size={20} />
                  ) : (
                    getCategoryIcon(category.id, "w-5 h-5")
                  )}
                </div>
                <span className="text-xs font-medium truncate max-w-full">
                  {category.name}
                </span>
              </Button>
            </motion.div>
          );
        })}
      </div>
      
      {showRightArrow && (
        <Button
          onClick={scrollRight}
          size="icon" 
          variant="ghost"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm"
        >
          <ChevronRight size={18} />
        </Button>
      )}
    </div>
  );
};

export default CategoriesScroller;
