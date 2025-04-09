
import React from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { DailyCategoryType, DailyCategory } from '@/types/dailyCategories';

// Import our new components
import LeftArrow from './LeftArrow';
import RightArrow from './RightArrow';
import CategoryItem from './CategoryItem';
import AddCategoryItem from './AddCategoryItem';

interface HorizontalScrollMenuProps {
  categories: DailyCategory[];
  activeCategory: DailyCategoryType | null;
  onCategorySelect: (categoryId: DailyCategoryType | null) => void;
  onAddCategory: () => void;
  onEditCategory?: (categoryId: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
}

const HorizontalScrollMenu: React.FC<HorizontalScrollMenuProps> = ({
  categories,
  activeCategory,
  onCategorySelect,
  onAddCategory
}) => {
  // Préparation des éléments du menu avec "Tous" en premier
  const allCategory = { id: null, name: 'Tous', color: '#6b7280' };
  
  return (
    <div className="w-full relative mb-5 py-1">
      <ScrollMenu 
        LeftArrow={LeftArrow} 
        RightArrow={RightArrow}
        options={{ 
          ratio: 0.9, 
          rootMargin: '0px',
          threshold: [0.01, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] 
        }}
      >
        {/* Use correct JSX pattern for ScrollMenu items */}
        <CategoryItem
          itemId="all"
          category={allCategory}
          isActive={activeCategory === null}
          onClick={() => onCategorySelect(null)}
        />
        
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            itemId={category.id}
            category={category}
            isActive={category.id === activeCategory}
            onClick={() => onCategorySelect(category.id)}
          />
        ))}
        
        <AddCategoryItem 
          itemId="add-new"
          onClick={onAddCategory}
        />
      </ScrollMenu>
    </div>
  );
};

export default HorizontalScrollMenu;
