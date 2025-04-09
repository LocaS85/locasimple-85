
import React, { useState, ReactNode, useContext, useMemo } from 'react';
import { 
  ScrollMenu, 
  VisibilityContext
} from 'react-horizontal-scrolling-menu';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LeftArrow from './LeftArrow';
import RightArrow from './RightArrow';

type Props = {
  children: ReactNode;
  className?: string;
};

// Define the type for items that can be rendered in the ScrollMenu
type ValidChild = React.ReactElement<{ itemId?: string }>;

const HorizontalScrollMenu = ({ children, className = '' }: Props) => {
  // Make sure children have itemId by wrapping them
  const wrappedChildren = useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    return childrenArray.map((child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as ValidChild, { 
          ...child.props,
          itemId: (child as ValidChild).props.itemId || `item-${index}` // Add the required itemId prop if not present
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
