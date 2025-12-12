import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, TrendingUp, Clock, DollarSign, Shield, Leaf, Target, Calendar, MapPin, FlaskConical, Brain, Zap, Home, Award, Info, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cropTrackingService } from "@/services/cropTrackingService";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  location: string;
  language: string;
  farmSize: number;
  experience: string;
  irrigationType: string;
  climateZone: string;
}

interface CropRecommendation {
  id: string;
  name: string;
  category: string;
  scientificName: string;
  soilCompatibility: number;
  expectedYield: string;
  duration: number; // days
  waterRequirement: 'Low' | 'Medium' | 'High';
  profitPotential: number;
  marketDemand: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  currentPrice: number;
  harvestPrice: number;
  inputCost: number;
  roi: number;
  reasons: string[];
  tips: string[];
  marketTiming: string;
  fertilizers: string[];
  diseases: string[];
  companions: string[];
  climate: string[];
  harvestMonth: string;
}

interface MultiCropStrategy {
  id: string;
  name: string;
  description: string;
  crops: string[];
  totalDuration: number;
  landUtilization: number;
  expectedProfit: number;
  riskMitigation: string[];
  implementation: string[];
  seasonalPlan: {
    season: string;
    crops: string[];
    activities: string[];
  }[];
}

interface StrategicRecommendations {
  soilOptimized: CropRecommendation[];
  quickHarvest: CropRecommendation[];
  marketTimed: CropRecommendation[];
  highProfit: CropRecommendation[];
  modernFarming: CropRecommendation[];
  multiCropStrategies: MultiCropStrategy[];
  analysis: {
    soilHealth: string;
    recommendations: string[];
    marketOutlook: string;
    riskFactors: string[];
    investmentAdvice: string;
  };
}

