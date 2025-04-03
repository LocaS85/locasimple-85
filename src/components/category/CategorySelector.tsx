
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/types/categories';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCategoryIcon } from '@/utils/categoryIcons';
import { getCategoryColorClass } from '@/utils/categoryColors';

const CategorySelector: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [listView, setListView] = useState(false);
  
  const mainCategories = CATEGORIES.filter(cat => !cat.subCategories || cat.subCategories.length === 0);
  
  return (
    <ScrollArea className="flex-1">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{t('selectCategory')}</h2>
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
              className={`cursor-pointer rounded-lg shadow-md transition-all duration-300 overflow-hidden
                ${getCategoryColorClass(category.id)}`}
              onClick={() => navigate(`/categories/${category.id}`)}
            >
              <div className="p-4 flex flex-col items-center justify-center h-full">
                {getCategoryIcon(category.id, listView ? "h-8 w-8" : "h-12 w-12")}
                <span className="text-md font-medium mt-2">{category.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default CategorySelector;
