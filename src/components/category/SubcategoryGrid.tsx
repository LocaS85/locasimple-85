
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/types/categories';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategoryColorClass } from '@/utils/categoryColors';
import SubcategoryCard from '@/components/category/SubcategoryCard';

// Import des icônes spécifiques par catégorie
import { getFoodCategoryIcon } from '@/utils/icons/foodIcons';
import { getServicesIcon } from '@/utils/icons/servicesIcons';
import { getHealthIcon } from '@/utils/icons/healthIcons';
import { getEntertainmentIcon } from '@/utils/icons/entertainmentIcons';
import { 
  Utensils, 
  ShoppingBag, 
  Briefcase, 
  Heart, 
  Film, 
  Hotel 
} from 'lucide-react';

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

  // Get the appropriate icon based on category ID
  const getCategoryIcon = (id: string) => {
    switch(id.toLowerCase()) {
      case 'alimentation':
        // Utilise l'icône d'alimentation avec une couleur spécifique
        return getFoodCategoryIcon('alimentation', "w-12 h-12", "text-orange-500");
      case 'shopping':
        return <ShoppingBag className="w-12 h-12 text-green-500" />;
      case 'services':
        // Utilise l'icône de services avec une couleur spécifique
        return getServicesIcon('services', "w-12 h-12", "text-blue-600");
      case 'sante':
        // Utilise l'icône de santé avec une couleur spécifique
        return getHealthIcon('sante', "w-12 h-12", "text-red-500");
      case 'divertissement':
        // Utilise l'icône de divertissement avec une couleur spécifique
        return getEntertainmentIcon('divertissement', "w-12 h-12", "text-purple-500");
      case 'hebergement':
        return <Hotel className="w-12 h-12 text-cyan-500" />;
      default:
        return <Briefcase className="w-12 h-12 text-gray-500" />;
    }
  };

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
          Retour aux catégories
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center mb-8 gap-4">
        <div className={`p-4 rounded-full ${getCategoryColorClass(category.id)}`}>
          {getCategoryIcon(category.id)}
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
