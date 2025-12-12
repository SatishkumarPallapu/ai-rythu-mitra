import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import IntelligentFarmingChat from "@/components/IntelligentFarmingChat";
import { Card } from "@/components/ui/card";
import { Bot, TrendingUp, Sparkles, Brain } from "lucide-react";

const VoiceAssistant = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Bot className="w-7 h-7 text-green-600" />
            🤖 AI Farm Business Advisor
          </h2>
          <p className="text-muted-foreground">
            Your intelligent farming consultant - Voice & Text in Telugu, Hindi & English
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <Brain className="w-4 h-4" />
              Smart Advice
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              <TrendingUp className="w-4 h-4" />
              Profit Focus
            </div>
            <div className="flex items-center gap-1 text-purple-600">
              <Sparkles className="w-4 h-4" />
              3 Languages
            </div>
          </div>
        </div>

        <IntelligentFarmingChat />

        <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2 text-green-800">🚀 What makes this AI special?</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-green-700 mb-1">💰 Profit-Focused Advice:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Value addition suggestions</li>
                    <li>• Direct marketing strategies</li>
                    <li>• ROI optimization tips</li>
                    <li>• Market timing advice</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-700 mb-1">🎯 Context-Aware Help:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Uses your crop data</li>
                    <li>• Real-time market prices</li>
                    <li>• Weather-based advice</li>
                    <li>• Problem-solving support</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Pro Tip:</strong> Ask "What should I do today?" for personalized daily farming advice based on your current crops and market conditions!
                </p>
              </div>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default VoiceAssistant;
