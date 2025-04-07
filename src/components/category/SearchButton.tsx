
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useCategory } from '../CategoryContext';
import { DistanceUnit } from '@/types/categoryTypes';

interface SearchButtonProps {
  selectedCategory: string;
  radius: number;
  transportMode: string;
  resultsCount: number;
  duration: number;
  distanceUnit?: DistanceUnit;
}

const SearchButton: React.FC<SearchButtonProps> = ({ 
  selectedCategory, 
  radius, 
  transportMode, 
  resultsCount, 
  duration,
  distanceUnit = 'km'
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { categoryVisibility } = useCategory();

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
      categories: visibleCategories.join(','),
      unit: distanceUnit
    });

    // Simulate a short delay to show loading state
    setTimeout(() => {
      setLoading(false);
      navigate(`/search?${searchParams.toString()}`);
      toast.success(t('searchStarted'));
    }, 500);
  };

  return (
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
  );
};

export default SearchButton;
