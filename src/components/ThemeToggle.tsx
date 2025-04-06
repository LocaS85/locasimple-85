
import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ThemeToggleProps {
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ThemeToggle = ({ variant = 'ghost', size = 'icon' }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className="focus:ring-0 relative w-9 h-9 rounded-full flex items-center justify-center"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-secondary" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-accent" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border-border rounded-lg shadow-lg p-1 min-w-[120px]">
        <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer hover:bg-muted/50 rounded-md flex items-center gap-2 px-3 py-2">
          <Sun className="h-4 w-4 text-secondary" />
          <span>{t('light') || 'Light'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer hover:bg-muted/50 rounded-md flex items-center gap-2 px-3 py-2">
          <Moon className="h-4 w-4 text-accent" />
          <span>{t('dark') || 'Dark'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer hover:bg-muted/50 rounded-md flex items-center gap-2 px-3 py-2">
          <Monitor className="h-4 w-4 text-primary" />
          <span>{t('system') || 'System'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
