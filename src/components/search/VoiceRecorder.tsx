
import React, { useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  setIsRecording,
}) => {
  // Modern implementation of voice recording component
  useEffect(() => {
    let recognition: any = null;
    
    if (isRecording) {
      // Check browser support
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.lang = 'fr-FR';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = () => {
          console.log('Voice recognition started');
          toast.success('Reconnaissance vocale activée');
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          toast.error(`Erreur: ${event.error}`);
          setIsRecording(false);
        };
        
        recognition.onend = () => {
          setIsRecording(false);
          console.log('Voice recognition ended');
        };
        
        recognition.start();
      } else {
        toast.error('La reconnaissance vocale n\'est pas supportée sur ce navigateur');
        setIsRecording(false);
      }
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isRecording, setIsRecording]);
  
  return (
    <div className="flex items-center">
      <button
        onClick={() => setIsRecording(!isRecording)}
        className={`rounded-full p-2 transition-colors ${
          isRecording 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
        aria-label={isRecording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement vocal"}
      >
        {isRecording ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </button>
      {isRecording && (
        <div className="ml-2 text-sm text-red-500 flex items-center">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Enregistrement...
        </div>
      )}
    </div>
  );
};

export const useVoiceRecorder = (isRecording: boolean, setIsRecording: (recording: boolean) => void) => {
  console.warn('useVoiceRecorder is deprecated. Use useVoiceRecording instead.');
  
  const handleMicClick = () => {
    setIsRecording(!isRecording);
  };

  return { handleMicClick };
};

export default VoiceRecorder;
