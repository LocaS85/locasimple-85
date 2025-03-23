
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  languages: {code: string, name: string}[];
}

const defaultLanguage = localStorage.getItem('language') || 'fr';

const LanguageContext = createContext<LanguageContextProps>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
  languages: [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' }
  ]
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [language, setLanguageState] = useState(defaultLanguage);
  
  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' }
  ];

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
