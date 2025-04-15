
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Users, Briefcase, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DAILY_CATEGORIES } from '@/types/dailyCategories';

interface CategoriesScrollerProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

const CategoriesScroller: React.FC<CategoriesScrollerProps> = ({
  selectedCategory,
  onCategorySelect
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);

  // Check scroll position
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);
  };

  // Add scroll event listener
  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      
      // Initial check
      checkScrollPosition();
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => checkScrollPosition();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Scroll functions
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

  // Get icon component for category
  const getCategoryIcon = (iconName: string, className = "h-4 w-4") => {
    switch (iconName) {
      case 'Family':
        return <Users className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Dumbbell':
        return <Dumbbell className={className} />;
      default:
        return <Users className={className} />;
    }
  };

  return (
    <div className="bg-white flex items-center px-1 py-2 overflow-hidden relative border-b border-gray-100">
      {showLeftArrow && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full shadow-sm mr-2 bg-white/80 backdrop-blur-sm" 
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      
      <div 
        ref={scrollContainerRef}
        className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide snap-x"
      >
        {DAILY_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          const iconEl = getCategoryIcon(category.icon, "h-4 w-4");
          
          return (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="snap-start"
            >
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={cn(
                  "whitespace-nowrap px-3 py-1 flex items-center gap-2 rounded-full",
                  isSelected ? 
                    `bg-${category.id} text-white border-transparent` : 
                    "bg-white text-gray-700 border-gray-200"
                )}
                style={isSelected ? { backgroundColor: category.color, borderColor: category.color } : {}}
                onClick={() => onCategorySelect(category.id)}
              >
                {iconEl}
                <span>{category.name}</span>
              </Button>
            </motion.div>
          );
        })}
      </div>
      
      {showRightArrow && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full shadow-sm ml-2 bg-white/80 backdrop-blur-sm" 
          onClick={scrollRight}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default CategoriesScroller;
