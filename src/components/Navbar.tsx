import React, { useState, useEffect } from 'react';
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
import { Menu, X, Search, User, LogIn, Home, Info, HelpCircle, Map, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import { useIconTheme } from '@/hooks/useIconTheme';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();
  const { getColor } = useIconTheme();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full backdrop-blur-sm transition-all duration-300",
      "border-b border-border",
      scrolled 
        ? "bg-background/95 shadow-sm" 
        : "bg-background/80"
    )}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-electricblue to-electricblue/80 text-white p-1.5 rounded-lg shadow-sm transition-transform group-hover:scale-110">
              <Map className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slateblue to-slateblue/80 bg-clip-text text-transparent">LocaSimple</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:bg-sagegreen/20 font-medium">{t('discover')}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 rounded-xl shadow-lg border border-border bg-white dark:bg-slateblue/30">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-electricblue to-electricblue/80 p-6 no-underline outline-none focus:shadow-md transition-all hover:shadow-lg"
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
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-sagegreen/20 focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none text-copper">{t('categories')}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {t('browseCategories')}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/quotidien"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-sagegreen/20 focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none text-copper">Quotidien</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Gérez vos lieux du quotidien
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
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-sagegreen/20 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    )}>
                      {t('navPricing')}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/faq">
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-sagegreen/20 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    )}>
                      {t('navFaq')}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact">
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-sagegreen/20 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    )}>
                      {t('navContact')}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <LanguageSelector variant="ghost" size="sm" />
              <Link to="/search">
                <Button variant="ghost" size="icon" className="hover:bg-sagegreen/20 text-foreground">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm" className="hidden lg:flex hover:bg-sagegreen/20 border-border">
                  <LogIn className="mr-2 h-4 w-4" />
                  {t('navLogin')}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="hidden lg:flex bg-electricblue hover:bg-electricblue/90 text-white">
                  {t('navRegister')}
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="hidden sm:flex lg:hidden hover:bg-sagegreen/20">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
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

      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border py-4 animate-fade-in">
          <div className="container mx-auto px-4 space-y-4">
            <Link to="/" className="flex items-center py-2" onClick={toggleMenu}>
              <Home className="h-5 w-5 mr-3 text-electricblue" />
              <span>{t('navHome')}</span>
            </Link>
            <Link to="/categories" className="flex items-center py-2" onClick={toggleMenu}>
              <Map className="h-5 w-5 mr-3 text-electricblue" />
              <span className="text-copper">{t('categories')}</span>
            </Link>
            <Link to="/quotidien" className="flex items-center py-2" onClick={toggleMenu}>
              <Home className="h-5 w-5 mr-3 text-electricblue" />
              <span>Quotidien</span>
            </Link>
            <Link to="/pricing" className="flex items-center py-2" onClick={toggleMenu}>
              <Info className="h-5 w-5 mr-3 text-electricblue" />
              <span>{t('navPricing')}</span>
            </Link>
            <Link to="/faq" className="flex items-center py-2" onClick={toggleMenu}>
              <HelpCircle className="h-5 w-5 mr-3 text-electricblue" />
              <span>{t('navFaq')}</span>
            </Link>
            <Link to="/contact" className="flex items-center py-2" onClick={toggleMenu}>
              <HelpCircle className="h-5 w-5 mr-3 text-electricblue" />
              <span>{t('navContact')}</span>
            </Link>
            <div className="pt-2 flex flex-col space-y-2">
              <Link to="/login" onClick={toggleMenu}>
                <Button variant="outline" className="w-full border-border">
                  <LogIn className="mr-2 h-4 w-4" />
                  {t('navLogin')}
                </Button>
              </Link>
              <Link to="/register" onClick={toggleMenu}>
                <Button className="w-full bg-electricblue hover:bg-electricblue/90 text-white">
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
