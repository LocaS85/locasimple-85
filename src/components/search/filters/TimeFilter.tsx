
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TimeFilterProps {
  type?: 'time-slider' | 'time-range' | 'day-select';
  ranges?: string[];
  onChange?: (timeRange: { start: string; end: string }) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({
  type = 'time-slider',
  ranges = ['now', 'today', 'custom'],
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(ranges[0]);
  
  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    
    // Convert range to actual time values
    let timeRange = { start: '', end: '' };
    
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium block mb-1">Début</label>
                    <input 
                      type="time" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      defaultValue="08:00"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Fin</label>
                    <input 
                      type="time" 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      defaultValue="18:00"
                    />
                  </div>
                </div>
              </div>
            )}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default TimeFilter;
