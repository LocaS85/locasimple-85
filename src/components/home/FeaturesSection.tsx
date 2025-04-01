
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
    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    whileHover={{ y: -5 }}
    whileTap={{ y: 0 }}
  >
    <Link to={link} className="block">
      <div className="p-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center text-primary">
          <span className="text-sm font-medium">Learn more</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </div>
      </div>
    </Link>
  </motion.div>
);

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{t('key_features') || 'Key Features'}</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('features_description') || 'Discover what makes our service unique and how it can help you find what you need.'}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Search className="h-6 w-6 text-primary" />}
          title={t('search') || 'Smart Search'}
          description={t('search_description') || 'Find what you need with our powerful search capabilities.'}
          link="/search"
        />
        
        <FeatureCard 
          icon={<MapPin className="h-6 w-6 text-primary" />}
          title={t('navigation') || 'Precise Navigation'}
          description={t('navigation_description') || 'Get to your destination with turn-by-turn directions.'}
          link="/navigation"
        />
        
        <FeatureCard 
          icon={<Tag className="h-6 w-6 text-primary" />}
          title={t('categories') || 'Categories'}
          description={t('categories_description') || 'Browse by categories to discover new places and services.'}
          link="/categories"
        />
      </div>
      
      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link to="/search">
            <Map className="mr-2 h-5 w-5" />
            {t('start_exploring') || 'Start Exploring'}
          </Link>
        </Button>
      </div>
    </section>
  );
}

export default FeaturesSection;
