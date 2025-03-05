
import { useState } from 'react';

interface UseVoiceRecordingProps {
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

export const useVoiceRecording = ({ isRecording, setIsRecording }: UseVoiceRecordingProps) => {
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

export default useVoiceRecording;
