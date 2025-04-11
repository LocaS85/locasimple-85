
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Compass } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface RadiusControlProps {
  unitOptions?: string[];
  maxRadius?: number;
  step?: number;
  defaultRadius?: number;
  defaultUnit?: string;
  timeUnitOptions?: string[];
  maxDuration?: number;
  defaultDuration?: number;
  defaultTimeUnit?: string;
  onChange?: (radius: number, unit: string) => void;
  onDurationChange?: (duration: number, timeUnit: string) => void;
}

const RadiusControl: React.FC<RadiusControlProps> = ({
  unitOptions = ['km', 'mi'],
  maxRadius = 100,
  step = 5,
  defaultRadius = 5,
  defaultUnit = 'km',
  timeUnitOptions = ['min', 'h'],
  maxDuration = 120,
  defaultDuration = 15,
  defaultTimeUnit = 'min',
  onChange,
  onDurationChange
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [radius, setRadius] = useState(defaultRadius);
  const [unit, setUnit] = useState(defaultUnit);
  const [filterType, setFilterType] = useState<'distance' | 'duration'>('distance');
  const [duration, setDuration] = useState(defaultDuration);
  const [timeUnit, setTimeUnit] = useState(defaultTimeUnit);

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseInt(e.target.value);
    setRadius(newRadius);
    if (onChange) {
      onChange(newRadius, unit);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    setUnit(newUnit);
    if (onChange) {
      onChange(radius, newUnit);
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(e.target.value);
    setDuration(newDuration);
    if (onDurationChange) {
      onDurationChange(newDuration, timeUnit);
    }
  };

  const handleTimeUnitChange = (newTimeUnit: string) => {
    setTimeUnit(newTimeUnit);
    if (onDurationChange) {
      onDurationChange(duration, newTimeUnit);
    }
  };

  const handleFilterTypeChange = (type: string) => {
    setFilterType(type as 'distance' | 'duration');
  };

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <button 
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">Rayon de recherche</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isOpen && (
        <div className="p-4">
          <Tabs 
            defaultValue="distance" 
            value={filterType}
            onValueChange={handleFilterTypeChange}
            className="w-full"
          >
            <TabsList className="w-full mb-4 grid grid-cols-2">
              <TabsTrigger 
                value="distance" 
                className="flex gap-1 items-center"
              >
                <Compass className="h-4 w-4" />
                Distance
              </TabsTrigger>
              <TabsTrigger 
                value="duration" 
                className="flex gap-1 items-center"
              >
                <Clock className="h-4 w-4" />
                Durée
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="distance" className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{radius} {unit}</span>
                <div className="flex rounded-md overflow-hidden border border-gray-300">
                  {unitOptions.map((option) => (
                    <button
                      key={option}
                      className={`px-2 py-1 text-xs ${
                        unit === option 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleUnitChange(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max={maxRadius}
                step={step}
                value={radius}
                onChange={handleRadiusChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{maxRadius/2}</span>
                <span>{maxRadius} {unit}</span>
              </div>
            </TabsContent>
            
            <TabsContent value="duration" className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{duration} {timeUnit}</span>
                <div className="flex rounded-md overflow-hidden border border-gray-300">
                  {timeUnitOptions.map((option) => (
                    <button
                      key={option}
                      className={`px-2 py-1 text-xs ${
                        timeUnit === option 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleTimeUnitChange(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max={maxDuration}
                step={timeUnit === 'min' ? 5 : 0.5}
                value={duration}
                onChange={handleDurationChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{maxDuration/2}</span>
                <span>{maxDuration} {timeUnit}</span>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default RadiusControl;
