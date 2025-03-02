
import React, { useRef } from 'react';
import { mockCategories } from '@/data/mockCategories';
import { CategoryButton } from './CategoryButton';
import { AddCategoryButton } from './AddCategoryButton';

export const CategoriesSelector: React.FC = () => {
  const categoriesRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="px-4 pb-2 relative">
      <div 
        ref={categoriesRef}
        className="flex items-center overflow-x-auto pb-2 gap-2 scrollbar-hide"
      >
        {mockCategories.map((category) => (
          <CategoryButton 
            key={category.id} 
            category={category}
          />
        ))}
        <AddCategoryButton />
      </div>
    </div>
  );
};
