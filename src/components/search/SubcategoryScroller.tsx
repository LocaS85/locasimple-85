
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="w-full" type="scroll" scrollHideDelay={400}>
      <div className="flex gap-2 py-2 overflow-x-auto">
        {subcategories.map((subcategory) => (
          <div
            key={subcategory}
            className={`subcategory-item px-3 py-2 rounded-full text-sm flex-shrink-0 cursor-pointer transition-all 
              ${selectedSubcategory === subcategory 
                ? 'bg-primary text-white border-secondary shadow-sm' 
                : 'bg-gray-100 hover:bg-primary/10'}`}
            onClick={() => onSubcategorySelect(subcategory)}
          >
            {subcategory}
          </div>
        ))}
      </div>
      <style>
        {`
        .subcategory-item {
          white-space: nowrap;
          border: 1px solid transparent;
        }
        .subcategory-item:hover {
          transform: translateY(-1px);
        }
        .subcategory-item.active {
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
        }
        `}
      </style>
    </ScrollArea>
  );
};

export default SubcategoryScroller;
