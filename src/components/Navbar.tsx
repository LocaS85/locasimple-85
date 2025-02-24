
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const Navbar = () => {
  const languages: Language[] = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo à gauche */}
          <Link to="/" className="text-xl font-bold text-primary">
            LocaSimple
          </Link>

          {/* Liens du centre */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              À propos
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900">
              Abonnement
            </Link>
          </div>

          {/* Liens de droite */}
          <div className="flex items-center space-x-4">
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Link to="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link to="/register">
              <Button>Inscription</Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="text-xl">{selectedLanguage.flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang)}
                  >
                    <span className="mr-2">{lang.flag}</span> {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
