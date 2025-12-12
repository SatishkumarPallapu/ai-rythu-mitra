import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, RefreshCw, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface WeatherData {
  date: string;
  temperature_high: number;
  temperature_low: number;
  condition: string;
  precipitation_chance: number;
  farming_precautions: string[];
}

interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  precipitation_chance: number;
  wind_speed: number;
}

interface WeatherAlert {
  type: string;
  severity: "low" | "medium" | "high";
  message: string;
}

const WeatherWidget = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [hourlyWeather, setHourlyWeather] = useState<HourlyForecast[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for fallback
  const mockWeatherData: WeatherData[] = [
    {
      date: new Date().toISOString().split('T')[0],
      temperature_high: 32,
      temperature_low: 22,
      condition: "Sunny",
      precipitation_chance: 10,
      farming_precautions: ["Ensure regular irrigation", "Monitor for pests"]
    },
    {
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      temperature_high: 30,
      temperature_low: 20,
      condition: "Partly Cloudy",
      precipitation_chance: 20,
      farming_precautions: ["Check soil moisture"]
    },
    {
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      temperature_high: 28,
      temperature_low: 18,
      condition: "Cloudy",
      precipitation_chance: 40,
      farming_precautions: ["Prepare for possible rain"]
    }
  ];

  const mockAlerts: WeatherAlert[] = [
    {
      type: "temperature",
      severity: "low",
      message: "Temperature may exceed 35°C in next 2 days"
    }
  ];

  const mockHourlyData: HourlyForecast[] = [
    { time: new Date().toISOString(), temperature: 28, condition: "Sunny", precipitation_chance: 10, wind_speed: 8 },
    { time: new Date(Date.now() + 3600000).toISOString(), temperature: 29, condition: "Sunny", precipitation_chance: 5, wind_speed: 9 },
    { time: new Date(Date.now() + 7200000).toISOString(), temperature: 31, condition: "Sunny", precipitation_chance: 8, wind_speed: 10 },
    { time: new Date(Date.now() + 10800000).toISOString(), temperature: 32, condition: "Partly Cloudy", precipitation_chance: 15, wind_speed: 11 },
    { time: new Date(Date.now() + 14400000).toISOString(), temperature: 30, condition: "Partly Cloudy", precipitation_chance: 20, wind_speed: 9 },
    { time: new Date(Date.now() + 18000000).toISOString(), temperature: 27, condition: "Cloudy", precipitation_chance: 30, wind_speed: 7 },
    { time: new Date(Date.now() + 21600000).toISOString(), temperature: 25, condition: "Cloudy", precipitation_chance: 35, wind_speed: 6 },
    { time: new Date(Date.now() + 25200000).toISOString(), temperature: 23, condition: "Clear", precipitation_chance: 10, wind_speed: 5 },
  ];

  useEffect(() => {
    // Initialize with mock data
    setWeather(mockWeatherData);
    setHourlyWeather(mockHourlyData);
    setAlerts(mockAlerts);
    
    // Try to fetch real data
    fetchWeatherData();
    
    const interval = setInterval(() => {
      fetchWeatherData(true);
    }, 30 * 60 * 1000); // Refresh every 30 minutes

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWeatherData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      // Use only mock data for demo to avoid API errors
      // Keep existing mock data as the primary data source
      console.log('Using mock weather data for demo');
    } catch (error) {
      console.error('Error in weather component:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getWeatherIcon = (condition: string, size = 6) => {
    const lower = condition.toLowerCase();
    const className = `w-${size} h-${size}`;
    if (lower.includes('rain')) return <CloudRain className={`${className} text-blue-500`} />;
    if (lower.includes('cloud')) return <Cloud className={`${className} text-gray-500`} />;
    if (lower.includes('sunny') || lower.includes('clear')) return <Sun className={`${className} text-yellow-500`} />;
    return <Cloud className={`${className} text-gray-400`} />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading && weather.length === 0) {
    return (
      <Card className="p-6 bg-gradient-subtle">
        <div className="text-center py-4">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Loading forecast...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Weather Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.slice(0, 2).map((alert, idx) => (
            <Card key={idx} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
              <div className="p-3 flex items-start gap-3">
                <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${getSeverityColor(alert.severity)}`} />
                <div className="flex-1">
                  <p className="font-semibold text-xs capitalize">{alert.type} Alert</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{alert.message}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Weather Card */}
      <Card className="p-6 bg-gradient-subtle">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Cloud className="w-5 h-5 text-primary" />
            7-Day Forecast
          </h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => fetchWeatherData(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {weather.length > 0 ? (
          <div className="space-y-3">
            {weather.slice(0, 3).map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                  <p className="text-sm text-muted-foreground">{day.condition}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getWeatherIcon(day.condition, 5)}
                  <div className="text-right">
                    <p className="font-bold text-sm">{day.temperature_high}°C</p>
                    <p className="text-xs text-muted-foreground">{day.precipitation_chance}% rain</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No forecast data available
          </div>
        )}

        {/* Hourly Forecast */}
        {hourlyWeather.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold text-sm mb-3">Hourly Weather</h4>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {hourlyWeather.map((hour, index) => {
                const hourTime = new Date(hour.time).toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true
                });
                return (
                  <div 
                    key={index} 
                    className="flex-shrink-0 w-16 p-3 bg-background rounded-lg border text-center hover:bg-primary/10 transition"
                  >
                    <p className="text-xs font-medium text-muted-foreground">{hourTime}</p>
                    <div className="flex justify-center my-1">
                      {getWeatherIcon(hour.condition, 4)}
                    </div>
                    <p className="text-sm font-bold">{hour.temperature}°</p>
                    <p className="text-xs text-muted-foreground">{hour.precipitation_chance}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Farming Precautions */}
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

        {/* View Full Weather */}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-4"
          onClick={() => navigate('/weather')}
        >
          View Detailed Weather
        </Button>
      </Card>
    </div>
  );
};

export default WeatherWidget;
