
import React from 'react';
import { Clock } from 'lucide-react';
import { TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

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

  const handleDurationChange = (value: number[]) => {
    onDurationChange(value[0]);
  };

  if (radiusType !== 'duration') {
    return (
      <TabsTrigger 
        value="duration" 
        className="flex gap-1 items-center bg-secondary text-white data-[state=active]:bg-secondary"
      >
        <Clock className="h-4 w-4" />
        Durée
      </TabsTrigger>
    );
  }

  return (
    <>
      <TabsTrigger 
        value="duration" 
        className="flex gap-1 items-center bg-secondary text-white data-[state=active]:bg-secondary"
      >
        <Clock className="h-4 w-4" />
        Durée
      </TabsTrigger>
      
      <TabsContent value="duration" className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">
            {t('max_duration')}: {duration} {timeUnit === 'minutes' ? 'min' : 'h'}
          </h3>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={timeUnit === 'minutes' ? 'default' : 'outline'} 
              onClick={() => onTimeUnitChange('minutes')}
              className={cn("px-2 py-1 h-7", timeUnit === 'minutes' ? "bg-secondary" : "")}
            >
              {t('minutes')}
            </Button>
            <Button 
              size="sm" 
              variant={timeUnit === 'hours' ? 'default' : 'outline'} 
              onClick={() => onTimeUnitChange('hours')}
              className={cn("px-2 py-1 h-7", timeUnit === 'hours' ? "bg-accent" : "")}
            >
              {t('hours')}
            </Button>
          </div>
        </div>
        <Slider
          value={[duration]}
          min={timeUnit === 'minutes' ? 5 : 1}
          max={timeUnit === 'minutes' ? 60 : 5}
          step={timeUnit === 'minutes' ? 5 : 1}
          onValueChange={handleDurationChange}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{timeUnit === 'minutes' ? '5 min' : '1 h'}</span>
          <span>{timeUnit === 'minutes' ? '30 min' : '3 h'}</span>
          <span>{timeUnit === 'minutes' ? '60 min' : '5 h'}</span>
        </div>
      </TabsContent>
    </>
  );
};
