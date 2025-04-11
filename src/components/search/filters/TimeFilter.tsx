
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Calendar } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface TimeRange {
  start: string; 
  end: string;
}

interface TimeFilterProps {
  type?: 'time-slider' | 'time-range' | 'day-select';
  ranges?: string[];
  defaultRange?: string;
  defaultDays?: string[];
  onChange?: (timeRange: TimeRange) => void;
  onDaysChange?: (days: string[]) => void;
}

const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

const TimeFilter: React.FC<TimeFilterProps> = ({
  type = 'time-slider',
  ranges = ['now', 'today', 'custom'],
  defaultRange = 'now',
  defaultDays = [],
  onChange,
  onDaysChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(defaultRange);
  const [selectedDays, setSelectedDays] = useState<string[]>(defaultDays);
  const [customStart, setCustomStart] = useState('08:00');
  const [customEnd, setCustomEnd] = useState('18:00');
  
  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    
    // Convert range to actual time values
    let timeRange: TimeRange = { start: '', end: '' };
    
    switch (range) {
      case 'now':
        timeRange = { 
          start: new Date().toISOString(), 
          end: new Date(Date.now() + 3600000).toISOString() // +1 hour
        };
        break;
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        timeRange = { 
          start: today.toISOString(), 
          end: endOfDay.toISOString() 
        };
        break;
      case 'custom':
        // Custom time range will be handled by the custom inputs
        if (customStart && customEnd) {
          const today = new Date();
          const [startHours, startMinutes] = customStart.split(':').map(Number);
          const [endHours, endMinutes] = customEnd.split(':').map(Number);
          
          const startDate = new Date(today);
          startDate.setHours(startHours, startMinutes, 0, 0);
          
          const endDate = new Date(today);
          endDate.setHours(endHours, endMinutes, 0, 0);
          
          timeRange = {
            start: startDate.toISOString(),
            end: endDate.toISOString()
          };
        }
        break;
      default:
        timeRange = { 
          start: new Date().toISOString(), 
          end: new Date(Date.now() + 3600000).toISOString() 
        };
    }
    
    if (onChange) {
      onChange(timeRange);
    }
  };

  const handleCustomTimeChange = (isStart: boolean, value: string) => {
    if (isStart) {
      setCustomStart(value);
    } else {
      setCustomEnd(value);
    }
    
    if (selectedRange === 'custom' && onChange && customStart && customEnd) {
      const today = new Date();
      const [startHours, startMinutes] = customStart.split(':').map(Number);
      const [endHours, endMinutes] = customEnd.split(':').map(Number);
      
      const startDate = new Date(today);
      startDate.setHours(startHours, startMinutes, 0, 0);
      
      const endDate = new Date(today);
      endDate.setHours(endHours, endMinutes, 0, 0);
      
      onChange({
        start: startDate.toISOString(),
        end: endDate.toISOString()
      });
    }
  };

  const toggleDay = (day: string) => {
    let newSelectedDays;
    
    if (selectedDays.includes(day)) {
      newSelectedDays = selectedDays.filter(d => d !== day);
    } else {
      newSelectedDays = [...selectedDays, day];
    }
    
    setSelectedDays(newSelectedDays);
    
    if (onDaysChange) {
      onDaysChange(newSelectedDays);
    }
  };

  const getDayLabel = (day: string): string => {
    const labels: Record<string, string> = {
      'monday': 'Lun',
      'tuesday': 'Mar',
      'wednesday': 'Mer',
      'thursday': 'Jeu',
      'friday': 'Ven',
      'saturday': 'Sam',
      'sunday': 'Dim'
    };
    
    return labels[day] || day;
  };

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <button 
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span className="font-medium">Horaires</span>
        </div>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isOpen && (
        <div className="p-4">
          <Tabs 
            defaultValue={selectedRange} 
            onValueChange={handleRangeChange}
            className="w-full"
          >
            <TabsList className="w-full mb-4 grid grid-cols-3">
              {ranges.map(range => (
                <TabsTrigger 
                  key={range}
                  value={range}
                  className="flex-1 capitalize"
                >
                  {range === 'now' ? 'Maintenant' : 
                   range === 'today' ? "Aujourd'hui" : 
                   range === 'custom' ? 'Personnalisé' : range}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {selectedRange === 'custom' && (
              <TabsContent value="custom" className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium block mb-1">Début</label>
                    <input 
                      type="time" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={customStart}
                      onChange={(e) => handleCustomTimeChange(true, e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Fin</label>
                    <input 
                      type="time" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={customEnd}
                      onChange={(e) => handleCustomTimeChange(false, e.target.value)}
                    />
                  </div>
                </div>
                
                {type === 'day-select' && (
                  <div className="mt-4">
                    <label className="text-sm font-medium block mb-2">Jours</label>
                    <div className="flex flex-wrap gap-1">
                      {DAYS_OF_WEEK.map(day => (
                        <button
                          key={day}
                          className={`px-2 py-1 text-xs rounded-full ${
                            selectedDays.includes(day)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => toggleDay(day)}
                        >
                          {getDayLabel(day)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            )}
            
            {/* Display selected time range info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
              {selectedRange === 'now' && (
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>Recherche pour la prochaine heure</span>
                </div>
              )}
              
              {selectedRange === 'today' && (
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>Recherche pour aujourd'hui ({new Date().toLocaleDateString('fr-FR')})</span>
                </div>
              )}
              
              {selectedRange === 'custom' && (
                <div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>De {customStart} à {customEnd}</span>
                  </div>
                  {selectedDays.length > 0 && type === 'day-select' && (
                    <div className="mt-1 flex gap-1 flex-wrap">
                      {selectedDays.map(day => (
                        <span key={day} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {getDayLabel(day)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default TimeFilter;
