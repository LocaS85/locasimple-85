import React from 'react';
import { useCategory } from './CategoryContext';
import { CATEGORIES } from '@/types/categories';
import { AddressForm } from '@/components/AddressForm';
import { SubCategoryList } from '@/components/SubCategoryList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Home, ShoppingBag, Utensils, Heart, Briefcase, BookOpen, Film, Hotel, Search } from 'lucide-react';
import FilterPanel from '@/components/FilterPanel';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export const CategoryContent = () => {
  const { selectedCategory, addresses } = useCategory();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [radius, setRadius] = React.useState(5);
  const [transportMode, setTransportMode] = React.useState('driving');
  const [resultsCount, setResultsCount] = React.useState(3);
  const [duration, setDuration] = React.useState(15);

  if (!selectedCategory) {
    const mainCategories = CATEGORIES.filter(cat => !cat.subCategories || cat.subCategories.length === 0);
    
    return (
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">{t('selectCategory')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                  {getCategoryIcon(category.id)}
                  <span className="text-md font-medium mt-2">{category.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollArea>
    );
  }

  const category = CATEGORIES.find(cat => cat.id === selectedCategory);
  if (!category) return null;

  const showAddressForm = ['adresse-principale', 'famille', 'travail', 'ecole'].includes(selectedCategory);
  const currentAddresses = addresses[selectedCategory] || [];
  const canAddAddress = currentAddresses.length < 10;
  const isMainAddress = selectedCategory === 'adresse-principale';

  const categoriesWithoutFilters = [
    'alimentation',
    'achats',
    'services',
    'sante',
    'divertissement',
    'hebergement'
  ];

  const showFilters = !showAddressForm && !categoriesWithoutFilters.includes(selectedCategory);

  const handleSearch = () => {
    const searchParams = new URLSearchParams({
      category: selectedCategory,
      radius: radius.toString(),
      transport: transportMode,
      duration: duration.toString(),
      results: resultsCount.toString()
    });

    navigate(`/search?${searchParams.toString()}`);
    toast.success(t('searchStarted'));
  };

  return (
    <ScrollArea className="flex-1">
      <div className="p-6 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-2xl font-bold">{category.name}</h1>
          {showAddressForm && (
            <span className="text-sm text-muted-foreground">
              {currentAddresses.length}/10 {t('addresses')}
            </span>
          )}
        </motion.div>

        {isMainAddress && currentAddresses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Alert>
              <Home className="h-4 w-4" />
              <AlertTitle>{t('mainAddress')}</AlertTitle>
              <AlertDescription>
                {t('mainAddressDescription')}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        {showAddressForm && canAddAddress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <AddressForm categoryId={selectedCategory} />
          </motion.div>
        )}

        {showFilters && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <FilterPanel
              radius={radius}
              onRadiusChange={setRadius}
              transportMode={transportMode}
              onTransportModeChange={setTransportMode}
              resultsCount={resultsCount}
              onResultsCountChange={setResultsCount}
              duration={duration}
              onDurationChange={setDuration}
            />

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={handleSearch}
                className="w-full"
                size="lg"
              >
                <Search className="w-4 h-4 mr-2" />
                {t('search')}
              </Button>
            </motion.div>
          </motion.div>
        )}
        
        {category.subCategories && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <SubCategoryList 
              subCategories={category.subCategories}
              categoryId={selectedCategory}
            />
          </motion.div>
        )}
      </div>
    </ScrollArea>
  );
};

const getCategoryColorClass = (categoryId: string) => {
  switch (categoryId) {
    case 'adresse-principale':
      return 'bg-primary/10 hover:bg-primary/20';
    case 'famille':
      return 'bg-secondary/10 hover:bg-secondary/20';
    case 'travail':
      return 'bg-success/10 hover:bg-success/20';
    case 'ecole':
      return 'bg-accent/10 hover:bg-accent/20';
    case 'alimentation':
      return 'bg-green-500/10 hover:bg-green-500/20';
    case 'achats':
      return 'bg-blue-500/10 hover:bg-blue-500/20';
    case 'services':
      return 'bg-orange-500/10 hover:bg-orange-500/20';
    case 'sante':
      return 'bg-red-500/10 hover:bg-red-500/20';
    case 'divertissement':
      return 'bg-purple-500/10 hover:bg-purple-500/20';
    case 'hebergement':
      return 'bg-pink-500/10 hover:bg-pink-500/20';
    default:
      return 'bg-gray-100 hover:bg-gray-200';
  }
};

const getCategoryIcon = (categoryId: string) => {
  const iconSize = "h-12 w-12";
  
  switch (categoryId) {
    case 'adresse-principale':
      return <Home className={`${iconSize} text-primary`} />;
    case 'famille':
      return <Home className={`${iconSize} text-secondary`} />;
    case 'travail':
      return <Briefcase className={`${iconSize} text-success`} />;
    case 'ecole':
      return <BookOpen className={`${iconSize} text-accent`} />;
    case 'alimentation':
      return <Utensils className={`${iconSize} text-green-500`} />;
    case 'achats':
      return <ShoppingBag className={`${iconSize} text-blue-500`} />;
    case 'services':
      return <Home className={`${iconSize} text-orange-500`} />;
    case 'sante':
      return <Heart className={`${iconSize} text-red-500`} />;
    case 'divertissement':
      return <Film className={`${iconSize} text-purple-500`} />;
    case 'hebergement':
      return <Hotel className={`${iconSize} text-pink-500`} />;
    default:
      return <Home className={`${iconSize} text-gray-500`} />;
  }
};
