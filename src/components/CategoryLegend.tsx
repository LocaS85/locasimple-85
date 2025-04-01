
import React from 'react';
import { useCategory } from './CategoryContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryLegendProps {
  onlyShowActive?: boolean;
}

const CategoryLegend = ({ onlyShowActive = false }: CategoryLegendProps) => {
  const { categoryColors, categoryVisibility, toggleCategoryVisibility, categoryNames } = useCategory();
  const { t } = useLanguage();

  const categories = Object.keys(categoryVisibility)
    .filter(cat => !onlyShowActive || categoryVisibility[cat]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="font-medium mb-3">{t('categories') || 'Catégories'}</h3>
      <div className="space-y-2">
        <AnimatePresence>
          {categories.map(categoryId => (
            <motion.div
              key={categoryId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between py-1"
            >
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded mr-2" 
                  style={{ backgroundColor: categoryColors[categoryId] || '#gray' }}
                />
                <div className="flex items-center">
                  {getCategoryIcon(categoryId, 'h-4 w-4 mr-2')}
                  <Label htmlFor={`visibility-${categoryId}`} className="cursor-pointer">
                    {categoryNames[categoryId] || t(categoryId) || categoryId}
                  </Label>
                </div>
              </div>
              <Switch
                id={`visibility-${categoryId}`}
                checked={categoryVisibility[categoryId]}
                onCheckedChange={() => toggleCategoryVisibility(categoryId)}
                aria-label={`${t('toggle')} ${categoryNames[categoryId]}`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategoryLegend;
