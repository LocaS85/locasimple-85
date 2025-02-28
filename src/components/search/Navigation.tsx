
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Bookmark, Settings } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  // Fonction pour vérifier si un lien est actif
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="bg-black text-white grid grid-cols-3 text-center p-4 z-20">
      <Button 
        variant="ghost" 
        className={`text-white hover:bg-gray-600 active:bg-gray-700 transition-colors ${
          isActive('/plan') ? 'bg-gray-700' : ''
        }`}
        asChild
      >
        <Link to="/plan" className="flex items-center justify-center">
          <MapPin className="mr-2 h-4 w-4" />
          Plan
        </Link>
      </Button>
      <Button 
        variant="ghost" 
        className="text-white hover:bg-gray-600 active:bg-gray-700 transition-colors"
        asChild
      >
        <Link to="/profile" className="flex items-center justify-center">
          <Bookmark className="mr-2 h-4 w-4" />
          Enregistré
        </Link>
      </Button>
      <Button 
        variant="ghost" 
        className="text-white hover:bg-gray-600 active:bg-gray-700 transition-colors"
        asChild
      >
        <Link to="/profile/settings" className="flex items-center justify-center">
          <Settings className="mr-2 h-4 w-4" />
          Paramètre
        </Link>
      </Button>
    </div>
  );
};

export default Navigation;
