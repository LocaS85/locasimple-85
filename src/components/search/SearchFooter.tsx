
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const SearchFooter: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-auto">
      <div className="bg-black text-white grid grid-cols-3 text-center p-2">
        <Button variant="ghost" className="text-white hover:text-gray-300 text-xs py-1">
          {t('plan')}
        </Button>
        <Button variant="ghost" className="text-white hover:text-gray-300 text-xs py-1">
          {t('saved')}
        </Button>
        <Button variant="ghost" className="text-white hover:text-gray-300 text-xs py-1">
          {t('settings')}
        </Button>
      </div>
    </div>
  );
};
