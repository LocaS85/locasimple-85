
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, ChevronDown } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();
  
  const scrollToCategories = () => {
    const categoriesSection = document.querySelector('.categories-section');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="relative bg-gradient-to-r from-primary/80 to-primary min-h-[85vh] flex items-center">
      <div className="absolute inset-0 bg-grid-white/[0.1] bg-[length:20px_20px]" />
      <div className="absolute inset-0 bg-[url('/background-pattern.svg')] bg-cover opacity-10" />
      
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center text-white z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {t('discoverPlacesNearYou')}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {t('findBestPlacesDesc')}
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link to="/search">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 dark:bg-white/90 dark:text-primary dark:hover:bg-white/80 rounded-full shadow-lg hover:shadow-xl transition-all">
                <Search className="mr-2 h-5 w-5 text-primary" />
                <span className="font-medium">
                  {t('startExploring')}
                </span>
              </Button>
            </Link>
            <Link to="/categories">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-amber-300 hover:bg-white/20 rounded-full font-medium"
              >
                <MapPin className="mr-2 h-5 w-5 text-amber-300" />
                {t('browseCategories')}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <button 
            onClick={scrollToCategories}
            className="text-white flex flex-col items-center hover:opacity-80 transition-opacity"
          >
            <span className="text-sm mb-2 font-medium">Découvrir plus</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </button>
        </motion.div>
      </div>
      
      {/* Curved bottom shape */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-auto fill-background">
          <path
            d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
