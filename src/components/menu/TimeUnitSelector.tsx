
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface TimeUnitSelectorProps {
  timeUnit: 'minutes' | 'hours';
  onTimeUnitChange: (unit: 'minutes' | 'hours') => void;
}

export const TimeUnitSelector: React.FC<TimeUnitSelectorProps> = ({
  timeUnit,
  onTimeUnitChange
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        variant={timeUnit === 'minutes' ? 'default' : 'outline'} 
        onClick={() => onTimeUnitChange('minutes')}
        className={cn("px-2 py-1 h-7 text-white", timeUnit === 'minutes' ? "bg-secondary hover:bg-secondary/90" : "")}
      >
        {t('minutes')}
      </Button>
      <Button 
        size="sm" 
        variant={timeUnit === 'hours' ? 'default' : 'outline'} 
        onClick={() => onTimeUnitChange('hours')}
        className={cn("px-2 py-1 h-7 text-white", timeUnit === 'hours' ? "bg-accent hover:bg-accent/90" : "")}
      >
        {t('hours')}
      </Button>
    </div>
  );
};
