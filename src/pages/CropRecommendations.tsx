import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Sprout, TrendingUp, Calendar, Droplets, Info, Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SmartCropRecommendation from "@/components/ai/SmartCropRecommendation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Crop {
  id: string;
  name: string;
  category: string;
  duration_days: number;
  season: string;
  water_requirement: string;
  profit_index: string;
  daily_market_crop: boolean;
  home_growable: boolean;
  market_demand_index: number;
  health_benefits: string;
  medical_benefits: string;
  vitamins: string;
  proteins: string;
  intercropping_possibility: string;
}

const CropRecommendations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [hoveredCrop, setHoveredCrop] = useState<string | null>(null);
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);

  const categories = ["all", "vegetable", "fruit", "grain", "pulse", "spice", "oilseed", "plantation", "medicinal", "fodder", "flower"];
  const marketFilters = [
    { value: "all", label: "All Crops", icon: "🌾" },
    { value: "daily-market", label: "Daily Market", icon: "🏪" },
    { value: "restaurant", label: "Restaurant Demand", icon: "🍽️" },
    { value: "short-duration", label: "Quick Harvest", icon: "⚡" },
    { value: "high-profit", label: "High Profit", icon: "💰" },
    { value: "home-growable", label: "Home Garden", icon: "🏠" }
  ];

  useEffect(() => {
    fetchCrops();
  }, [selectedCategory, selectedFilter]);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      // Generate mock crop data for demo
      let mockCrops = generateMockCrops();

      // Apply category filter
      if (selectedCategory !== "all") {
        mockCrops = mockCrops.filter(crop => crop.category.toLowerCase() === selectedCategory);
      }

      // Apply market filter
      switch (selectedFilter) {
        case 'daily-market':
          mockCrops = mockCrops.filter(crop => crop.daily_market_crop);
          break;
        case 'restaurant':
          mockCrops = mockCrops.filter(crop => crop.market_demand_index >= 8.0);
          break;
        case 'short-duration':
          mockCrops = mockCrops.filter(crop => crop.duration_days <= 120);
          break;
        case 'high-profit':
          mockCrops = mockCrops.filter(crop => crop.profit_index === 'high');
          break;
        case 'home-growable':
          mockCrops = mockCrops.filter(crop => crop.home_growable);
          break;
      }

      if (mode === 'multi-crop') {
        mockCrops = mockCrops.filter(crop => crop.home_growable);
      }

      // Order by market demand and profit
      mockCrops.sort((a, b) => b.market_demand_index - a.market_demand_index);

      setCrops(mockCrops);
    } catch (error: any) {
      console.error('Error loading crops:', error);
      toast({
        title: "Error loading crops",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockCrops = () => {
    return [
      {
        id: '1',
        name: 'Coriander',
        category: 'vegetable',
        suitability_score: 98,
        expected_yield: '8-12 tons/acre',
        growth_duration: '30-45 days',
        duration_days: 45,
        water_requirement: 'low',
        profit_index: 'high',
        market_demand_index: 9.5,
        daily_market_crop: true,
        home_growable: true,
        intercropping_possibility: 'Excellent with spinach, radish, fenugreek',
        health_benefits: 'Rich in antioxidants, aids digestion, lowers cholesterol.',
        medical_benefits: 'Digestive health, anti-inflammatory, blood sugar control',
        vitamins: 'A, C, K, Folate',
        proteins: 'Medium protein content',
        season: 'Winter'
      },
      {
        id: '2',
        name: 'Spinach',
        category: 'vegetable',
        suitability_score: 95,
        expected_yield: '6-10 tons/acre',
        growth_duration: '25-35 days',
        duration_days: 35,
        water_requirement: 'low',
        profit_index: 'high',
        market_demand_index: 9.0,
        daily_market_crop: true,
        home_growable: true,
        intercropping_possibility: 'Good with radish, carrot, onion',
        health_benefits: 'High iron, folate, vitamin K. Boosts immunity.',
        medical_benefits: 'Anemia prevention, bone health, eye health',
        vitamins: 'A, C, E, K, Folate, Iron',
        proteins: 'High protein for leafy green',
        season: 'Winter'
      },
      {
        id: '3',
        name: 'Radish',
        category: 'vegetable',
        suitability_score: 92,
        expected_yield: '15-20 tons/acre',
        growth_duration: '30-35 days',
        duration_days: 35,
        water_requirement: 'low',
        profit_index: 'high',
        market_demand_index: 9.0,
        daily_market_crop: true,
        home_growable: true,
        intercropping_possibility: 'Excellent with carrot, beetroot, turnip',
        health_benefits: 'Aids digestion, detoxifies liver, vitamin C rich.',
        medical_benefits: 'Liver detox, respiratory health, weight management',
        vitamins: 'C, Folate, Potassium',
        proteins: 'Low but good fiber content',
        season: 'Winter'
      },
      {
        id: '4',
        name: 'Okra',
        category: 'vegetable',
        suitability_score: 94,
        expected_yield: '15-20 tons/acre',
        growth_duration: '60-70 days',
        duration_days: 70,
        water_requirement: 'medium',
        profit_index: 'high',
        market_demand_index: 9.5,
        daily_market_crop: true,
        home_growable: true,
        intercropping_possibility: 'Good with tomato, chili, marigold',
        health_benefits: 'High fiber, controls diabetes, heart healthy.',
        medical_benefits: 'Diabetes management, digestive health, heart protection',
        vitamins: 'A, C, K, Folate',
        proteins: 'Moderate protein and high fiber',
        season: 'Summer'
      },
      {
        id: '5',
        name: 'Fenugreek',
        category: 'vegetable',
        suitability_score: 88,
        expected_yield: '4-8 tons/acre',
        growth_duration: '30-40 days',
        duration_days: 40,
        water_requirement: 'low',
        profit_index: 'high',
        market_demand_index: 8.8,
        daily_market_crop: true,
        home_growable: true,
        intercropping_possibility: 'Excellent with coriander, spinach',
        health_benefits: 'Controls blood sugar, aids lactation, digestive health.',
        medical_benefits: 'Diabetes control, cholesterol reduction, digestive aid',
        vitamins: 'A, C, Iron, Calcium',
        proteins: 'High protein for leafy green',
        season: 'Winter'
      },
      {
        id: '6',
        name: 'Microgreens',
        category: 'vegetable',
        suitability_score: 99,
        expected_yield: '1-2 kg/sq.ft',
        growth_duration: '10-20 days',
        duration_days: 20,
        water_requirement: 'low',
        profit_index: 'high',
        market_demand_index: 9.8,
        daily_market_crop: true,
        home_growable: true,
        intercropping_possibility: 'Indoor controlled environment',
        health_benefits: 'Concentrated nutrients, antioxidants, enzymes.',
        medical_benefits: 'Super concentrated nutrition, anti-aging, immunity boost',
        vitamins: 'All vitamins concentrated',
        proteins: 'Very high protein concentration',
        season: 'Year-round'
      },
      {
        id: '7',
        name: 'Beetroot',
        category: 'vegetable',
        suitability_score: 90,
        expected_yield: '10-15 tons/acre',
        growth_duration: '21-45 days',
        duration_days: 35,
        water_requirement: 'low',
        profit_index: 'high',
        market_demand_index: 8.5,
        daily_market_crop: true,
        home_growable: true,
        intercropping_possibility: 'Good with radish, carrot, onion',
        health_benefits: 'Improves blood flow, lowers blood pressure, brain health.',
        medical_benefits: 'Cardiovascular health, cognitive function, stamina boost',
        vitamins: 'A, C, Folate, Iron',
        proteins: 'Moderate protein with natural sugars',
        season: 'Winter'
      },
      {
        id: '8',
        name: 'Cucumber',
        category: 'vegetable',
        suitability_score: 91,
        expected_yield: '20-25 tons/acre',
        growth_duration: '50-60 days',
        duration_days: 60,
        water_requirement: 'medium',
        profit_index: 'high',
        market_demand_index: 9.2,
        daily_market_crop: true,
        home_growable: true,
        intercropping_possibility: 'Good with radish, lettuce, marigold',
        health_benefits: 'Hydrating, aids weight loss, skin health.',
        medical_benefits: 'Hydration, weight management, skin health, cooling effect',
        vitamins: 'C, K, Potassium',
        proteins: 'Low protein, high water content',
        season: 'Summer'
      },
      {
        id: '9',
        name: 'Amaranthus',
        category: 'vegetable',
        suitability_score: 87,
        expected_yield: '5-8 tons/acre',
        growth_duration: '25-30 days',
        duration_days: 30,
        water_requirement: 'low',
        profit_index: 'high',
        market_demand_index: 8.8,
        daily_market_crop: true,
        home_growable: true,
        intercropping_possibility: 'Good with coriander, fenugreek',
        health_benefits: 'High protein leafy green, rich in minerals.',
        medical_benefits: 'Protein supplementation, mineral deficiency prevention',
        vitamins: 'A, C, K, Iron, Calcium',
        proteins: 'Very high protein for leafy green',
        season: 'Year-round'
      },
      {
        id: '10',
        name: 'Oyster Mushroom',
        category: 'vegetable',
        suitability_score: 96,
        expected_yield: '6-8 kg/sq.ft',
        growth_duration: '30-45 days',
        duration_days: 45,
        water_requirement: 'medium',
        profit_index: 'high',
        market_demand_index: 9.2,
        daily_market_crop: true,
        home_growable: true,
        intercropping_possibility: 'Indoor controlled environment',
        health_benefits: 'High protein, boosts immunity, lowers cholesterol.',
        medical_benefits: 'Immune system boost, cholesterol management, protein source',
        vitamins: 'B complex, D, Potassium',
        proteins: 'Very high quality protein',
        season: 'Year-round'
      }
    ];
  };

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProfitColor = (profit: string) => {
    switch (profit) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getWaterColor = (water: string) => {
    switch (water) {
      case 'high': return 'text-blue-500';
      case 'medium': return 'text-blue-400';
      default: return 'text-blue-300';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            {mode === 'multi-crop' ? 'Select Crops for Multi-Cropping' : 'AI Crop Recommendations'}
          </h2>
          <p className="text-muted-foreground">
            Discover {crops.length}+ crops suitable for your region
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Market & Usage Filters */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Market Focus</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {marketFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={selectedFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.value)}
                className="h-auto p-3 flex flex-col items-center gap-1"
              >
                <span className="text-lg">{filter.icon}</span>
                <span className="text-xs">{filter.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Crops Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredCrops.length === 0 ? (
          <Card className="p-12 text-center">
            <Sprout className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No crops found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or category filter
            </p>
            <Button onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCrops.map((crop) => (
              <Card
                key={crop.id}
                className="p-4 hover:shadow-lg transition-all cursor-pointer relative"
                onMouseEnter={() => setHoveredCrop(crop.id)}
                onMouseLeave={() => setHoveredCrop(null)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{crop.name}</h3>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {crop.category}
                      </Badge>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="space-y-2 text-sm">
                            <p><strong>Health Benefits:</strong> {crop.health_benefits}</p>
                            <p><strong>Medical:</strong> {crop.medical_benefits}</p>
                            <p><strong>Vitamins:</strong> {crop.vitamins}</p>
                            <p><strong>Proteins:</strong> {crop.proteins}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Market Demand Indicator */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Market Demand</span>
                    <div className="flex items-center gap-1">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-green-500 transition-all"
                          style={{ width: `${(crop.market_demand_index / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{crop.market_demand_index}/10</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{crop.duration_days} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className={`w-4 h-4 ${getWaterColor(crop.water_requirement)}`} />
                      <span className="capitalize">{crop.water_requirement}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`w-4 h-4 ${getProfitColor(crop.profit_index)}`} />
                      <span className="capitalize">{crop.profit_index} profit</span>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {crop.season}
                      </Badge>
                    </div>
                  </div>

                  {/* Special Badges */}
                  <div className="flex gap-1 flex-wrap">
                    {crop.daily_market_crop && (
                      <Badge variant="default" className="text-xs bg-green-600">
                        🏪 Daily Market
                      </Badge>
                    )}
                    {crop.home_growable && (
                      <Badge variant="secondary" className="text-xs">
                        🏠 Home Garden
                      </Badge>
                    )}
                    {crop.duration_days <= 90 && (
                      <Badge variant="outline" className="text-xs border-orange-400 text-orange-600">
                        ⚡ Quick Harvest
                      </Badge>
                    )}
                    {crop.profit_index === 'high' && (
                      <Badge variant="outline" className="text-xs border-green-400 text-green-600">
                        💰 High Profit
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/crop-roadmap/${crop.id}`)}
                    >
                      View Complete Roadmap
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <strong>Intercropping:</strong> {crop.intercropping_possibility}
                  </div>
                </div>

                {/* Hover Card with Nutritional Info */}
                {hoveredCrop === crop.id && (
                  <div className="absolute inset-0 bg-background/95 backdrop-blur-sm p-4 rounded-lg border-2 border-primary animate-fade-in z-10">
                    <div className="space-y-2 text-xs">
                      <h4 className="font-semibold text-sm mb-2">Nutritional & Health Information</h4>
                      <p><strong>Health Benefits:</strong> {crop.health_benefits.substring(0, 100)}...</p>
                      <p><strong>Vitamins:</strong> {crop.vitamins}</p>
                      <p><strong>Proteins:</strong> {crop.proteins}</p>
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => navigate(`/crop-roadmap/${crop.id}`)}
                      >
                        View Full Details
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* AI Strategic Recommendation System */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                AI Strategic Business Advisor
              </h3>
              <p className="text-muted-foreground text-sm">
                Get sophisticated soil-based crop recommendations across 5 strategic categories
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate('/seed-recommendations')}
                variant="outline"
                className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100"
              >
                <Sprout className="w-4 h-4 text-green-600" />
                AI Seed Guide
                <Badge className="bg-green-500 text-white text-xs">LIVE</Badge>
              </Button>
              <Button
                onClick={() => setShowAIRecommendation(!showAIRecommendation)}
                variant={showAIRecommendation ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                {showAIRecommendation ? 'Hide AI Advisor' : 'Launch AI Advisor'}
              </Button>
            </div>
          </div>
          
          {showAIRecommendation && (
            <div className="animate-fade-in">
              <SmartCropRecommendation />
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default CropRecommendations;
