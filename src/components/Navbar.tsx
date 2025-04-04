
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X, Search, User, LogIn, Home, Info, HelpCircle, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Map className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gray-900">LocaSimple</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:bg-blue-50">{t('discover')}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-white">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500 to-blue-700 p-6 no-underline outline-none focus:shadow-md"
                            to="/search"
                          >
                            <Search className="h-6 w-6 text-white" />
                            <div className="mt-4 mb-2 text-lg font-medium text-white">
                              {t('navSearch')}
                            </div>
                            <p className="text-sm leading-tight text-white/90">
                              {t('searchDescription')}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/categories"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{t('categories')}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {t('browseCategories')}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/about"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{t('navAbout')}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {t('aboutDescription')}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/pricing">
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-50 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    )}>
                      {t('navPricing')}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/faq">
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-50 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    )}>
                      {t('navFaq')}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact">
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-50 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    )}>
                      {t('navContact')}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-2">
              <LanguageSelector variant="outline" size="sm" />
              <Link to="/search">
                <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm" className="hidden lg:flex hover:bg-blue-50">
                  <LogIn className="mr-2 h-4 w-4" />
                  {t('navLogin')}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="hidden lg:flex">
                  {t('navRegister')}
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="hidden sm:flex lg:hidden hover:bg-blue-50">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <LanguageSelector variant="ghost" size="icon" className="p-0" />
            <Link to="/search">
              <Button variant="ghost" size="icon" className="p-0">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="p-0">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4">
          <div className="container mx-auto px-4 space-y-4">
            <Link to="/" className="flex items-center py-2" onClick={toggleMenu}>
              <Home className="h-5 w-5 mr-3 text-primary" />
              <span>{t('navHome')}</span>
            </Link>
            <Link to="/categories" className="flex items-center py-2" onClick={toggleMenu}>
              <Map className="h-5 w-5 mr-3 text-primary" />
              <span>{t('categories')}</span>
            </Link>
            <Link to="/pricing" className="flex items-center py-2" onClick={toggleMenu}>
              <Info className="h-5 w-5 mr-3 text-primary" />
              <span>{t('navPricing')}</span>
            </Link>
            <Link to="/faq" className="flex items-center py-2" onClick={toggleMenu}>
              <HelpCircle className="h-5 w-5 mr-3 text-primary" />
              <span>{t('navFaq')}</span>
            </Link>
            <Link to="/contact" className="flex items-center py-2" onClick={toggleMenu}>
              <HelpCircle className="h-5 w-5 mr-3 text-primary" />
              <span>{t('navContact')}</span>
            </Link>
            <div className="pt-2 flex flex-col space-y-2">
              <Link to="/login" onClick={toggleMenu}>
                <Button variant="outline" className="w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  {t('navLogin')}
                </Button>
              </Link>
              <Link to="/register" onClick={toggleMenu}>
                <Button className="w-full">
                  {t('navRegister')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
