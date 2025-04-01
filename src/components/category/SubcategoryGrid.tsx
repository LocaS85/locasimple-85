
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/categories';
import { CATEGORIES } from '@/types/categories';
import { getCategoryIcon } from '@/utils/categoryIcons';
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
      <Button variant="outline" onClick={() => navigate('/categories')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux catégories
      </Button>
      
      <h1 className="text-3xl font-bold mb-8 text-center">
        {mainCategory ? (t(mainCategory.name) || mainCategory.name) : (t(category?.name || '') || category?.name || '')}
      </h1>
      
      {subCategories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subCategories.map((subCategory) => (
            <motion.div
              key={subCategory.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
              onClick={() => navigate(`/search?category=${subCategory.id}`)}
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="mb-4">
                  {getCategoryIcon(subCategory.id)}
                </div>
                <h3 className="text-lg font-semibold">{t(subCategory.name) || subCategory.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">Aucune sous-catégorie disponible.</p>
          <Button className="mt-4" onClick={() => navigate(`/search?category=${categoryId}`)}>
            Rechercher dans cette catégorie
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubcategoryGrid;
