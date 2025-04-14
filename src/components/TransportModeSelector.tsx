
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { transportModesWithColors } from '@/data/transportModesWithColors';
import { TransportMode } from '@/types/categoryTypes';
import { getCategoryIcon } from '@/utils/categoryIcons';

interface TransportModeSelectorProps {
  value: TransportMode;
  onChange: (value: TransportMode) => void;
  className?: string;
}

export function TransportModeSelector({ 
  value, 
  onChange,
  className 
}: TransportModeSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const selectedMode = transportModesWithColors.find(mode => mode.id === value);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${className}`}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: selectedMode?.color || '#3b82f6' }}
            />
            <span>{selectedMode?.name || 'Sélectionner'}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un mode de transport..." />
          <CommandEmpty>Aucun mode trouvé.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {transportModesWithColors.map((mode) => (
                <CommandItem
                  key={mode.id}
                  value={mode.name}
                  onSelect={() => {
                    onChange(mode.id);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(mode.id, "h-4 w-4", mode.color) || (
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: mode.color }}
                      />
                    )}
                    <span>{mode.name}</span>
                  </div>
                  {value === mode.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
