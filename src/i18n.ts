
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import fr from './locales/fr.json';
import en from './locales/en.json';
import es from './locales/es.json';
import it from './locales/it.json';
import pt from './locales/pt.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      es: { translation: es },
      it: { translation: it },
      pt: { translation: pt },
    },
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;
