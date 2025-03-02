
import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Plus, MapPin, Clock, Navigation, Car, PersonStanding, Bike, Bus, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
  { id: 'driving', name: 'Voiture', icon: <Car className="h-4 w-4" /> },
  { id: 'walking', name: 'À pied', icon: <PersonStanding className="h-4 w-4" /> },
  { id: 'cycling', name: 'Vélo', icon: <Bike className="h-4 w-4" /> },
  { id: 'transit', name: 'Transport', icon: <Bus className="h-4 w-4" /> },
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
  const categoriesRef = useRef<HTMLDivElement>(null);

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleRadiusChange = (value: number[]) => {
    setRadius(value[0]);
    triggerFilterChange({ radius: value[0] });
  };

  const handleDurationChange = (value: number[]) => {
    setDuration(value[0]);
    triggerFilterChange({ duration: value[0] });
  };

  const handleResultsCountChange = (value: number[]) => {
    setResultsCount(value[0]);
    triggerFilterChange({ resultsCount: value[0] });
  };

  const handleTransportModeChange = (mode: string) => {
    setTransportMode(mode);
    triggerFilterChange({ transportMode: mode });
  };

  const handleUnitChange = (newUnit: 'km' | 'miles') => {
    setUnit(newUnit);
    triggerFilterChange({ unit: newUnit });
  };

  const handleTimeUnitChange = (newUnit: 'minutes' | 'hours') => {
    setTimeUnit(newUnit);
    triggerFilterChange({ timeUnit: newUnit });
  };

  const handleRadiusTypeChange = (type: 'distance' | 'duration') => {
    setRadiusType(type);
    triggerFilterChange({ radiusType: type });
  };

  const triggerFilterChange = (changedValues: Partial<{
    radius: number;
    unit: 'km' | 'miles';
    duration: number;
    timeUnit: 'minutes' | 'hours';
    resultsCount: number;
    transportMode: string;
    radiusType: 'distance' | 'duration';
  }> = {}) => {
    onFilterChange({
      radius: changedValues.radius !== undefined ? changedValues.radius : radius,
      unit: changedValues.unit || unit,
      duration: changedValues.duration !== undefined ? changedValues.duration : duration,
      timeUnit: changedValues.timeUnit || timeUnit,
      resultsCount: changedValues.resultsCount !== undefined ? changedValues.resultsCount : resultsCount,
      transportMode: changedValues.transportMode || transportMode,
      radiusType: changedValues.radiusType || radiusType,
    });
  };

  // ScrollLeft/Right handling for categories
  const scrollLeft = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg transition-all duration-300 transform relative">
      <div 
        className="flex justify-center items-center py-2 cursor-pointer hover:bg-gray-50 rounded-t-lg"
        onClick={handleToggleMenu}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronUp className="h-6 w-6 text-primary" />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Horizontal scrolling categories */}
            <div className="px-4 pb-2 relative">
              <div 
                ref={categoriesRef}
                className="flex items-center overflow-x-auto pb-2 gap-2 scrollbar-hide"
              >
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
            
            {/* Tabs for Distance/Durée */}
            <div className="px-4 py-4 border-t">
              <Tabs 
                defaultValue="distance" 
                value={radiusType}
                onValueChange={(v) => handleRadiusTypeChange(v as 'distance' | 'duration')} 
                className="w-full"
              >
                <TabsList className="w-full mb-4 grid grid-cols-2">
                  <TabsTrigger 
                    value="distance" 
                    className="flex gap-1 items-center bg-primary text-white data-[state=active]:bg-primary"
                  >
                    <Compass className="h-4 w-4" />
                    {t('distance')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="duration" 
                    className="flex gap-1 items-center bg-secondary text-white data-[state=active]:bg-secondary"
                  >
                    <Clock className="h-4 w-4" />
                    Durée
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="distance" className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">{t('radius')}: {radius} {unit}</h3>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={unit === 'km' ? 'default' : 'outline'} 
                        onClick={() => handleUnitChange('km')}
                        className={cn("px-2 py-1 h-7", unit === 'km' ? "bg-primary" : "")}
                      >
                        KM
                      </Button>
                      <Button 
                        size="sm" 
                        variant={unit === 'miles' ? 'default' : 'outline'} 
                        onClick={() => handleUnitChange('miles')}
                        className={cn("px-2 py-1 h-7", unit === 'miles' ? "bg-accent" : "")}
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
                        className={cn("px-2 py-1 h-7", timeUnit === 'minutes' ? "bg-secondary" : "")}
                      >
                        {t('minutes')}
                      </Button>
                      <Button 
                        size="sm" 
                        variant={timeUnit === 'hours' ? 'default' : 'outline'} 
                        onClick={() => handleTimeUnitChange('hours')}
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
              </Tabs>
            </div>
            
            {/* Number of results - updated label */}
            <div className="px-4 py-4 border-t">
              <h3 className="text-sm font-medium mb-2">Nombre autour de moi: {resultsCount}</h3>
              <Slider
                value={[resultsCount]}
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
            
            {/* Transport modes - updated label */}
            <div className="px-4 py-4 border-t">
              <h3 className="text-sm font-medium mb-2">Transport</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveMenu;
