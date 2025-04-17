
import React from 'react';

// Convertit une chaîne d'emoji en un composant fonctionnel React
export const createEmojiIcon = (emoji: string): React.FC => {
  const EmojiIcon: React.FC = () => <span>{emoji}</span>;
  return EmojiIcon;
};
