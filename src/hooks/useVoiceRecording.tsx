
import { useState } from 'react';

interface UseVoiceRecordingProps {
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  onTextResult?: (text: string) => void;
}

export const useVoiceRecording = ({ isRecording, setIsRecording, onTextResult }: UseVoiceRecordingProps) => {
  const handleMicClick = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      console.log("Démarrage de l'enregistrement...");
      // Code pour démarrer l'enregistrement
    } else {
      console.log("Arrêt de l'enregistrement...");
      // Code pour arrêter l'enregistrement
      // Simulate text result for demo purposes
      if (onTextResult) {
        setTimeout(() => {
          onTextResult("Résultat de transcription simulé");
        }, 1000);
      }
    }
  };

  return { handleMicClick };
};

export default useVoiceRecording;
