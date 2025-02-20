
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  return (
    <section className="py-10 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
          Fonctionnalités principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center p-4 md:p-6"
          >
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Recherche multi-catégories</h3>
            <p className="text-gray-600">Trouvez plusieurs types de lieux en une seule recherche</p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center p-4 md:p-6"
          >
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Itinéraires optimisés</h3>
            <p className="text-gray-600">Calculez les meilleurs trajets selon vos préférences</p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center p-4 md:p-6"
          >
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Favoris personnalisés</h3>
            <p className="text-gray-600">Enregistrez vos lieux préférés pour y accéder rapidement</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
