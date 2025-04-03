
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, MapPin, Filter, Compass } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, link }: { 
  icon: React.ReactNode,
  title: string, 
  description: string,
  link: string
}) => {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ y: 0 }}
    >
      <Link to={link} className="block p-6">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
          <span>En savoir plus</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </div>
      </Link>
    </motion.div>
  );
};

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{t('key_features')}</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t('features_description')}
        </p>
      </div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Search className="h-6 w-6 text-blue-500" />}
            title={t('search')}
            description={t('search_description')}
            link="/search"
          />
          
          <FeatureCard 
            icon={<Compass className="h-6 w-6 text-blue-500" />}
            title={t('navigation')}
            description={t('navigation_description')}
            link="/navigation"
          />
          
          <FeatureCard 
            icon={<Filter className="h-6 w-6 text-blue-500" />}
            title={t('categories')}
            description={t('categories_description')}
            link="/categories"
          />
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <Button asChild size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700">
          <Link to="/search" className="flex items-center px-6">
            <MapPin className="mr-2 h-5 w-5" />
            <span>{t('start_exploring')}</span>
          </Link>
        </Button>
      </div>
    </section>
  );
}

export default FeaturesSection;
