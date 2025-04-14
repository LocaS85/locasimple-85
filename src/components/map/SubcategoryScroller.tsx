
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { CATEGORIES, SubCategory } from '@/types/categories';

interface SubcategoryScrollerProps {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onSubcategorySelect: (subcategoryId: string | null) => void;
}

const SubcategoryScroller: React.FC<SubcategoryScrollerProps> = ({
  selectedCategory,
  selectedSubcategory,
  onSubcategorySelect
}) => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  
  // Find subcategories for selected category
  const subcategories: SubCategory[] = React.useMemo(() => {
    if (!selectedCategory) return [];
    
    const category = CATEGORIES.find(cat => cat.id === selectedCategory);
    return category?.subCategories || [];
  }, [selectedCategory]);
  
  // Check scroll state for arrows
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollRef.current) return;
      
      setShowLeftArrow(scrollRef.current.scrollLeft > 0);
      setShowRightArrow(
        scrollRef.current.scrollLeft + scrollRef.current.offsetWidth < 
        scrollRef.current.scrollWidth
      );
    };

    checkScroll();
    
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', checkScroll);
    }
    
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', checkScroll);
      }
    };
  }, [subcategories]);
  
  // Scroll controls
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  // Drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setInitialScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setInitialScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = initialScrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = initialScrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  // Handle item selection
  const handleSubcategoryClick = (subcategoryId: string) => {
    if (!isDragging) {
      onSubcategorySelect(subcategoryId === selectedSubcategory ? null : subcategoryId);
    }
  };
  
  // If no category is selected or no subcategories exist, don't render
  if (!selectedCategory || subcategories.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-36 left-0 right-0 z-10 px-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md">
        <div className="flex items-center">
          {showLeftArrow && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full flex-shrink-0" 
              onClick={() => scrollLeft()}
            >
              <ArrowLeft className="h-4 w-4 text-gray-500" />
            </Button>
          )}
          
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto hide-scrollbar py-1 gap-2 flex-1"
            style={{ 
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleDragEnd}
          >
            {subcategories.map((subcategory) => {
              const isSelected = subcategory.id === selectedSubcategory;
              
              return (
                <Button 
                  key={subcategory.id} 
                  className={cn(
                    "rounded-full whitespace-nowrap px-3 py-1 h-7 flex-shrink-0 text-xs transition-colors",
                    isSelected 
                      ? "bg-blue-500 text-white" 
                      : "bg-white text-black border-gray-300 border hover:bg-blue-50"
                  )}
                  onClick={() => handleSubcategoryClick(subcategory.id)}
                >
                  <span>{t(subcategory.id) || subcategory.name}</span>
                </Button>
              );
            })}
          </div>
          
          {showRightArrow && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full flex-shrink-0" 
              onClick={() => scrollRight()}
            >
              <ArrowRight className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubcategoryScroller;
