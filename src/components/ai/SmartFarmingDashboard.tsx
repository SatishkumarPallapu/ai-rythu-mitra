import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Bell, TrendingUp, Droplets, Thermometer, Wind, CloudRain,
  DollarSign, Package, Truck, Users, Shield, Target, Clock,
  Activity, BarChart3, PieChart, AlertTriangle, CheckCircle2,
  Brain, Smartphone, Calendar, MapPin, Zap, Heart
} from "lucide-react";

interface SmartFarmingDashboardProps {
  cropName: string;
  cropId: string;
  currentPhase: string;
}

const SmartFarmingDashboard: React.FC<SmartFarmingDashboardProps> = ({ 
  cropName, 
  cropId, 
  currentPhase 
}) => {
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [marketData, setMarketData] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    generateRealTimeData();
    generateMarketIntelligence();
    generateSmartRecommendations();
    
    // Update data every 30 seconds for real-time experience
    const interval = setInterval(() => {
      generateRealTimeData();
      generateMarketIntelligence();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [currentPhase]);

  const generateRealTimeData = () => {
    const data = {
      weather: {
        temperature: Math.floor(Math.random() * 10 + 25) + "°C",
        humidity: Math.floor(Math.random() * 20 + 60) + "%",
        soilMoisture: Math.floor(Math.random() * 30 + 65) + "%",
        windSpeed: Math.floor(Math.random() * 15 + 5) + " km/h",
        rainfall: Math.floor(Math.random() * 5) + "mm (24h)",
        uvIndex: Math.floor(Math.random() * 5 + 5)
      },
      cropHealth: {
        overallScore: Math.floor(Math.random() * 15 + 85),
        growthRate: Math.floor(Math.random() * 20 + 80) + "%",
        diseaseRisk: Math.floor(Math.random() * 30 + 10) + "%",
        nutrientStatus: Math.floor(Math.random() * 15 + 85) + "%",
        waterStress: Math.floor(Math.random() * 25 + 15) + "%"
      },
      fieldOperations: {
        lastIrrigation: "6 hours ago",
        nextScheduledActivity: "Fertilizer application",
        timeToHarvest: `${Math.floor(Math.random() * 30 + 20)} days`,
        expectedYield: `${Math.floor(Math.random() * 20 + 40)} tons/acre`
      }
    };
    setRealTimeData(data);

    // Generate alerts based on data
    generateAlerts(data);
  };

  const generateMarketIntelligence = () => {
    const basePrice = Math.floor(Math.random() * 30 + 35);
    const priceChange = Math.floor(Math.random() * 10) - 5;
    
    const marketData = {
      currentPrice: basePrice,
      priceChange: priceChange,
      priceChangePercent: ((priceChange / basePrice) * 100).toFixed(1),
      demandForecast: Math.random() > 0.5 ? "increasing" : "stable",
      bestMarkets: [
        { name: "Premium Retail", price: basePrice + 12, demand: "High" },
        { name: "Export Markets", price: basePrice + 20, demand: "Medium" },
        { name: "Processing Units", price: basePrice - 5, demand: "High" },
        { name: "Local Markets", price: basePrice - 2, demand: "Medium" }
      ],
      profitProjection: {
        conservative: `₹${Math.floor((basePrice - 8) * 40 * 0.8 / 1000)}K per acre`,
        optimistic: `₹${Math.floor((basePrice + 5) * 50 * 0.9 / 1000)}K per acre`,
        realistic: `₹${Math.floor(basePrice * 45 * 0.85 / 1000)}K per acre`
      }
    };
    setMarketData(marketData);
  };

  const generateAlerts = (data: any) => {
    const newAlerts = [];
    
    if (data.weather.soilMoisture < 70) {
      newAlerts.push({
        type: "warning",
        icon: <Droplets className="w-4 h-4" />,
        title: "Irrigation Required",
        message: `Soil moisture at ${data.weather.soilMoisture}. Schedule irrigation within 6 hours.`,
        priority: "high",
        action: "Start drip irrigation for 2-3 hours"
      });
    }

    if (data.weather.temperature > 32) {
      newAlerts.push({
        type: "info",
        icon: <Thermometer className="w-4 h-4" />,
        title: "High Temperature Alert",
        message: `Temperature at ${data.weather.temperature}. Consider shade management.`,
        priority: "medium",
        action: "Install shade net or increase irrigation frequency"
      });
    }

    if (data.cropHealth.diseaseRisk > 25) {
      newAlerts.push({
        type: "error",
        icon: <Shield className="w-4 h-4" />,
        title: "Disease Risk Elevated",
        message: `Disease risk at ${data.cropHealth.diseaseRisk}. Preventive action needed.`,
        priority: "high",
        action: "Apply preventive fungicide spray immediately"
      });
    }

    setAlerts(newAlerts);
  };

  const generateSmartRecommendations = () => {
    const recommendations = [
      {
        category: "Nutrition",
        icon: <Zap className="w-4 h-4" />,
        title: "Optimal Fertilizer Timing",
        description: "Based on current growth stage, apply potassium-rich fertilizer",
        timing: "Next 2-3 days",
        expectedBenefit: "15-20% yield increase",
        cost: "₹1,500 per acre",
        confidence: 92
      },
      {
        category: "Pest Management",
        icon: <Shield className="w-4 h-4" />,
        title: "Preventive Pest Control",
        description: "Weather conditions favor pest development. Deploy bio-control agents",
        timing: "This week",
        expectedBenefit: "60-80% pest reduction",
        cost: "₹800 per acre",
        confidence: 87
      },
      {
        category: "Market Strategy", 
        icon: <TrendingUp className="w-4 h-4" />,
        title: "Price Timing Optimization",
        description: "Market analysis suggests delaying harvest by 5-7 days for better prices",
        timing: "Harvest planning",
        expectedBenefit: "₹5-8 per kg premium",
        cost: "Extended care costs",
        confidence: 78
      },
      {
        category: "Quality Enhancement",
        icon: <Target className="w-4 h-4" />,
        title: "Fruit Quality Booster",
        description: "Apply calcium foliar spray to improve fruit firmness and shelf life",
        timing: "Before harvest",
        expectedBenefit: "25% longer shelf life",
        cost: "₹600 per acre",
        confidence: 85
      }
    ];
    setRecommendations(recommendations);
  };

  const profitCalculator = {
    currentEstimate: {
      expectedYield: "45 tons per acre",
      currentPrice: "₹35 per kg",
      grossIncome: "₹1,57,500",
      totalCosts: "₹65,000",
      netProfit: "₹92,500",
      profitMargin: "59%"
    },
    optimizationPotential: {
      yieldImprovement: "+15% (Quality inputs)",
      priceImprovement: "+20% (Premium markets)",
      costReduction: "-12% (Efficiency gains)",
      totalImpact: "+45% profit increase"
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Monitoring Dashboard */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            🔴 LIVE: Smart Farm Monitoring Dashboard
          </CardTitle>
          <p className="text-muted-foreground">
            Real-time AI-powered monitoring and recommendations for optimal crop management
          </p>
        </CardHeader>
        <CardContent>
          {realTimeData && (
            <div className="grid md:grid-cols-3 gap-4">
              {/* Weather Monitoring */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CloudRain className="w-5 h-5 text-blue-600" />
                    Weather Station
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span className="font-semibold">{realTimeData.weather.temperature}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Humidity:</span>
                      <span className="font-semibold">{realTimeData.weather.humidity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Soil Moisture:</span>
                      <span className="font-semibold">{realTimeData.weather.soilMoisture}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wind Speed:</span>
                      <span className="font-semibold">{realTimeData.weather.windSpeed}</span>
                    </div>
                  </div>
                  <Progress value={parseInt(realTimeData.weather.soilMoisture)} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Soil moisture level - Optimal range: 70-85%
                  </p>
                </CardContent>
              </Card>

              {/* Crop Health Score */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-green-600" />
                    Crop Health AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {realTimeData.cropHealth.overallScore}/100
                    </div>
                    <p className="text-xs text-muted-foreground">Overall Health Score</p>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Growth Rate:</span>
                      <span className="font-semibold">{realTimeData.cropHealth.growthRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disease Risk:</span>
                      <Badge variant={parseInt(realTimeData.cropHealth.diseaseRisk) > 25 ? "destructive" : "secondary"}>
                        {realTimeData.cropHealth.diseaseRisk}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Field Operations */}
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    Operations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Last Irrigation:</span>
                    <p className="font-semibold">{realTimeData.fieldOperations.lastIrrigation}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Next Activity:</span>
                    <p className="font-semibold">{realTimeData.fieldOperations.nextScheduledActivity}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time to Harvest:</span>
                    <p className="font-semibold text-green-600">{realTimeData.fieldOperations.timeToHarvest}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Bell className="w-5 h-5" />
              🚨 Critical Farm Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert, index) => (
              <Alert key={index} className={`border-l-4 ${
                alert.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                alert.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                'border-l-blue-500 bg-blue-50'
              }`}>
                {alert.icon}
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{alert.title}</p>
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-green-700 mt-1">
                        <strong>Action:</strong> {alert.action}
                      </p>
                    </div>
                    <Badge variant={alert.priority === 'high' ? 'destructive' : 
                                alert.priority === 'medium' ? 'default' : 'secondary'}>
                      {alert.priority.toUpperCase()}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            🤖 AI-Powered Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => (
              <Card key={index} className="border-l-4 border-l-indigo-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {rec.icon}
                    {rec.title}
                  </CardTitle>
                  <Badge className="w-fit">{rec.category}</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">{rec.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Timing:</span>
                      <p className="font-semibold">{rec.timing}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected Benefit:</span>
                      <p className="font-semibold text-green-600">{rec.expectedBenefit}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Investment:</span>
                      <p className="font-semibold">{rec.cost}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">AI Confidence:</span>
                      <p className="font-semibold">{rec.confidence}%</p>
                    </div>
                  </div>
                  <Progress value={rec.confidence} className="h-2" />
                  <Button size="sm" className="w-full">
                    Implement Recommendation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Intelligence & Profit Optimization */}
      {marketData && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                💹 Live Market Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">₹{marketData.currentPrice}/kg</div>
                <div className={`text-sm ${marketData.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {marketData.priceChange >= 0 ? '↗️' : '↘️'} 
                  {Math.abs(marketData.priceChange)} ({marketData.priceChangePercent}%)
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Best Markets Today:</h4>
                {marketData.bestMarkets.slice(0, 3).map((market: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{market.name}</span>
                    <div className="text-right">
                      <div className="font-semibold">₹{market.price}/kg</div>
                      <Badge variant={market.demand === 'High' ? 'default' : 'secondary'} className="text-xs">
                        {market.demand}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                💰 Profit Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Current Projection:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Expected Yield:</span>
                    <span className="font-semibold">{profitCalculator.currentEstimate.expectedYield}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gross Income:</span>
                    <span className="font-semibold text-green-600">{profitCalculator.currentEstimate.grossIncome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Profit:</span>
                    <span className="font-semibold text-green-600">{profitCalculator.currentEstimate.netProfit}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded">
                <h4 className="font-semibold text-yellow-800">Optimization Potential:</h4>
                <p className="text-sm text-yellow-700">{profitCalculator.optimizationPotential.totalImpact}</p>
              </div>
              
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                Get Detailed Profit Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            📱 Quick Farm Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button className="h-auto py-3 flex-col gap-2">
              <Droplets className="w-5 h-5" />
              <span className="text-sm">Start Irrigation</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex-col gap-2">
              <Package className="w-5 h-5" />
              <span className="text-sm">Order Inputs</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex-col gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">Book Labor</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex-col gap-2">
              <Truck className="w-5 h-5" />
              <span className="text-sm">Arrange Transport</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartFarmingDashboard;