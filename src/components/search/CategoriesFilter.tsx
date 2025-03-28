
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { ArrowRight, Layers, Settings } from 'lucide-react';
import { mockCategories } from '@/data/mockCategories';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoriesFilterProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export const CategoriesFilter: React.FC<CategoriesFilterProps> = ({
  selectedCategory,
  onCategorySelect
}) => {
  const { t } = useLanguage();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          className={`w-full rounded-full border text-xs h-7 px-3 ${
            selectedCategory 
              ? "border-primary bg-primary text-white hover:bg-primary/90" 
              : "border-black bg-white text-black hover:bg-gray-50"
          } justify-between`}
        >
          <div className="flex items-center gap-1">
            {selectedCategory ? (
              <>
                {mockCategories.find(c => c.id === selectedCategory)?.icon}
                <span>{t(selectedCategory) || mockCategories.find(c => c.id === selectedCategory)?.name}</span>
              </>
            ) : (
              <>
                <Layers className="h-4 w-4" />
                <span>{t('categories')}</span>
              </>
            )}
          </div>
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0 bg-white shadow-lg rounded-md">
        <div className="p-2">
          <h3 className="font-bold mb-2 text-sm">{t('categories')}</h3>
          <div className="space-y-0.5">
            {mockCategories.map((category) => (
              <Button 
                key={category.id} 
                variant={selectedCategory === category.id ? "default" : "ghost"}
                className={`text-xs justify-between w-full h-9 ${
                  selectedCategory === category.id 
                    ? "bg-blue-500 text-white hover:bg-blue-600" 
                    : "text-black hover:bg-gray-100"
                }`}
                onClick={() => onCategorySelect(category.id)}
              >
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span>{t(category.id) || category.name}</span>
                </div>
                {selectedCategory === category.id && (
                  <Settings className="h-4 w-4" />
                )}
              </Button>
            ))}
            <Button 
              variant={selectedCategory === null ? "default" : "ghost"}
              className="text-xs justify-start h-8 w-full mt-1"
              onClick={() => onCategorySelect(null)}
            >
              <div className="flex items-center gap-1">
                <Layers className="h-4 w-4" />
                <span>{t('all') || "Tous"}</span>
              </div>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