const AIStrategicCropAdvisor: React.FC = () => {
  const navigate = useNavigate();
  const [soilData, setSoilData] = useState<SoilData>({
    nitrogen: 120,
    phosphorus: 25,
    potassium: 180,
    ph: 6.8,
    location: '',
    language: 'English',
    farmSize: 2,
    experience: 'intermediate',
    irrigationType: 'drip',
    climateZone: 'tropical'
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<StrategicRecommendations | null>(null);
  const [activeStrategy, setActiveStrategy] = useState<string>('soil-optimized');
  const { toast } = useToast();

  const generateStrategicRecommendations = async (data: SoilData): Promise<StrategicRecommendations> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 4500));

    // Quick-Income Crop Database (30-120 Days for Monthly Earnings)
    const cropDatabase: CropRecommendation[] = [
      // Ultra-Fast Leafy Greens (30-45 Days)
      {
        id: 'coriander-quick',
        name: 'Coriander',
        category: 'leafy',
        scientificName: 'Coriandrum sativum',
        soilCompatibility: calculateSoilScore('coriander', data),
        expectedYield: '8-12 tons/hectare',
        duration: 45,
        waterRequirement: 'Low',
        profitPotential: 92,
        marketDemand: 95,
        riskLevel: 'Low',
        currentPrice: 40,
        harvestPrice: 50,
        inputCost: 10000,
        roi: 500,
        reasons: ['Ready in 30-45 days', 'Dual purpose: leaves and seeds', 'Steady spice market demand'],
        tips: ['Sow in December for Rabi season', 'Harvest leaves multiple times', 'Direct market sales'],
        marketTiming: 'Dec sowing for Feb-Mar harvest peak',
        fertilizers: ['NPK 20:20:20', 'Urea for leaf growth'],
        diseases: ['Powdery mildew', 'Aphids'],
        companions: ['Spinach', 'Radish', 'Fenugreek'],
        climate: ['Temperature: 15-25°C', 'Cool weather preferred'],
        harvestMonth: getHarvestMonth(45)
      },
      {
        id: 'spinach-urban',
        name: 'Spinach',
        category: 'leafy',
        scientificName: 'Spinacia oleracea',
        soilCompatibility: calculateSoilScore('spinach', data),
        expectedYield: '6-10 tons/hectare',
        duration: 35,
        waterRequirement: 'Low',
        profitPotential: 88,
        marketDemand: 90,
        riskLevel: 'Low',
        currentPrice: 30,
        harvestPrice: 40,
        inputCost: 8000,
        roi: 400,
        reasons: ['Ready in 25-45 days', 'High urban fresh demand', 'Minimal water needs'],
        tips: ['Multiple cuttings possible', 'Direct sales to restaurants', 'Succession planting'],
        marketTiming: 'Winter sowing for peak demand',
        fertilizers: ['Balanced NPK', 'Nitrogen boost'],
        diseases: ['Downy mildew', 'Leaf miners'],
        companions: ['Radish', 'Carrot', 'Onion'],
        climate: ['Temperature: 10-20°C', 'Cool season crop'],
        harvestMonth: getHarvestMonth(35)
      },
      {
        id: 'fenugreek-dual',
        name: 'Fenugreek (Methi)',
        category: 'leafy',
        scientificName: 'Trigonella foenum-graecum',
        soilCompatibility: calculateSoilScore('fenugreek', data),
        expectedYield: '4-8 tons/hectare',
        duration: 40,
        waterRequirement: 'Low',
        profitPotential: 85,
        marketDemand: 88,
        riskLevel: 'Low',
        currentPrice: 35,
        harvestPrice: 45,
        inputCost: 7000,
        roi: 450,
        reasons: ['Ready in 30-40 days', 'Dual purpose: leaves + seeds', 'Medicinal value adds premium'],
        tips: ['Harvest leaves first, then seeds', 'Nitrogen-fixing benefits soil', 'Popular in North Indian cuisine'],
        marketTiming: 'Year-round demand for fresh leaves',
        fertilizers: ['Minimal fertilizer needed', 'Phosphorus for seed development'],
        diseases: ['Powdery mildew', 'Root rot'],
        companions: ['Coriander', 'Spinach', 'Wheat'],
        climate: ['Temperature: 15-25°C', 'Cool dry weather'],
        harvestMonth: getHarvestMonth(40)
      },
      // Quick Root Vegetables (30-60 Days)
      {
        id: 'radish-winter',
        name: 'Radish (Japanese White)',
        category: 'root',
        scientificName: 'Raphanus sativus',
        soilCompatibility: calculateSoilScore('radish', data),
        expectedYield: '15-20 tons/hectare',
        duration: 35,
        waterRequirement: 'Low',
        profitPotential: 82,
        marketDemand: 90,
        riskLevel: 'Low',
        currentPrice: 12,
        harvestPrice: 18,
        inputCost: 10000,
        roi: 400,
        reasons: ['Ready in 30-40 days', 'Winter salad peak demand', 'High yield on marginal land'],
        tips: ['December sowing for winter harvest', 'Deep tillage for straight roots', 'Fresh market premium'],
        marketTiming: 'Dec sowing for Jan-Feb peak demand',
        fertilizers: ['Balanced NPK', 'Avoid fresh manure'],
        diseases: ['Club root', 'Flea beetles'],
        companions: ['Carrot', 'Beetroot', 'Turnip'],
        climate: ['Temperature: 10-18°C', 'Cool weather crop'],
        harvestMonth: getHarvestMonth(35)
      },
      {
        id: 'beetroot-dual',
        name: 'Beetroot (Dual Purpose)',
        category: 'root',
        scientificName: 'Beta vulgaris',
        soilCompatibility: calculateSoilScore('beetroot', data),
        expectedYield: '10-15 tons/hectare',
        duration: 35,
        waterRequirement: 'Low',
        profitPotential: 85,
        marketDemand: 85,
        riskLevel: 'Low',
        currentPrice: 20,
        harvestPrice: 28,
        inputCost: 12000,
        roi: 450,
        reasons: ['Dual income: leaves + roots', 'Ready in 21-45 days', 'High nutritional value'],
        tips: ['Harvest leaves first for early income', 'Roots ready in 6-8 weeks', 'Both fresh and processed markets'],
        marketTiming: 'Winter growing for peak demand',
        fertilizers: ['NPK with micronutrients', 'Boron supplement'],
        diseases: ['Leaf spot', 'Root rot'],
        companions: ['Radish', 'Carrot', 'Onion'],
        climate: ['Temperature: 15-20°C', 'Cool season preferred'],
        harvestMonth: getHarvestMonth(35)
      },
      // High-Yield Vegetables (50-90 Days)
      {
        id: 'okra-multiple',
        name: 'Okra (Hybrid)',
        category: 'vegetable',
        scientificName: 'Abelmoschus esculentus',
        soilCompatibility: calculateSoilScore('okra', data),
        expectedYield: '15-20 tons/hectare',
        duration: 70,
        waterRequirement: 'Medium',
        profitPotential: 92,
        marketDemand: 95,
        riskLevel: 'Low',
        currentPrice: 25,
        harvestPrice: 35,
        inputCost: 18000,
        roi: 833,
        reasons: ['Multiple pickings over 60-75 days', 'Processing demand (frozen/dried)', 'Consistent fresh market demand'],
        tips: ['Regular harvesting every 2-3 days', 'Tender pods fetch premium prices', 'Contract with processing units'],
        marketTiming: 'Year-round cultivation possible',
        fertilizers: ['High potash NPK', 'Organic matter'],
        diseases: ['Yellow mosaic virus', 'Aphids'],
        companions: ['Tomato', 'Chili', 'Marigold'],
        climate: ['Temperature: 25-35°C', 'Warm weather crop'],
        harvestMonth: getHarvestMonth(70)
      },
      {
        id: 'cucumber-premium',
        name: 'Cucumber (Hybrid)',
        category: 'vegetable',
        scientificName: 'Cucumis sativus',
        soilCompatibility: calculateSoilScore('cucumber', data),
        expectedYield: '20-25 tons/hectare',
        duration: 60,
        waterRequirement: 'Medium',
        profitPotential: 88,
        marketDemand: 92,
        riskLevel: 'Medium',
        currentPrice: 18,
        harvestPrice: 25,
        inputCost: 20000,
        roi: 625,
        reasons: ['Ready in 50-70 days', 'Urban premium market demand', 'Polyhouse cultivation advantage'],
        tips: ['Trellising for better quality', 'Regular harvesting increases yield', 'Grade by size for premium pricing'],
        marketTiming: 'Off-season cultivation for premium',
        fertilizers: ['High potash fertilizers', 'Calcium supplement'],
        diseases: ['Powdery mildew', 'Downy mildew'],
        companions: ['Radish', 'Lettuce', 'Marigold'],
        climate: ['Temperature: 20-30°C', 'Warm weather preferred'],
        harvestMonth: getHarvestMonth(60)
      },
      // Ultra-High Value Indoor Crops
      {
        id: 'microgreens-ultra',
        name: 'Microgreens Mix',
        category: 'microgreens',
        scientificName: 'Mixed varieties',
        soilCompatibility: 95,
        expectedYield: '1-2 kg/sq.ft',
        duration: 20,
        waterRequirement: 'Low',
        profitPotential: 98,
        marketDemand: 95,
        riskLevel: 'Low',
        currentPrice: 500,
        harvestPrice: 600,
        inputCost: 15000,
        roi: 1500,
        reasons: ['Ready in 10-30 days', '₹15-25 lakh/year potential', 'Gourmet market demand'],
        tips: ['Controlled environment growing', 'Direct supply to restaurants', 'Multiple harvests per month'],
        marketTiming: 'Year-round production possible',
        fertilizers: ['Minimal nutrients needed', 'Organic growing medium'],
        diseases: ['Damping off', 'Mold prevention'],
        companions: ['Can rotate with mushrooms'],
        climate: ['Temperature: 18-22°C', 'Controlled environment'],
        harvestMonth: getHarvestMonth(20)
      },
      {
        id: 'mushroom-premium',
        name: 'Oyster Mushroom',
        category: 'fungi',
        scientificName: 'Pleurotus ostreatus',
        soilCompatibility: 95, // Soilless farming
        expectedYield: '8-12 kg per 10kg substrate',
        duration: 60,
        waterRequirement: 'High',
        profitPotential: 98,
        marketDemand: 88,
        riskLevel: 'Low',
        currentPrice: 200,
        harvestPrice: 250,
        inputCost: 25000,
        roi: 300,
        reasons: ['High value per kg', 'Year-round production', 'Urban market premium'],
        tips: ['Controlled environment essential', 'Multiple flushes possible', 'Direct restaurant sales'],
        marketTiming: 'Consistent demand, premium in hotels/restaurants',
        fertilizers: ['Rice straw', 'Wheat straw', 'Cotton seed hulls'],
        diseases: ['Green mold', 'Bacterial blotch', 'Competitor fungi'],
        companions: ['Can be combined with other controlled crops'],
        climate: ['Controlled environment', '20-25°C optimal'],
        harvestMonth: getHarvestMonth(60)
      },
      {
        id: 'marigold-flowers',
        name: 'Marigold (Commercial)',
        category: 'flowers',
        scientificName: 'Tagetes erecta',
        soilCompatibility: calculateSoilScore('flowers', data),
        expectedYield: '8-12 tons/hectare',
        duration: 90,
        waterRequirement: 'Medium',
        profitPotential: 85,
        marketDemand: 90,
        riskLevel: 'Low',
        currentPrice: 15,
        harvestPrice: 25,
        inputCost: 20000,
        roi: 175,
        reasons: ['Festival demand spikes', 'Religious ceremonies', 'Natural pesticide properties'],
        tips: ['Time planting for festival seasons', 'Daily harvest required', 'Cold chain important'],
        marketTiming: 'Diwali, Durga Puja: 300% price increase',
        fertilizers: ['Phosphorus rich', 'Organic compost', 'Micronutrients'],
        diseases: ['Damping off', 'Leaf spot', 'Aphids'],
        companions: ['Tomato', 'Chili', 'Vegetables (pest control)'],
        climate: ['Moderate temperature', 'Post-monsoon optimal'],
        harvestMonth: getHarvestMonth(90)
      }
    ];

    // Filter out tracked crops
    const trackedCropNames = cropTrackingService.getTrackedCropNames();
    const availableCrops = cropDatabase.filter(crop => 
      !trackedCropNames.includes(crop.name.toLowerCase())
    );

    // Calculate AI scores and categorize
    const scoredCrops = availableCrops.map(crop => ({
      ...crop,
      soilCompatibility: crop.id === 'mushroom-premium' ? 95 : calculateSoilScore(crop.name.toLowerCase(), data)
    }));

    // Strategic categorization
    const soilOptimized = scoredCrops
      .filter(crop => crop.soilCompatibility >= 80)
      .sort((a, b) => b.soilCompatibility - a.soilCompatibility)
      .slice(0, 3);

    const quickHarvest = scoredCrops
      .filter(crop => crop.duration <= 90)
      .sort((a, b) => a.duration - b.duration)
      .slice(0, 3);

    const marketTimed = scoredCrops
      .sort((a, b) => b.marketDemand - a.marketDemand)
      .slice(0, 3);

    const highProfit = scoredCrops
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 3);

    const modernFarming = scoredCrops
      .filter(crop => ['mushroom', 'leafy', 'microgreens'].some(keyword => 
        crop.name.toLowerCase().includes(keyword) || crop.category === 'fungi'
      ))
      .slice(0, 3);

    // Quick-Income Multi-crop Strategies
    const multiCropStrategies: MultiCropStrategy[] = [
      {
        id: 'quick-rotation-system',
        name: 'Quick Income Rotation System',
        description: '3 cycles per year with 30-120 day crops for continuous monthly income',
        crops: ['Coriander → Okra → Spinach'],
        totalDuration: 180,
        landUtilization: 98,
        expectedProfit: 500000,
        riskMitigation: ['Quick turnover reduces risk', 'Diversified market timing', 'Low investment per crop'],
        implementation: ['December: Coriander sowing', 'March: Okra planting', 'July: Spinach cultivation'],
        seasonalPlan: [
          {
            season: 'Winter (Dec-Feb)',
            crops: ['Coriander'],
            activities: ['Quick 45-day cycle', 'Multiple harvests', 'Fresh market sales']
          },
          {
            season: 'Summer (Mar-Jun)',
            crops: ['Okra'],
            activities: ['70-day cycle', 'Continuous picking', 'Processing market']
          },
          {
            season: 'Monsoon (Jul-Oct)',
            crops: ['Spinach'],
            activities: ['Quick leafy production', '35-day cycles', 'Urban market supply']
          }
        ]
      },
      {
        id: 'ultra-fast-system',
        name: 'Ultra-Fast Income System',
        description: 'Combination of microgreens with quick vegetables for weekly income',
        crops: ['Microgreens + Radish + Fenugreek'],
        totalDuration: 365,
        landUtilization: 150,
        expectedProfit: 800000,
        riskMitigation: ['Weekly income from microgreens', 'Multiple quick crops', 'Low investment cycles'],
        implementation: ['Indoor microgreen setup', 'Staggered field crops', 'Continuous harvest system'],
        seasonalPlan: [
          {
            season: 'Year-round',
            crops: ['Microgreens (weekly)', 'Quick vegetables (monthly)'],
            activities: ['Continuous microgreen harvests', 'Succession planting', 'Direct market sales']
          }
        ]
      },
      {
        id: 'mushroom-vegetable-combo',
        name: 'Indoor-Outdoor Combo System',
        description: 'Combine controlled mushroom production with field vegetables',
        crops: ['Oyster Mushroom + Cucumber + Beetroot'],
        totalDuration: 365,
        landUtilization: 120,
        expectedProfit: 600000,
        riskMitigation: ['Weather-independent mushroom income', 'Premium market access', 'Continuous production'],
        implementation: ['30% area for mushroom shed', '70% field for rotation crops', 'Integrated waste recycling'],
        seasonalPlan: [
          {
            season: 'Year-round',
            crops: ['Mushroom (continuous)', 'Vegetables (seasonal)'],
            activities: ['Mushroom cycles every 45 days', 'Vegetable succession planting', 'Value addition']
          }
        ]
      }
    ];

    return {
      soilOptimized,
      quickHarvest,
      marketTimed,
      highProfit,
      modernFarming,
      multiCropStrategies,
      analysis: {
        soilHealth: calculateSoilHealth(data),
        recommendations: generateSoilRecommendations(data),
        marketOutlook: 'Current market shows strong demand for vegetables and spices with 15% price increase expected',
        riskFactors: ['Weather variability', 'Market price fluctuations', 'Input cost inflation'],
        investmentAdvice: `For ${data.farmSize} acres, optimal investment range: ₹${data.farmSize * 50000}-${data.farmSize * 80000}`
      }
    };
  };

  // Helper functions
  function calculateSoilScore(cropType: string, data: SoilData): number {
    let score = 65; // Higher base score for quick crops
    const { nitrogen, phosphorus, potassium, ph } = data;

    // General soil health (quick crops are more adaptable)
    if (nitrogen >= 80 && nitrogen <= 150) score += 15;
    else if (nitrogen < 60) score -= 10;

    if (phosphorus >= 15 && phosphorus <= 40) score += 10;
    else if (phosphorus < 10) score -= 15;

    if (potassium >= 120 && potassium <= 200) score += 10;
    else if (potassium < 80) score -= 10;

    if (ph >= 6.0 && ph <= 7.5) score += 15;
    else if (ph < 5.5 || ph > 8.0) score -= 20;

    // Quick-income crop specific adjustments
    if (cropType.includes('coriander') && ph >= 6.0 && ph <= 7.5) score += 8;
    if (cropType.includes('spinach') && nitrogen >= 100) score += 8;
    if (cropType.includes('fenugreek') && ph >= 6.5 && ph <= 7.2) score += 8;
    if (cropType.includes('radish') && ph >= 6.0 && ph <= 7.0) score += 8;
    if (cropType.includes('beetroot') && ph >= 6.0 && ph <= 7.5) score += 8;
    if (cropType.includes('okra') && potassium >= 140) score += 10;
    if (cropType.includes('cucumber') && ph >= 6.0 && ph <= 7.0) score += 8;
    if (cropType.includes('amaranthus') && nitrogen >= 80) score += 8;

    return Math.max(0, Math.min(100, score));
  }

  function getHarvestMonth(daysFromNow: number): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date();
    const harvestDate = new Date(today.getTime() + (daysFromNow * 24 * 60 * 60 * 1000));
    return months[harvestDate.getMonth()];
  }

  function calculateSoilHealth(data: SoilData): string {
    const nScore = data.nitrogen >= 100 ? 'Good' : 'Needs improvement';
    const pScore = data.phosphorus >= 20 ? 'Good' : 'Low';
    const kScore = data.potassium >= 150 ? 'Good' : 'Needs attention';
    const phScore = data.ph >= 6.0 && data.ph <= 7.5 ? 'Optimal' : 'Requires adjustment';
    
    return `Nitrogen: ${nScore}, Phosphorus: ${pScore}, Potassium: ${kScore}, pH: ${phScore}`;
  }

  function generateSoilRecommendations(data: SoilData): string[] {
    const recommendations = [];
    if (data.nitrogen < 100) recommendations.push('Apply organic compost or urea to boost nitrogen levels');
    if (data.phosphorus < 20) recommendations.push('Add single super phosphate or bone meal for phosphorus');
    if (data.potassium < 150) recommendations.push('Use muriate of potash or wood ash for potassium');
    if (data.ph < 6.0) recommendations.push('Apply lime to increase soil pH');
    if (data.ph > 7.5) recommendations.push('Add organic matter or sulfur to reduce pH');
    return recommendations.length > 0 ? recommendations : ['Your soil parameters are well-balanced for most crops'];
  }

  const handleAnalyze = async () => {
    if (!soilData.location) {
      toast({
        title: "Missing Information",
        description: "Please enter your farm location to get strategic recommendations.",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);

    try {
      toast({
        title: "🧠 AI Strategic Analysis Started",
        description: "Processing soil data, market intelligence, and strategic farming opportunities...",
      });

      const strategicRecommendations = await generateStrategicRecommendations(soilData);
      setRecommendations(strategicRecommendations);

      toast({
        title: "✅ Strategic Business Plan Ready!",
        description: "Your personalized agri-business strategy with 5 profit-focused recommendations is ready.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Please try again or check your connection.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const CropCard: React.FC<{ crop: CropRecommendation; strategy: string }> = ({ crop, strategy }) => (
    <Card className="hover:shadow-lg transition-all border-l-4 border-l-green-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {crop.name}
              <Badge className={`${crop.riskLevel === 'Low' ? 'bg-green-500' : crop.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                {crop.riskLevel} Risk
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground italic">{crop.scientificName}</p>
          </div>
          <Badge className="bg-blue-600">
            ROI: {crop.roi}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{crop.duration} days</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span>{crop.expectedYield}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-purple-600" />
            <span>₹{crop.currentPrice}→₹{crop.harvestPrice}/kg</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <span>Harvest: {crop.harvestMonth}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Soil Compatibility</span>
            <Badge variant="outline">{crop.soilCompatibility}/100</Badge>
          </div>
          <Progress value={crop.soilCompatibility} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Market Demand</span>
            <Badge variant="outline">{crop.marketDemand}/100</Badge>
          </div>
          <Progress value={crop.marketDemand} className="h-2" />
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Strategic Reasons:</p>
          <ul className="text-xs space-y-1">
            {crop.reasons.slice(0, 2).map((reason, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <span className="text-green-600 font-bold">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-1">Market Timing Intelligence:</p>
          <p className="text-xs text-blue-700">{crop.marketTiming}</p>
        </div>

        <div className="bg-amber-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-amber-800 mb-1">Pro Farming Tip:</p>
          <p className="text-xs text-amber-700">{crop.tips[0]}</p>
        </div>

        <Button 
          className="w-full mt-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          size="sm"
          onClick={() => {
            // Convert crop name to kebab-case for URL
            const cropId = crop.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            navigate(`/crop-roadmap/${cropId}`);
          }}
        >
          View Complete Roadmap
        </Button>
      </CardContent>
    </Card>
  );

  const StrategyCard: React.FC<{ strategy: MultiCropStrategy }> = ({ strategy }) => (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          {strategy.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{strategy.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded">
            <p className="text-2xl font-bold text-green-700">₹{(strategy.expectedProfit / 1000).toFixed(0)}K</p>
            <p className="text-xs text-green-600">Expected Profit</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded">
            <p className="text-2xl font-bold text-blue-700">{strategy.landUtilization}%</p>
            <p className="text-xs text-blue-600">Land Utilization</p>
          </div>
        </div>

        <div>
          <p className="font-medium mb-2">Crop Sequence:</p>
          <p className="text-sm bg-muted p-2 rounded">{strategy.crops.join(' ')}</p>
        </div>

        <div>
          <p className="font-medium mb-2">Risk Mitigation:</p>
          <ul className="text-sm space-y-1">
            {strategy.riskMitigation.slice(0, 2).map((risk, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <Shield className="w-3 h-3 text-green-600 mt-1" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-medium mb-2">Implementation Steps:</p>
          <ul className="text-sm space-y-1">
            {strategy.implementation.slice(0, 2).map((step, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <Target className="w-3 h-3 text-blue-600 mt-1" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Brain className="w-6 h-6 text-primary" />
            AI Strategic Agri-Business Advisor
          </CardTitle>
          <p className="text-muted-foreground">
            Transform from farmer to agripreneur with AI-powered strategic crop recommendations across 5 business categories.
          </p>
        </CardHeader>
      </Card>

      {/* Soil Analysis Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            Scientific Soil & Farm Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Provide your soil test results and farm details for strategic business recommendations
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="nitrogen">Nitrogen (N) ppm</Label>
              <Input
                id="nitrogen"
                type="number"
                value={soilData.nitrogen}
                onChange={(e) => setSoilData({...soilData, nitrogen: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="phosphorus">Phosphorus (P) ppm</Label>
              <Input
                id="phosphorus"
                type="number"
                value={soilData.phosphorus}
                onChange={(e) => setSoilData({...soilData, phosphorus: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="potassium">Potassium (K) ppm</Label>
              <Input
                id="potassium"
                type="number"
                value={soilData.potassium}
                onChange={(e) => setSoilData({...soilData, potassium: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="ph">Soil pH</Label>
              <Input
                id="ph"
                type="number"
                step="0.1"
                value={soilData.ph}
                onChange={(e) => setSoilData({...soilData, ph: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="location">Farm Location</Label>
              <Input
                id="location"
                placeholder="e.g., Bangalore, Karnataka"
                value={soilData.location}
                onChange={(e) => setSoilData({...soilData, location: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="language">Preferred Language</Label>
              <Select value={soilData.language} onValueChange={(value) => setSoilData({...soilData, language: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Telugu">Telugu</SelectItem>
                  <SelectItem value="Tamil">Tamil</SelectItem>
                  <SelectItem value="Kannada">Kannada</SelectItem>
                  <SelectItem value="Marathi">Marathi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="farmSize">Farm Size (acres)</Label>
              <Input
                id="farmSize"
                type="number"
                step="0.1"
                value={soilData.farmSize}
                onChange={(e) => setSoilData({...soilData, farmSize: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700"
            size="lg"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                AI Strategic Analysis in Progress...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                Generate Strategic Business Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Strategic Recommendations */}
      {recommendations && (
        <div className="space-y-6">
          {/* Analysis Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Strategic Business Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Soil Health Assessment</h4>
                  <p className="text-sm bg-blue-100 p-2 rounded">{recommendations.analysis.soilHealth}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Investment Advice</h4>
                  <p className="text-sm bg-green-100 p-2 rounded">{recommendations.analysis.investmentAdvice}</p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Market Outlook</h4>
                <p className="text-sm">{recommendations.analysis.marketOutlook}</p>
              </div>
            </CardContent>
          </Card>

          {/* Strategic Categories */}
          <Tabs value={activeStrategy} onValueChange={setActiveStrategy}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="soil-optimized" className="text-xs">
                <Leaf className="w-4 h-4 mr-1" />
                Soil Optimized
              </TabsTrigger>
              <TabsTrigger value="quick-harvest" className="text-xs">
                <Zap className="w-4 h-4 mr-1" />
                Quick Harvest
              </TabsTrigger>
              <TabsTrigger value="market-timed" className="text-xs">
                <Calendar className="w-4 h-4 mr-1" />
                Market Timed
              </TabsTrigger>
              <TabsTrigger value="high-profit" className="text-xs">
                <DollarSign className="w-4 h-4 mr-1" />
                High Profit
              </TabsTrigger>
              <TabsTrigger value="modern-farming" className="text-xs">
                <Home className="w-4 h-4 mr-1" />
                Modern Farming
              </TabsTrigger>
              <TabsTrigger value="multi-crop" className="text-xs">
                <Target className="w-4 h-4 mr-1" />
                Multi-Crop
              </TabsTrigger>
            </TabsList>

            <TabsContent value="soil-optimized" className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border-green-200 border">
                <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  🧬 Soil-Optimized Crops (Scientific Match)
                </h3>
                <p className="text-sm text-green-700 mb-4">
                  <strong>Strategy:</strong> These crops are scientifically matched to your exact soil conditions (N: {soilData.nitrogen}, P: {soilData.phosphorus}, K: {soilData.potassium}, pH: {soilData.ph}). 
                  They will thrive with minimal soil correction, reducing input costs and maximizing natural compatibility.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {recommendations.soilOptimized.map(crop => (
                  <CropCard key={crop.id} crop={crop} strategy="soil-optimized" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="quick-harvest" className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg border-yellow-200 border">
                <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  ⚡ Quick Harvest Crops (Fast Cash Flow)
                </h3>
                <p className="text-sm text-yellow-700 mb-4">
                  <strong>Strategy:</strong> Ultra-short cycle crops (30-90 days) for rapid revenue generation. 
                  Perfect for funding your next crop cycle or meeting immediate cash flow needs. Multiple harvests possible per year.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {recommendations.quickHarvest.map(crop => (
                  <CropCard key={crop.id} crop={crop} strategy="quick-harvest" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="market-timed" className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg border-purple-200 border">
                <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  📈 Market-Timed Crops (Peak Price Strategy)
                </h3>
                <p className="text-sm text-purple-700 mb-4">
                  <strong>Strategy:</strong> Harvest timing synchronized with peak market demand periods (festivals, seasons). 
                  AI calculates optimal planting dates to ensure your produce reaches market exactly when prices are highest.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {recommendations.marketTimed.map(crop => (
                  <CropCard key={crop.id} crop={crop} strategy="market-timed" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="high-profit" className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-lg border-emerald-200 border">
                <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  💰 High-Profit Crops (Premium Returns)
                </h3>
                <p className="text-sm text-emerald-700 mb-4">
                  <strong>Strategy:</strong> "Blue-chip" agricultural investments with proven high ROI and stable markets. 
                  These crops consistently deliver strong profitability with established demand chains and processing industries.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {recommendations.highProfit.map(crop => (
                  <CropCard key={crop.id} crop={crop} strategy="high-profit" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="modern-farming" className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border-blue-200 border">
                <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  🏭 Modern Farming Crops (Tech-Enhanced)
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  <strong>Strategy:</strong> Controlled environment agriculture for premium markets. 
                  Ideal for limited land but high-value production. Includes hydroponics, mushroom cultivation, and protected farming systems.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {recommendations.modernFarming.map(crop => (
                  <CropCard key={crop.id} crop={crop} strategy="modern-farming" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="multi-crop" className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg border-indigo-200 border">
                <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  🎯 Multi-Crop Strategies (Risk Distribution)
                </h3>
                <p className="text-sm text-indigo-700 mb-4">
                  <strong>Strategy:</strong> Comprehensive farming systems combining multiple crops for risk mitigation, 
                  land optimization, and year-round income. Includes rotation, intercropping, and integrated farming approaches.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {recommendations.multiCropStrategies.map(strategy => (
                  <StrategyCard key={strategy.id} strategy={strategy} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AIStrategicCropAdvisor;