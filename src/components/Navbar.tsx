
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlignJustify, X, User, MapPin, Search, Layers, Info } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Check if a link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md ${
        scrolled 
          ? 'bg-white/90 shadow-sm py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 transform transition-transform hover:scale-105"
        >
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            whileHover={{ rotate: -10, scale: 1.1 }}
            className="text-app-primary"
          >
            <MapPin className="h-6 w-6" />
          </motion.div>
          <span className={`text-xl font-bold ${scrolled ? 'text-app-primary' : 'text-app-primary'}`}>
            LocaSimple
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`text-sm transition-colors ${
              isActive('/') 
                ? 'text-app-primary font-medium' 
                : 'text-gray-600 hover:text-app-primary'
            }`}
          >
            {t('home')}
          </Link>
          
          <Link 
            to="/search" 
            className={`text-sm flex items-center space-x-1 transition-colors ${
              isActive('/search') 
                ? 'text-app-primary font-medium' 
                : 'text-gray-600 hover:text-app-primary'
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            <span>{t('search')}</span>
          </Link>
          
          <Link 
            to="/categories" 
            className={`text-sm flex items-center space-x-1 transition-colors ${
              isActive('/categories') 
                ? 'text-app-primary font-medium' 
                : 'text-gray-600 hover:text-app-primary'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{t('categories')}</span>
          </Link>
          
          <Link 
            to="/about" 
            className={`text-sm flex items-center space-x-1 transition-colors ${
              isActive('/about') 
                ? 'text-app-primary font-medium' 
                : 'text-gray-600 hover:text-app-primary'
            }`}
          >
            <Info className="h-3.5 w-3.5" />
            <span>{t('about')}</span>
          </Link>
          
          <div className="h-4 w-px bg-gray-300 mx-2"></div>
          
          <LanguageSelector variant="ghost" size="sm" />
          
          <Link to="/login">
            <Button 
              variant="outline" 
              size="sm" 
              className={`rounded-full transition-all ${
                scrolled ? 'border-app-primary text-app-primary' : 'border-app-primary text-app-primary'
              }`}
            >
              <User className="h-3.5 w-3.5 mr-1.5" />
              {t('login')}
            </Button>
          </Link>
        </nav>

        <div className="flex items-center md:hidden space-x-2">
          <LanguageSelector variant="ghost" size="sm" />
          <button 
            onClick={toggleMenu} 
            className="menu-button p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-app-primary" />
            ) : (
              <AlignJustify className="h-5 w-5 text-app-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        className="mobile-menu md:hidden bg-white shadow-lg absolute w-full overflow-hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isMenuOpen ? 'auto' : 0,
          opacity: isMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="py-4 px-4">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 py-2 px-3 rounded-md ${
                isActive('/') ? 'bg-app-primary/10 text-app-primary' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>{t('home')}</span>
            </Link>
            
            <Link 
              to="/search" 
              className={`flex items-center space-x-2 py-2 px-3 rounded-md ${
                isActive('/search') ? 'bg-app-primary/10 text-app-primary' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>{t('search')}</span>
            </Link>
            
            <Link 
              to="/categories" 
              className={`flex items-center space-x-2 py-2 px-3 rounded-md ${
                isActive('/categories') ? 'bg-app-primary/10 text-app-primary' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>{t('categories')}</span>
            </Link>
            
            <Link 
              to="/about" 
              className={`flex items-center space-x-2 py-2 px-3 rounded-md ${
                isActive('/about') ? 'bg-app-primary/10 text-app-primary' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Info className="h-4 w-4" />
              <span>{t('about')}</span>
            </Link>
            
            <div className="h-px bg-gray-100 my-1"></div>
            
            <Link 
              to="/login" 
              className="flex items-center space-x-2 py-2 px-3 text-app-primary hover:bg-app-primary/10 rounded-md"
            >
              <User className="h-4 w-4" />
              <span>{t('login')}</span>
            </Link>
            
            <Link 
              to="/register" 
              className="bg-app-primary text-white py-2 px-3 rounded-md text-center hover:bg-app-primary/90 transition-colors"
            >
              {t('register')}
            </Link>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;
