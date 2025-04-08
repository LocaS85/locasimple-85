
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/types/categories';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategoryColorClass } from '@/utils/categoryColors';
import { getCategoryIcon } from '@/utils/categoryIcons';
import SubcategoryCard from '@/components/category/SubcategoryCard';

const SubcategoryGrid = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Find current category
  const category = CATEGORIES.find(cat => cat.id === categoryId);
  
  if (!category) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-xl font-semibold">{t('categoryNotFound')}</h2>
        <Button onClick={() => navigate('/categories')} className="mt-4">
          {t('backToCategories')}
        </Button>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 mb-8">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/categories')}
          className="flex items-center text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToCategories')}
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center mb-8 gap-4">
        <div className={`p-4 rounded-full ${getCategoryColorClass(category.id)}`}>
          {getCategoryIcon(category.id, "w-12 h-12")}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-center sm:text-left">{t(category.name) || category.name}</h1>
      </div>
      
      {category.subCategories && category.subCategories.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {category.subCategories.map(subCategory => (
            <SubcategoryCard 
              key={subCategory.id}
              subCategory={subCategory}
              categoryId={category.id}
              onNavigate={navigate}
              t={t}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center p-10">
          <p>{t('noSubcategories')}</p>
        </div>
      )}
    </div>
  );
};

export default SubcategoryGrid;
