
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/categories';
import { CATEGORIES } from '@/types/categories';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { getCategoryColorClass } from '@/utils/categoryColors';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SubcategoryGrid = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const category = CATEGORIES.find(cat => cat.id === categoryId);
  const mainCategory = categories.find(cat => cat.id === categoryId);
  
  if (!category && !mainCategory) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Button variant="outline" onClick={() => navigate('/categories')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux catégories
        </Button>
        <h1 className="text-3xl font-bold mb-4">Catégorie non trouvée</h1>
        <p>La catégorie que vous recherchez n'existe pas.</p>
      </div>
    );
  }
  
  const subCategories = category?.subCategories || [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => navigate('/categories')} className="mb-4 btn-3d">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux catégories
      </Button>
      
      <h1 className="text-3xl font-bold mb-8 text-center text-3d">
        {mainCategory ? (t(mainCategory.name) || mainCategory.name) : (t(category?.name || '') || category?.name || '')}
      </h1>
      
      {subCategories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subCategories.map((subCategory) => (
            <motion.div
              key={subCategory.id}
              whileHover={{ 
                scale: 1.05,
                rotateX: '2deg',
                rotateY: '2deg',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
              }}
              whileTap={{ scale: 0.98 }}
              className={`category-card preserve-3d perspective-1000 overflow-hidden cursor-pointer transition-all duration-300 ${getCategoryColorClass(subCategory.id)}`}
              onClick={() => navigate(`/search?category=${subCategory.id}`)}
            >
              <div className="p-8 flex flex-col items-center text-center relative h-full">
                <div className="mb-6 text-white transform translate-z-10 text-4xl">
                  {getCategoryIcon(subCategory.id)}
                </div>
                <h3 className="text-xl font-semibold text-white transform translate-z-10">{t(subCategory.name) || subCategory.name}</h3>
                <div className="gradient-overlay"></div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">Aucune sous-catégorie disponible.</p>
          <Button className="mt-4 btn-3d" onClick={() => navigate(`/search?category=${categoryId}`)}>
            Rechercher dans cette catégorie
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubcategoryGrid;
