
import React, { memo, ReactNode } from 'react';

// Type étendu pour une meilleure compatibilité
type EmojiIconComponent = React.FC<{
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  title?: string;
  [key: string]: any; // Pour les props HTML supplémentaires
}>;

/**
 * Crée un composant Emoji compatible avec tous les projets React
 * @param emoji - L'emoji ou texte à afficher
 * @returns Un composant React optimisé
 */
export const createEmojiIcon = (emoji: string): EmojiIconComponent => {
  const displayEmoji = emoji || '❓'; // Fallback par défaut

  const EmojiIcon: EmojiIconComponent = memo(({
    className = '',
    style = {},
    ariaLabel,
    title,
    children,
    ...props
  }) => (
    <span
      {...props}
      role="img"
      aria-label={ariaLabel || title || `emoji ${displayEmoji}`}
      title={title}
      className={`emoji-icon ${className}`}
      style={{ 
        display: 'inline-block',
        lineHeight: '1em',
        ...style 
      }}
    >
      {displayEmoji}
      {children}
    </span>
  ));

  EmojiIcon.displayName = `EmojiIcon(${displayEmoji})`;
  return EmojiIcon;
};
