
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

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

  // Helper to determine if the selected duration is in minutes (< 60) or hours
  const isMinutesDuration = selectedDuration !== null && selectedDuration < 60;

  // Get active button color based on whether it's minutes or hours
  const getButtonColor = () => {
    if (!selectedDuration) return "border-black bg-gray-50 text-black hover:bg-gray-100";
    return isMinutesDuration
      ? "border-orange-500 bg-orange-500 text-white hover:bg-orange-600"
      : "border-green-500 bg-green-500 text-white hover:bg-green-600";
  };

  // Format duration for display
  const formatSelectedDuration = () => {
    if (!selectedDuration) return t('duration');
    
    if (selectedDuration < 60) {
      return `${selectedDuration} min`;
    } else {
      const hours = Math.floor(selectedDuration / 60);
      const minutes = selectedDuration % 60;
      
      if (minutes === 0) {
        return `${hours} h`;
      } else {
        return `${hours} h ${minutes} min`;
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          className={`w-full rounded-full border text-xs h-7 px-2 ${getButtonColor()} justify-between`}
        >
          <span className="text-xs">{formatSelectedDuration()}</span>
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
                className={cn(
                  "text-xs py-0 h-6",
                  selectedDuration === min 
                    ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600" 
                    : "bg-white text-black border border-gray-200 hover:bg-gray-100"
                )}
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
                className={cn(
                  "text-xs py-0 h-6",
                  selectedDuration === hour * 60 
                    ? "bg-green-500 text-white border-green-500 hover:bg-green-600" 
                    : "bg-white text-black border border-gray-200 hover:bg-gray-100"
                )}
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
