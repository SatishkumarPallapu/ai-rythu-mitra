import { Droplets, Thermometer, Sun, TrendingUp, AlertTriangle, MessageCircle, Layers, Calendar as CalendarIcon, Sparkles, Brain, Satellite } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import WeatherWidget from "@/components/WeatherWidget";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cropTrackingService, TrackedCrop } from "@/services/cropTrackingService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trackedCrops, setTrackedCrops] = useState<TrackedCrop[]>([]);

  useEffect(() => {
    // Load tracked crops and simulate data loading
    const loadData = () => {
      const crops = cropTrackingService.getActiveCrops();
      setTrackedCrops(crops);
      setLoading(false);
    };
    
    setTimeout(loadData, 500);
  }, []);

  const handleRemoveCrop = (cropId: string) => {
    if (cropTrackingService.removeCropFromTracking(cropId)) {
      setTrackedCrops(trackedCrops.filter(crop => crop.id !== cropId));
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'preparation': return 'bg-gray-500';
      case 'sowing': return 'bg-blue-500';
      case 'vegetative': return 'bg-green-500';
      case 'flowering': return 'bg-pink-500';
      case 'fruiting': return 'bg-orange-500';
      case 'harvest': return 'bg-yellow-500';
      default: return 'bg-gray-500';
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
        <WeatherWidget />

        {/* Tracked Crops Section */}
        {trackedCrops.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Layers className="w-5 h-5 text-green-500" />
                My Crops ({trackedCrops.length})
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/calendar")}>
                View Calendar
              </Button>
            </div>
            <div className="space-y-3">
              {trackedCrops.map((crop) => (
                <div 
                  key={crop.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/crop-roadmap/${crop.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{crop.emoji}</span>
                    <div>
                      <h4 className="font-medium">{crop.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge 
                          variant="secondary" 
                          className={`${getPhaseColor(crop.currentPhase)} text-white text-xs`}
                        >
                          {crop.currentPhase}
                        </Badge>
                        <span>•</span>
                        <span>{crop.daysRemaining > 0 ? `${crop.daysRemaining} days left` : 'Ready to harvest!'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm">
                      <div className="font-medium text-green-600">{crop.profitProjection}</div>
                      <div className="text-xs text-muted-foreground">{crop.progress}% complete</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCrop(crop.id);
                      }}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Latest Alerts */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Latest Alerts
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/alerts")}>
              View All
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-l-orange-400">
              <Droplets className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Low Soil Moisture</p>
                <p className="text-xs text-muted-foreground">Consider irrigation for tomato crops</p>
              </div>
              <Badge variant="secondary" className="text-xs">2h ago</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-l-green-400">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Price Alert</p>
                <p className="text-xs text-muted-foreground">Tomato prices increased 25% - Good time to sell!</p>
              </div>
              <Badge variant="secondary" className="text-xs">4h ago</Badge>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            size="lg" 
            className="gap-2 h-auto py-4 flex-col bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 relative"
            onClick={() => navigate("/crop-recommendations")}
          >
            <Brain className="w-6 h-6" />
            <span className="text-sm">AI Crop Advisor</span>
            <Badge className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs px-1">
              NEW
            </Badge>
          </Button>
          <Button 
            size="lg" 
            className="gap-2 h-auto py-4 flex-col bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 relative"
            onClick={() => navigate("/strategic-crop-planner")}
          >
            <Brain className="w-6 h-6" />
            <span className="text-sm">Strategic Planner</span>
            <Badge className="absolute -top-1 -right-1 bg-gold-500 text-black text-xs px-1">
              PRO
            </Badge>
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
            className="gap-2 h-auto py-4 flex-col bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 relative"
            onClick={() => navigate("/seed-recommendations")}
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-sm">AI Seed Guide</span>
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1">
              LIVE
            </Badge>
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
          <Button 
            size="lg" 
            variant="outline"
            className="gap-2 h-auto py-4 flex-col bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:from-blue-100 hover:to-cyan-100"
            onClick={() => navigate("/satellite-analysis")}
          >
            <Satellite className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-blue-700">Satellite Analysis</span>
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
