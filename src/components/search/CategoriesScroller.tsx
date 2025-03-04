
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { mockCategories } from '@/data/mockCategories';
import { cn } from '@/lib/utils';

interface CategoriesScrollerProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export const CategoriesScroller: React.FC<CategoriesScrollerProps> = ({ 
  selectedCategory, 
  onCategorySelect 
}) => {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!categoriesRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - categoriesRef.current.offsetLeft);
    setScrollLeft(categoriesRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!categoriesRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - categoriesRef.current.offsetLeft);
    setScrollLeft(categoriesRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !categoriesRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoriesRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    categoriesRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !categoriesRef.current) return;
    const x = e.touches[0].pageX - categoriesRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    categoriesRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId === selectedCategory ? null : categoryId);
  };

  return (
    <div className="px-2 py-1">
      <div className="mb-1.5 flex justify-center">
        <div className="rounded-full border border-black px-4 py-0.5 bg-white text-sm">
          Catégorie
        </div>
      </div>
      
      <div className="flex justify-center items-center">
        <ArrowLeft className="h-4 w-4 mr-1.5 text-gray-400" />
        
        <div 
          ref={categoriesRef}
          className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 px-1 max-w-full"
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
          {mockCategories.map((category) => {
            const isSelected = category.id === selectedCategory;
            
            return (
              <Button 
                key={category.id} 
                className={cn(
                  "rounded-full border whitespace-nowrap px-2 py-0.5 h-7 flex-shrink-0 text-xs",
                  isSelected 
                    ? "bg-black text-white" 
                    : "bg-white text-black hover:bg-gray-50 border-black"
                )}
                onClick={() => handleCategoryClick(category.id)}
              >
                <MapPin className="h-3 w-3 mr-1" />
                <span>{category.name}</span>
              </Button>
            );
          })}
        </div>
        
        <ArrowRight className="h-4 w-4 ml-1.5 text-gray-400" />
      </div>
    </div>
  );
};
