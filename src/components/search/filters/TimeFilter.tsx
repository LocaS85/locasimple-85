
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface TimeFilterProps {
  type?: 'time-selector' | 'time-slider';
  ranges?: string[];
  onChange?: (timeOption: string, customTime?: Date) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({
  type = 'time-slider',
  ranges = ['now', 'today', 'custom'],
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedRange, setSelectedRange] = useState(ranges[0]);
  const [customTime, setCustomTime] = useState<string>('');
  const [customDate, setCustomDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    if (onChange) {
      onChange(range, range === 'custom' ? new Date(`${customDate}T${customTime || '00:00'}`) : undefined);
    }
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTime(e.target.value);
    if (selectedRange === 'custom' && onChange) {
      onChange('custom', new Date(`${customDate}T${e.target.value || '00:00'}`));
    }
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDate(e.target.value);
    if (selectedRange === 'custom' && onChange) {
      onChange('custom', new Date(`${e.target.value}T${customTime || '00:00'}`));
    }
  };

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <button 
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">Horaire</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isOpen && (
        <div className="p-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {ranges.map((range) => (
              <button
                key={range}
                className={`px-3 py-2 rounded-md text-sm ${
                  selectedRange === range 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handleRangeChange(range)}
              >
                {range === 'now' && 'Maintenant'}
                {range === 'today' && "Aujourd'hui"}
                {range === 'custom' && 'Personnalisé'}
              </button>
            ))}
          </div>
          
          {selectedRange === 'custom' && (
            <div className="space-y-2">
              <div>
                <label htmlFor="custom-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="custom-date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={customDate}
                  onChange={handleCustomDateChange}
                />
              </div>
              
              <div>
                <label htmlFor="custom-time" className="block text-sm font-medium text-gray-700 mb-1">
                  Heure
                </label>
                <input
                  type="time"
                  id="custom-time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={customTime}
                  onChange={handleCustomTimeChange}
                />
              </div>
            </div>
          )}
          
          {type === 'time-slider' && (
            <div className="mt-4">
              <div className="flex items-center">
                <Clock size={16} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Heure de départ</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="0.5"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0h</span>
                <span>12h</span>
                <span>24h</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeFilter;
