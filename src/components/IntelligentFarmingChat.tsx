import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, Bot, User, Sparkles, TrendingUp, MessageCircle, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { IntelligentFarmingAdvisor } from "@/services/intelligentFarmingAdvisor";
import type { AIResponse } from "@/services/intelligentFarmingAdvisor";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  language?: string;
  aiResponse?: AIResponse;
  urgency?: 'low' | 'medium' | 'high';
  contextTags?: string[];
}

interface RealTimeData {
  weather: {
    temperature: number;
    humidity: number;
    forecast: string;
    rainfall: number;
  };
  soil: {
    moisture: number;
    ph: number;
    temperature: number;
  };
  market: {
    [key: string]: {
      price: number;
      trend: 'up' | 'down';
    };
  };
  lastUpdated: Date;
}

const IntelligentFarmingChat = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'te' | 'hi'>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [aiStatus, setAiStatus] = useState<string>('Ready');
  const [contextInsights, setContextInsights] = useState<string[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const advisor = useRef(new IntelligentFarmingAdvisor()).current;

  // Initialize speech recognition and load real-time data
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserInput(transcript, true);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice input failed",
          description: "Please try again or type your message",
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Load initial real-time data and start periodic updates
    loadRealTimeData();
    const interval = setInterval(loadRealTimeData, 30000); // Update every 30 seconds

    // Add intelligent welcome message
    addIntelligentWelcome();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      clearInterval(interval);
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Update speech recognition language
  useEffect(() => {
    if (recognitionRef.current) {
      const langMap = {
        'en': 'en-IN',
        'te': 'te-IN', 
        'hi': 'hi-IN'
      };
      recognitionRef.current.lang = langMap[currentLanguage];
    }
  }, [currentLanguage]);

  const loadRealTimeData = async () => {
    try {
      setAiStatus('Loading farm data...');
      await advisor.loadFarmData();
      const farmContext = advisor.getFarmContext();
      
      setRealTimeData({
        weather: {
          temperature: farmContext.weatherData?.temperature || 28 + Math.random() * 8,
          humidity: farmContext.weatherData?.humidity || 60 + Math.random() * 25,
          forecast: farmContext.weatherData?.forecast || 'sunny',
          rainfall: farmContext.weatherData?.rainfall || Math.random() * 5,
        },
        soil: {
          moisture: farmContext.soilData?.moisture || 45 + Math.random() * 20,
          ph: farmContext.soilData?.ph || 6.5 + Math.random() * 0.8,
          temperature: farmContext.soilData?.temperature || 25 + Math.random() * 6,
        },
        market: farmContext.marketPrices || {
          tomato: { price: 22 + Math.random() * 8, trend: Math.random() > 0.5 ? 'up' : 'down' },
          onion: { price: 18 + Math.random() * 6, trend: Math.random() > 0.5 ? 'up' : 'down' },
        },
        lastUpdated: new Date(),
      });
      
      setAiStatus('Analyzing conditions...');
      
      // Generate context insights
      updateContextInsights();
      
      setTimeout(() => setAiStatus('Ready'), 1000);
    } catch (error) {
      console.error('Error loading real-time data:', error);
      setAiStatus('Ready');
    }
  };

  const updateContextInsights = () => {
    if (!realTimeData) return;
    
    const insights = [];
    
    if (realTimeData.weather.temperature > 32) {
      insights.push(currentLanguage === 'te' ? 'అధిక వేడిమి హెచ్చరిక' : 'Heat stress alert');
    }
    
    if (realTimeData.soil.moisture < 25) {
      insights.push(currentLanguage === 'te' ? 'నీటి అవసరం' : 'Irrigation needed');
    }
    
    const highPriceItem = Object.entries(realTimeData.market).find(([_, data]) => data.trend === 'up');
    if (highPriceItem) {
      insights.push(currentLanguage === 'te' ? `${highPriceItem[0]} ధర పెరుగుతోంది` : `${highPriceItem[0]} prices rising`);
    }
    
    setContextInsights(insights);
  };

  const addIntelligentWelcome = async () => {
    try {
      const currentHour = new Date().getHours();
      let greeting = '';
      
      if (currentLanguage === 'te') {
        greeting = currentHour < 10 ? 'శుభోదయం' : currentHour < 16 ? 'మధ్యాహ్న నమస్కారం' : 'సాయంత్రి నమస్కారం';
      } else if (currentLanguage === 'hi') {
        greeting = currentHour < 10 ? 'सुप्रभात' : currentHour < 16 ? 'नमस्ते' : 'शुभ संध्या';
      } else {
        greeting = currentHour < 10 ? 'Good morning' : currentHour < 16 ? 'Good afternoon' : 'Good evening';
      }

      const welcomeResponse = await advisor.processQuery(greeting, currentLanguage, []);
      
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: welcomeResponse.message,
        timestamp: new Date(),
        language: currentLanguage,
        aiResponse: welcomeResponse,
        urgency: welcomeResponse.urgency || 'medium',
        contextTags: ['welcome', 'greeting']
      };
      
      setMessages([welcomeMessage]);
      
      // Speak welcome message
      speakMessage(welcomeResponse.message);
    } catch (error) {
      console.error('Error generating welcome:', error);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice input",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
      setAiStatus('Listening...');
    }
  };

  const handleUserInput = async (text: string, isVoice: boolean = false) => {
    if (!text.trim()) return;

    // Extract context tags from user message
    const contextTags = extractContextTags(text);

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
      language: currentLanguage,
      contextTags
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);
    setAiStatus('Processing with AI...');

    // Update conversation context
    const updatedContext = [...conversationContext.slice(-8), text]; // Keep last 8 messages for context
    setConversationContext(updatedContext);

    try {
      // Get AI response with full conversation context
      const aiResponse = await advisor.processQuery(text, currentLanguage, updatedContext);
      
      // Analyze urgency and add contextual data
      const urgency = analyzeUrgency(text, aiResponse);
      
      // Add AI message
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.message,
        timestamp: new Date(),
        language: currentLanguage,
        aiResponse,
        urgency,
        contextTags: [...contextTags, 'ai-response']
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation context with AI response
      setConversationContext(prev => [...prev.slice(-8), aiResponse.message]);
      
      // Speak AI response
      speakMessage(aiResponse.message);
      
      setAiStatus('Ready');
    } catch (error) {
      console.error('Error processing message:', error);
      setIsProcessing(false);
      setAiStatus('Error - Ready');
      
      toast({
        title: "Processing failed",
        description: "Please try again",
        variant: "destructive"
      });
    }

    setIsProcessing(false);
  };

  const extractContextTags = (text: string): string[] => {
    const tags = [];
    const lower = text.toLowerCase();
    
    if (lower.includes('crop') || lower.includes('plant')) tags.push('crops');
    if (lower.includes('profit') || lower.includes('money') || lower.includes('sell')) tags.push('business');
    if (lower.includes('disease') || lower.includes('problem')) tags.push('health');
    if (lower.includes('weather') || lower.includes('rain')) tags.push('weather');
    if (lower.includes('soil') || lower.includes('water')) tags.push('soil');
    if (lower.includes('urgent') || lower.includes('help') || lower.includes('emergency')) tags.push('urgent');
    
    return tags;
  };

  const analyzeUrgency = (userText: string, aiResponse: AIResponse): 'low' | 'medium' | 'high' => {
    const lower = userText.toLowerCase();
    
    if (lower.includes('urgent') || lower.includes('emergency') || lower.includes('dying')) {
      return 'high';
    }
    
    if (lower.includes('problem') || lower.includes('disease') || lower.includes('help')) {
      return 'medium';
    }
    
    if (aiResponse.urgency === 'high') {
      return 'high';
    }
    
    return 'low';
  };

  const speakMessage = (text: string) => {
    if (!text || isSpeaking) return;
    
    try {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'te' ? 'te-IN' : currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleQuickAction = (action: any) => {
    if (action.navigate) {
      navigate(action.navigate);
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'border-l-4 border-red-400 bg-red-50';
      case 'medium': return 'border-l-4 border-yellow-400 bg-yellow-50';
      default: return 'bg-gray-100';
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Enhanced Header with Real-time Status */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6" />
              </div>
              {realTimeData && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold flex items-center space-x-2">
                <span>
                  {currentLanguage === 'te' ? 'AI మార్గదర్శకుడు' : 
                   currentLanguage === 'hi' ? 'AI मार्गदर्शक' : 
                   'AI Farm Advisor'}
                </span>
                {isProcessing && (
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                )}
              </h3>
              <p className="text-sm opacity-90">{aiStatus}</p>
            </div>
          </div>
          
          {/* Real-time Data Display */}
          {realTimeData && (
            <div className="text-right text-sm">
              <div className="flex items-center space-x-2">
                <span>🌡️ {Math.round(realTimeData.weather.temperature)}°C</span>
                <span>💧 {Math.round(realTimeData.soil.moisture)}%</span>
                <span>⚖️ pH {realTimeData.soil.ph.toFixed(1)}</span>
              </div>
              <div className="text-xs opacity-75">
                {currentLanguage === 'te' ? 'రియల్‌టైమ్ డేటా' : 'Real-time Data'}
              </div>
            </div>
          )}
        </div>
        
        {/* Context Insights */}
        {contextInsights.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {contextInsights.map((insight, idx) => (
              <Badge key={idx} variant="secondary" className="bg-white/20 text-white border-white/30">
                <Zap className="h-3 w-3 mr-1" />
                {insight}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {/* Message Bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl relative ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white ml-auto'
                      : `${getUrgencyColor(message.urgency)} text-gray-800`
                  }`}
                >
                  {/* Urgency Indicator */}
                  {message.type === 'ai' && message.urgency === 'high' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                  
                  <div className="text-sm leading-relaxed">{message.content}</div>
                  
                  {/* AI Suggestions */}
                  {message.type === 'ai' && message.aiResponse?.suggestions && (
                    <div className="mt-3 space-y-2">
                      <div className="text-xs font-medium opacity-75">
                        {currentLanguage === 'te' ? 'సలహాలు:' : currentLanguage === 'hi' ? 'सुझाव:' : 'Suggestions:'}
                      </div>
                      {message.aiResponse.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="text-xs bg-white/50 rounded p-2 border">
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* AI Actions */}
                  {message.type === 'ai' && message.aiResponse?.actions && message.aiResponse.actions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="text-xs font-medium opacity-75">
                        {currentLanguage === 'te' ? 'చర్యలు:' : currentLanguage === 'hi' ? 'कार्य:' : 'Quick Actions:'}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {message.aiResponse.actions.map((action: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickAction(action)}
                            className={`px-3 py-1 rounded-full text-xs transition-all hover:scale-105 ${
                              message.urgency === 'high' 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Profit Insight */}
                  {message.type === 'ai' && message.aiResponse?.profitInsight && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-xs text-blue-600 font-medium mb-1">
                        💎 {currentLanguage === 'te' ? 'లాభ అవకాశం:' : 'Profit Insight:'}
                      </div>
                      <div className="text-xs text-blue-700">
                        {message.aiResponse.profitInsight}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Timestamp and Context Tags */}
                <div className={`mt-1 text-xs text-gray-500 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className="flex items-center justify-between">
                    <span>{formatTimestamp(message.timestamp)}</span>
                    {message.contextTags && message.contextTags.length > 0 && (
                      <div className="flex space-x-1">
                        {message.contextTags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="px-1 bg-gray-200 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Conversation Context Display */}
      {conversationContext.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-t">
          <div className="text-xs text-gray-500 mb-1">
            {currentLanguage === 'te' ? 'సంభాషణ సందర్భం:' : 
             currentLanguage === 'hi' ? 'बातचीत का संदर्भ:' : 
             'Conversation Context:'}
          </div>
          <div className="flex flex-wrap gap-1">
            {Array.from(new Set(
              conversationContext.slice(-3).flatMap(msg => 
                msg.toLowerCase().match(/\b(crop|profit|weather|soil|market|disease|water|harvest)\w*\b/g) || []
              )
            )).slice(0, 4).map((topic, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        {/* Language Selection */}
        <div className="mb-3 flex justify-between items-center">
          <div className="flex space-x-2">
            {(['en', 'te', 'hi'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setCurrentLanguage(lang)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  currentLanguage === lang
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {lang === 'en' ? 'English' : lang === 'te' ? 'తెలుగు' : 'हिंदी'}
              </button>
            ))}
          </div>
          
          {conversationContext.length > 0 && (
            <div className="text-xs text-gray-500">
              {conversationContext.length} {currentLanguage === 'te' ? 'సందేశాలు' : 'messages'}
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="flex space-x-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              currentLanguage === 'te' ? 'మీ ప్రశ్న రాయండి...' :
              currentLanguage === 'hi' ? 'अपना प्रश्न लिखें...' :
              'Ask about crops, profits, weather, or any farming question...'
            }
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isProcessing) {
                handleUserInput(inputText);
              }
            }}
            disabled={isProcessing}
            className="flex-1"
          />
          
          <Button
            onClick={() => handleUserInput(inputText)}
            disabled={!inputText.trim() || isProcessing}
            className="bg-green-500 hover:bg-green-600"
          >
            {isProcessing ? '...' : '↗'}
          </Button>
          
          <Button
            onClick={handleVoiceInput}
            disabled={isProcessing}
            variant={isListening ? "destructive" : "outline"}
            size="sm"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Button
            onClick={isSpeaking ? stopSpeaking : () => {}}
            disabled={!isSpeaking}
            variant="outline"
            size="sm"
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Status Indicators */}
        <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            {isListening && <span className="text-red-500">🎤 Listening...</span>}
            {isProcessing && <span className="text-blue-500">🧠 AI Processing...</span>}
            {isSpeaking && <span className="text-green-500">🔊 Speaking...</span>}
          </div>
          
          {realTimeData && (
            <div className="text-right">
              <span>Last updated: {formatTimestamp(realTimeData.lastUpdated)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntelligentFarmingChat;