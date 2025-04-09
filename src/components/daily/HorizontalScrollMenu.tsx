
import React, { useState, ReactNode, useContext, useMemo } from 'react';
import { 
  ScrollMenu, 
  VisibilityContext, 
  type VisibilityContextType
} from 'react-horizontal-scrolling-menu';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

type Props = {
  children: ReactNode;
  className?: string;
};

const LeftArrow = () => {
  const { isFirstItemVisible, scrollPrev } = 
    useContext<VisibilityContextType>(VisibilityContext);

  return (
    <button
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
      className={`flex items-center justify-center p-2 rounded-full bg-white shadow-md mr-2 ${
        isFirstItemVisible ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
      }`}
      aria-label="Scroll left"
    >
      <ChevronLeft size={20} />
    </button>
  );
};

const RightArrow = () => {
  const { isLastItemVisible, scrollNext } = 
    useContext<VisibilityContextType>(VisibilityContext);

  return (
    <button
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
      className={`flex items-center justify-center p-2 rounded-full bg-white shadow-md ml-2 ${
        isLastItemVisible ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
      }`}
      aria-label="Scroll right"
    >
      <ChevronRight size={20} />
    </button>
  );
};

const HorizontalScrollMenu = ({ children, className = '' }: Props) => {
  // Make sure children have itemId by wrapping them
  const wrappedChildren = useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    return childrenArray.map((child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { 
          ...child.props,
          itemId: `item-${index}` // Add the required itemId prop
        });
      }
      return child;
    });
  }, [children]);

  return (
    <div className={`w-full ${className}`}>
      <ScrollMenu
        LeftArrow={LeftArrow}
        RightArrow={RightArrow}
        wrapperClassName="flex items-center"
        scrollContainerClassName="py-1"
      >
        {wrappedChildren}
      </ScrollMenu>
    </div>
  );
};

export default HorizontalScrollMenu;
