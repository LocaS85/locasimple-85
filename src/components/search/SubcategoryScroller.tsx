
import React, { useRef, useEffect } from 'react';

interface SubcategoryScrollerProps {
  subcategories: string[];
  selectedSubcategory: string | null;
  onSubcategorySelect: (subcategory: string) => void;
}

const SubcategoryScroller: React.FC<SubcategoryScrollerProps> = ({
  subcategories,
  selectedSubcategory,
  onSubcategorySelect
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll selected item into view if it exists
    if (selectedSubcategory && scrollRef.current) {
      const selectedElement = scrollRef.current.querySelector(`.subcategory-item.active`) as HTMLElement;
      if (selectedElement) {
        scrollRef.current.scrollTo({
          left: selectedElement.offsetLeft - scrollRef.current.offsetWidth / 2 + selectedElement.offsetWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedSubcategory]);

  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto mb-4" ref={scrollRef}>
      <div className="flex gap-2 pb-2 px-1">
        {subcategories.map((subcategory) => (
          <button
            key={subcategory}
            className={`subcategory-item whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedSubcategory === subcategory 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
            onClick={() => onSubcategorySelect(subcategory)}
          >
            {subcategory}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubcategoryScroller;
