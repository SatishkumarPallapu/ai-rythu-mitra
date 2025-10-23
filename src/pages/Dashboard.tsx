import { Droplets, Thermometer, Sun, TrendingUp, AlertTriangle, MessageCircle, Layers, Calendar as CalendarIcon, Sparkles, CloudRain } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WeatherDay {
  date: string;
  temperature_high: number;
  temperature_low: number;
  condition: string;
  precipitation_chance: number;
  farming_precautions: string[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [weather, setWeather] = useState<WeatherDay[]>([]);
  const [currentCrop, setCurrentCrop] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherForecast();
  }, []);

  const fetchWeatherForecast = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-weather-forecast', {
        body: { location: 'Guntur, Andhra Pradesh' }
      });

      if (error) throw error;

      setWeather(data.forecast || []);
      setCurrentCrop(data.current_crop || '');
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast({
        title: "Weather update unavailable",
        description: "Using cached forecast data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Welcome, Farmer! 🌾</h2>
          <p className="text-muted-foreground">
            Monitor your farm and get AI-powered insights
          </p>
        </div>

        {/* Weather Forecast Section */}
        <Card className="p-6 bg-gradient-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-primary" />
              7-Day Weather Forecast
            </h3>
            {currentCrop && (
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                Growing: {currentCrop}
              </span>
            )}
          </div>

          {loading ? (
            <div className="text-center py-4 text-muted-foreground">Loading forecast...</div>
          ) : weather.length > 0 ? (
            <div className="space-y-3">
              {weather.slice(0, 3).map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium">{new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                    <p className="text-sm text-muted-foreground">{day.condition}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{day.temperature_high}°C / {day.temperature_low}°C</p>
                    <p className="text-xs text-muted-foreground">{day.precipitation_chance}% rain</p>
                  </div>
                </div>
              ))}
              
              {weather[0]?.farming_precautions && weather[0].farming_precautions.length > 0 && (
                <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm mb-2">Today's Farming Precautions:</p>
                      <ul className="text-sm space-y-1">
                        {weather[0].farming_precautions.map((precaution, idx) => (
                          <li key={idx} className="text-muted-foreground">• {precaution}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">No forecast data available</div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            size="lg" 
            className="gap-2 h-auto py-4 flex-col"
            onClick={() => navigate("/crop-recommendations")}
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-sm">AI Recommendations</span>
          </Button>
          <Button 
            size="lg" 
            variant="secondary"
            className="gap-2 h-auto py-4 flex-col"
            onClick={() => navigate("/voice-assistant")}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-sm">Voice Chat</span>
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="gap-2 h-auto py-4 flex-col"
            onClick={() => navigate("/multi-crop-planner")}
          >
            <Layers className="w-6 h-6" />
            <span className="text-sm">Multi-Crop Plan</span>
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="gap-2 h-auto py-4 flex-col"
            onClick={() => navigate("/calendar")}
          >
            <CalendarIcon className="w-6 h-6" />
            <span className="text-sm">Calendar</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <DashboardCard
            title="Soil Moisture"
            value="68%"
            icon={Droplets}
            subtitle="Good level"
            status="success"
            onClick={() => navigate("/moisture")}
          />
          <DashboardCard
            title="Temperature"
            value="28°C"
            icon={Thermometer}
            subtitle="Optimal"
            status="success"
          />
          <DashboardCard
            title="Weather"
            value="Sunny"
            icon={Sun}
            subtitle="Clear skies"
            status="neutral"
          />
          <DashboardCard
            title="Yield Trend"
            value="+12%"
            icon={TrendingUp}
            subtitle="This season"
            status="success"
          />
        </div>

        {/* Soil Status Card */}
        <div className="bg-card rounded-2xl p-6 border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Soil Analysis</h3>
            <span className="text-xs text-success font-medium bg-success/10 px-3 py-1 rounded-full">
              Healthy
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">pH Level</p>
              <p className="text-lg font-semibold">6.8</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Nitrogen</p>
              <p className="text-lg font-semibold">120 kg</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Potassium</p>
              <p className="text-lg font-semibold">200 kg</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/soil")}
          >
            View Full Report
          </Button>
        </div>

        {/* AI Recommendations */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🤖</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">AI Recommendation</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your soil analysis, consider planting tomatoes this season. 
                Market demand is predicted to increase by 15%.
              </p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
