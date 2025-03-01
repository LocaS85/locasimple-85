
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Map, Info, MessageSquare, User, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t } = useLanguage();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Map className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">LocaSimple</span>
          </Link>

          {/* Center - Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/search" className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                {t('search')}
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/categories" className="flex items-center">
                <Map className="mr-2 h-4 w-4" />
                {t('categories')}
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/about" className="flex items-center">
                <Info className="mr-2 h-4 w-4" />
                {t('about')}
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/contact" className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                {t('contact')}
              </Link>
            </Button>
          </div>

          {/* Right side - Auth + Language Selector */}
          <div className="flex items-center space-x-2">
            <LanguageSelector variant="ghost" size="sm" />
            
            <Button variant="ghost" asChild>
              <Link to="/profile" className="md:flex items-center hidden">
                <User className="mr-2 h-4 w-4" />
                {t('profile')}
              </Link>
            </Button>
            
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>LocaSimple</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 mt-8">
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/search" className="flex items-center">
                        <Search className="mr-2 h-4 w-4" />
                        {t('search')}
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/categories" className="flex items-center">
                        <Map className="mr-2 h-4 w-4" />
                        {t('categories')}
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/about" className="flex items-center">
                        <Info className="mr-2 h-4 w-4" />
                        {t('about')}
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/contact" className="flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {t('contact')}
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        {t('profile')}
                      </Link>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
