
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { mockCategories } from '@/data/mockCategories';

export const CategoriesScroller: React.FC = () => {
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
    const walk = (x - startX) * 2; // Multiplicateur de vitesse de défilement
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

  return (
    <div className="px-4 py-3">
      <div className="mb-2 flex justify-center">
        <div className="rounded-full border-2 border-black px-6 py-1 bg-white">
          Catégorie
        </div>
      </div>
      
      <div className="flex justify-center items-center">
        <ArrowLeft className="h-6 w-6 mr-2 text-gray-400" />
        
        <div 
          ref={categoriesRef}
          className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-1 max-w-full"
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
          {mockCategories.map((category) => (
            <Button 
              key={category.id} 
              className="rounded-full border-2 border-black bg-white text-black hover:bg-gray-100 whitespace-nowrap px-4 py-1 h-auto flex-shrink-0"
            >
              {category.icon}
              <span className="ml-1">{category.name}</span>
            </Button>
          ))}
        </div>
        
        <ArrowRight className="h-6 w-6 ml-2 text-gray-400" />
      </div>
    </div>
  );
};
