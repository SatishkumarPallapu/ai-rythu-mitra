import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import VoiceChatTelugu from "@/components/VoiceChatTelugu";
import { Card } from "@/components/ui/card";
import { MessageCircle, Sparkles } from "lucide-react";

const VoiceAssistant = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="w-7 h-7 text-primary" />
            Voice Assistant
          </h2>
          <p className="text-muted-foreground">
            Talk to our AI assistant in Telugu for farming guidance
          </p>
        </div>

        <VoiceChatTelugu />

        <Card className="p-6 bg-gradient-subtle">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">What can I help you with?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• పంట సిఫార్సులు (Crop recommendations)</li>
                <li>• నేల విశ్లేషణ (Soil analysis)</li>
                <li>• వాతావరణ సమాచారం (Weather information)</li>
                <li>• వ్యాధుల నిర్ధారణ (Disease diagnosis)</li>
                <li>• విత్తన సలహాలు (Seed suggestions)</li>
                <li>• మార్కెట్ ధరలు (Market prices)</li>
                <li>• నీటి నిర్వహణ (Water management)</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default VoiceAssistant;
