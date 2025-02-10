
import React from 'react';
import { CategorySidebar } from '@/components/CategorySidebar';
import { CategoryContent } from '@/components/CategoryContent';
import { CategoryProvider } from '@/components/CategoryContext';
import { SidebarProvider } from '@/components/ui/sidebar';

const Categories = () => {
  return (
    <SidebarProvider defaultOpen>
      <CategoryProvider>
        <div className="flex min-h-screen w-full">
          <CategorySidebar />
          <CategoryContent />
        </div>
      </CategoryProvider>
    </SidebarProvider>
  );
};

export default Categories;
