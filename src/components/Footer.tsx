
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Github, Twitter, Instagram, Facebook, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
    { icon: <Github className="h-5 w-5" />, href: "#", label: "Github" },
  ];

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants}>
            <Link to="/" className="flex items-center text-xl font-bold text-app-primary mb-4 hover:opacity-80 transition-opacity">
              <motion.div 
                whileHover={{ rotate: -10, scale: 1.1 }}
                className="mr-2"
              >
                <MapPin className="h-5 w-5" />
              </motion.div>
              LocaSimple
            </Link>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Simplifiez vos trajets, optimisez votre temps avec des solutions de localisation rapides et efficaces.
            </p>
            
            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
              <Mail className="h-4 w-4 text-app-primary mr-1" />
              <a href="mailto:contact@locasimple.com" className="hover:text-app-primary transition-colors">
                contact@locasimple.com
              </a>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Phone className="h-4 w-4 text-app-primary mr-1" />
              <a href="tel:+33123456789" className="hover:text-app-primary transition-colors">
                +33 1 23 45 67 89
              </a>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="font-medium mb-4 text-gray-800">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-app-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-600 hover:text-app-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Recherche
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-600 hover:text-app-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Catégories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-app-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  À propos
                </Link>
              </li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="font-medium mb-4 text-gray-800">Aide</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-app-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-app-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-app-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-app-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Abonnements
                </Link>
              </li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h3 className="font-medium mb-4 text-gray-800">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-app-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-app-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 hover:text-app-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Cookies
                </Link>
              </li>
            </ul>
          </motion.div>
        </motion.div>
        
        <Separator className="my-8 bg-gray-200" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} LocaSimple. Tous droits réservés.
          </p>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-app-primary transition-colors"
                aria-label={link.label}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
          
          <div className="flex space-x-3 mt-4 md:mt-0 text-xs">
            <Link to="/terms" className="text-gray-500 hover:text-app-primary">
              Conditions
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/privacy" className="text-gray-500 hover:text-app-primary">
              Confidentialité
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/cookies" className="text-gray-500 hover:text-app-primary">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
