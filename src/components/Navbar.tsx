import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AlignJustify, X, User, Search } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-primary">Locasphere</Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <form onSubmit={handleSearch} className="relative w-64">
            <Input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </form>
          <Link to="/" className="text-gray-600 hover:text-primary">{t('home')}</Link>
          <Link to="/search" className="text-gray-600 hover:text-primary">{t('search')}</Link>
          <Link to="/about" className="text-gray-600 hover:text-primary">{t('about')}</Link>
          <Link to="/contact" className="text-gray-600 hover:text-primary">{t('contact')}</Link>
          <Link to="/login">
            <Button variant="outline" size="sm" className="ml-2">
              <User className="h-4 w-4 mr-2" />
              {t('login')}
            </Button>
          </Link>
          <LanguageSelector variant="ghost" size="sm" />
        </nav>

        <div className="flex items-center md:hidden space-x-2">
          <LanguageSelector variant="ghost" size="sm" />
          <button onClick={toggleMenu} className="menu-button p-2 focus:outline-none">
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <AlignJustify className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu md:hidden bg-white shadow-lg absolute w-full">
          <div className="py-4 px-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </form>
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-600 hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>
                {t('home')}
              </Link>
              <Link to="/search" className="text-gray-600 hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>
                {t('search')}
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>
                {t('about')}
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>
                {t('contact')}
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>
                {t('login')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
