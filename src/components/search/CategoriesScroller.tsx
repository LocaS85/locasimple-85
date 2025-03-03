
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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

  // Couleurs pour chaque catégorie
  const categoryColors: Record<string, string> = {
    restaurants: 'bg-red-500 hover:bg-red-600',
    bars: 'bg-blue-500 hover:bg-blue-600',
    cafes: 'bg-orange-500 hover:bg-orange-600',
    shopping: 'bg-green-500 hover:bg-green-600',
    hotels: 'bg-purple-500 hover:bg-purple-600',
    entertainment: 'bg-pink-500 hover:bg-pink-600',
    health: 'bg-emerald-500 hover:bg-emerald-600',
    services: 'bg-cyan-500 hover:bg-cyan-600',
    education: 'bg-amber-500 hover:bg-amber-600',
    transport: 'bg-indigo-500 hover:bg-indigo-600',
  };

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

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId === selectedCategory ? null : categoryId);
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
          {mockCategories.map((category) => {
            const isSelected = category.id === selectedCategory;
            const colorClass = categoryColors[category.id] || 'bg-gray-500 hover:bg-gray-600';
            
            return (
              <Button 
                key={category.id} 
                className={cn(
                  "rounded-full border-2 whitespace-nowrap px-4 py-1 h-auto flex-shrink-0 text-white",
                  isSelected ? colorClass : "bg-white text-black hover:bg-gray-100 border-black"
                )}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.icon}
                <span className="ml-1">{category.name}</span>
              </Button>
            );
          })}
        </div>
        
        <ArrowRight className="h-6 w-6 ml-2 text-gray-400" />
      </div>
    </div>
  );
};
