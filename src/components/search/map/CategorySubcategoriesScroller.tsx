
import React, { useRef } from 'react';
import { SubCategory } from '@/types/categoryTypes';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-2 left-0 right-0 z-10 px-4">
      <div className="relative bg-white rounded-md shadow-md">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 ml-1"
          aria-label="Défiler à gauche"
        >
          <ChevronLeft size={18} />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto py-2 px-8 gap-2 scroll-smooth scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {subcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => onSubcategorySelect(subcategory.id)}
              className={cn(
                "whitespace-nowrap px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 flex-shrink-0 transition-all",
                selectedSubcategories.includes(subcategory.id)
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              )}
            >
              <span className="flex items-center justify-center w-4 h-4">
                {typeof subcategory.icon === 'string' ? (
                  <span>{subcategory.icon}</span>
                ) : React.isValidElement(subcategory.icon) ? (
                  subcategory.icon
                ) : typeof subcategory.icon === 'function' ? (
                  React.createElement(subcategory.icon as React.ComponentType, {})
                ) : null}
              </span>
              {subcategory.name}
            </button>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 mr-1"
          aria-label="Défiler à droite"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default CategorySubcategoriesScroller;
