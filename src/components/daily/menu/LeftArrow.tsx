
import React, { useContext } from 'react';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const LeftArrow: React.FC = () => {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

  return (
    <div className="flex items-center mr-1">
      <Button
        variant="ghost"
        size="icon"
        disabled={isFirstItemVisible}
        onClick={() => scrollPrev()}
        className="cursor-pointer h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default LeftArrow;
