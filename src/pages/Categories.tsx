
import React from 'react';
import { CategoryProvider } from '@/components/CategoryContext';
import { CategorySidebar } from '@/components/CategorySidebar';
import { CategoryContent } from '@/components/CategoryContent';
import { motion } from 'framer-motion';
import { SidebarProvider } from '@/components/ui/sidebar';

const Categories = () => {
  return (
    <CategoryProvider>
      <motion.div 
        className="flex h-[calc(100vh-4rem)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SidebarProvider>
          <CategorySidebar />
          <div className="flex-1 overflow-auto">
            <CategoryContent />
          </div>
        </SidebarProvider>
      </motion.div>
    </CategoryProvider>
  );
};

export default Categories;
