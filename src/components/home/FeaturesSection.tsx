
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, MapPin, Filter, Compass, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, link, index }: { 
  icon: React.ReactNode,
  title: string, 
  description: string,
  link: string,
  index: number
}) => {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
    >
      <Link to={link} className="block p-6">
        <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group">
          <span>{t('learnMore')}</span>
          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
};

export function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Search className="h-7 w-7 text-blue-500" />,
      title: t('search'),
      description: t('search_description'),
      link: "/search"
    },
    {
      icon: <Compass className="h-7 w-7 text-blue-500" />,
      title: t('navigation'),
      description: t('navigation_description'),
      link: "/navigation"
    },
    {
      icon: <Filter className="h-7 w-7 text-blue-500" />,
      title: t('categories'),
      description: t('categories_description'),
      link: "/categories"
    },
    {
      icon: <Star className="h-7 w-7 text-blue-500" />,
      title: t('saved'),
      description: t('favoritesDescription'),
      link: "/profile/favorites"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('key_features')}
        </motion.h2>
        <motion.p 
          className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t('features_description')}
        </motion.p>
      </div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              link={feature.link}
              index={index}
            />
          ))}
        </div>
      </div>
      
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button asChild size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">
          <Link to="/search" className="flex items-center px-8">
            <MapPin className="mr-2 h-5 w-5" />
            <span>{t('start_exploring')}</span>
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}

export default FeaturesSection;
