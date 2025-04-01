
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface Result {
  id: string;
  name: string;
  address: string;
  category: string;
  distance: number;
  duration: number;
  latitude: number;
  longitude: number;
}

interface PrintableViewProps {
  results: Result[];
  mapUrl: string;
  onClose: () => void;
}

const PrintableView: React.FC<PrintableViewProps> = ({ 
  results, 
  mapUrl, 
  onClose 
}) => {
  const { t } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    documentTitle: `${t('searchResults')} - ${new Date().toLocaleDateString()}`,
    onAfterPrint: () => {
      console.log('Print completed');
    },
    // Use the correct property according to react-to-print API
    contentRef: printRef,
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">{t('printableView')}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="overflow-auto flex-grow p-4">
          <div ref={printRef} className="print:p-0 print:shadow-none">
            {/* Map Preview */}
            <div className="mb-6 border rounded-lg overflow-hidden">
              <img 
                src={mapUrl} 
                alt="Map preview" 
                className="w-full h-[300px] object-cover"
              />
            </div>
            
            {/* Results List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('results')}</h3>
              
              {results.map((result) => (
                <div 
                  key={result.id}
                  className="p-4 border rounded-lg shadow-sm"
                >
                  <h4 className="font-medium">{result.name}</h4>
                  <p className="text-gray-600">{result.address}</p>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>{result.distance.toFixed(1)} km</span>
                    <span>{result.duration} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <Button 
            className="w-full" 
            onClick={() => handlePrint()}
          >
            {t('print') || 'Imprimer'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrintableView;
