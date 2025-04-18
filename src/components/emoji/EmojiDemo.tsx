
import React from 'react';
import { HeartIcon, StarIcon, EmojiLibrary } from './EmojiIcons';

const EmojiDemo: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Démo des Emojis</h2>
      
      <div className="space-y-4">
        {/* Utilisation simple */}
        <div className="flex items-center gap-2">
          <HeartIcon ariaLabel="J'aime" style={{ color: 'red' }} />
          <span>Utilisation simple d'un emoji</span>
        </div>

        {/* Utilisation avancée */}
        <div>
          <h3 className="text-lg mb-2">Bibliothèque d'emojis</h3>
          <EmojiLibrary size="lg" theme="dark" />
        </div>
      </div>
    </div>
  );
};

export default EmojiDemo;

