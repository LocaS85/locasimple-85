
import React from 'react';

interface VoiceRecorderProps {
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  setIsRecording,
}) => {
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

  return (
    <React.Fragment>
      {/* This is a utility component that only provides functionality */}
    </React.Fragment>
  );
};

// Export the handler separately
export const useVoiceRecorder = (isRecording: boolean, setIsRecording: (recording: boolean) => void) => {
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
