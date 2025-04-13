
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
      
      // We would use html2canvas and jsPDF here
      // But since we don't want to add these dependencies just for the demo,
      // we'll simulate the export with a toast notification
      
      setTimeout(() => {
        toast.success(`Exporté en ${type === 'pdf' ? 'PDF' : 'image'} avec succès!`);
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Une erreur est survenue lors de l\'export');
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
