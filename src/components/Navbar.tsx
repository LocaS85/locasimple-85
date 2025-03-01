
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import { useState, useEffect } from "react";
import { Menu, Search, MapPin, Info, Map } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const Navbar = () => {
  const languages: Language[] = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
  ];

  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Set selected language from context
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    languages.find(lang => lang.code === language) || languages[0]
  );

  // Update context when language changes
  useEffect(() => {
    setLanguage(selectedLanguage.code);
  }, [selectedLanguage, setLanguage]);

  const navLinks = [
    { to: "/search", label: t("search"), icon: <Search className="h-4 w-4 mr-2" /> },
    { to: "/categories", label: t("categories"), icon: <MapPin className="h-4 w-4 mr-2" /> },
    { to: "/plan", label: t("plans"), icon: <Map className="h-4 w-4 mr-2" /> },
    { to: "/about", label: t("about"), icon: <Info className="h-4 w-4 mr-2" /> },
  ];

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-primary flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            LocaSimple
          </Link>

          {/* Navigation pour desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.to) 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-600'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions de droite pour desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="hover:bg-gray-100 hover:text-primary">{t("login")}</Button>
            </Link>
            <Link to="/register">
              <Button className="hover:bg-primary/90">{t("register")}</Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <span className="text-xl">{selectedLanguage.flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang)}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    <span className="mr-2">{lang.flag}</span> {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Menu hamburger pour mobile et tablette */}
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[385px]">
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="text-xl font-bold text-primary mb-4 flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    LocaSimple
                  </div>
                  
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center text-lg py-2 px-4 rounded-lg ${
                        isActive(link.to) 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                  
                  <div className="py-4 border-t border-gray-200 mt-4">
                    <Link 
                      to="/login" 
                      className="block py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="ghost" className="w-full justify-start hover:bg-gray-100">
                        {t("login")}
                      </Button>
                    </Link>
                    <Link 
                      to="/register" 
                      className="block py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button className="w-full justify-start hover:bg-primary/90">
                        {t("register")}
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="py-4 border-t border-gray-200">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="lg" className="w-full justify-start hover:bg-gray-100">
                          <span className="text-xl mr-2">{selectedLanguage.flag}</span>
                          {selectedLanguage.name}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        {languages.map((lang) => (
                          <DropdownMenuItem 
                            key={lang.code}
                            onClick={() => {
                              setSelectedLanguage(lang);
                              setIsOpen(false);
                            }}
                            className="hover:bg-gray-100 cursor-pointer"
                          >
                            <span className="mr-2">{lang.flag}</span> {lang.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
