import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Droplets,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Leaf,
  Package,
  BarChart3,
  Lightbulb,
  Video,
} from "lucide-react";

const CropRoadmap = () => {
  const { cropId } = useParams();
  
  // Mock data (will be fetched from database)
  const cropData = {
    name: "Tomato",
    category: "Vegetables",
    duration: 90,
    currentDay: 15,
    status: "active",
    startDate: "2025-01-01",
    expectedHarvestDate: "2025-04-01",
  };

  // Mock 5-year history data
  const priceHistory = [
    { year: 2020, price: 1800, yield: 24 },
    { year: 2021, price: 2100, yield: 26 },
    { year: 2022, price: 1950, yield: 25 },
    { year: 2023, price: 2300, yield: 28 },
    { year: 2024, price: 2200, yield: 27 },
    { year: 2025, price: 2400, yield: 29, forecast: true },
  ];

  // Mock daily tasks
  const dailyTasks = [
    { day: 1, title: "Land Preparation", description: "Plow and level the field", completed: true },
    { day: 3, title: "Seed Selection", description: "Choose disease-resistant variety", completed: true },
    { day: 5, title: "Sowing", description: "Plant seeds in nursery beds", completed: true },
    { day: 15, title: "First Watering", description: "Check soil moisture and water if needed", completed: false },
    { day: 20, title: "Fertilizer Application", description: "Apply NPK fertilizer (19:19:19)", completed: false },
    { day: 30, title: "Transplanting", description: "Move seedlings to main field", completed: false },
    { day: 45, title: "First Pruning", description: "Remove side shoots", completed: false },
    { day: 60, title: "Flowering Stage", description: "Monitor for pests, apply organic spray", completed: false },
    { day: 75, title: "Fruit Setting", description: "Ensure adequate water supply", completed: false },
    { day: 90, title: "Harvesting", description: "Pick ripe tomatoes", completed: false },
  ];

  // Seed recommendations
  const seedOptions = [
    {
      name: "Arka Vikas (Hybrid)",
      yield: "28-30 tons/acre",
      resistance: ["Bacterial Wilt", "Early Blight"],
      price: "₹1,200/100g",
    },
    {
      name: "Pusa Ruby (Open Pollinated)",
      yield: "25-27 tons/acre",
      resistance: ["Late Blight", "Leaf Curl"],
      price: "₹800/100g",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <div className="p-4 space-y-6">
        {/* Header Card */}
        <Card className="p-6 gradient-primary text-white animate-fadeIn">
          <h1 className="text-3xl font-bold mb-2">{cropData.name} Cultivation Roadmap</h1>
          <p className="text-white/90 mb-4">Complete guidance from Day 1 to Harvest</p>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-white/70 text-sm">Current Progress</p>
              <p className="text-2xl font-bold">Day {cropData.currentDay}/{cropData.duration}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm">Expected Harvest</p>
              <p className="text-lg font-semibold">{cropData.expectedHarvestDate}</p>
            </div>
          </div>
          
          <Progress value={(cropData.currentDay / cropData.duration) * 100} className="mt-4" />
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="roadmap" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="seeds">Seeds</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Day-by-Day Tasks
              </h3>

              <div className="space-y-3">
                {dailyTasks.map((task) => (
                  <div
                    key={task.day}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                      task.completed ? "bg-success/10" : "bg-muted"
                    }`}
                  >
                    <Checkbox checked={task.completed} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-primary">Day {task.day}</span>
                        {task.day === cropData.currentDay && (
                          <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                            Today
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    {task.completed && <CheckCircle2 className="w-5 h-5 text-success" />}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                5-Year Price Trend
              </h3>

              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={priceHistory}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="mt-4 p-4 bg-success/10 rounded-lg">
                <p className="text-sm font-medium text-success">
                  📈 Price Forecast: ₹2,400/quintal (↑ 9% from last year)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on AI analysis of 10-year data and current market demand
                </p>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Yield Comparison
              </h3>

              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="yield"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Seeds Tab */}
          <TabsContent value="seeds" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Recommended Seed Varieties
              </h3>

              <div className="space-y-3">
                {seedOptions.map((seed, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-lg">{seed.name}</h4>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Expected Yield</p>
                        <p className="font-medium text-success">{seed.yield}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium">{seed.price}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground">Disease Resistance:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {seed.resistance.map((r) => (
                          <span
                            key={r}
                            className="text-xs bg-success/10 text-success px-2 py-1 rounded-full"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full mt-3" variant="outline">
                      Select This Seed
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Tips Tab */}
          <TabsContent value="tips" className="space-y-4">
            <Card className="p-4 bg-accent/10 border-accent">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-accent-foreground">
                <Lightbulb className="w-5 h-5" />
                Pro Tips for Higher Profits
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                  <span>Plant marigold on field borders to naturally repel pests</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                  <span>Ensure proper air ventilation by leaving gaps in wind direction</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                  <span>Drip irrigation saves 40% water compared to flood irrigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                  <span>Harvest in morning hours for better shelf life and market price</span>
                </li>
              </ul>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Video Tutorials (Telugu)
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  ▶️ Day 1-10: Land Preparation & Sowing
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  ▶️ Day 30-45: Transplanting Techniques
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  ▶️ Day 60-75: Pest & Disease Management
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default CropRoadmap;
