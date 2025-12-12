import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge, AlertTriangle, RefreshCw, MapPin } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CurrentWeather {
  temperature: number;
  feels_like: number;
  condition: string;
  icon: string;
  humidity: number;
  wind_speed: number;
  wind_direction: string;
  visibility: number;
  pressure: number;
  uv_index: number;
  location: string;
  last_updated: string;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  precipitation_chance: number;
}

interface DailyForecast {
  date: string;
  temperature_high: number;
  temperature_low: number;
  condition: string;
  precipitation_chance: number;
  humidity: number;
  wind_speed: number;
  farming_precautions: string[];
}

interface WeatherAlert {
  id: string;
  type: string;
  severity: "low" | "medium" | "high";
  message: string;
  forecast_days: number;
}

const Weather = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState("Guntur, Andhra Pradesh");
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchWeatherData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      // Generate mock weather data for demo
      const mockCurrentWeather: CurrentWeather = {
        temperature: 28,
        feels_like: 32,
        condition: "Partly Cloudy",
        icon: "partly-cloudy",
        humidity: 65,
        wind_speed: 12,
        wind_direction: "NW",
        visibility: 8,
        pressure: 1013,
        uv_index: 6,
        location: location,
        last_updated: new Date().toISOString()
      };

      const mockHourlyForecast: HourlyForecast[] = Array.from({ length: 12 }, (_, i) => ({
        time: new Date(Date.now() + i * 3600000).toISOString(),
        temperature: 26 + Math.random() * 8,
        condition: ["Sunny", "Partly Cloudy", "Cloudy"][Math.floor(Math.random() * 3)],
        precipitation_chance: Math.floor(Math.random() * 40)
      }));

      const mockDailyForecast: DailyForecast[] = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
        temperature_high: 30 + Math.random() * 6,
        temperature_low: 20 + Math.random() * 6,
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
        precipitation_chance: Math.floor(Math.random() * 60),
        humidity: 60 + Math.random() * 20,
        wind_speed: 8 + Math.random() * 10,
        farming_precautions: [
          "Monitor soil moisture levels",
          "Check for pest activity",
          "Ensure proper drainage"
        ]
      }));

      const mockAlerts: WeatherAlert[] = [
        {
          id: "1",
          type: "temperature",
          severity: "medium",
          message: "Temperature may reach 35°C in next 2 days",
          forecast_days: 2
        }
      ];

      setCurrentWeather(mockCurrentWeather);
      setHourlyForecast(mockHourlyForecast);
      setDailyForecast(mockDailyForecast);
      setAlerts(mockAlerts);

      if (isRefresh) {
        toast({
          title: "Weather Updated",
          description: `Latest forecast for ${location}`,
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Could not load weather data";
      console.error('Error in weather component:', error);
      toast({
        title: "Weather update failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    
    // Auto-refresh every 30 minutes
    const refreshInterval = autoRefresh ? setInterval(() => {
      fetchWeatherData(true);
    }, 30 * 60 * 1000) : null;

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, location]);

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('rain')) return <CloudRain className="w-12 h-12 text-blue-500" />;
    if (lower.includes('cloud')) return <Cloud className="w-12 h-12 text-gray-500" />;
    if (lower.includes('sunny') || lower.includes('clear')) return <Sun className="w-12 h-12 text-yellow-500" />;
    return <Cloud className="w-12 h-12 text-gray-400" />;
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="container px-4 py-6">
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading weather data...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Cloud className="w-7 h-7 text-primary" />
              Live Weather Forecast
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchWeatherData(true)}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {location}
          </p>
        </div>

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${getAlertColor(alert.severity)}`}>
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${getAlertColor(alert.severity)}`} />
                  <div className="flex-1">
                    <p className="font-semibold text-sm capitalize">{alert.type} Alert - {alert.severity}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">Valid for next {alert.forecast_days} days</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Current Weather */}
        {currentWeather && (
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left side - Temperature and condition */}
                <div className="flex flex-col justify-center items-start">
                  <div className="flex items-start gap-4">
                    <div className="text-6xl font-bold">{currentWeather.temperature}°</div>
                    <div>
                      <p className="text-xl font-semibold">{currentWeather.condition}</p>
                      <p className="text-sm text-muted-foreground">
                        Feels like {currentWeather.feels_like}°
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last updated: {new Date(currentWeather.last_updated).toLocaleTimeString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side - Weather details grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <p className="text-xs text-muted-foreground">Humidity</p>
                    </div>
                    <p className="text-2xl font-bold">{currentWeather.humidity}%</p>
                  </div>

                  <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="w-4 h-4 text-cyan-500" />
                      <p className="text-xs text-muted-foreground">Wind Speed</p>
                    </div>
                    <p className="text-2xl font-bold">{currentWeather.wind_speed} km/h</p>
                    <p className="text-xs text-muted-foreground">{currentWeather.wind_direction}</p>
                  </div>

                  <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-orange-500" />
                      <p className="text-xs text-muted-foreground">Visibility</p>
                    </div>
                    <p className="text-2xl font-bold">{currentWeather.visibility} km</p>
                  </div>

                  <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="w-4 h-4 text-purple-500" />
                      <p className="text-xs text-muted-foreground">UV Index</p>
                    </div>
                    <p className="text-2xl font-bold">{currentWeather.uv_index}</p>
                  </div>

                  <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4 col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="w-4 h-4 text-indigo-500" />
                      <p className="text-xs text-muted-foreground">Pressure</p>
                    </div>
                    <p className="text-2xl font-bold">{currentWeather.pressure} mb</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hourly Forecast */}
        {hourlyForecast.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Hourly Forecast (Next 12 Hours)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="flex gap-3 pb-2">
                  {hourlyForecast.map((hour, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 bg-muted rounded-lg p-3 text-center min-w-[100px]"
                    >
                      <p className="text-xs font-semibold text-muted-foreground mb-2">
                        {new Date(hour.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm mb-2">{getWeatherIcon(hour.condition)}</p>
                      <p className="font-bold text-lg">{hour.temperature}°</p>
                      <p className="text-xs text-muted-foreground mt-1">{hour.precipitation_chance}% rain</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 7-Day Forecast */}
        {dailyForecast.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>7-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dailyForecast.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-muted rounded-lg hover:bg-muted/80 transition"
                >
                  <div className="flex-shrink-0">{getWeatherIcon(day.condition)}</div>
                  
                  <div className="flex-1">
                    <p className="font-semibold">
                      {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-sm text-muted-foreground">{day.condition}</p>
                  </div>

                  <div className="text-right">
                    <div className="flex gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">High</p>
                        <p className="font-semibold">{day.temperature_high}°</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Low</p>
                        <p className="font-semibold">{day.temperature_low}°</p>
                      </div>
                      <div className="text-blue-500">
                        <p className="text-xs">Precip.</p>
                        <p className="font-semibold">{day.precipitation_chance}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Farming Precautions */}
        {dailyForecast.length > 0 && dailyForecast[0].farming_precautions?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Farming Precautions (Today)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {dailyForecast[0].farming_precautions.map((precaution, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span className="text-sm">{precaution}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Auto-Refresh Toggle */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Auto-Refresh</p>
                <p className="text-xs text-muted-foreground">Updates every 30 minutes</p>
              </div>
              <Button
                size="sm"
                variant={autoRefresh ? "default" : "outline"}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Weather;
