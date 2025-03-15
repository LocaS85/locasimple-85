
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import CategoryButton from './CategoryButton';
import { mockCategories } from '@/data/mockCategories';

interface CategoriesSelectorProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export const CategoriesSelector: React.FC<CategoriesSelectorProps> = ({
  selectedCategory,
  onCategorySelect
}) => {
  const { t } = useLanguage();

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      // Si la catégorie est déjà sélectionnée, la désélectionner
      onCategorySelect(null);
    } else {
      // Sinon, sélectionner la nouvelle catégorie
      onCategorySelect(categoryId);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-2">{t('categories')}</h3>
      <div className="flex flex-wrap gap-2">
        {mockCategories.map((category) => (
          <CategoryButton
            key={category.id}
            categoryId={category.id}
            isActive={selectedCategory === category.id}
            onClick={handleCategoryClick}
            className="flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesSelector;
