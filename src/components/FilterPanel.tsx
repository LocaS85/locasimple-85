import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterPanelProps {
  radius: number;
  onRadiusChange: (value: number) => void;
  transportMode: string;
  onTransportModeChange: (value: string) => void;
  resultsCount: number;
  onResultsCountChange: (value: number) => void;
}

const FilterPanel = ({
  radius,
  onRadiusChange,
  transportMode,
  onTransportModeChange,
  resultsCount,
  onResultsCountChange,
}: FilterPanelProps) => {
  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label>Rayon de recherche ({radius} km)</Label>
        <Slider
          value={[radius]}
          onValueChange={(values) => onRadiusChange(values[0])}
          min={1}
          max={20}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label>Mode de transport</Label>
        <Select value={transportMode} onValueChange={onTransportModeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="driving">En voiture</SelectItem>
            <SelectItem value="walking">À pied</SelectItem>
            <SelectItem value="cycling">À vélo</SelectItem>
            <SelectItem value="transit">Transport en commun</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Nombre de résultats</Label>
        <Select 
          value={resultsCount.toString()} 
          onValueChange={(value) => onResultsCountChange(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Nombre de résultats" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 résultats</SelectItem>
            <SelectItem value="5">5 résultats</SelectItem>
            <SelectItem value="10">10 résultats</SelectItem>
            <SelectItem value="20">20 résultats</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterPanel;