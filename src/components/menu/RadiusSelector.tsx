
import React from 'react';
import { Compass } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface RadiusSelectorProps {
  radius: number;
  unit: 'km' | 'miles';
  radiusType: 'distance' | 'duration';
  onRadiusChange: (value: number) => void;
  onUnitChange: (unit: 'km' | 'miles') => void;
  onRadiusTypeChange: (type: 'distance' | 'duration') => void;
}

export const RadiusSelector: React.FC<RadiusSelectorProps> = ({
  radius,
  unit,
  radiusType,
  onRadiusChange,
  onUnitChange,
  onRadiusTypeChange
}) => {
  const { t } = useLanguage();

  const handleRadiusChange = (value: number[]) => {
    onRadiusChange(value[0]);
  };

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
        {/* The Duration TabsTrigger is now in the DurationSelector component */}
      </TabsList>
      
      <TabsContent value="distance" className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">{t('radius')}: {radius} {unit}</h3>
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
              variant={unit === 'miles' ? 'default' : 'outline'} 
              onClick={() => onUnitChange('miles')}
              className={cn("px-2 py-1 h-7 text-white", unit === 'miles' ? "bg-accent hover:bg-accent/90" : "")}
            >
              {t('miles')}
            </Button>
          </div>
        </div>
        <Slider
          value={[radius]}
          min={1}
          max={100}
          step={1}
          onValueChange={handleRadiusChange}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1 {unit}</span>
          <span>50 {unit}</span>
          <span>100 {unit}</span>
        </div>
      </TabsContent>
    </Tabs>
  );
};
