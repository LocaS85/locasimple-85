
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/types/categories';
import { cn } from '@/lib/utils';
import { getCategoryColorClass, getHoverColor } from '@/utils/categoryColors';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoriesScrollerProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export const CategoriesScroller: React.FC<CategoriesScrollerProps> = ({ 
  selectedCategory, 
  onCategorySelect 
}) => {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);

  // Check if we should show navigation arrows
  useEffect(() => {
    const checkScroll = () => {
      if (!categoriesRef.current) return;
      
      setShowLeftArrow(categoriesRef.current.scrollLeft > 0);
      setShowRightArrow(
        categoriesRef.current.scrollLeft + categoriesRef.current.offsetWidth < 
        categoriesRef.current.scrollWidth
      );
    };

    checkScroll();
    
    if (categoriesRef.current) {
      categoriesRef.current.addEventListener('scroll', checkScroll);
    }
    
    return () => {
      if (categoriesRef.current) {
        categoriesRef.current.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  const scrollRight = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!categoriesRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - categoriesRef.current.offsetLeft);
    setInitialScrollLeft(categoriesRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!categoriesRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - categoriesRef.current.offsetLeft);
    setInitialScrollLeft(categoriesRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !categoriesRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoriesRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    categoriesRef.current.scrollLeft = initialScrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !categoriesRef.current) return;
    const x = e.touches[0].pageX - categoriesRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    categoriesRef.current.scrollLeft = initialScrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleCategoryClick = (categoryId: string) => {
    if (!isDragging) {
      onCategorySelect(categoryId === selectedCategory ? null : categoryId);
    }
  };

  return (
    <div className="px-2 py-1">
      <div className="mb-1.5 flex justify-center">
        <div className="rounded-full border border-black px-4 py-0.5 bg-white text-sm">
          {t('categories') || 'Catégories'}
        </div>
      </div>
      
      <div className="flex justify-center items-center">
        {showLeftArrow && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full" 
            onClick={() => scrollLeft()}
          >
            <ArrowLeft className="h-4 w-4 text-gray-500" />
          </Button>
        )}
        
        <div 
          ref={categoriesRef}
          className="flex gap-1.5 overflow-x-auto hide-scrollbar py-1 px-1 max-w-full"
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
          {CATEGORIES.map((category) => {
            const isSelected = category.id === selectedCategory;
            
            return (
              <Button 
                key={category.id} 
                className={cn(
                  "rounded-full whitespace-nowrap px-3 py-1 h-8 flex-shrink-0 text-xs transition-colors",
                  isSelected 
                    ? getCategoryColorClass(category.id)
                    : `bg-white text-black border-gray-300 border ${getHoverColor(category.id)}`
                )}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.icon}
                <span className="ml-1">{t(category.id) || category.name}</span>
              </Button>
            );
          })}
        </div>
        
        {showRightArrow && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full" 
            onClick={() => scrollRight()}
          >
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CategoriesScroller;
