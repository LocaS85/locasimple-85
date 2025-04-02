
import { useState, useContext, createContext, ReactNode } from 'react';
import { defaultThemeColors, generateTheme } from '@/utils/themeColors';

interface IconThemeContextProps {
  theme: Record<string, string>;
  updateTheme: (newColors: Record<string, string>) => void;
  getColor: (key: string) => string;
}

const IconThemeContext = createContext<IconThemeContextProps>({
  theme: defaultThemeColors,
  updateTheme: () => {},
  getColor: () => '#000000',
});

export const IconThemeProvider = ({ children, initialTheme = {} }: { children: ReactNode, initialTheme?: Record<string, string> }) => {
  const [theme, setTheme] = useState(generateTheme(initialTheme));

  const updateTheme = (newColors: Record<string, string>) => {
    setTheme(current => ({
      ...current,
      ...newColors
    }));
  };

  const getColor = (key: string) => {
    return theme[key] || theme.primary || defaultThemeColors.primary;
  };

  return (
    <IconThemeContext.Provider value={{ theme, updateTheme, getColor }}>
      {children}
    </IconThemeContext.Provider>
  );
};

export const useIconTheme = () => {
  const context = useContext(IconThemeContext);
  if (context === undefined) {
    throw new Error('useIconTheme must be used within an IconThemeProvider');
  }
  return context;
};
