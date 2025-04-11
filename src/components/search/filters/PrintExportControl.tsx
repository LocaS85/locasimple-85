
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Printer, FileImage, FilePdf, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ExportFormat {
  id: string;
  label: string;
  icon: React.ReactNode;
  handler?: () => void;
}

interface PrintExportControlProps {
  formats?: ExportFormat[];
  includeMap?: boolean;
  includeFilters?: boolean;
  includeLegend?: boolean;
  onExport?: (format: string, options: { map: boolean; filters: boolean; legend: boolean }) => void;
}

const DEFAULT_EXPORT_FORMATS: ExportFormat[] = [
  { id: 'pdf', label: 'PDF', icon: <FilePdf size={18} /> },
  { id: 'image', label: 'Image', icon: <FileImage size={18} /> }
];

const PrintExportControl: React.FC<PrintExportControlProps> = ({
  formats = DEFAULT_EXPORT_FORMATS,
  includeMap = true,
  includeFilters = true,
  includeLegend = false,
  onExport
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({
    map: includeMap,
    filters: includeFilters,
    legend: includeLegend
  });

  const handleExport = (formatId: string) => {
    if (onExport) {
      onExport(formatId, options);
    } else {
      // Fallback if no handler is provided
      toast.info(`Exporting in ${formatId} format with options: ${JSON.stringify(options)}`);
    }
  };

  const toggleOption = (option: keyof typeof options) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <button 
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Printer size={16} />
          <span className="font-medium">Exporter</span>
        </div>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isOpen && (
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Options</div>
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.map} 
                  onChange={() => toggleOption('map')}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                Inclure la carte
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.filters} 
                  onChange={() => toggleOption('filters')}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                Inclure les filtres
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.legend} 
                  onChange={() => toggleOption('legend')}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                Inclure la légende
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {formats.map(format => (
              <button
                key={format.id}
                className="flex items-center justify-center gap-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors"
                onClick={() => format.handler ? format.handler() : handleExport(format.id)}
              >
                {format.icon}
                <span>{format.label}</span>
              </button>
            ))}
          </div>
          
          <button
            className="w-full flex items-center justify-center gap-2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            onClick={() => handleExport('pdf')}
          >
            <Download size={18} />
            <span>Télécharger</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PrintExportControl;
