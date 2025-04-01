
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useLanguage();
  const location = useLocation();

  // Check if a link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white py-4 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-blue-600">
            <MapPin className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-blue-600">
            LocaSimple
          </span>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link 
            to="/" 
            className={`text-sm transition-colors ${
              isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {t('home')}
          </Link>
          
          <Link 
            to="/search" 
            className={`text-sm transition-colors ${
              isActive('/search') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {t('search')}
          </Link>
          
          <Link 
            to="/categories" 
            className={`text-sm transition-colors ${
              isActive('/categories') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {t('categories')}
          </Link>
          
          <Link 
            to="/about" 
            className={`text-sm transition-colors ${
              isActive('/about') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {t('about')}
          </Link>
          
          <LanguageSelector variant="ghost" size="sm" />
          
          <Link to="/login">
            <Button 
              variant="default" 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t('register')}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
