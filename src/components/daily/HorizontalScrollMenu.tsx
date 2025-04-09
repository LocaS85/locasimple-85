
import React, { useState, ReactNode, useContext, useMemo } from 'react';
import { 
  ScrollMenu, 
  VisibilityContext
} from 'react-horizontal-scrolling-menu';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DailyCategory } from '@/types/dailyCategories';
import CategoryItem from './menu/CategoryItem';
import AddCategoryItem from './menu/AddCategoryItem';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

type Props = {
  categories: DailyCategory[];
  activeCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  onAddCategory: () => void;
};

const LeftArrow = () => {
  const { isFirstItemVisible, scrollPrev } = 
    useContext(VisibilityContext);

  return (
    <button
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
      className={`flex items-center justify-center p-2 rounded-full bg-white shadow-md mr-2 ${
        isFirstItemVisible ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
      }`}
      aria-label="Scroll left"
    >
      <ChevronLeft size={20} />
    </button>
  );
};

const RightArrow = () => {
  const { isLastItemVisible, scrollNext } = 
    useContext(VisibilityContext);

  return (
    <button
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
      className={`flex items-center justify-center p-2 rounded-full bg-white shadow-md ml-2 ${
        isLastItemVisible ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
      }`}
      aria-label="Scroll right"
    >
      <ChevronRight size={20} />
    </button>
  );
};

const HorizontalScrollMenu = ({
  categories,
  activeCategory,
  onCategorySelect,
  onAddCategory
}: Props) => {
  const items = [
    // All categories button
    <CategoryItem 
      key="all"
      itemId="all"
      category={{ id: null, name: "Tous", color: "#6B7280" }}
      isActive={activeCategory === null}
      onClick={() => onCategorySelect(null)}
    />,
    // Category buttons
    ...categories.map(category => (
      <CategoryItem
        key={category.id}
        itemId={category.id}
        category={category}
        isActive={activeCategory === category.id}
        onClick={() => onCategorySelect(category.id)}
      />
    )),
    // Add category button
    <AddCategoryItem 
      key="add"
      itemId="add"
      onClick={onAddCategory}
    />
  ];

  return (
    <div className="w-full mb-4">
      <ScrollMenu
        LeftArrow={LeftArrow}
        RightArrow={RightArrow}
        wrapperClassName="flex items-center"
        scrollContainerClassName="py-1"
      >
        {items}
      </ScrollMenu>
    </div>
  );
};

export default HorizontalScrollMenu;
