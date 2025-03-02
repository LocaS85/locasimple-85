
import React from 'react';
import { Clock } from 'lucide-react';
import { TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { TimeUnitSelector } from './TimeUnitSelector';
import { DurationSlider } from './DurationSlider';

interface DurationSelectorProps {
  duration: number;
  timeUnit: 'minutes' | 'hours';
  radiusType: 'distance' | 'duration';
  onDurationChange: (value: number) => void;
  onTimeUnitChange: (unit: 'minutes' | 'hours') => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  duration,
  timeUnit,
  radiusType,
  onDurationChange,
  onTimeUnitChange
}) => {
  const { t } = useLanguage();

  return (
    <>
      <TabsTrigger 
        value="duration" 
        className="flex gap-1 items-center text-white data-[state=active]:bg-secondary"
      >
        <Clock className="h-4 w-4" />
        Durée
      </TabsTrigger>
      
      {radiusType === 'duration' && (
        <TabsContent value="duration" className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">
              {t('max_duration')}: {duration} {timeUnit === 'minutes' ? 'min' : 'h'}
            </h3>
            <TimeUnitSelector timeUnit={timeUnit} onTimeUnitChange={onTimeUnitChange} />
          </div>
          <DurationSlider 
            duration={duration} 
            timeUnit={timeUnit} 
            onDurationChange={onDurationChange} 
          />
        </TabsContent>
      )}
    </>
  );
};
