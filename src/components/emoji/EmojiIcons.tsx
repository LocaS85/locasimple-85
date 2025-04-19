
import React from 'react';
import { createEmojiIcon } from '@/utils/iconHelpers';

// 1. Création des icônes
export const HeartIcon = createEmojiIcon('❤️');
export const StarIcon = createEmojiIcon('⭐');
export const WarningIcon = createEmojiIcon('⚠️');

// 2. Composant démo
interface EmojiLibraryProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
}

export const EmojiLibrary: React.FC<EmojiLibraryProps> = ({
  size = 'md',
  theme = 'light'
}) => {
  const sizeMap = {
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem'
  };

  return (
    <div className={`emoji-library ${theme}`} style={{
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      background: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333'
    }}>
      <HeartIcon 
        ariaLabel="Coeur rouge" 
        style={{ fontSize: sizeMap[size] }} 
        data-testid="heart-icon"
      />
      
      <StarIcon 
        className="twinkling-star"
        style={{ 
          fontSize: sizeMap[size],
          filter: 'drop-shadow(0 0 2px gold)'
        }}
      />
      
      <WarningIcon 
        title="Attention"
        style={{ 
          fontSize: sizeMap[size],
          color: theme === 'dark' ? 'gold' : 'darkorange'
        }}
      />
    </div>
  );
};
