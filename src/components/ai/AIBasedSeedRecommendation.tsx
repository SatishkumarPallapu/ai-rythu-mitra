import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, TrendingUp, Target, MapPin, Calendar, Droplets, Thermometer, DollarSign, Award, Clock, Shield, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FarmData {
  location: string;
  soilType: string;
  farmSize: number;
  season: string;
  irrigationType: string;
  budget: number;
  priority: string; // 'yield', 'quality', 'profit', 'sustainability'
  experience: string; // 'beginner', 'intermediate', 'expert'
  climateZone: string;
}

interface SeedVariety {
  id: string;
  name: string;
  crop: string;
  type: string; // 'hybrid', 'heirloom', 'organic', 'gmo'
  supplier: string;
  pricePerKg: number;
  germinationRate: number;
  maturityDays: number;
  expectedYield: string;
  waterRequirement: 'Low' | 'Medium' | 'High';
  diseaseResistance: string[];
  soilSuitability: string[];
  climateSuitability: string[];
  marketDemand: number; // 1-100
  profitPotential: number; // 1-100
  aiScore: number; // AI calculated score
  recommendations: {
    plantingTips: string[];
    careInstructions: string[];
    harvestGuidance: string[];
    marketTiming: string;
  };
  certifications: string[];
  reviews: {
    rating: number;
    farmerCount: number;
    successRate: number;
  };
}

interface WeatherData {
  temperature: number;
  rainfall: number;
  humidity: number;
  forecast: string;
}

interface AIRecommendationResult {
  topSeeds: SeedVariety[];
  alternativeOptions: SeedVariety[];
  seasonalTrends: {
    trend: string;
    impact: string;
    recommendation: string;
  }[];
  marketInsights: {
    currentPrices: { crop: string; price: number; trend: 'up' | 'down' | 'stable' }[];
    demandForecast: string;
    exportOpportunities: string[];
  };
  riskAnalysis: {
    weatherRisk: string;
    marketRisk: string;
    diseaseRisk: string;
    mitigation: string[];
  };
  customizedAdvice: string[];
}

