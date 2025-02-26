
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, Bike, User, Bus, Train } from 'lucide-react';

interface TransportMode {
  name: string;
  icon: JSX.Element;
  color: string;
}

interface TransportSectionProps {
  selectedTransports: string[];
  onTransportClick: (transport: string) => void;
}

const TransportSection = ({ selectedTransports, onTransportClick }: TransportSectionProps) => {
  const transportModes: TransportMode[] = [
    { name: "Voiture", icon: <Car className="h-4 w-4 mr-2" />, color: "bg-blue-500" },
    { name: "Vélo", icon: <Bike className="h-4 w-4 mr-2" />, color: "bg-green-500" },
    { name: "À pied", icon: <User className="h-4 w-4 mr-2" />, color: "bg-yellow-500" },
    { name: "Transport en commun", icon: <Bus className="h-4 w-4 mr-2" />, color: "bg-purple-500" },
    { name: "Train", icon: <Train className="h-4 w-4 mr-2" />, color: "bg-red-500" }
  ];

  return (
    <div className="px-4 py-3">
      <div className="flex flex-wrap gap-2">
        {transportModes.map((mode, index) => (
          <Button 
            key={index}
            onClick={() => onTransportClick(mode.name)}
            className={`flex items-center px-4 py-2 rounded-full transition-colors ${
              selectedTransports.includes(mode.name)
                ? `${mode.color} text-white`
                : 'bg-white text-black border-2 border-black hover:bg-gray-100'
            }`}
          >
            {mode.icon}
            {mode.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TransportSection;
