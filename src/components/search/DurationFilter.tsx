
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DurationFilterProps {
  selectedDuration: number | null;
  onDurationChange: (duration: number) => void;
}

export const DurationFilter: React.FC<DurationFilterProps> = ({
  selectedDuration,
  onDurationChange
}) => {
  const { t } = useLanguage();

  const generateMinutesDurations = () => {
    return Array.from({ length: 11 }, (_, i) => i * 5 + 5);
  };
  
  const generateHoursDurations = () => {
    return Array.from({ length: 10 }, (_, i) => i + 1);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          className={`w-full rounded-full border text-xs h-7 px-2 ${
            selectedDuration 
              ? "border-primary bg-primary text-white hover:bg-primary/90" 
              : "border-black bg-gray-50 text-black hover:bg-gray-100"
          } justify-between`}
        >
          <span className="text-xs">{t('duration')}</span>
          <Clock className="h-3 w-3 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0 bg-white">
        <div className="p-2">
          <h3 className="font-bold mb-1 text-sm">{t('minutes')}</h3>
          <div className="grid grid-cols-3 gap-1 mb-3">
            {generateMinutesDurations().map((min) => (
              <Button 
                key={`min-${min}`} 
                variant={selectedDuration === min ? "default" : "outline"}
                className="text-xs py-0 h-6"
                onClick={() => onDurationChange(min)}
              >
                {min} min
              </Button>
            ))}
          </div>
          <h3 className="font-bold mb-1 text-sm">{t('hours')}</h3>
          <div className="grid grid-cols-5 gap-1">
            {generateHoursDurations().map((hour) => (
              <Button 
                key={`hour-${hour}`} 
                variant={selectedDuration === hour * 60 ? "default" : "outline"}
                className="text-xs py-0 h-6"
                onClick={() => onDurationChange(hour * 60)}
              >
                {hour} h
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
