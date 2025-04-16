
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface RadiusControlProps {
  unitOptions?: string[];
  maxRadius?: number;
  step?: number;
  defaultRadius?: number;
  defaultUnit?: string;
  onChange?: (radius: number, unit: string) => void;
}

const RadiusControl: React.FC<RadiusControlProps> = ({
  unitOptions = ['km', 'mi'],
  maxRadius = 100,
  step = 5,
  defaultRadius = 5,
  defaultUnit = 'km',
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [radius, setRadius] = useState(defaultRadius);
  const [unit, setUnit] = useState(defaultUnit);

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
        </div>
      )}
    </div>
  );
};

export default RadiusControl;
