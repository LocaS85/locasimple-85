
import React from 'react';
import { Hotel, Store, Heart, Car } from 'lucide-react';
import { House, ShoppingCart, FirstAid, Bus } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

interface IconShowcaseProps {
  onSelect?: (library: string) => void;
}

export const IconShowcase: React.FC<IconShowcaseProps> = ({ onSelect }) => {
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
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Bibliothèques d'icônes disponibles</h2>
      
      <div className="space-y-8">
        {/* Lucide Icons */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Lucide Icons</h3>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-gray-900 text-white rounded-xl p-6 shadow-xl hover:scale-105 transform transition-all"
              onClick={() => onSelect?.('lucide')}
            >
              <Hotel size={48} className="text-blue-400 mx-auto mb-4 glow-pulse" />
              <p className="text-center">Hébergement</p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-gray-900 text-white rounded-xl p-6 shadow-xl hover:scale-105 transform transition-all"
            >
              <Store size={48} className="text-green-400 mx-auto mb-4 glow-pulse" />
              <p className="text-center">Shopping</p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-gray-900 text-white rounded-xl p-6 shadow-xl hover:scale-105 transform transition-all"
            >
              <Heart size={48} className="text-red-400 mx-auto mb-4 glow-pulse" />
              <p className="text-center">Santé</p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-gray-900 text-white rounded-xl p-6 shadow-xl hover:scale-105 transform transition-all"
            >
              <Car size={48} className="text-yellow-400 mx-auto mb-4 glow-pulse" />
              <p className="text-center">Transport</p>
            </motion.div>
          </motion.div>
        </section>
        
        {/* Phosphor Icons */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Phosphor Icons</h3>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-gray-900 text-white rounded-xl p-6 shadow-xl hover:scale-105 transform transition-all holographic-glow"
              onClick={() => onSelect?.('phosphor')}
            >
              <House weight="fill" size={48} className="text-blue-400 mx-auto mb-4" />
              <p className="text-center">Hébergement</p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-gray-900 text-white rounded-xl p-6 shadow-xl hover:scale-105 transform transition-all holographic-glow"
            >
              <ShoppingCart weight="fill" size={48} className="text-green-400 mx-auto mb-4" />
              <p className="text-center">Shopping</p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-gray-900 text-white rounded-xl p-6 shadow-xl hover:scale-105 transform transition-all holographic-glow"
            >
              <FirstAid weight="fill" size={48} className="text-red-400 mx-auto mb-4" />
              <p className="text-center">Santé</p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-gray-900 text-white rounded-xl p-6 shadow-xl hover:scale-105 transform transition-all holographic-glow"
            >
              <Bus weight="fill" size={48} className="text-yellow-400 mx-auto mb-4" />
              <p className="text-center">Transport</p>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default IconShowcase;
