
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/categories';
import { CATEGORIES } from '@/types/categories';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SubcategoryCard from '@/components/category/SubcategoryCard';
import BackButton from '@/components/category/BackButton';

const SubcategoryGrid = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const category = CATEGORIES.find(cat => cat.id === categoryId);
  const mainCategory = categories.find(cat => cat.id === categoryId);
  
  if (!category && !mainCategory) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <BackButton onClick={() => navigate('/categories')} />
        <h1 className="text-3xl font-bold mb-4">Catégorie non trouvée</h1>
        <p>La catégorie que vous recherchez n'existe pas.</p>
      </div>
    );
  }
  
  const subCategories = category?.subCategories || [];
  
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
      <BackButton onClick={() => navigate('/categories')} />
      
      <h1 className="text-3xl font-bold mb-8 text-center">
        {mainCategory ? (t(mainCategory.name) || mainCategory.name) : (t(category?.name || '') || category?.name || '')}
      </h1>
      
      {subCategories.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {subCategories.map(subCategory => (
            <SubcategoryCard
              key={subCategory.id}
              subCategory={subCategory}
              categoryId={categoryId || ''}
              onNavigate={navigate}
              t={t as (key: string) => string}
            />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 dark:text-gray-400">Aucune sous-catégorie disponible.</p>
          <Button 
            className="mt-4 hover:scale-105 transform transition-all" 
            onClick={() => navigate(`/search?category=${categoryId}`)}
          >
            Rechercher dans cette catégorie
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubcategoryGrid;
