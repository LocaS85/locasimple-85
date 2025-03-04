
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ResultsCountPopoverProps {
  resultsCount: number;
  onResultsCountChange: (count: number) => void;
}

export const ResultsCountPopover: React.FC<ResultsCountPopoverProps> = ({
  resultsCount,
  onResultsCountChange
}) => {
  const { t } = useLanguage();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full rounded-full border border-black bg-white text-black hover:bg-gray-50 justify-between text-xs h-7 px-3">
          <span>{t('results_count')}</span>
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white">
        <div className="grid grid-cols-5 gap-1 p-2">
          {Array.from({ length: 10 }, (_, i) => (
            <Button 
              key={`nbr-${i+1}`} 
              variant="outline"
              className="h-8 w-8 text-xs"
              onClick={() => onResultsCountChange(i+1)}
            >
              {i+1}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
