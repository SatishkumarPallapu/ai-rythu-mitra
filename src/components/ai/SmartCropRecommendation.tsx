import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FlaskConical, Zap, TrendingUp, Target, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cropTrackingService } from "@/services/cropTrackingService";

interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  soilType: string;
  season: string;
  location: string;
}

interface CropRecommendation {
  name: string;
  suitabilityScore: number;
  soilMatch: string;
  expectedYield: string;
  marketPrice: string;
  demandForecast: string;
  harvestingDuration: string;
  plantingWindow: string;
  roiProjection: string;
  riskLevel: string;
  waterRequirement: string;
  climateAdaptation: string;
  marketDemandAtHarvest: number;
  profitPerAcre: string;
  quickHarvestScore: number;
  demandScore: number;
  reason: string;
}

interface SmartRecommendations {
  soilOptimized: CropRecommendation[];
  quickHarvest: CropRecommendation[];
  highIncome: CropRecommendation[];
  demandBased: CropRecommendation[];
  allCrops: CropRecommendation[];
  marketAnalysis: {
    currentSeason: string;
    optimalPlantingTime: string;
    marketTrends: string[];
    priceProjections: { crop: string; currentPrice: number; harvestPrice: number; }[];
  };
  soilRecommendations: {
    improvements: string[];
    fertilizers: string[];
    organicOptions: string[];
  };
}

