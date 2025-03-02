
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const SearchFooter: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-auto">
      <div className="bg-black text-white grid grid-cols-3 text-center p-4">
        <Button variant="ghost" className="text-white hover:text-gray-300">{t('plan')}</Button>
        <Button variant="ghost" className="text-white hover:text-gray-300">{t('saved')}</Button>
        <Button variant="ghost" className="text-white hover:text-gray-300">{t('settings')}</Button>
      </div>
    </div>
  );
};
