
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Image, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface PrintExportControlProps {
  onExport?: (format: string, options: any) => void;
}

const PrintExportControl: React.FC<PrintExportControlProps> = ({
  onExport = () => {}
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [includeOptions, setIncludeOptions] = useState({
    map: true,
    filters: true,
    legend: true
  });

  const handleExport = (format: string) => {
    onExport(format, includeOptions);
  };

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <button 
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">Exporter</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isOpen && (
        <div className="p-4 space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={includeOptions.map} 
                onChange={() => setIncludeOptions(prev => ({...prev, map: !prev.map}))}
                className="rounded border-gray-300"
              />
              <span>Inclure la carte</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={includeOptions.filters} 
                onChange={() => setIncludeOptions(prev => ({...prev, filters: !prev.filters}))}
                className="rounded border-gray-300"
              />
              <span>Inclure les filtres</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={includeOptions.legend} 
                onChange={() => setIncludeOptions(prev => ({...prev, legend: !prev.legend}))}
                className="rounded border-gray-300"
              />
              <span>Inclure la légende</span>
            </label>
          </div>
          
          <div className="flex justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="px-4">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('image')}>
                  <Image className="mr-2 h-4 w-4" />
                  Image
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="default" onClick={() => window.print()}>
              Imprimer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintExportControl;
