
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Higher-order component to enforce translation usage in components
 * @param Component The component to wrap
 * @returns A wrapped component with translation functionality
 */
export function withTranslation<P extends object>(
  Component: React.ComponentType<P & { t: (key: string) => string }>
) {
  return (props: P) => {
    const { t } = useLanguage();
    return <Component {...props} t={t} />;
  };
}

/**
 * Custom hook to get translation function with error handling
 * This version logs missing translation keys during development
 */
export const useTranslation = () => {
  const { t, language } = useLanguage();
  
  const translateWithWarning = (key: string, defaultValue?: string): string => {
    const translation = t(key);
    if (translation === key && process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation key: "${key}" for language "${language}"`);
      return defaultValue || key;
    }
    return translation;
  };
  
  return { t: translateWithWarning, language };
};

/**
 * Function to check if all texts in a component use the translation system
 * Useful for development and testing
 * @param component Component text content
 * @param t Translation function
 */
export const validateTranslations = (component: string, t: (key: string) => string): void => {
  if (process.env.NODE_ENV !== 'development') return;
  
  // Extract text content that's not likely to be a translation key
  const textPattern = /["'`]([^"'`]{5,})["'`]/g;
  const matches = component.match(textPattern);
  
  if (matches) {
    matches.forEach(match => {
      const text = match.slice(1, -1);
      if (!text.includes('{') && !text.includes('(') && text.length > 5) {
        console.warn(`Possible untranslated text found: "${text}"`);
      }
    });
  }
};
