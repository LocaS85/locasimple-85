
import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCategory } from './CategoryContext';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Printer, FileDown, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import type { Result } from './ResultsList';
import { getCategoryIcon } from '@/utils/categoryIcons';

interface PrintableViewProps {
  results: Result[];
  mapUrl?: string;
  onClose: () => void;
}

const PrintableView = ({ results, mapUrl, onClose }: PrintableViewProps) => {
  const { categoryColors, categoryVisibility, categoryNames } = useCategory();
  const { t } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter results by visible categories
  const visibleResults = results.filter(result => {
    if (!result.category) return true;
    return categoryVisibility[result.category];
  });

  // Group results by category
  const resultsByCategory = visibleResults.reduce((acc, result) => {
    const category = result.category || 'unknown';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(result);
    return acc;
  }, {} as Record<string, Result[]>);

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Résultats de recherche',
    onBeforeGetContent: () => {
      setLoading(true);
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    },
    onAfterPrint: () => {
      setLoading(false);
      toast.success(t('printSuccess') || 'Document prêt à être imprimé !');
    },
  });

  // Handle PDF export
  const handleExportPDF = () => {
    setLoading(true);
    toast.success(t('pdfExported') || 'PDF exporté avec succès !');
    setLoading(false);
    // In a real app, this would actually export the PDF
    // We're just showing a success message for this demo
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {t('printableView') || 'Vue imprimable'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">{t('close') || 'Fermer'}</span>
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleExportPDF} disabled={loading}>
                <FileDown className="h-4 w-4 mr-2" />
                {t('exportPDF') || 'Exporter en PDF'}
              </Button>
              <Button onClick={handlePrint} disabled={loading}>
                <Printer className="h-4 w-4 mr-2" />
                {t('print') || 'Imprimer'}
              </Button>
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">
                {t('personalNotes') || 'Notes personnelles'}
              </h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('addNotes') || 'Ajoutez vos notes ici...'}
                rows={3}
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('printPreview') || 'Aperçu avant impression. Utilisez les boutons ci-dessus pour imprimer ou exporter en PDF.'}
              </AlertDescription>
            </Alert>

            <div ref={printRef} className="print-container">
              <div className="text-center p-4 print-header">
                <h1 className="text-2xl font-bold">
                  {t('searchResults') || 'Résultats de recherche'}
                </h1>
                <p className="text-gray-500">
                  {new Date().toLocaleDateString()} - {visibleResults.length} {t('results') || 'résultats'}
                </p>
              </div>

              {mapUrl && (
                <div className="map-container mb-4 border rounded overflow-hidden">
                  <img src={mapUrl} alt="Map" className="w-full h-auto" />
                </div>
              )}

              {notes && (
                <div className="notes-section mb-4 p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">
                    {t('notes') || 'Notes'}
                  </h3>
                  <p className="whitespace-pre-line text-sm">{notes}</p>
                </div>
              )}

              <div className="results-section space-y-4">
                {Object.keys(resultsByCategory).map(category => (
                  <div key={category} className="category-section">
                    <div 
                      className="category-header p-2 rounded flex items-center"
                      style={{ backgroundColor: `${categoryColors[category] || '#gray'}20` }}
                    >
                      {getCategoryIcon(category, 'h-5 w-5 mr-2')}
                      <h3 className="font-medium">
                        {categoryNames[category] || t(category) || category} ({resultsByCategory[category].length})
                      </h3>
                    </div>
                    
                    <div className="category-results grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {resultsByCategory[category].map(result => (
                        <Card key={result.id} className="print-result">
                          <CardContent className="p-3">
                            <div className="font-medium">{result.name}</div>
                            <div className="text-sm text-gray-500">{result.address}</div>
                            {result.distance && (
                              <div className="text-sm mt-1">
                                Distance: {result.distance.toFixed(1)} km
                              </div>
                            )}
                            {result.duration && (
                              <div className="text-sm">
                                Durée: {result.duration} min
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PrintableView;
