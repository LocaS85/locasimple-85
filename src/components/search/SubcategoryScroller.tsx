
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
  return (
    <ScrollArea className="w-full" type="scroll" scrollHideDelay={400}>
      <div className="subcategory-scroller">
        {subcategories.map((subcategory) => (
          <div
            key={subcategory}
            className={`subcategory-item ${selectedSubcategory === subcategory ? 'active' : ''}`}
            onClick={() => onSubcategorySelect(subcategory)}
          >
            {subcategory}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SubcategoryScroller;
