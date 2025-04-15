
import React from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';

interface ResultsCountSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const ResultsCountSlider: React.FC<ResultsCountSliderProps> = ({
  value,
  onChange,
  min = 1,
  max = 10
}) => {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <motion.div 
      className="w-60"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Résultats à afficher</span>
        <motion.span 
          className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full"
          key={value}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          {value}
        </motion.span>
      </div>
      
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={handleSliderChange}
        className="py-1"
      />
      
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">{min}</span>
        <span className="text-xs text-gray-500">{max}</span>
      </div>
    </motion.div>
  );
};

export default ResultsCountSlider;
