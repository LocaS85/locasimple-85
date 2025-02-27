
import React from 'react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  return (
    <div className="bg-black text-white grid grid-cols-3 text-center p-4 z-20">
      <Button 
        variant="ghost" 
        className="text-white hover:bg-gray-600 active:bg-gray-700 transition-colors"
      >
        Plan
      </Button>
      <Button 
        variant="ghost" 
        className="text-white hover:bg-gray-600 active:bg-gray-700 transition-colors"
      >
        Enregistré
      </Button>
      <Button 
        variant="ghost" 
        className="text-white hover:bg-gray-600 active:bg-gray-700 transition-colors"
      >
        Paramètre
      </Button>
    </div>
  );
};

export default Navigation;
