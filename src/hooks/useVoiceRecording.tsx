
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface UseVoiceRecordingProps {
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  onTextResult?: (text: string) => void;
}

export const useVoiceRecording = ({ isRecording, setIsRecording, onTextResult }: UseVoiceRecordingProps) => {
  const recognition = useRef<any>(null);
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'fr-FR'; // Set to French

      // Set up callbacks
      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (onTextResult) {
          onTextResult(transcript);
        }
        setIsRecording(false);
      };

      recognition.current.onerror = (event: any) => {
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
