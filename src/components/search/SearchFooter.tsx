
import React from 'react';
import { Button } from '@/components/ui/button';

export const SearchFooter: React.FC = () => {
  return (
    <div className="mt-auto">
      <div className="bg-black text-white grid grid-cols-3 text-center p-4">
        <Button variant="ghost" className="text-white hover:text-gray-300">Plan</Button>
        <Button variant="ghost" className="text-white hover:text-gray-300">Enregistré</Button>
        <Button variant="ghost" className="text-white hover:text-gray-300">Paramètre</Button>
      </div>
    </div>
  );
};
