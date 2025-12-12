import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowRight, 
  Layers, 
  Grid3X3, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp,
  Leaf,
  Droplets,
  Calendar,
  Plus
} from "lucide-react";

interface CroppingStrategy {
  id: string;
  type: 'sequential' | 'intercrop' | 'mixed' | 'relay';
  title: string;
  description: string;
  crops: string[];
  duration: number;
  yieldGain: number;
  soilBenefit: string;
  profitIndex: string;
  compatibility: number;
  waterSavings: number;
  pestControl: boolean;
  nitrogenFixation: boolean;
}

const MultiCroppingPlanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedStrategy, setSelectedStrategy] = useState<string>('sequential');
  const [strategies, setStrategies] = useState<CroppingStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [farmArea, setFarmArea] = useState(1);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);

  const allCrops = [
    // Leafy Greens (30-60 Days)
    'Coriander', 'Spinach', 'Fenugreek', 'Amaranthus', 'Green Mustard', 'Dill',
    // Root Vegetables (30-60 Days) 
    'Radish', 'Beetroot', 'Carrot', 'Turnip',
    // Fruit Vegetables (50-90 Days)
    'Okra', 'Cucumber', 'Tomato', 'Capsicum', 'Brinjal', 'Bottle Gourd',
    // Pods & Others (60-120 Days)
    'Green Gram', 'Black Gram', 'Cowpea', 'Onion', 'Chili',
    // Quick High-Value (10-60 Days)
    'Microgreens', 'Oyster Mushrooms', 'Button Mushrooms', 'Tulsi', 'Marigold',
    // Additional Options
    'Lettuce', 'Basil', 'Drumstick'
  ];

  const fetchStrategies = useCallback(async () => {
    setLoading(true);
    try {
      // Generate mock strategies
      const mockStrategies = generateMockStrategies();
      setStrategies(mockStrategies);

      toast({
        title: "Strategies loaded",
        description: "Multi-cropping strategies and recommendations ready"
      });
    } catch (error) {
      console.error('Error fetching strategies:', error);
      toast({
        title: "Error loading strategies",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  const generateMockStrategies = (): CroppingStrategy[] => {
    return [
      {
        id: '1',
        type: 'sequential',
        title: 'Coriander → Okra → Spinach',
        description: 'Quick succession crops for continuous monthly income. Each crop completes in 30-75 days.',
        crops: ['Coriander', 'Okra', 'Spinach'],
        duration: 180,
        yieldGain: 25,
        soilBenefit: 'Improved organic matter',
        profitIndex: 'Very High',
        compatibility: 98,
        waterSavings: 15,
        pestControl: true,
        nitrogenFixation: false
      },
      {
        id: '2',
        type: 'sequential',
        title: 'Paddy → Wheat → Summer Crop',
        description: 'Ideal for irrigated regions. Maximize land utilization year-round.',
        crops: ['Paddy', 'Wheat', 'Okra'],
        duration: 320,
        yieldGain: 18,
        soilBenefit: 'Excellent nutrient cycling',
        profitIndex: 'Very High',
        compatibility: 98,
        waterSavings: 10,
        pestControl: false,
        nitrogenFixation: true
      },
      {
        id: '3',
        type: 'intercrop',
        title: 'Maize + Beans',
        description: 'Grow beans between maize rows. Beans fix nitrogen, reducing fertilizer needs.',
        crops: ['Maize', 'Beans'],
        duration: 120,
        yieldGain: 22,
        soilBenefit: 'Nitrogen fixation improved',
        profitIndex: 'High',
        compatibility: 92,
        waterSavings: 15,
        pestControl: true,
        nitrogenFixation: true
      },
      {
        id: '4',
        type: 'intercrop',
        title: 'Sugarcane + Groundnut',
        description: 'Groundnut planted in alternate rows. Low canopy crop doesn\'t compete for light.',
        crops: ['Sugarcane', 'Groundnut'],
        duration: 180,
        yieldGain: 20,
        soilBenefit: 'Nitrogen addition via legumes',
        profitIndex: 'High',
        compatibility: 88,
        waterSavings: 20,
        pestControl: true,
        nitrogenFixation: true
      },
      {
        id: '5',
        type: 'intercrop',
        title: 'Cotton + Soybean',
        description: 'Legume crop between cotton plants. Reduces pest infestation significantly.',
        crops: ['Cotton', 'Soybean'],
        duration: 150,
        yieldGain: 25,
        soilBenefit: 'Improved soil structure',
        profitIndex: 'High',
        compatibility: 90,
        waterSavings: 18,
        pestControl: true,
        nitrogenFixation: true
      },
      {
        id: '6',
        type: 'mixed',
        title: 'Wheat + Mustard (Mixed)',
        description: 'Both crops grown together without strict pattern. Risk diversification approach.',
        crops: ['Wheat', 'Mustard'],
        duration: 120,
        yieldGain: 12,
        soilBenefit: 'Moderate nutrient balance',
        profitIndex: 'Medium',
        compatibility: 78,
        waterSavings: 5,
        pestControl: false,
        nitrogenFixation: false
      },
      {
        id: '7',
        type: 'relay',
        title: 'Rice → Wheat (Relay)',
        description: 'Plant wheat when rice is still standing. Saves time and optimizes water use.',
        crops: ['Rice', 'Wheat'],
        duration: 240,
        yieldGain: 16,
        soilBenefit: 'Water efficiency improved',
        profitIndex: 'High',
        compatibility: 85,
        waterSavings: 25,
        pestControl: false,
        nitrogenFixation: false
      },
      {
        id: '8',
        type: 'relay',
        title: 'Paddy → Linseed (Relay)',
        description: 'Linseed planted in final weeks of paddy growth. Continuous productivity.',
        crops: ['Paddy', 'Linseed'],
        duration: 250,
        yieldGain: 14,
        soilBenefit: 'Soil moisture retention',
        profitIndex: 'Medium',
        compatibility: 82,
        waterSavings: 30,
        pestControl: false,
        nitrogenFixation: false
      }
    ];
  };

  const getStrategyIcon = (type: string) => {
    switch (type) {
      case 'sequential':
        return <ArrowRight className="w-5 h-5" />;
      case 'intercrop':
        return <Grid3X3 className="w-5 h-5" />;
      case 'mixed':
        return <Layers className="w-5 h-5" />;
      case 'relay':
        return <Zap className="w-5 h-5" />;
      default:
        return <Leaf className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sequential': return 'bg-blue-500';
      case 'intercrop': return 'bg-green-500';
      case 'mixed': return 'bg-yellow-500';
      case 'relay': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredStrategies = strategies.filter(s => s.type === selectedStrategy || selectedStrategy === 'all');

  const estimateProduction = () => {
    const selectedStrat = strategies[0];
    if (!selectedStrat) return;

    const baseYield = 4; // tons/acre
    const gainMultiplier = (100 + selectedStrat.yieldGain) / 100;
    const totalYield = (baseYield * farmArea * gainMultiplier).toFixed(2);
    const estimatedIncome = (parseFloat(totalYield) * 2000).toFixed(0);

    toast({
      title: "Production Estimate",
      description: `Expected yield: ${totalYield} tons | Estimated income: ₹${estimatedIncome}`
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="container px-4 py-6 flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading cropping strategies...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Layers className="w-8 h-8 text-primary" />
              Multi-Cropping Planner
            </h1>
            <p className="text-muted-foreground mt-2">Sequential • Intercropping • Mixed • Relay</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        </div>

        {/* Farm Size Input */}
        <Card>
          <CardHeader>
            <CardTitle>Your Farm Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Farm Size (acres)</label>
                <input 
                  type="number" 
                  value={farmArea}
                  onChange={(e) => setFarmArea(parseFloat(e.target.value) || 1)}
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
                  min="0.5"
                  step="0.5"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Water Availability</label>
                <select className="w-full mt-2 px-3 py-2 border rounded-lg">
                  <option>High (Irrigated)</option>
                  <option>Medium (Semi-irrigated)</option>
                  <option>Low (Rainfed)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Soil Type</label>
                <select className="w-full mt-2 px-3 py-2 border rounded-lg">
                  <option>Loamy</option>
                  <option>Clay</option>
                  <option>Sandy</option>
                  <option>Silty</option>
                </select>
              </div>
            </div>

            <Button className="w-full" onClick={estimateProduction}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Estimate Production
            </Button>
          </CardContent>
        </Card>

        {/* Strategy Type Filter */}
        <div>
          <h2 className="text-xl font-bold mb-4">Choose Cropping Strategy</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {['all', 'sequential', 'intercrop', 'mixed', 'relay'].map(type => (
              <Button
                key={type}
                variant={selectedStrategy === type ? 'default' : 'outline'}
                onClick={() => setSelectedStrategy(type)}
                className="capitalize"
              >
                {type === 'all' ? 'All' : type === 'intercrop' ? 'Inter' : type}
              </Button>
            ))}
          </div>
        </div>

        {/* Strategies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStrategies.map(strategy => (
            <Card key={strategy.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <CardHeader className={`text-white ${getTypeColor(strategy.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getStrategyIcon(strategy.type)}
                    <div>
                      <CardTitle className="text-lg">{strategy.title}</CardTitle>
                      <Badge variant="secondary" className="mt-2 capitalize">{strategy.type}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{strategy.description}</p>
                </div>

                {/* Crops Timeline */}
                {strategy.type === 'sequential' && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    {strategy.crops.map((crop, idx) => (
                      <div key={idx} className="text-center">
                        <p className="text-xs font-semibold text-muted-foreground">Month {(idx * 4 + 1)}-{(idx + 1) * 4}</p>
                        <p className="font-bold text-sm">{crop}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Grid Layout for Intercrop */}
                {strategy.type === 'intercrop' && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Layout Pattern</p>
                    <div className="grid grid-cols-5 gap-1">
                      {Array(10).fill(0).map((_, idx) => (
                        <div key={idx} className={`h-12 rounded ${idx % 2 === 0 ? 'bg-green-400' : 'bg-green-200'} flex items-center justify-center text-xs font-bold text-white`}>
                          {idx % 2 === 0 ? strategy.crops[0]?.[0] : strategy.crops[1]?.[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-primary/10 rounded">
                    <p className="text-xs text-muted-foreground">Yield Gain</p>
                    <p className="font-bold text-lg text-primary">+{strategy.yieldGain}%</p>
                  </div>
                  <div className="p-2 bg-success/10 rounded">
                    <p className="text-xs text-muted-foreground">Water Savings</p>
                    <p className="font-bold text-lg text-success">{strategy.waterSavings}%</p>
                  </div>
                  <div className="p-2 bg-info/10 rounded">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-bold text-lg text-info">{strategy.duration} days</p>
                  </div>
                  <div className="p-2 bg-warning/10 rounded">
                    <p className="text-xs text-muted-foreground">Profit Index</p>
                    <p className="font-bold text-lg text-warning">{strategy.profitIndex}</p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{strategy.soilBenefit}</span>
                  </div>
                  {strategy.nitrogenFixation && (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Nitrogen fixation improves soil fertility</span>
                    </div>
                  )}
                  {strategy.pestControl && (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Reduced pest infestation</span>
                    </div>
                  )}
                </div>

                <Button className="w-full" onClick={() => toast({
                  title: "Plan Created",
                  description: `Multi-cropping plan: ${strategy.title}`
                })}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to My Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Crop Compatibility Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Crop Compatibility Matrix</CardTitle>
            <CardDescription>Guide for selecting compatible crop combinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-primary/10">
                  <tr>
                    <th className="p-2 text-left font-semibold">Crop 1</th>
                    <th className="p-2 text-left font-semibold">Compatible Crops</th>
                    <th className="p-2 text-left font-semibold">Benefits</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-2 font-medium">Maize</td>
                    <td className="p-2">Beans, Peas, Squash</td>
                    <td className="p-2 text-sm">Nitrogen fixation, pest control, structural support</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Cotton</td>
                    <td className="p-2">Soybean, Groundnut, Chickpea</td>
                    <td className="p-2 text-sm">Pest reduction, soil fertility, better yields</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Sugarcane</td>
                    <td className="p-2">Groundnut, Potato, Cabbage</td>
                    <td className="p-2 text-sm">Maximum land use, reduced disease</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Paddy/Rice</td>
                    <td className="p-2">Wheat, Linseed, Mustard</td>
                    <td className="p-2 text-sm">Sequential use, water savings, year-round production</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Wheat</td>
                    <td className="p-2">Mustard, Chickpea, Linseed</td>
                    <td className="p-2 text-sm">Risk diversification, complementary nutrients</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Natural Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Sustainable Multi-Cropping Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
              <p className="font-semibold text-sm">Bund Planting</p>
              <p className="text-sm text-muted-foreground mt-1">Plant small flowering plants (marigold, dhaniya) on field bunds to reduce pest infestation</p>
            </div>
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
              <p className="font-semibold text-sm">Air Ventilation</p>
              <p className="text-sm text-muted-foreground mt-1">Leave gaps in windward direction for proper air circulation, reducing fungal diseases</p>
            </div>
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
              <p className="font-semibold text-sm">Water Efficiency</p>
              <p className="text-sm text-muted-foreground mt-1">Intercropping with legumes reduces irrigation frequency by 15-30%</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default MultiCroppingPlanner;
