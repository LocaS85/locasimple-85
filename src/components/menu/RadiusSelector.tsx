
import React from 'react';
import { Compass } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { RadiusUnitSelector } from './RadiusUnitSelector';
import { RadiusSlider } from './RadiusSlider';
import { DurationSelector } from './DurationSelector';
import { DistanceUnit } from '@/types/categoryTypes';

interface RadiusSelectorProps {
  radius: number;
  unit: DistanceUnit;
  radiusType: 'distance' | 'duration';
  duration: number;
  timeUnit: 'minutes' | 'hours';
  onRadiusChange: (value: number) => void;
  onUnitChange: (unit: DistanceUnit) => void;
  onRadiusTypeChange: (type: 'distance' | 'duration') => void;
  onDurationChange: (value: number) => void;
  onTimeUnitChange: (unit: 'minutes' | 'hours') => void;
}

export const RadiusSelector: React.FC<RadiusSelectorProps> = ({
  radius,
  unit,
  radiusType,
  duration,
  timeUnit,
  onRadiusChange,
  onUnitChange,
  onRadiusTypeChange,
  onDurationChange,
  onTimeUnitChange
}) => {
  const { t } = useLanguage();

  return (
    <Tabs 
      defaultValue="distance" 
      value={radiusType}
      onValueChange={(v) => onRadiusTypeChange(v as 'distance' | 'duration')} 
      className="w-full"
    >
      <TabsList className="w-full mb-4 grid grid-cols-2">
        <TabsTrigger 
          value="distance" 
          className="flex gap-1 items-center text-white data-[state=active]:bg-primary"
        >
          <Compass className="h-4 w-4" />
          {t('distance')}
        </TabsTrigger>
        <DurationSelector 
          duration={duration}
          timeUnit={timeUnit}
          radiusType={radiusType}
          onDurationChange={onDurationChange}
          onTimeUnitChange={onTimeUnitChange}
        />
      </TabsList>
      
      <TabsContent value="distance" className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">{t('radius')}: {radius} {unit}</h3>
          <RadiusUnitSelector unit={unit} onUnitChange={onUnitChange} />
        </div>
        <RadiusSlider radius={radius} unit={unit} onRadiusChange={onRadiusChange} />
      </TabsContent>
    </Tabs>
  );
};
