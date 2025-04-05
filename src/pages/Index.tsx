
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import { motion } from "framer-motion";
import { Hotel, Store, Heart, Briefcase, Utensils, Film, BookOpen, Home, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { t } = useLanguage();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  return (
    <div className="w-full">
      <HeroSection />
      
      <CategoriesSection 
        selectedCategories={selectedCategories} 
        onCategorySelect={handleCategorySelect} 
      />
      
      <FeaturesSection />
      
      <DiscoverSection />
    </div>
  );
};

const CategoriesSection = ({ 
  selectedCategories, 
  onCategorySelect 
}: { 
  selectedCategories: string[], 
  onCategorySelect: (id: string) => void 
}) => {
  const { t } = useLanguage();
  
  const categoryIcons = {
    alimentation: <Utensils size={36} className="text-orange-500" />,
    divertissement: <Film size={36} className="text-blue-500" />,
    sante: <Heart size={36} className="text-red-500" />,
    travail: <Briefcase size={36} className="text-purple-500" />,
    shopping: <Store size={36} className="text-green-500" />,
    education: <BookOpen size={36} className="text-yellow-500" />,
    maison: <Home size={36} className="text-pink-500" />,
    hotel: <Hotel size={36} className="text-cyan-500" />,
  };

  return (
    <div className="bg-background py-16 px-4 categories-section">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-center text-foreground">
            {t('exploreCategories')}
          </h2>
          
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
            {t('categoriesDescription')}
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {Object.entries(categoryIcons).map(([category, icon], index) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <button
                  onClick={() => onCategorySelect(category)}
                  className={`w-full h-32 flex flex-col items-center justify-center p-4 rounded-xl transition-all shadow-sm hover:shadow-md
                    ${selectedCategories.includes(category) 
                      ? 'bg-primary/10 border-2 border-primary' 
                      : 'bg-card hover:bg-accent border border-border'}`}
                >
                  <div className="mb-3">{icon}</div>
                  <p className="text-sm font-medium text-foreground">
                    {t(category) || category}
                  </p>
                </button>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Link to="/categories">
              <Button 
                variant="outline" 
                className="rounded-full group text-amber-400 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                <span>{t('browseCategories')}</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform text-amber-400" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const DiscoverSection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-gradient-to-b from-accent/30 to-background py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-6 text-primary">
            {t('startExploring')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            {t('exploreDescription')}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/search">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 rounded-full px-8 shadow-md hover:shadow-lg transition-all"
              >
                {t('search')}
              </Button>
            </Link>
            
            <Link to="/categories">
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-full px-8 border-amber-300 text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                {t('browseCategories')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
