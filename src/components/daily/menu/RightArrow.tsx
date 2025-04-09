
import React, { useContext } from 'react';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const RightArrow: React.FC = () => {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

  return (
    <div className="flex items-center ml-1">
      <Button
        variant="ghost"
        size="icon"
        disabled={isLastItemVisible}
        onClick={() => scrollNext()}
        className="cursor-pointer h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default RightArrow;
