import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Cloud, 
  Droplets, 
  MessageCircle, 
  Phone, 
  Mic,
  Shield,
  Calendar,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

interface Alert {
  id: string;
  type: 'weather' | 'moisture' | 'pest' | 'market' | 'task' | 'health';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  whatsappSent: boolean;
  voiceSent: boolean;
}

const AlertsSystem = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [settings, setSettings] = useState({
    whatsappEnabled: true,
    voiceEnabled: true,
    weatherAlerts: true,
    moistureAlerts: true,
    pestAlerts: true,
    marketAlerts: false,
    dailyReports: true,
    teluguVoice: true
  });

  useEffect(() => {
    // Initialize with sample alerts
    const sampleAlerts: Alert[] = [
      {
        id: '1',
        type: 'weather',
        title: 'Heavy Rain Alert',
        message: 'Heavy rainfall expected in next 48 hours. Cover sensitive crops and ensure proper drainage.',
        priority: 'high',
        timestamp: new Date().toISOString(),
        whatsappSent: true,
        voiceSent: false
      },
      {
        id: '2',
        type: 'moisture',
        title: 'Soil Moisture Low',
        message: 'Soil moisture dropped to 35%. Consider irrigation for tomato and chilli crops.',
        priority: 'medium',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        whatsappSent: true,
        voiceSent: true
      },
      {
        id: '3',
        type: 'pest',
        title: 'Pest Activity Detected',
        message: 'Increased aphid activity in your area. Apply neem oil spray as prevention.',
        priority: 'medium',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        whatsappSent: false,
        voiceSent: false
      },
      {
        id: '4',
        type: 'market',
        title: 'Price Increase Alert',
        message: 'Tomato prices increased by 25%. Good time to harvest and sell.',
        priority: 'low',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        whatsappSent: true,
        voiceSent: false
      }
    ];
    setAlerts(sampleAlerts);
  }, []);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'weather': return <Cloud className="w-5 h-5" />;
      case 'moisture': return <Droplets className="w-5 h-5" />;
      case 'pest': return <Shield className="w-5 h-5" />;
      case 'market': return <TrendingUp className="w-5 h-5" />;
      case 'task': return <Calendar className="w-5 h-5" />;
      case 'health': return <AlertTriangle className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const sendWhatsAppAlert = (alertId: string) => {
    // Simulate WhatsApp sending
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, whatsappSent: true }
        : alert
    ));
    toast({
      title: "WhatsApp Alert Sent",
      description: "Alert has been sent to your WhatsApp number",
    });
  };

  const sendVoiceAlert = (alertId: string) => {
    // Simulate voice message sending
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, voiceSent: true }
        : alert
    ));
    toast({
      title: "Voice Alert Sent",
      description: "Telugu voice message has been sent",
    });
  };

  const testTeluguVoice = () => {
    // Simulate Telugu voice test
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        settings.teluguVoice 
          ? "మీ పంట ఆరోగ్యం గురించి ఈ రోజు నివేదిక"
          : "Your crop health report for today"
      );
      utterance.lang = settings.teluguVoice ? 'te-IN' : 'en-IN';
      speechSynthesis.speak(utterance);
    }
    toast({
      title: "Voice Test",
      description: settings.teluguVoice ? "Telugu voice test played" : "English voice test played",
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alert Settings
          </CardTitle>
          <CardDescription>
            Configure your WhatsApp and voice notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium">WhatsApp Alerts</span>
                </div>
                <Switch 
                  checked={settings.whatsappEnabled}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, whatsappEnabled: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Voice Alerts</span>
                </div>
                <Switch 
                  checked={settings.voiceEnabled}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, voiceEnabled: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Telugu Voice</span>
                </div>
                <Switch 
                  checked={settings.teluguVoice}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, teluguVoice: checked})
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Weather Forecasts</span>
                <Switch 
                  checked={settings.weatherAlerts}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, weatherAlerts: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Soil Moisture</span>
                <Switch 
                  checked={settings.moistureAlerts}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, moistureAlerts: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Pest & Disease</span>
                <Switch 
                  checked={settings.pestAlerts}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, pestAlerts: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Market Prices</span>
                <Switch 
                  checked={settings.marketAlerts}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, marketAlerts: checked})
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={testTeluguVoice} variant="outline" size="sm">
              <Mic className="w-4 h-4 mr-2" />
              Test Voice
            </Button>
            <Button 
              onClick={() => {
                toast({
                  title: "Test WhatsApp Sent",
                  description: "Check your WhatsApp for the test message",
                });
              }}
              variant="outline" 
              size="sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Test WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            Your latest farming alerts and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(alert.priority)} mt-2 flex-shrink-0`} />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getAlertIcon(alert.type)}
                        <h4 className="font-medium">{alert.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {alert.type}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <MessageCircle className={`w-3 h-3 ${alert.whatsappSent ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className={alert.whatsappSent ? 'text-green-600' : 'text-gray-400'}>
                            WhatsApp {alert.whatsappSent ? '✓' : '○'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className={`w-3 h-3 ${alert.voiceSent ? 'text-blue-600' : 'text-gray-400'}`} />
                          <span className={alert.voiceSent ? 'text-blue-600' : 'text-gray-400'}>
                            Voice {alert.voiceSent ? '✓' : '○'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        {!alert.whatsappSent && settings.whatsappEnabled && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => sendWhatsAppAlert(alert.id)}
                          >
                            Send WhatsApp
                          </Button>
                        )}
                        {!alert.voiceSent && settings.voiceEnabled && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => sendVoiceAlert(alert.id)}
                          >
                            Send Voice
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Report Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Reports</CardTitle>
          <CardDescription>
            Automated daily crop health and weather updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Morning Report (7:00 AM)</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 15-day weather forecast</li>
                <li>• Soil moisture levels</li>
                <li>• Today's farming tasks</li>
                <li>• Market price updates</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Evening Report (6:00 PM)</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Daily crop health summary</li>
                <li>• Tomorrow's weather</li>
                <li>• Irrigation recommendations</li>
                <li>• Pest monitoring alerts</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <span className="font-medium">Enable Daily Reports</span>
            <Switch 
              checked={settings.dailyReports}
              onCheckedChange={(checked) => 
                setSettings({...settings, dailyReports: checked})
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsSystem;