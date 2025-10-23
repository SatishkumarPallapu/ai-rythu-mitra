import { Droplets, Thermometer, Sun, TrendingUp, Upload, Camera, MessageCircle, Layers, Calendar as CalendarIcon, Sparkles } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

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
