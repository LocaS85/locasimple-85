
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/categories')} 
        className="mb-4 hover:scale-105 transform transition-all"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux catégories
      </Button>
      
      <h1 className="text-3xl font-bold mb-8 text-center text-3d">
        {mainCategory ? (t(mainCategory.name) || mainCategory.name) : (t(category?.name || '') || category?.name || '')}
      </h1>
      
      {subCategories.length > 0 ? (
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {subCategories.map((subCategory) => (
            <motion.div
              key={subCategory.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-900 text-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-xl"
              onClick={() => navigate(`/search?category=${subCategory.id}`)}
            >
              <div className="p-8 flex flex-col items-center text-center relative h-full">
                <div className="mb-6 transform translate-z-10 text-5xl">
                  {getCategoryIcon(subCategory.id, {
                    className: "w-16 h-16", 
                    color: getCategoryTextColor(subCategory.id)
                  })}
                </div>
                <h3 className="text-xl font-semibold transform translate-z-10">
                  {t(subCategory.name) || subCategory.name}
                </h3>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-gray-900/90"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">Aucune sous-catégorie disponible.</p>
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

// Helper function to get text color for each category
const getCategoryTextColor = (categoryId: string): string => {
  switch(categoryId) {
    case 'alimentation': 
    case 'restaurants':
    case 'gastronomie':
    case 'cafes':
      return '#f97316'; // orange-500
    case 'divertissement':
    case 'cinemas':
    case 'theatres':
      return '#3b82f6'; // blue-500
    case 'sante':
    case 'hopitaux':
    case 'pharmacies':
      return '#ef4444'; // red-500
    case 'travail':
    case 'bureaux':
      return '#8b5cf6'; // violet-500
    case 'shopping':
    case 'centres-commerciaux':
    case 'vetements':
      return '#22c55e'; // green-500
    case 'education':
    case 'ecoles':
    case 'bibliotheques':
      return '#eab308'; // yellow-500
    case 'hebergement':
    case 'hotels':
    case 'auberges':
      return '#06b6d4'; // cyan-500
    case 'transport':
    case 'stations':
    case 'aeroports':
      return '#a855f7'; // purple-500
    default:
      return '#f8fafc'; // slate-50
  }
};

export default SubcategoryGrid;
