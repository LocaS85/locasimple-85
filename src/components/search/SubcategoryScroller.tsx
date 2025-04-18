
import React from 'react';

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
    <div className="overflow-x-auto mb-4">
      <div className="flex gap-2 pb-2">
        {subcategories.map((subcategory) => (
          <button
            key={subcategory}
            className={`subcategory-item ${selectedSubcategory === subcategory ? 'active' : ''}`}
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
