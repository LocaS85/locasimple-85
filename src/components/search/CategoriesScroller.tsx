
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

  // Define category colors
  const getCategoryColor = (categoryId: string) => {
    switch(categoryId) {
      case 'restaurants': return 'bg-red-500 hover:bg-red-500 text-white border-red-500';
      case 'bars': return 'bg-orange-500 hover:bg-orange-500 text-white border-orange-500';
      case 'cafes': return 'bg-amber-500 hover:bg-amber-500 text-white border-amber-500';
      case 'shopping': return 'bg-yellow-500 hover:bg-yellow-500 text-white border-yellow-500';
      case 'hotels': return 'bg-lime-500 hover:bg-lime-500 text-white border-lime-500';
      case 'entertainment': return 'bg-green-500 hover:bg-green-500 text-white border-green-500';
      case 'health': return 'bg-teal-500 hover:bg-teal-500 text-white border-teal-500';
      case 'services': return 'bg-cyan-500 hover:bg-cyan-500 text-white border-cyan-500';
      case 'education': return 'bg-blue-500 hover:bg-blue-500 text-white border-blue-500';
      case 'transport': return 'bg-indigo-500 hover:bg-indigo-500 text-white border-indigo-500';
      default: return 'bg-black hover:bg-black text-white border-black';
    }
  };
  
  const getHoverColor = (categoryId: string) => {
    switch(categoryId) {
      case 'restaurants': return 'hover:bg-red-200 hover:text-red-700 hover:border-red-500';
      case 'bars': return 'hover:bg-orange-200 hover:text-orange-700 hover:border-orange-500';
      case 'cafes': return 'hover:bg-amber-200 hover:text-amber-700 hover:border-amber-500';
      case 'shopping': return 'hover:bg-yellow-200 hover:text-yellow-700 hover:border-yellow-500';
      case 'hotels': return 'hover:bg-lime-200 hover:text-lime-700 hover:border-lime-500';
      case 'entertainment': return 'hover:bg-green-200 hover:text-green-700 hover:border-green-500';
      case 'health': return 'hover:bg-teal-200 hover:text-teal-700 hover:border-teal-500';
      case 'services': return 'hover:bg-cyan-200 hover:text-cyan-700 hover:border-cyan-500';
      case 'education': return 'hover:bg-blue-200 hover:text-blue-700 hover:border-blue-500';
      case 'transport': return 'hover:bg-indigo-200 hover:text-indigo-700 hover:border-indigo-500';
      default: return 'hover:bg-gray-200 hover:text-gray-700 hover:border-gray-500';
    }
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
                  "rounded-full border whitespace-nowrap px-2 py-0.5 h-7 flex-shrink-0 text-xs transition-colors",
                  isSelected 
                    ? getCategoryColor(category.id)
                    : `bg-white text-black border-black ${getHoverColor(category.id)}`
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
