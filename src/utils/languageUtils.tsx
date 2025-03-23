
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
    if (!key) {
      console.warn('Attempting to translate with empty key');
      return defaultValue || '';
    }
    
    try {
      const translation = t(key);
      if (translation === key && process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: "${key}" for language "${language}"`);
        return defaultValue || key;
      }
      return translation;
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error);
      return defaultValue || key;
    }
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
      // Skip typical non-translatable strings
      if (
        !text.includes('{') && 
        !text.includes('(') && 
        !text.startsWith('/') && 
        !text.startsWith('http') && 
        !text.match(/^[A-Z0-9_]+$/) && // Skip constants
        text.length > 5
      ) {
        console.warn(`Possible untranslated text found: "${text}"`);
      }
    });
  }
};

/**
 * Helper function to verify if a translation file contains all required keys
 * @param expectedKeys List of keys that should exist in all translation files
 * @param translationObject Translation object to check
 * @returns List of missing keys
 */
export const validateTranslationFile = (
  expectedKeys: string[], 
  translationObject: Record<string, string>
): string[] => {
  return expectedKeys.filter(key => !translationObject[key]);
};

/**
 * Function to ensure all languages have the same keys
 * @param translations Object containing all translations
 * @returns Object with missing keys for each language
 */
export const checkTranslationConsistency = (
  translations: Record<string, Record<string, string>>
): Record<string, string[]> => {
  // Get all unique keys across all languages
  const allKeys = Object.values(translations)
    .flatMap(trans => Object.keys(trans))
    .filter((key, i, arr) => arr.indexOf(key) === i);
  
  // Check each language for missing keys
  const missingKeys: Record<string, string[]> = {};
  
  Object.entries(translations).forEach(([lang, trans]) => {
    const missing = validateTranslationFile(allKeys, trans);
    if (missing.length > 0) {
      missingKeys[lang] = missing;
    }
  });
  
  return missingKeys;
};

/**
 * Helper function to quickly add missing translations
 * Useful during development
 */
export const logMissingTranslations = (): void => {
  if (process.env.NODE_ENV !== 'development') return;
  
  try {
    // Import all language files
    const fr = require('../locales/fr.json');
    const en = require('../locales/en.json');
    const es = require('../locales/es.json');
    const it = require('../locales/it.json');
    const pt = require('../locales/pt.json');
    
    const translations = { fr, en, es, it, pt };
    const missingKeys = checkTranslationConsistency(translations);
    
    if (Object.keys(missingKeys).length > 0) {
      console.warn('Missing translation keys:', missingKeys);
    } else {
      console.log('All translations are consistent across languages.');
    }
  } catch (error) {
    console.error('Error checking translations:', error);
  }
};

