
import React from 'react';
import { Button } from '@/components/ui/button';
import { DistanceUnit } from '@/types/categoryTypes';

interface RadiusUnitSelectorProps {
  value: DistanceUnit;
  onChange: (unit: DistanceUnit) => void;
  className?: string;
}

const RadiusUnitSelector: React.FC<RadiusUnitSelectorProps> = ({
  value,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant={value === 'km' ? 'default' : 'outline'}
        size="xs"
        className="px-2 h-6 text-xs font-medium"
        onClick={() => onChange('km')}
      >
        km
      </Button>
      <Button
        variant={value === 'mi' ? 'default' : 'outline'}
        size="xs"
        className="px-2 h-6 text-xs font-medium"
        onClick={() => onChange('mi')}
      >
        mi
      </Button>
    </div>
  );
};

export default RadiusUnitSelector;
