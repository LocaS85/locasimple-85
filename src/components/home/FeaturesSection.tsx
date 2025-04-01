
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, MapPin, Tag, Map } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description, link }: { 
  icon: React.ReactNode,
  title: string, 
  description: string,
  link: string
}) => (
  <motion.div 
    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100"
    whileHover={{ y: -5 }}
    whileTap={{ y: 0 }}
  >
    <Link to={link} className="block">
      <div className="p-5">
        <div className="w-10 h-10 rounded-full bg-app-primary/10 flex items-center justify-center mb-3">
          {icon}
        </div>
        <h3 className="text-lg font-heading font-medium mb-1.5">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <div className="flex items-center text-app-primary">
          <span className="text-xs font-medium">Learn more</span>
          <ArrowRight className="h-3 w-3 ml-1" />
        </div>
      </div>
    </Link>
  </motion.div>
);

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-heading font-semibold mb-3">{t('key_features') || 'Key Features'}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm">
          {t('features_description') || 'Discover what makes our service unique and how it can help you find what you need.'}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<Search className="h-5 w-5 text-app-primary" />}
          title={t('search') || 'Smart Search'}
          description={t('search_description') || 'Find what you need with our powerful search capabilities.'}
          link="/search"
        />
        
        <FeatureCard 
          icon={<MapPin className="h-5 w-5 text-app-primary" />}
          title={t('navigation') || 'Precise Navigation'}
          description={t('navigation_description') || 'Get to your destination with turn-by-turn directions.'}
          link="/navigation"
        />
        
        <FeatureCard 
          icon={<Tag className="h-5 w-5 text-app-primary" />}
          title={t('categories') || 'Categories'}
          description={t('categories_description') || 'Browse by categories to discover new places and services.'}
          link="/categories"
        />
      </div>
      
      <div className="mt-10 text-center">
        <Button asChild size="sm" className="rounded-full bg-app-primary hover:bg-app-primary/90">
          <Link to="/search" className="flex items-center px-5">
            <Map className="mr-1.5 h-4 w-4" />
            <span className="text-sm">{t('start_exploring') || 'Start Exploring'}</span>
          </Link>
        </Button>
      </div>
    </section>
  );
}

export default FeaturesSection;
