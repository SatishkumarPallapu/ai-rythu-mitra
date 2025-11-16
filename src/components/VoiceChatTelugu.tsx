import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const VoiceChatTelugu = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'te-IN'; // Telugu
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          handleVoiceCommand(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceCommand = async (text: string) => {
    try {
      setIsSpeaking(true);
      // TODO: Integrate with AI to process Telugu voice commands
      // For now, just echo back
      const response = `మీరు చెప్పారు: ${text}`;
      speakText(response);
    } catch (error) {
      console.error('Error processing voice command:', error);
      toast({
        title: "Error",
        description: "Failed to process voice command",
        variant: "destructive",
      });
    } finally {
      setIsSpeaking(false);
    }
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'te-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      toast({
        title: "వినడం ప్రారంభమైంది",
        description: "తెలుగులో మాట్లాడండి...",
      });
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">తెలుగు వాయిస్ చాట్</h3>
        {isSpeaking && (
          <div className="flex items-center gap-2 text-primary animate-pulse">
            <Volume2 className="w-5 h-5" />
            <span className="text-sm">మాట్లాడుతోంది...</span>
          </div>
        )}
      </div>

      {transcript && (
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">మీరు చెప్పారు:</p>
          <p className="mt-1">{transcript}</p>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={toggleListening}
          className={`rounded-full w-20 h-20 ${
            isListening ? 'bg-destructive hover:bg-destructive/90 animate-pulse' : ''
          }`}
        >
          {isListening ? (
            <MicOff className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {isListening ? 'మాట్లాడుతున్నారా...' : 'మాట్లాడడానికి బటన్‌ను నొక్కండి'}
      </p>
    </Card>
  );
};

export default VoiceChatTelugu;
