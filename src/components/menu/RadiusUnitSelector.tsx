
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { DistanceUnit } from '@/types/categoryTypes';

interface RadiusUnitSelectorProps {
  unit: DistanceUnit;
  onUnitChange: (unit: DistanceUnit) => void;
}

export const RadiusUnitSelector: React.FC<RadiusUnitSelectorProps> = ({
  unit,
  onUnitChange
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        variant={unit === 'km' ? 'default' : 'outline'} 
        onClick={() => onUnitChange('km')}
        className={cn("px-2 py-1 h-7 text-white", unit === 'km' ? "bg-primary hover:bg-primary/90" : "")}
      >
        KM
      </Button>
      <Button 
        size="sm" 
        variant={unit === 'mi' ? 'default' : 'outline'} 
        onClick={() => onUnitChange('mi')}
        className={cn("px-2 py-1 h-7 text-white", unit === 'mi' ? "bg-accent hover:bg-accent/90" : "")}
      >
        {t('miles')}
      </Button>
    </div>
  );
};
