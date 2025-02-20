
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="bg-white py-10 md:py-20 px-4 text-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">LocaSimple</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 px-4">Simplifiez vos trajets, optimisez votre temps</p>
        <div className="space-y-4">
          <Button asChild size="lg" className="w-full sm:w-auto mb-4">
            <Link to="/register">Essayer maintenant</Link>
          </Button>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/pricing" className="text-primary hover:underline">
              Voir nos plans d'abonnement
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
