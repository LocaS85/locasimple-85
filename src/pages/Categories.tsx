
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const Categories = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Liste des catégories
  const categories = [
    { 
      id: 'restaurant', 
      name: 'Restaurants', 
      icon: '🍽️', 
      color: 'bg-red-100 text-red-600',
      description: 'Trouvez les meilleurs endroits pour manger près de vous'
    },
    { 
      id: 'hotel', 
      name: 'Hôtels', 
      icon: '🏨', 
      color: 'bg-blue-100 text-blue-600',
      description: 'Découvrez les hébergements à proximité'
    },
    { 
      id: 'activity', 
      name: 'Activités', 
      icon: '🏄‍♂️', 
      color: 'bg-green-100 text-green-600',
      description: 'Explorez les activités de loisirs dans votre région'
    },
    { 
      id: 'museum', 
      name: 'Musées', 
      icon: '🏛️', 
      color: 'bg-amber-100 text-amber-600',
      description: 'Visitez les expositions et patrimoines culturels'
    },
    { 
      id: 'transport', 
      name: 'Transports', 
      icon: '🚆', 
      color: 'bg-indigo-100 text-indigo-600',
      description: 'Localisez les moyens de transport en commun'
    },
    { 
      id: 'pharmacy', 
      name: 'Pharmacies', 
      icon: '💊', 
      color: 'bg-teal-100 text-teal-600',
      description: 'Trouvez les pharmacies ouvertes à proximité'
    },
    { 
      id: 'atm', 
      name: 'Distributeurs', 
      icon: '💰', 
      color: 'bg-emerald-100 text-emerald-600',
      description: 'Localisez les distributeurs et services bancaires'
    },
    { 
      id: 'shopping', 
      name: 'Shopping', 
      icon: '🛍️', 
      color: 'bg-pink-100 text-pink-600',
      description: 'Explorez les magasins et centres commerciaux'
    },
    { 
      id: 'gasstation', 
      name: 'Stations-service', 
      icon: '⛽', 
      color: 'bg-gray-100 text-gray-600',
      description: 'Trouvez le carburant au meilleur prix'
    }
  ];

  // Animation pour les cartes de catégories
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    // Rediriger vers la recherche avec la catégorie sélectionnée
    navigate(`/search?category=${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900 mr-4">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">{t('categories') || 'Catégories'}</h1>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
          Sélectionnez une catégorie pour trouver rapidement ce que vous cherchez près de votre position.
        </p>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className={`${category.color} rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow`}
              variants={itemVariants}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="flex items-start mb-2">
                <span className="text-2xl mr-3">{category.icon}</span>
                <h3 className="font-semibold">{t(category.id) || category.name}</h3>
              </div>
              <p className="text-sm opacity-80">{category.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Categories;
