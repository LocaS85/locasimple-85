
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, PersonStanding, Bike, Bus, Train, Plane, Tram } from 'lucide-react';

interface FilterPanelProps {
  radius: number;
  onRadiusChange: (value: number) => void;
  transportMode: string;
  onTransportModeChange: (value: string) => void;
  resultsCount: number;
  onResultsCountChange: (value: number) => void;
  duration?: number;
  onDurationChange?: (value: number) => void;
}

const FilterPanel = ({
  radius,
  onRadiusChange,
  transportMode,
  onTransportModeChange,
  resultsCount,
  onResultsCountChange,
  duration = 15,
  onDurationChange = () => {},
}: FilterPanelProps) => {
  const transportModes = [
    { value: 'driving', label: 'Voiture', icon: Car },
    { value: 'walking', label: 'À pied', icon: PersonStanding },
    { value: 'cycling', label: 'Vélo', icon: Bike },
    { value: 'transit', label: 'Transport en commun', icon: Bus },
    { value: 'train', label: 'Train', icon: Train },
    { value: 'plane', label: 'Avion', icon: Plane },
    { value: 'tram', label: 'Tramway', icon: Tram },
  ];

  const distanceOptions = [1, 2, 3, 5, 7, 10];
  const durationOptions = [5, 10, 15, 20, 25, 30];

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label>Distance ({radius} km)</Label>
        <Select 
          value={radius.toString()} 
          onValueChange={(value) => onRadiusChange(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir une distance" />
          </SelectTrigger>
          <SelectContent>
            {distanceOptions.map((km) => (
              <SelectItem key={km} value={km.toString()}>
                {km} km
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Mode de transport</Label>
        <Select value={transportMode} onValueChange={onTransportModeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un mode" />
          </SelectTrigger>
          <SelectContent>
            {transportModes.map(({ value, label, icon: Icon }) => (
              <SelectItem key={value} value={value}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Durée maximale ({duration} minutes)</Label>
        <Select 
          value={duration.toString()} 
          onValueChange={(value) => onDurationChange(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir une durée" />
          </SelectTrigger>
          <SelectContent>
            {durationOptions.map((min) => (
              <SelectItem key={min} value={min.toString()}>
                {min} minutes
              </SelectItem>
            ))}
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
            {[2, 3, 4, 5, 6, 8, 10].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} résultats
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterPanel;
