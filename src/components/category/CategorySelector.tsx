
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Grid, List, Users, Briefcase, Heart, ShoppingBag, Utensils, Film, Hotel, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/types/categories';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCategoryColorClass, getCategoryTextColor } from '@/utils/categoryColors';

const CategorySelector: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [listView, setListView] = useState(false);
  
  const mainCategories = CATEGORIES.filter(cat => !cat.subCategories || cat.subCategories.length === 0);
  
  // Category icon mapping function
  const getCategoryLucideIcon = (categoryId: string, className: string) => {
    switch(categoryId) {
      case 'quotidien':
        return <Users className={className} />;
      case 'alimentation':
        return <Utensils className={className} />;
      case 'shopping':
        return <ShoppingBag className={className} />;
      case 'services':
        return <Briefcase className={className} />;
      case 'sante':
        return <Heart className={className} />;
      case 'divertissement':
        return <Film className={className} />;
      case 'hebergement':
        return <Hotel className={className} />;
      default:
        return <Home className={className} />;
    }
  };

  return (
    <ScrollArea className="flex-1">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Sélectionnez une catégorie</h2>
          <Button onClick={() => setListView(!listView)} variant="outline">
            {listView ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </Button>
        </div>

        <div className={`grid ${listView ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-4`}>
          {mainCategories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer rounded-lg shadow-md transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
              onClick={() => navigate(`/categories/${category.id}`)}
            >
              {listView ? (
                <div className="p-3 flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getCategoryColorClass(category.id)}`}>
                    {getCategoryLucideIcon(category.id, "h-5 w-5 text-white")}
                  </div>
                  <span className="text-md font-medium">{category.name}</span>
                </div>
              ) : (
                <div className="p-6 flex flex-col items-center justify-center h-full">
                  <div className={`p-4 rounded-full ${getCategoryColorClass(category.id)} mb-3`}>
                    {getCategoryLucideIcon(category.id, "h-8 w-8 text-white")}
                  </div>
                  <span className="text-md font-medium">{category.name}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {category.subCategories?.length || 0} sous-catégories
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default CategorySelector;
