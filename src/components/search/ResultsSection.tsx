
import React from 'react';
import { List, MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResultsList from '@/components/ResultsList';
import ResultDetail from '@/components/search/ResultDetail';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Result } from '@/components/ResultsList';

interface ResultsSectionProps {
  results: Result[];
  loading: boolean;
  selectedResult: Result | null;
  onResultClick: (result: Result) => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  results,
  loading,
  selectedResult,
  onResultClick
}) => {
  const { t } = useLanguage();
  const [view, setView] = React.useState<'map' | 'list'>('map');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="font-semibold text-lg mb-4">{t('results')}</h2>
        <div className="bg-gray-50 p-4 rounded-lg h-[500px] overflow-y-auto">
          <ResultsList 
            results={results} 
            onResultClick={onResultClick} 
            selectedResultId={selectedResult?.id}
          />
        </div>
      </div>
      
      <div className="lg:col-span-3 space-y-4">
        <div className="flex justify-center lg:hidden mb-4 bg-white rounded-lg shadow-sm p-2">
          <div className="inline-flex rounded-md shadow-sm">
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              className="rounded-l-md rounded-r-none"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4 mr-2" />
              {t('list_view')}
            </Button>
            <Button
              variant={view === 'map' ? 'default' : 'outline'}
              className="rounded-r-md rounded-l-none"
              onClick={() => setView('map')}
            >
              <MapIcon className="h-4 w-4 mr-2" />
              {t('map_view')}
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold">
            {loading ? (
              <span>{t('searching')}...</span>
            ) : (
              <span>{results.length} {t('results_found')}</span>
            )}
          </h2>
          
          <ResultDetail result={selectedResult} />
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
