
import React from 'react';
import { render } from '@testing-library/react';
import { LanguageProvider } from '@/contexts/LanguageContext';

/**
 * Helper function to test if a component uses translations correctly
 * @param Component The component to test
 * @param props Component props
 */
export const testTranslations = (
  Component: React.ComponentType<any>,
  props: any = {}
) => {
  // Mock language change
  const switchLanguage = (language: string) => {
    // Implementation would use jest.spyOn in a real test environment
    console.log(`Switch language to: ${language}`);
  };

  // Render with different languages to check for hard-coded text
  const languages = ['en', 'fr', 'es', 'it', 'pt'];
  
  languages.forEach(language => {
    // This would be a formal test in a test suite
    console.log(`Testing ${Component.name} with ${language}`);
    
    render(
      <LanguageProvider>
        <Component {...props} />
      </LanguageProvider>
    );
    
    // Switch language and check if component updates
    switchLanguage(language);
    
    // In a real test, we would assert that text content changes
  });
};

/**
 * This function would be used during development to quickly identify
 * components that don't use the translation system properly
 */
export const scanForUntranslatedText = (componentString: string): string[] => {
  const untranslatedTexts: string[] = [];
  
  // Look for potential hardcoded text patterns
  const textPattern = /["'`]([^"'`]{5,})["'`]/g;
  let match;
  
  while ((match = textPattern.exec(componentString)) !== null) {
    const text = match[1];
    // Skip certain patterns that are typically not translated
    if (
      !text.includes('{') && 
      !text.includes('(') && 
      !text.includes('//') &&
      !text.includes('<') &&
      !text.includes('>') &&
      text.length > 5
    ) {
      untranslatedTexts.push(text);
    }
  }
  
  return untranslatedTexts;
};
