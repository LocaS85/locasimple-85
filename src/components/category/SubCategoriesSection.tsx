
import React from 'react';
import { motion } from 'framer-motion';
import { SubCategoryList } from '@/components/SubCategoryList';
import { SubCategory } from '@/types/categories';

interface SubCategoriesSectionProps {
  subCategories?: SubCategory[];
  categoryId: string;
}

const SubCategoriesSection: React.FC<SubCategoriesSectionProps> = ({ 
  subCategories,
  categoryId
}) => {
  if (!subCategories) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <SubCategoryList 
        subCategories={subCategories}
        categoryId={categoryId}
      />
    </motion.div>
  );
};

export default SubCategoriesSection;
