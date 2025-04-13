
import React, { useState } from 'react';
import { Printer, Download, Share2, ImageIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PrintControlProps {
  title?: string;
  mapElementSelector?: string;
  includeResults?: boolean;
}

const PrintControl = ({
  title = 'Résultats de recherche',
  mapElementSelector = '.map-container',
  includeResults = true,
}: PrintControlProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: 'pdf' | 'image') => {
    setIsExporting(true);
    
    try {
      const mapElement = document.querySelector(mapElementSelector) as HTMLElement;
      
      if (!mapElement) {
        toast.error("Impossible de trouver l'élément carte");
        return;
      }
      
      // Take screenshot of the map
      const canvas = await html2canvas(mapElement, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
      });
      
      if (type === 'image') {
        // Export as image
        const link = document.createElement('a');
        link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success('Image exportée avec succès!');
      } else if (type === 'pdf') {
        // Create PDF
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
        });
        
        // Add title
        pdf.setFontSize(20);
        pdf.text(title, 15, 15);
        
        // Add date
        pdf.setFontSize(10);
        pdf.text(`Exporté le ${new Date().toLocaleDateString()}`, 15, 22);
        
        // Add map image
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 270;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 15, 30, imgWidth, imgHeight);
        
        // Add search results if needed
        if (includeResults) {
          const resultsElement = document.querySelector('.search-results') as HTMLElement;
          if (resultsElement) {
            const resultsCanvas = await html2canvas(resultsElement, {
              useCORS: true,
              allowTaint: true,
            });
            
            pdf.addPage();
            pdf.setFontSize(18);
            pdf.text('Liste des résultats', 15, 15);
            
            const resultsImgData = resultsCanvas.toDataURL('image/png');
            const resultsWidth = 270;
            const resultsHeight = (resultsCanvas.height * resultsWidth) / resultsCanvas.width;
            pdf.addImage(resultsImgData, 'PNG', 15, 25, resultsWidth, resultsHeight);
          }
        }
        
        // Save PDF
        pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
        toast.success('PDF exporté avec succès!');
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Une erreur est survenue lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="print-control">
      <h3 className="text-sm font-medium mb-3">Exporter</h3>
      
      <div className="flex gap-2">
        <Button 
          onClick={() => handleExport('image')} 
          variant="outline" 
          size="sm"
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          <ImageIcon size={16} />
          Image
        </Button>
        
        <Button 
          onClick={() => handleExport('pdf')} 
          variant="outline" 
          size="sm"
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          <FileText size={16} />
          PDF
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Share2 size={16} />
              Partager
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => {
              toast.success('Lien copié dans le presse-papier');
              navigator.clipboard.writeText(window.location.href);
            }}>
              Copier le lien
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              toast('Fonction non implémentée');
            }}>
              Envoyer par e-mail
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PrintControl;
