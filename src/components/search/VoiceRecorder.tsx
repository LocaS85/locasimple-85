import React from 'react';

interface VoiceRecorderProps {
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  setIsRecording,
}) => {
  return (
    <React.Fragment>
      {/* This component is deprecated and its functionality has been moved to useVoiceRecording */}
    </React.Fragment>
  );
};

// This export is kept for backward compatibility
export const useVoiceRecorder = (isRecording: boolean, setIsRecording: (recording: boolean) => void) => {
  console.warn('useVoiceRecorder is deprecated. Use useVoiceRecording instead.');
  
  const handleMicClick = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      console.log("Démarrage de l'enregistrement...");
      // Code pour démarrer l'enregistrement
    } else {
      console.log("Arrêt de l'enregistrement...");
      // Code pour arrêter l'enregistrement
    }
  };

  return { handleMicClick };
};

export default VoiceRecorder;
