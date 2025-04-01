
import React, { useState } from 'react';
import { useCategory } from './CategoryContext';
import { CATEGORIES } from '@/types/categories';
import { AddressForm } from '@/components/AddressForm';
import { SubCategoryList } from '@/components/SubCategoryList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Home, ShoppingBag, Utensils, Heart, Briefcase, BookOpen, Film, Hotel, Search, Printer, Grid, List, Loader } from 'lucide-react';
import FilterPanel from '@/components/FilterPanel';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import CategoryNameEditor from './CategoryNameEditor';
import CustomFieldsForm from './CustomFieldsForm';
import CategoryLegend from './CategoryLegend';
import PrintableView from './PrintableView';
import { getCategoryIcon } from '@/utils/categoryIcons';

export const CategoryContent = () => {
  const { selectedCategory, addresses, categoryVisibility, toggleCategoryVisibility } = useCategory();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [radius, setRadius] = React.useState(5);
  const [transportMode, setTransportMode] = React.useState('driving');
  const [resultsCount, setResultsCount] = React.useState(3);
  const [duration, setDuration] = React.useState(15);
  const [showPrintView, setShowPrintView] = useState(false);
  const [listView, setListView] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!selectedCategory) {
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
  }

  const category = CATEGORIES.find(cat => cat.id === selectedCategory);
  if (!category) return null;

  const showAddressForm = ['adresse-principale', 'famille', 'travail', 'ecole', 'divers'].includes(selectedCategory);
  const currentAddresses = addresses[selectedCategory] || [];
  const canAddAddress = currentAddresses.length < 10;
  const isMainAddress = selectedCategory === 'adresse-principale';
  const isDiversCategory = selectedCategory === 'divers';

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
    // Show loading indicator
    setLoading(true);
    
    // Only include visible categories in search
    const visibleCategories = Object.keys(categoryVisibility)
      .filter(catId => categoryVisibility[catId]);
    
    if (visibleCategories.length === 0) {
      setLoading(false);
      toast.error(t('noVisibleCategories') || 'Veuillez activer au moins une catégorie.');
      return;
    }

    const searchParams = new URLSearchParams({
      category: selectedCategory,
      radius: radius.toString(),
      transport: transportMode,
      duration: duration.toString(),
      results: resultsCount.toString(),
      categories: visibleCategories.join(',')
    });

    // Simulate a short delay to show loading state
    setTimeout(() => {
      setLoading(false);
      navigate(`/search?${searchParams.toString()}`);
      toast.success(t('searchStarted'));
    }, 500);
  };

  // Mock data for printable view
  const mockResults = [
    { 
      id: '1', 
      name: 'Résultat 1', 
      address: '123 Rue Example', 
      category: 'restaurant',
      distance: 2.5,
      duration: 15,
      latitude: 48.856614,
      longitude: 2.3522219
    },
    { 
      id: '2', 
      name: 'Résultat 2', 
      address: '456 Avenue Sample', 
      category: 'shopping',
      distance: 1.8,
      duration: 10,
      latitude: 48.85,
      longitude: 2.35
    }
  ];

  return (
    <ScrollArea className="flex-1">
      <div className="p-6 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">
              <CategoryNameEditor categoryId={selectedCategory} />
            </h1>
            <div className="flex items-center space-x-2">
              <Switch
                id={`toggle-${selectedCategory}`}
                checked={categoryVisibility[selectedCategory]}
                onCheckedChange={() => toggleCategoryVisibility(selectedCategory)}
              />
              <Label htmlFor={`toggle-${selectedCategory}`} className="text-sm">
                {categoryVisibility[selectedCategory] ? t('visible') : t('hidden')}
              </Label>
            </div>
          </div>
          
          {showAddressForm && (
            <span className="text-sm text-muted-foreground">
              {currentAddresses.length}/10 {t('addresses')}
            </span>
          )}
          
          <Button variant="outline" size="sm" onClick={() => setShowPrintView(true)}>
            <Printer className="h-4 w-4 mr-2" />
            {t('print') || 'Imprimer'}
          </Button>
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

        {isDiversCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <CustomFieldsForm categoryId={selectedCategory} />
          </motion.div>
        )}

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              exit={{ opacity: 0, y: -20 }}
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

              <CategoryLegend />

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={handleSearch}
                  className="w-full flex items-center justify-center gap-2 rounded-xl transition-all hover:bg-blue-600 focus:ring focus:ring-blue-300"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 
                    <Loader className="w-4 h-4 animate-spin" /> : 
                    <Search className="w-4 h-4" />
                  }
                  {t('search')}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
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

      {/* Printable View Modal */}
      {showPrintView && (
        <PrintableView 
          results={mockResults} 
          mapUrl="https://via.placeholder.com/800x400?text=Map+Preview" 
          onClose={() => setShowPrintView(false)} 
        />
      )}
    </ScrollArea>
  );
};

// Helper functions
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
    case 'divers':
      return 'bg-teal-500/10 hover:bg-teal-500/20';
    default:
      return 'bg-gray-100 hover:bg-gray-200';
  }
};
