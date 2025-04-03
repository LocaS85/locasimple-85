
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 min-h-[75vh] flex items-center">
      <div className="absolute inset-0 bg-grid-white/[0.1] bg-[length:20px_20px]" />
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center text-white z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('discoverPlacesNearYou')}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto mb-10">
            {t('findBestPlacesDesc')}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/search">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 rounded-full">
                <Search className="mr-2 h-5 w-5" />
                {t('startExploring')}
              </Button>
            </Link>
            <Link to="/categories">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/20 rounded-full"
              >
                <MapPin className="mr-2 h-5 w-5" />
                {t('browseCategories')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
