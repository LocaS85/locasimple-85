import React from 'react';
import { CategorySidebar } from '@/components/CategorySidebar';
import { CategoryContent } from '@/components/CategoryContent';
import { CategoryProvider } from '@/components/CategoryContext';

const Categories = () => {
  return (
    <CategoryProvider>
      <div className="flex min-h-screen w-full">
        <CategorySidebar />
        <CategoryContent />
      </div>
    </CategoryProvider>
  );
};

export default Categories;