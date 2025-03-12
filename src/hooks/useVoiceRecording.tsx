
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface UseVoiceRecordingProps {
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  onTextResult?: (text: string) => void;
}

// Définition des types pour SpeechRecognition
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

// Déclaration globale pour accéder aux objets SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

export const useVoiceRecording = ({ isRecording, setIsRecording, onTextResult }: UseVoiceRecordingProps) => {
  const recognition = useRef<SpeechRecognition | null>(null);
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      recognition.current = new SpeechRecognitionAPI();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'fr-FR'; // Set to French

      // Set up callbacks
      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        if (onTextResult) {
          onTextResult(transcript);
        }
        setIsRecording(false);
      };

      recognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        toast.error(`Erreur de reconnaissance vocale: ${event.error}`);
        setIsRecording(false);
      };

      recognition.current.onend = () => {
        setIsRecording(false);
      };

      setIsRecognitionSupported(true);
    } else {
      setIsRecognitionSupported(false);
      console.warn('Speech recognition is not supported in this browser');
    }

    return () => {
      if (recognition.current) {
        try {
          recognition.current.stop();
        } catch (e) {
          // Ignore errors when stopping already stopped recognition
        }
      }
    };
  }, [setIsRecording, onTextResult]);

  // Start or stop recognition based on isRecording state
  useEffect(() => {
    if (isRecording && recognition.current) {
      try {
        recognition.current.start();
        toast.info("Parlez maintenant...");
      } catch (error) {
        console.error("Couldn't start recording:", error);
        setIsRecording(false);
        toast.error("Impossible de démarrer l'enregistrement");
      }
    } else if (!isRecording && recognition.current) {
      try {
        recognition.current.stop();
      } catch (error) {
        // Ignore errors when stopping
      }
    }
  }, [isRecording, setIsRecording]);

  const handleMicClick = () => {
    if (!isRecognitionSupported) {
      toast.error("La reconnaissance vocale n'est pas supportée par votre navigateur");
      return;
    }
    
    setIsRecording(!isRecording);
  };

  return { handleMicClick, isRecognitionSupported };
};

export default useVoiceRecording;
