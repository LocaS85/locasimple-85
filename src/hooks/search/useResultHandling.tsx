
import { useCallback } from 'react';
import { Result } from '@/components/ResultsList';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface UseResultHandlingProps {
  setPopupInfo?: (info: any) => void;
  setViewport?: (viewport: any) => void;
  setShowRoutes?: (show: boolean) => void;
}

export const useResultHandling = (
  setPopupInfo?: (info: any) => void,
  setViewport?: (viewport: any) => void,
  setShowRoutes?: (show: boolean) => void
) => {
  const handleResultClick = useCallback((result: Result) => {
    if (setPopupInfo) {
      setPopupInfo({
        id: result.id,
        name: result.name,
        lat: result.latitude,
        lon: result.longitude,
        address: result.address,
        category: result.category
      });
    }
    
    if (setViewport) {
      setViewport({
        latitude: result.latitude,
        longitude: result.longitude,
        zoom: 14,
      });
    }
  }, [setPopupInfo, setViewport]);

  const toggleRoutes = useCallback(() => {
    if (setShowRoutes) {
      setShowRoutes(prev => !prev);
    }
  }, [setShowRoutes]);

  const generatePDF = useCallback(async () => {
    try {
      const mapElement = document.querySelector('.mapboxgl-map');
      if (!mapElement) {
        toast.error('La carte n\'a pas pu être capturée');
        return;
      }
      
      toast.info('Création du PDF en cours...');
      
      const canvas = await html2canvas(mapElement as HTMLElement, { 
        useCORS: true,
        allowTaint: true
      });
      
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('carte.pdf');
      
      toast.success('PDF créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  }, []);

  return {
    handleResultClick,
    toggleRoutes,
    generatePDF
  };
};

export default useResultHandling;
