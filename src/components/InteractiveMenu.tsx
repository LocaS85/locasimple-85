
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Plus, MapPin, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface InteractiveMenuProps {
  onFilterChange: (filters: {
    radius: number;
    unit: 'km' | 'miles';
    duration: number;
    timeUnit: 'minutes' | 'hours';
    resultsCount: number;
    transportMode: string;
    radiusType: 'distance' | 'duration';
  }) => void;
}

const mockCategories: Category[] = [
  { id: 'restaurants', name: 'Restaurants', icon: <MapPin className="h-4 w-4" /> },
  { id: 'bars', name: 'Bars', icon: <MapPin className="h-4 w-4" /> },
  { id: 'cafes', name: 'Cafés', icon: <MapPin className="h-4 w-4" /> },
  { id: 'shopping', name: 'Shopping', icon: <MapPin className="h-4 w-4" /> },
  { id: 'hotels', name: 'Hôtels', icon: <MapPin className="h-4 w-4" /> },
  { id: 'entertainment', name: 'Divertissement', icon: <MapPin className="h-4 w-4" /> },
  { id: 'health', name: 'Santé', icon: <MapPin className="h-4 w-4" /> },
  { id: 'services', name: 'Services', icon: <MapPin className="h-4 w-4" /> },
  { id: 'education', name: 'Éducation', icon: <MapPin className="h-4 w-4" /> },
  { id: 'transport', name: 'Transport', icon: <MapPin className="h-4 w-4" /> },
];

const transportModes = [
  { id: 'driving', name: 'Voiture', icon: <Navigation className="h-4 w-4" /> },
  { id: 'walking', name: 'À pied', icon: <Navigation className="h-4 w-4" /> },
  { id: 'cycling', name: 'Vélo', icon: <Navigation className="h-4 w-4" /> },
  { id: 'transit', name: 'Transport', icon: <Navigation className="h-4 w-4" /> },
];

const InteractiveMenu: React.FC<InteractiveMenuProps> = ({ onFilterChange }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const [radius, setRadius] = useState(5);
  const [unit, setUnit] = useState<'km' | 'miles'>('km');
  const [duration, setDuration] = useState(15);
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours'>('minutes');
  const [resultsCount, setResultsCount] = useState(5);
  const [transportMode, setTransportMode] = useState('driving');
  const [radiusType, setRadiusType] = useState<'distance' | 'duration'>('distance');

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleRadiusChange = (value: number[]) => {
    setRadius(value[0]);
    triggerFilterChange();
  };

  const handleDurationChange = (value: number[]) => {
    setDuration(value[0]);
    triggerFilterChange();
  };

  const handleResultsCountChange = (value: number[]) => {
    setResultsCount(value[0]);
    triggerFilterChange();
  };

  const handleTransportModeChange = (mode: string) => {
    setTransportMode(mode);
    triggerFilterChange();
  };

  const handleUnitChange = (newUnit: 'km' | 'miles') => {
    setUnit(newUnit);
    triggerFilterChange();
  };

  const handleTimeUnitChange = (newUnit: 'minutes' | 'hours') => {
    setTimeUnit(newUnit);
    triggerFilterChange();
  };

  const handleRadiusTypeChange = (type: 'distance' | 'duration') => {
    setRadiusType(type);
    triggerFilterChange();
  };

  const triggerFilterChange = () => {
    onFilterChange({
      radius,
      unit,
      duration,
      timeUnit,
      resultsCount,
      transportMode,
      radiusType,
    });
  };

  return (
    <div className="bg-white rounded-t-lg shadow-lg transition-all duration-300 transform">
      <div 
        className="flex justify-center items-center py-2 cursor-pointer"
        onClick={handleToggleMenu}
      >
        {isOpen ? (
          <ChevronDown className="h-6 w-6 text-primary" />
        ) : (
          <ChevronUp className="h-6 w-6 text-primary" />
        )}
      </div>
      
      <div className={cn(
        "transition-all duration-300 overflow-hidden", 
        isOpen ? "max-h-[500px]" : "max-h-0"
      )}>
        {/* Horizontal scrolling categories */}
        <div className="px-4 pb-2">
          <div className="flex items-center overflow-x-auto pb-2 gap-2 scrollbar-hide">
            {mockCategories.map((category) => (
              <Button 
                key={category.id} 
                variant="outline" 
                className="flex-shrink-0 whitespace-nowrap"
              >
                {category.icon}
                <span>{category.name}</span>
              </Button>
            ))}
            <Button variant="outline" className="flex-shrink-0 rounded-full p-2">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Tabs for Distance/Duration */}
        <div className="px-4 py-4 border-t">
          <Tabs defaultValue="distance" className="w-full" onValueChange={(v) => handleRadiusTypeChange(v as 'distance' | 'duration')}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="distance" className="flex-1">{t('distance')}</TabsTrigger>
              <TabsTrigger value="duration" className="flex-1">{t('duration')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="distance" className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">{t('radius')}: {radius} {unit}</h3>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={unit === 'km' ? 'default' : 'outline'} 
                    onClick={() => handleUnitChange('km')}
                    className="px-2 py-1 h-7"
                  >
                    KM
                  </Button>
                  <Button 
                    size="sm" 
                    variant={unit === 'miles' ? 'default' : 'outline'} 
                    onClick={() => handleUnitChange('miles')}
                    className="px-2 py-1 h-7"
                  >
                    {t('miles')}
                  </Button>
                </div>
              </div>
              <Slider
                defaultValue={[radius]}
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
            
            <TabsContent value="duration" className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">
                  {t('max_duration')}: {duration} {timeUnit === 'minutes' ? 'min' : 'h'}
                </h3>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={timeUnit === 'minutes' ? 'default' : 'outline'} 
                    onClick={() => handleTimeUnitChange('minutes')}
                    className="px-2 py-1 h-7"
                  >
                    {t('minutes')}
                  </Button>
                  <Button 
                    size="sm" 
                    variant={timeUnit === 'hours' ? 'default' : 'outline'} 
                    onClick={() => handleTimeUnitChange('hours')}
                    className="px-2 py-1 h-7"
                  >
                    {t('hours')}
                  </Button>
                </div>
              </div>
              <Slider
                defaultValue={[duration]}
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
          </Tabs>
        </div>
        
        {/* Number of results */}
        <div className="px-4 py-4 border-t">
          <h3 className="text-sm font-medium mb-2">{t('results_count')}: {resultsCount}</h3>
          <Slider
            defaultValue={[resultsCount]}
            min={1}
            max={10}
            step={1}
            onValueChange={handleResultsCountChange}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
        
        {/* Transport modes */}
        <div className="px-4 py-4 border-t">
          <h3 className="text-sm font-medium mb-2">{t('transport_mode')}</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {transportModes.map((mode) => (
              <Button 
                key={mode.id} 
                variant={transportMode === mode.id ? 'default' : 'outline'} 
                className="flex-shrink-0"
                onClick={() => handleTransportModeChange(mode.id)}
              >
                {mode.icon}
                <span>{mode.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMenu;
