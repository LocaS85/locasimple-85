
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  // Check if a link is active
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/search', label: 'Recherche' },
    { path: '/categories', label: 'Catégories' },
    { path: '/about', label: 'À propos' }
  ];
  
  // Component for navigation links - reused in desktop and mobile views
  const NavLinks = ({ mobile = false, onClick = () => {} }) => (
    <>
      {navLinks.map((link) => (
        <Link 
          key={link.path}
          to={link.path} 
          className={`${mobile ? 'text-lg py-3 w-full' : 'text-sm'} transition-colors ${
            isActive(link.path) 
              ? 'text-blue-600 font-medium' 
              : 'text-gray-600 hover:text-blue-600'
          } ${mobile ? 'block border-b border-gray-100' : ''}`}
          onClick={mobile ? onClick : undefined}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  return (
    <header className="bg-white py-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-blue-600">
            <MapPin className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-blue-600">
            LocaSimple
          </span>
        </Link>

        {isMobile ? (
          // Mobile navigation with sheet component
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b flex justify-between items-center">
                  <Link to="/" className="flex items-center space-x-2" onClick={() => setMenuOpen(false)}>
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="font-bold text-blue-600">LocaSimple</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex flex-col p-4 space-y-1 flex-1">
                  <NavLinks mobile onClick={() => setMenuOpen(false)} />
                </div>
                
                <div className="p-4 border-t mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Langue</span>
                    <LanguageSelector variant="ghost" size="sm" />
                  </div>
                  <Link to="/login" onClick={() => setMenuOpen(false)}>
                    <Button 
                      variant="default" 
                      size="default" 
                      className="bg-blue-600 hover:bg-blue-700 w-full"
                    >
                      S'inscrire
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          // Desktop navigation
          <nav className="flex items-center space-x-6">
            <NavLinks />
            <LanguageSelector variant="ghost" size="sm" />
            
            <Link to="/login">
              <Button 
                variant="default" 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
              >
                S'inscrire
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