const AIBasedSeedRecommendation: React.FC = () => {
  const [farmData, setFarmData] = useState<FarmData>({
    location: '',
    soilType: '',
    farmSize: 1,
    season: '',
    irrigationType: '',
    budget: 10000,
    priority: 'profit',
    experience: 'intermediate',
    climateZone: ''
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendationResult | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [realTimeUpdate, setRealTimeUpdate] = useState(false);
  const { toast } = useToast();

  // Simulate real-time weather data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (farmData.location) {
        setWeatherData({
          temperature: 25 + Math.random() * 10,
          rainfall: Math.random() * 100,
          humidity: 60 + Math.random() * 30,
          forecast: ['Sunny', 'Partly Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 4)]
        });
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [farmData.location]);

  const generateAISeedRecommendations = async (data: FarmData): Promise<AIRecommendationResult> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Mock seed database with AI scoring
    const seedDatabase: SeedVariety[] = [
      {
        id: 'tomato-hybrid-1',
        name: 'Arka Rakshak Hybrid',
        crop: 'Tomato',
        type: 'hybrid',
        supplier: 'IIHR Bangalore',
        pricePerKg: 2500,
        germinationRate: 90,
        maturityDays: 75,
        expectedYield: '40-50 tons/hectare',
        waterRequirement: 'Medium',
        diseaseResistance: ['Late Blight', 'Early Blight', 'Bacterial Wilt'],
        soilSuitability: ['Alluvial Soil', 'Black Soil', 'Red Soil'],
        climateSuitability: ['Tropical', 'Sub-tropical'],
        marketDemand: 95,
        profitPotential: 88,
        aiScore: 92,
        recommendations: {
          plantingTips: ['Plant during cooler months', 'Maintain 60cm spacing', 'Use raised beds for drainage'],
          careInstructions: ['Weekly drip irrigation', 'Stake plants at 30cm height', 'Apply organic mulch'],
          harvestGuidance: ['Harvest when 75% red', 'Early morning harvest preferred', 'Handle carefully'],
          marketTiming: 'Peak demand: November-February'
        },
        certifications: ['Organic Certified', 'IIHR Approved'],
        reviews: { rating: 4.6, farmerCount: 1250, successRate: 87 }
      },
      {
        id: 'onion-dehydrator',
        name: 'Nasik Red Premium',
        crop: 'Onion',
        type: 'heirloom',
        supplier: 'Maharashtra Seeds Corp',
        pricePerKg: 800,
        germinationRate: 85,
        maturityDays: 120,
        expectedYield: '25-30 tons/hectare',
        waterRequirement: 'Low',
        diseaseResistance: ['Purple Blotch', 'Stemphylium Blight'],
        soilSuitability: ['Black Soil', 'Alluvial Soil'],
        climateSuitability: ['Semi-arid', 'Tropical'],
        marketDemand: 92,
        profitPotential: 85,
        aiScore: 89,
        recommendations: {
          plantingTips: ['Transplant 6-week seedlings', '15cm row spacing', 'Well-drained soil essential'],
          careInstructions: ['Minimal watering after bulb formation', 'Regular weeding crucial', 'Balanced fertilization'],
          harvestGuidance: ['Harvest when tops fall over', 'Cure in sun for 7-10 days', 'Store in ventilated area'],
          marketTiming: 'Best prices: March-May'
        },
        certifications: ['Non-GMO', 'Traditional Variety'],
        reviews: { rating: 4.4, farmerCount: 980, successRate: 82 }
      },
      {
        id: 'potato-processing',
        name: 'Kufri Chipsona-3',
        crop: 'Potato',
        type: 'hybrid',
        supplier: 'CPRI Shimla',
        pricePerKg: 60,
        germinationRate: 95,
        maturityDays: 90,
        expectedYield: '30-35 tons/hectare',
        waterRequirement: 'Medium',
        diseaseResistance: ['Late Blight', 'Common Scab'],
        soilSuitability: ['Alluvial Soil', 'Red Soil'],
        climateSuitability: ['Temperate', 'Cool Subtropical'],
        marketDemand: 88,
        profitPotential: 90,
        aiScore: 87,
        recommendations: {
          plantingTips: ['Plant certified seed tubers', '20cm depth planting', 'Avoid waterlogged fields'],
          careInstructions: ['Earthing up at 30 days', 'Regular irrigation in tuber development', 'Integrated pest management'],
          harvestGuidance: ['Harvest after skin set', 'Avoid damage during digging', 'Grade and store properly'],
          marketTiming: 'Processing industry demand: Year-round'
        },
        certifications: ['CPRI Certified', 'Processing Grade'],
        reviews: { rating: 4.5, farmerCount: 750, successRate: 88 }
      },
      {
        id: 'chili-export',
        name: 'Teja Export Quality',
        crop: 'Chili',
        type: 'hybrid',
        supplier: 'Andhra Seeds Ltd',
        pricePerKg: 1200,
        germinationRate: 88,
        maturityDays: 100,
        expectedYield: '8-12 tons/hectare',
        waterRequirement: 'Medium',
        diseaseResistance: ['Anthracnose', 'Leaf Curl Virus'],
        soilSuitability: ['Black Soil', 'Red Soil', 'Alluvial Soil'],
        climateSuitability: ['Tropical', 'Sub-tropical'],
        marketDemand: 94,
        profitPotential: 92,
        aiScore: 91,
        recommendations: {
          plantingTips: ['Nursery raising for 35 days', 'Transplant in evening', 'Maintain plant spacing 45x30cm'],
          careInstructions: ['Drip irrigation preferred', 'Stake tall varieties', 'Balanced NPK application'],
          harvestGuidance: ['Multiple harvests possible', 'Red ripe stage for export', 'Sun dry to 8-10% moisture'],
          marketTiming: 'Export season: October-March'
        },
        certifications: ['Export Quality', 'Spice Board Approved'],
        reviews: { rating: 4.7, farmerCount: 650, successRate: 90 }
      },
      {
        id: 'rice-basmati',
        name: 'Pusa Basmati 1718',
        crop: 'Rice',
        type: 'hybrid',
        supplier: 'IARI New Delhi',
        pricePerKg: 150,
        germinationRate: 92,
        maturityDays: 140,
        expectedYield: '5-6 tons/hectare',
        waterRequirement: 'High',
        diseaseResistance: ['Bacterial Leaf Blight', 'Brown Plant Hopper'],
        soilSuitability: ['Alluvial Soil', 'Clay Soil'],
        climateSuitability: ['Tropical', 'Subtropical'],
        marketDemand: 96,
        profitPotential: 89,
        aiScore: 90,
        recommendations: {
          plantingTips: ['Nursery in puddle field', 'Transplant 20-25 day seedlings', 'Maintain 2-3cm water level'],
          careInstructions: ['Continuous water management', 'Weed control in early stages', 'Balanced fertilization'],
          harvestGuidance: ['Harvest at 80% grain maturity', 'Proper drying essential', 'Quality grading important'],
          marketTiming: 'Premium prices for quality grain'
        },
        certifications: ['Basmati Export Quality', 'IARI Developed'],
        reviews: { rating: 4.8, farmerCount: 2100, successRate: 91 }
      }
    ];

    // AI scoring algorithm
    const calculateAIScore = (seed: SeedVariety, farmData: FarmData): number => {
      let score = 50; // Base score
      
      // Soil compatibility
      if (seed.soilSuitability.includes(farmData.soilType)) score += 15;
      
      // Season compatibility
      if (farmData.season === 'Kharif (Monsoon)' && seed.waterRequirement !== 'Low') score += 10;
      if (farmData.season === 'Rabi (Winter)' && seed.waterRequirement !== 'High') score += 10;
      
      // Priority matching
      if (farmData.priority === 'profit' && seed.profitPotential > 85) score += 15;
      if (farmData.priority === 'yield' && parseFloat(seed.expectedYield.split('-')[1]) > 30) score += 15;
      if (farmData.priority === 'quality' && seed.reviews.rating > 4.5) score += 15;
      
      // Experience level
      if (farmData.experience === 'beginner' && seed.reviews.successRate > 85) score += 10;
      if (farmData.experience === 'expert' && seed.type === 'hybrid') score += 5;
      
      // Budget consideration
      const seedCostPerAcre = (seed.pricePerKg * 2); // Assuming 2kg per acre
      if (seedCostPerAcre <= farmData.budget * 0.1) score += 10; // Seed cost should be <10% of budget
      
      return Math.min(100, score);
    };

    // Score all seeds
    const scoredSeeds = seedDatabase.map(seed => ({
      ...seed,
      aiScore: calculateAIScore(seed, data)
    }));

    // Sort by AI score
    const topSeeds = scoredSeeds
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 3);

    const alternativeOptions = scoredSeeds
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(3, 6);

    return {
      topSeeds,
      alternativeOptions,
      seasonalTrends: [
        {
          trend: `${data.season} season optimal for high-value crops`,
          impact: 'Market prices 15-20% higher than off-season',
          recommendation: 'Focus on premium quality varieties with export potential'
        },
        {
          trend: 'Increasing demand for organic produce',
          impact: '30-40% price premium for certified organic',
          recommendation: 'Consider transitioning to organic seed varieties'
        }
      ],
      marketInsights: {
        currentPrices: [
          { crop: 'Tomato', price: 25, trend: 'up' as const },
          { crop: 'Onion', price: 18, trend: 'stable' as const },
          { crop: 'Potato', price: 12, trend: 'down' as const }
        ],
        demandForecast: 'High demand expected for vegetables in upcoming festival season',
        exportOpportunities: ['Basmati Rice to Middle East', 'Chilies to Bangladesh', 'Onions to Southeast Asia']
      },
      riskAnalysis: {
        weatherRisk: `${weatherData?.forecast || 'Normal'} conditions predicted - adjust irrigation accordingly`,
        marketRisk: 'Moderate - diversify with 2-3 crops to spread risk',
        diseaseRisk: 'Low to moderate - ensure proper seed treatment',
        mitigation: [
          'Use certified disease-resistant varieties',
          'Implement drip irrigation for water efficiency',
          'Set up weather monitoring for early warnings',
          'Join farmer producer organizations for better market access'
        ]
      },
      customizedAdvice: [
        `For ${data.farmSize} acres, invest ₹${Math.round(data.budget * 0.15)} in quality seeds`,
        `${data.experience} farmers should focus on ${data.experience === 'beginner' ? 'proven varieties with high success rates' : 'innovative high-yield varieties'}`,
        `${data.location} region benefits from ${data.soilType.toLowerCase()} specific varieties`,
        `Your ${data.priority} priority aligns perfectly with the recommended seed selection`
      ]
    };
  };

  const handleAnalyze = async () => {
    if (!farmData.location || !farmData.soilType || !farmData.season) {
      toast({
        title: "Missing Information",
        description: "Please fill in location, soil type, and season to get AI recommendations.",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    setRealTimeUpdate(true);

    try {
      toast({
        title: "🤖 AI Analysis Started",
        description: "Processing real-time market data, weather conditions, and seed performance...",
      });

      const result = await generateAISeedRecommendations(farmData);
      setRecommendations(result);
      setRealTimeUpdate(false);

      toast({
        title: "✅ AI Recommendations Ready!",
        description: `Found ${result.topSeeds.length} optimal seed varieties based on your specific requirements.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Please try again or check your internet connection.",
        variant: "destructive"
      });
      setRealTimeUpdate(false);
    } finally {
      setAnalyzing(false);
    }
  };

  const SeedCard: React.FC<{ seed: SeedVariety; isTop?: boolean }> = ({ seed, isTop = false }) => (
    <Card className={`transition-all hover:shadow-lg ${isTop ? 'border-green-500 border-2' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{seed.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{seed.crop} • {seed.type}</p>
          </div>
          <Badge className={`${seed.aiScore >= 90 ? 'bg-green-500' : seed.aiScore >= 80 ? 'bg-blue-500' : 'bg-orange-500'}`}>
            AI Score: {seed.aiScore}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span>₹{seed.pricePerKg}/kg</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{seed.maturityDays} days</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span>{seed.expectedYield}</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-600" />
            <span>{seed.waterRequirement}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Market Demand</span>
            <Badge variant="outline">{seed.marketDemand}%</Badge>
          </div>
          <Progress value={seed.marketDemand} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Profit Potential</span>
            <Badge variant="outline">{seed.profitPotential}%</Badge>
          </div>
          <Progress value={seed.profitPotential} className="h-2" />
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Disease Resistance:</p>
          <div className="flex flex-wrap gap-1">
            {seed.diseaseResistance.slice(0, 2).map((disease, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                {disease}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Farmer Reviews:</p>
          <div className="flex items-center gap-2 text-sm">
            <Award className="w-4 h-4 text-yellow-500" />
            <span>{seed.reviews.rating}/5.0 ({seed.reviews.farmerCount} farmers)</span>
          </div>
        </div>

        <div className="bg-muted p-3 rounded-lg">
          <p className="text-sm font-medium mb-1">AI Recommendation:</p>
          <p className="text-xs text-muted-foreground">{seed.recommendations.marketTiming}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            AI-Powered Seed Recommendation System
          </CardTitle>
          <p className="text-muted-foreground">
            Get real-time, personalized seed recommendations based on AI analysis of soil, weather, market trends, and farming conditions.
          </p>
        </CardHeader>
      </Card>

      {/* Real-time Status */}
      {weatherData && (
        <Card className="border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  <span className="text-sm">{Math.round(weatherData.temperature)}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{Math.round(weatherData.humidity)}% humidity</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{weatherData.forecast}</span>
                </div>
              </div>
              {realTimeUpdate && (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Live updates</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Farm & Requirements Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="location">Farm Location</Label>
              <Input
                id="location"
                placeholder="e.g., Bangalore, Karnataka"
                value={farmData.location}
                onChange={(e) => setFarmData({...farmData, location: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="soilType">Soil Type</Label>
              <Select value={farmData.soilType} onValueChange={(value) => setFarmData({...farmData, soilType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alluvial Soil">Alluvial Soil</SelectItem>
                  <SelectItem value="Black Soil">Black Soil</SelectItem>
                  <SelectItem value="Red Soil">Red Soil</SelectItem>
                  <SelectItem value="Laterite Soil">Laterite Soil</SelectItem>
                  <SelectItem value="Clay Soil">Clay Soil</SelectItem>
                  <SelectItem value="Sandy Soil">Sandy Soil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="season">Growing Season</Label>
              <Select value={farmData.season} onValueChange={(value) => setFarmData({...farmData, season: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kharif (Monsoon)">Kharif (Monsoon)</SelectItem>
                  <SelectItem value="Rabi (Winter)">Rabi (Winter)</SelectItem>
                  <SelectItem value="Zaid (Summer)">Zaid (Summer)</SelectItem>
                  <SelectItem value="Year Round">Year Round</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="farmSize">Farm Size (acres)</Label>
              <Input
                id="farmSize"
                type="number"
                min="0.1"
                step="0.1"
                value={farmData.farmSize}
                onChange={(e) => setFarmData({...farmData, farmSize: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget (₹)</Label>
              <Input
                id="budget"
                type="number"
                min="1000"
                step="1000"
                value={farmData.budget}
                onChange={(e) => setFarmData({...farmData, budget: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={farmData.priority} onValueChange={(value) => setFarmData({...farmData, priority: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profit">Maximum Profit</SelectItem>
                  <SelectItem value="yield">High Yield</SelectItem>
                  <SelectItem value="quality">Premium Quality</SelectItem>
                  <SelectItem value="sustainability">Sustainability</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Select value={farmData.experience} onValueChange={(value) => setFarmData({...farmData, experience: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            size="lg"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                AI Analysis in Progress...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Get AI-Powered Seed Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {recommendations && (
        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommendations">Top Seeds</TabsTrigger>
            <TabsTrigger value="market">Market Insights</TabsTrigger>
            <TabsTrigger value="trends">Seasonal Trends</TabsTrigger>
            <TabsTrigger value="advice">Custom Advice</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            {/* Top Recommendations */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                🏆 AI Top Recommendations
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {recommendations.topSeeds.map((seed, index) => (
                  <SeedCard key={seed.id} seed={seed} isTop={true} />
                ))}
              </div>
            </div>

            {/* Alternative Options */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-500" />
                Alternative Options
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {recommendations.alternativeOptions.map(seed => (
                  <SeedCard key={seed.id} seed={seed} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            {/* Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Real-time Market Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Current Market Prices</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {recommendations.marketInsights.currentPrices.map((price, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded">
                        <span>{price.crop}</span>
                        <div className="flex items-center gap-2">
                          <span>₹{price.price}/kg</span>
                          <Badge className={
                            price.trend === 'up' ? 'bg-green-500' : 
                            price.trend === 'down' ? 'bg-red-500' : 'bg-gray-500'
                          }>
                            {price.trend}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Export Opportunities</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {recommendations.marketInsights.exportOpportunities.map((opportunity, idx) => (
                      <li key={idx}>{opportunity}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Demand Forecast</h4>
                  <p className="text-sm">{recommendations.marketInsights.demandForecast}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* Seasonal Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Seasonal Trends & Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.seasonalTrends.map((trend, idx) => (
                    <div key={idx} className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium">{trend.trend}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{trend.impact}</p>
                      <p className="text-sm bg-green-50 p-2 rounded">{trend.recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Risk Analysis & Mitigation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-3 bg-yellow-50 rounded">
                    <h4 className="font-medium text-yellow-800">Weather Risk</h4>
                    <p className="text-sm text-yellow-700">{recommendations.riskAnalysis.weatherRisk}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <h4 className="font-medium text-blue-800">Market Risk</h4>
                    <p className="text-sm text-blue-700">{recommendations.riskAnalysis.marketRisk}</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded">
                    <h4 className="font-medium text-red-800">Disease Risk</h4>
                    <p className="text-sm text-red-700">{recommendations.riskAnalysis.diseaseRisk}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Mitigation Strategies</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {recommendations.riskAnalysis.mitigation.map((strategy, idx) => (
                      <li key={idx}>{strategy}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advice" className="space-y-6">
            {/* Customized Advice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Personalized AI Advice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.customizedAdvice.map((advice, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-sm">{advice}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AIBasedSeedRecommendation;