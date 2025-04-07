
import React, { useEffect, useState } from 'react';
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
  const [animationActive, setAnimationActive] = useState(false);
  const [supported, setSupported] = useState(true);
  
  // Check for browser support on mount
  useEffect(() => {
    const isSpeechRecognitionSupported = 
      'webkitSpeechRecognition' in window || 
      'SpeechRecognition' in window;
      
    setSupported(isSpeechRecognitionSupported);
    
    if (!isSpeechRecognitionSupported) {
      console.warn('Speech recognition is not supported in this browser');
    }
  }, []);
  
  // Animation effect for recording state
  useEffect(() => {
    if (isRecording) {
      setAnimationActive(true);
    }
  }, [isRecording]);

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
          toast.success('Reconnaissance vocale activée', {
            position: 'bottom-center',
            duration: 2000,
          });
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          toast.error(`Erreur: ${event.error}`, {
            position: 'bottom-center',
            duration: 3000,
          });
          setIsRecording(false);
        };
        
        recognition.onend = () => {
          setIsRecording(false);
          console.log('Voice recognition ended');
        };
        
        recognition.start();
      } else {
        toast.error('La reconnaissance vocale n\'est pas supportée sur ce navigateur', {
          position: 'bottom-center',
          duration: 3000,
        });
        setIsRecording(false);
      }
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isRecording, setIsRecording]);

  // Handle click with better touch support
  const handleClick = () => {
    if (!supported) {
      toast.error('La reconnaissance vocale n\'est pas supportée sur ce navigateur', {
        position: 'bottom-center',
        duration: 3000,
      });
      return;
    }
    setIsRecording(!isRecording);
  };
  
  return (
    <div className="flex items-center">
      <button
        onClick={handleClick}
        className={`rounded-full p-2 transition-colors min-w-[44px] min-h-[44px] touch-target ${
          isRecording 
            ? 'bg-red-500 text-white animate-pulse' 
            : supported ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        aria-label={isRecording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement vocal"}
        disabled={!supported}
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
          <span className="hidden xs:inline">Enregistrement...</span>
        </div>
      )}
      {!supported && (
        <div className="ml-2 text-xs text-gray-500 hidden sm:block">
          Non supporté sur ce navigateur
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