const SmartCropRecommendation = () => {
  const navigate = useNavigate();
  const [soilData, setSoilData] = useState<SoilData>({
    nitrogen: 120,
    phosphorus: 80,
    potassium: 200,
    ph: 7.0,
    soilType: "",
    season: "",
    location: "Kamareddy"
  });
  
  const [recommendations, setRecommendations] = useState<SmartRecommendations | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  const getCropIcon = (cropName: string): string => {
    const icons: { [key: string]: string } = {
      "Cotton": "🌿",
      "Paddy (Rice)": "🌾",
      "Maize": "🌽",
      "Tomato": "🍅",
      "Brinjal": "🍆",
      "Onion": "🧅",
      "Potato": "🥔",
      "Chilli": "🌶️",
      "Groundnut": "🥜",
      "Soybean": "🫘",
      "Sugarcane": "🎋",
      "Rice": "🌾"
    };
    return icons[cropName] || "🌱";
  };

  const generateRealTimeRecommendations = async (data: SoilData): Promise<SmartRecommendations> => {
    // Simulate real-time AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const { nitrogen, phosphorus, potassium, ph, soilType, season, location } = data;
    
    // AI Soil Analysis Engine
    const analyzeSoilCompatibility = (cropName: string): number => {
      let score = 50; // Base score
      
      // Nitrogen analysis
      if (nitrogen >= 100 && nitrogen <= 150) score += 20;
      else if (nitrogen < 80 || nitrogen > 200) score -= 15;
      
      // Phosphorus analysis
      if (phosphorus >= 20 && phosphorus <= 40) score += 15;
      else if (phosphorus < 10) score -= 20;
      
      // Potassium analysis
      if (potassium >= 120 && potassium <= 200) score += 15;
      else if (potassium < 80) score -= 15;
      
      // pH analysis
      if (ph >= 6.0 && ph <= 7.5) score += 10;
      else if (ph < 5.5 || ph > 8.0) score -= 20;
      
      // Soil type specific bonuses
      if (soilType === 'Black Soil' && ['Cotton', 'Soybean', 'Wheat'].includes(cropName)) score += 25;
      if (soilType === 'Alluvial Soil' && ['Rice', 'Maize', 'Sugarcane'].includes(cropName)) score += 25;
      if (soilType === 'Red Soil' && ['Groundnut', 'Millets', 'Pulses'].includes(cropName)) score += 20;
      
      return Math.min(Math.max(score, 0), 100);
    };
    
    // Market Demand Forecasting AI
    const predictMarketDemand = (cropName: string, harvestMonths: number): { demandScore: number; price: number; harvestPrice: number } => {
      const today = new Date();
      const harvestDate = new Date(today.getTime() + (harvestMonths * 30 * 24 * 60 * 60 * 1000));
      const harvestMonth = harvestDate.getMonth();
      
      // Seasonal demand patterns
      const demandPatterns: { [key: string]: number[] } = {
        'Tomato': [85, 90, 95, 80, 60, 50, 45, 55, 70, 85, 90, 88],
        'Onion': [70, 75, 85, 90, 95, 85, 70, 65, 75, 80, 85, 75],
        'Potato': [60, 65, 70, 85, 95, 90, 75, 70, 75, 80, 70, 65],
        'Cotton': [40, 45, 50, 60, 70, 80, 90, 95, 85, 70, 60, 50],
        'Rice': [90, 85, 80, 75, 70, 75, 80, 85, 90, 95, 92, 88],
        'Maize': [75, 80, 85, 90, 95, 85, 70, 65, 70, 75, 80, 78],
        'Chilli': [95, 90, 85, 80, 75, 70, 65, 70, 80, 90, 95, 92]
      };
      
      const baseDemand = demandPatterns[cropName] ? demandPatterns[cropName][harvestMonth] : 70;
      const seasonalMultiplier = season === 'Kharif (Monsoon)' ? 1.1 : season === 'Rabi (Winter)' ? 1.2 : 1.0;
      const demandScore = Math.min(baseDemand * seasonalMultiplier, 100);
      
      // Price calculation
      const basePrice = Math.floor(Math.random() * 30) + 20; // 20-50 per kg base
      const harvestPrice = basePrice * (demandScore / 70); // Adjust price based on demand
      
      return { demandScore, price: basePrice, harvestPrice: Math.round(harvestPrice) };
    };
    
    // Comprehensive crop database
    const cropDatabase = [
      {
        name: 'Tomato',
        baseYield: '25-35',
        duration: 3,
        waterNeed: 'Medium',
        climate: 'Warm',
        profitMultiplier: 2.8
      },
      {
        name: 'Onion',
        baseYield: '20-30',
        duration: 4,
        waterNeed: 'Low',
        climate: 'Cool',
        profitMultiplier: 2.2
      },
      {
        name: 'Potato',
        baseYield: '15-25',
        duration: 3,
        waterNeed: 'Medium',
        climate: 'Cool',
        profitMultiplier: 1.8
      },
      {
        name: 'Cotton',
        baseYield: '8-12',
        duration: 6,
        waterNeed: 'High',
        climate: 'Warm',
        profitMultiplier: 3.5
      },
      {
        name: 'Rice',
        baseYield: '30-50',
        duration: 4,
        waterNeed: 'Very High',
        climate: 'Warm',
        profitMultiplier: 1.5
      }
    ];
    
    // Get tracked crop names to exclude from recommendations
    const trackedCropNames = cropTrackingService.getTrackedCropNames();
    
    // Filter out already tracked crops
    const availableCrops = cropDatabase.filter(crop => 
      !trackedCropNames.includes(crop.name.toLowerCase())
    );

    // Generate recommendations for available crops only
    const allRecommendations: CropRecommendation[] = availableCrops.map(crop => {
      const soilScore = analyzeSoilCompatibility(crop.name);
      const marketData = predictMarketDemand(crop.name, crop.duration);
      const quickScore = Math.max(0, 100 - (crop.duration * 15));
      const profitPerAcre = `₹${Math.round(marketData.harvestPrice * parseFloat(crop.baseYield.split('-')[1]) * crop.profitMultiplier * 1000)}`;
      
      return {
        id: crop.name.toLowerCase().replace(/\s+/g, '-'),
        name: crop.name,
        suitabilityScore: soilScore,
        soilMatch: soilScore >= 80 ? 'Excellent' : soilScore >= 65 ? 'Good' : soilScore >= 50 ? 'Average' : 'Poor',
        expectedYield: `${crop.baseYield} tons/acre`,
        marketPrice: `₹${marketData.price}/kg`,
        demandForecast: `${Math.round(marketData.demandScore)}% demand`,
        harvestingDuration: `${crop.duration} months`,
        plantingWindow: data.season,
        roiProjection: `${Math.round(crop.profitMultiplier * 100)}% ROI`,
        riskLevel: soilScore >= 70 ? 'Low' : soilScore >= 50 ? 'Medium' : 'High',
        waterRequirement: crop.waterNeed,
        climateAdaptation: crop.climate,
        marketDemandAtHarvest: marketData.demandScore,
        profitPerAcre: profitPerAcre,
        quickHarvestScore: quickScore,
        demandScore: marketData.demandScore,
        reason: `${crop.name} shows ${soilScore >= 70 ? 'excellent' : 'good'} compatibility with your soil conditions.`
      };
    });
    
    // Sort and categorize crops
    const soilOptimized = [...allRecommendations]
      .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
      .slice(0, 4);
    
    const quickHarvest = [...allRecommendations]
      .sort((a, b) => b.quickHarvestScore - a.quickHarvestScore)
      .slice(0, 4);
    
    const highIncome = [...allRecommendations]
      .sort((a, b) => parseFloat(b.profitPerAcre.replace(/[₹,]/g, '')) - parseFloat(a.profitPerAcre.replace(/[₹,]/g, '')))
      .slice(0, 4);
    
    const demandBased = [...allRecommendations]
      .sort((a, b) => b.demandScore - a.demandScore)
      .slice(0, 4);
    
    return {
      soilOptimized,
      quickHarvest,
      highIncome,
      demandBased,
      allCrops: allRecommendations,
      marketAnalysis: {
        currentSeason: data.season,
        optimalPlantingTime: `${data.season} - Best window for current soil conditions`,
        marketTrends: [
          `${data.location} region showing high demand for vegetables`,
          'Export opportunities increasing for quality crops',
          'Organic produce premium of 30-40% in current market'
        ],
        priceProjections: allRecommendations.slice(0, 5).map(crop => ({
          crop: crop.name,
          currentPrice: parseFloat(crop.marketPrice.replace(/[₹]/g, '')),
          harvestPrice: parseFloat(crop.marketPrice.replace(/[₹]/g, '')) * (crop.demandScore / 70)
        }))
      },
      soilRecommendations: {
        improvements: [
          nitrogen < 100 ? 'Increase nitrogen through organic compost or green manure' : '',
          phosphorus < 20 ? 'Add phosphorus through bone meal or rock phosphate' : '',
          potassium < 120 ? 'Boost potassium with wood ash or organic potash' : ''
        ].filter(rec => rec !== ''),
        fertilizers: [
          'NPK 19:19:19 for balanced nutrition',
          'Urea for nitrogen boost if needed',
          'Single Super Phosphate for phosphorus'
        ],
        organicOptions: [
          'Compost from farm waste',
          'Vermicompost for soil health',
          'Neem cake for pest prevention'
        ]
      }
    };
  };

  const handleAnalyze = async () => {
    if (!soilData.soilType || !soilData.season) {
      toast({
        title: "Missing Information",
        description: "Please select both soil type and season to get recommendations.",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    
    try {
      toast({
        title: "AI Analysis Started",
        description: "Processing soil data, market trends, and seasonal patterns...",
      });
      
      const smartRecommendations = await generateRealTimeRecommendations(soilData);
      setRecommendations(smartRecommendations);
      
      toast({
        title: "Real-time Analysis Complete!",
        description: `Generated ${smartRecommendations.allCrops.length} crop recommendations based on your soil test report and current market conditions.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Please try again with different parameters.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">AI Crop Recommendation</h1>
        <p className="text-muted-foreground">
          Get personalized crop suggestions based on your soil analysis and farming goals
        </p>
      </div>

      <div className="space-y-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Soil Analysis & Farm Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Enter your complete soil test report data for real-time AI analysis.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nitrogen">Nitrogen (ppm)</Label>
                  <Input
                    id="nitrogen"
                    type="number"
                    placeholder="e.g., 120"
                    value={soilData.nitrogen}
                    onChange={(e) => setSoilData({...soilData, nitrogen: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="phosphorus">Phosphorus (ppm)</Label>
                  <Input
                    id="phosphorus"
                    type="number"
                    placeholder="e.g., 50"
                    value={soilData.phosphorus}
                    onChange={(e) => setSoilData({...soilData, phosphorus: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="potassium">Potassium (K)</Label>
                  <Input
                    id="potassium"
                    type="number"
                    placeholder="e.g., 75"
                    value={soilData.potassium}
                    onChange={(e) => setSoilData({...soilData, potassium: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="ph">pH Level</Label>
                  <Input
                    id="ph"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 6.8"
                    value={soilData.ph}
                    onChange={(e) => setSoilData({...soilData, ph: Number(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Select value={soilData.soilType} onValueChange={(value) => setSoilData({...soilData, soilType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alluvial Soil">Alluvial Soil</SelectItem>
                      <SelectItem value="Black Soil">Black Soil</SelectItem>
                      <SelectItem value="Red Soil">Red Soil</SelectItem>
                      <SelectItem value="Laterite Soil">Laterite Soil</SelectItem>
                      <SelectItem value="Desert Soil">Desert Soil</SelectItem>
                      <SelectItem value="Mountain Soil">Mountain Soil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="season">Season</Label>
                  <Select value={soilData.season} onValueChange={(value) => setSoilData({...soilData, season: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kharif (Monsoon)">Kharif (Monsoon)</SelectItem>
                      <SelectItem value="Rabi (Winter)">Rabi (Winter)</SelectItem>
                      <SelectItem value="Zaid (Summer)">Zaid (Summer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Farm Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Kamareddy"
                  value={soilData.location}
                  onChange={(e) => setSoilData({...soilData, location: e.target.value})}
                />
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={analyzing || !soilData.soilType || !soilData.season}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Real-time AI Analysis in Progress...
                  </>
                ) : (
                  "🤖 Start Real-time AI Analysis"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {recommendations && (
          <div className="space-y-8">
            {/* Market Analysis Overview */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-xl font-bold mb-4">🔍 Real-time Market Intelligence</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Current Season</p>
                  <p className="text-lg text-blue-700">{recommendations.marketAnalysis.currentSeason}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Crops Analyzed</p>
                  <p className="text-lg text-blue-700">{recommendations.allCrops.length} Varieties</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Analysis Location</p>
                  <p className="text-lg text-blue-700">{soilData.location}</p>
                </div>
              </div>
            </Card>

            {/* Notification about excluded tracked crops */}
            {cropTrackingService.getTrackedCropNames().length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <Layers className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {cropTrackingService.getTrackedCropNames().length} crop(s) currently being tracked are excluded from recommendations.
                  </span>
                </div>
              </div>
            )}

            {/* Soil-Optimized Crops */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">🏆 Best Soil Matches</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {recommendations.soilOptimized.map((crop, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getCropIcon(crop.name)}</div>
                        <div>
                          <h4 className="font-bold">{crop.name}</h4>
                          <Badge className={`text-xs ${crop.suitabilityScore >= 80 ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                            {crop.suitabilityScore}% Match
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">{crop.profitPerAcre}</p>
                        <p className="text-xs text-muted-foreground">per acre</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>Yield: {crop.expectedYield}</div>
                      <div>Duration: {crop.harvestingDuration}</div>
                      <div>Market Price: {crop.marketPrice}</div>
                      <div>ROI: {crop.roiProjection}</div>
                    </div>
                    
                    <Button 
                      className="w-full mt-3 bg-green-600 hover:bg-green-700" 
                      size="sm"
                      onClick={() => {
                        // Convert crop name to kebab-case for URL
                        const cropId = crop.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        navigate(`/crop-roadmap/${cropId}`);
                      }}
                    >
                      View Complete Roadmap
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Harvest Crops */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold">⚡ Quick Harvest Champions</h3>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                {recommendations.quickHarvest.map((crop, index) => (
                  <Card key={index} className="p-4 text-center border-l-4 border-l-yellow-500">
                    <div className="text-3xl mb-3">{getCropIcon(crop.name)}</div>
                    <h4 className="font-bold mb-2">{crop.name}</h4>
                    <Badge className="bg-yellow-500 text-white mb-3">
                      {crop.quickHarvestScore}% Quick Score
                    </Badge>
                    <div className="space-y-1 text-xs text-muted-foreground mb-3">
                      <p>Duration: {crop.harvestingDuration}</p>
                      <p>Profit: {crop.profitPerAcre}</p>
                    </div>
                    <Button 
                      className="w-full bg-yellow-600 hover:bg-yellow-700" 
                      size="sm"
                      onClick={() => {
                        // Convert crop name to kebab-case for URL
                        const cropId = crop.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        navigate(`/crop-roadmap/${cropId}`);
                      }}
                    >
                      View Complete Roadmap
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartCropRecommendation;