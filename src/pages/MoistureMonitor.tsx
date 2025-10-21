import { Droplets, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MoistureMonitor = () => {
  const moistureData = [
    { time: "6 AM", value: 65 },
    { time: "9 AM", value: 62 },
    { time: "12 PM", value: 58 },
    { time: "3 PM", value: 55 },
    { time: "6 PM", value: 68 },
  ];

  const currentMoisture = 68;
  const trend = "up";

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Moisture Monitor</h2>
          <p className="text-muted-foreground">
            Real-time soil moisture from IoT sensors
          </p>
        </div>

        {/* Current Moisture Card */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Moisture</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-primary">{currentMoisture}%</span>
                  {trend === "up" ? (
                    <TrendingUp className="w-6 h-6 text-success" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-warning" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Last updated: 5 minutes ago
                </p>
              </div>
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <Droplets className="w-10 h-10 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Alert */}
        {currentMoisture > 60 && (
          <Alert className="bg-success/10 border-success/20">
            <AlertCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              Soil moisture is at optimal level. No irrigation needed.
            </AlertDescription>
          </Alert>
        )}

        {/* Moisture Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Trend</CardTitle>
            <CardDescription>Moisture levels throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moistureData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-16 text-muted-foreground">
                    {data.time}
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full flex items-center justify-end px-3 transition-all"
                      style={{ width: `${data.value}%` }}
                    >
                      <span className="text-xs font-medium text-primary-foreground">
                        {data.value}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button size="lg" className="h-20">
            <div className="flex flex-col items-center gap-1">
              <Droplets className="w-6 h-6" />
              <span className="text-sm">Schedule Irrigation</span>
            </div>
          </Button>
          <Button size="lg" variant="outline" className="h-20">
            <div className="flex flex-col items-center gap-1">
              <AlertCircle className="w-6 h-6" />
              <span className="text-sm">Set Alert</span>
            </div>
          </Button>
        </div>

        {/* Sensor Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sensor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Device ID</span>
              <span className="text-sm font-medium">ESP32-001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Battery</span>
              <span className="text-sm font-medium text-success">87%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Signal</span>
              <span className="text-sm font-medium text-success">Strong</span>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default MoistureMonitor;
