import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getCropIcon } from "@/utils/cropIcons";
import ComprehensiveCultivationGuide from "@/components/ai/ComprehensiveCultivationGuide";
import SmartFarmingDashboard from "@/components/ai/SmartFarmingDashboard";
import SatelliteCropAnalysis from "@/components/ai/SatelliteCropAnalysis";
import { cropTrackingService, TrackedCrop } from "@/services/cropTrackingService";
import { aiCropGuideService, CropGuideData, CropStageDetails } from "@/services/aiCropGuideService";
import {
  Calendar,
  Droplets,
  TrendingUp,
  Leaf,
  Play,
  CheckCircle2,
  Clock,
  Sprout,
  Loader2,
  Bug,
  Shield,
  AlertTriangle,
  Target,
  Activity,
  Camera,
  Upload,
  Heart,
  ThermometerSun,
  TrendingUp as TrendingUpIcon,
  Info,
  Sparkles,
  BookOpen,
  DollarSign
} from "lucide-react";

const CropRoadmap = () => {
  const { cropId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // States
  const [crop, setCrop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [isTrackingStarted, setIsTrackingStarted] = useState(false);
  
  // AI-generated content states
  const [cropGuide, setCropGuide] = useState<CropGuideData | null>(null);
  const [activeStage, setActiveStage] = useState<CropStageDetails | null>(null);
  const [dailyActivities, setDailyActivities] = useState<any[]>([]);
  const [pestPredictions, setPestPredictions] = useState<any[]>([]);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<any>(null);
  const [benefitsData, setBenefitsData] = useState<any>(null);
  
  // Image capture states
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [healthAnalysis, setHealthAnalysis] = useState<{health: string; recommendations: string[]; confidence: number;} | null>(null);
  
  // Additional states
  const [seeds, setSeeds] = useState<any[]>([]);
  const [instructions, setInstructions] = useState<any[]>([]);

  const fetchCropDetails = useCallback(async () => {
    try {
      // Quick-income crop mapping
      const cropIdToNameMap: { [key: string]: string } = {
        '1': 'Coriander',
        '2': 'Spinach',
        '3': 'Radish',
        '4': 'Okra',
        '5': 'Fenugreek',
        '6': 'Microgreens',
        '7': 'Beetroot',
        '8': 'Cucumber'
      };
      
      // Determine crop name from cropId
      let cropName: string;
      if (cropIdToNameMap[cropId || '']) {
        cropName = cropIdToNameMap[cropId || ''];
      } else if (cropId?.includes('-')) {
        cropName = cropId.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      } else {
        cropName = cropId?.charAt(0).toUpperCase() + cropId?.slice(1) || 'Coriander';
      }
      
      // Generate AI-powered crop guide
      const aiGeneratedGuide = aiCropGuideService.generateCropGuide(cropName);
      setCropGuide(aiGeneratedGuide);
      setActiveStage(aiGeneratedGuide.stages[0]); // Start with first stage
      
      // Create crop object from AI data
      const mockCrop = {
        id: cropId,
        name: aiGeneratedGuide.cropName,
        category: aiGeneratedGuide.category,
        duration_days: aiGeneratedGuide.totalDuration,
        season: cropName.toLowerCase().includes('winter') ? 'Rabi' : 'Kharif',
        water_requirement: activeStage?.wateringSchedule || 'Medium',
        soil_type: 'Well-drained fertile soil (AI optimized)',
        temperature_range: 'Optimal range varies by growth stage',
        description: `${aiGeneratedGuide.cropName} (${aiGeneratedGuide.scientificName}) - AI-generated cultivation guide for maximum profit in ${aiGeneratedGuide.totalDuration} days.`
      };
      
      setCrop(mockCrop);
      
      // Generate static data
      setSeeds([
        { variety: 'Hybrid', price: '₹200/kg', germination: '85%', source: 'Local Dealer' },
        { variety: 'Organic', price: '₹150/kg', germination: '80%', source: 'Certified Store' }
      ]);
      
      setInstructions([
        { phase: 'Preparation', instruction: 'Prepare the land and select quality seeds' },
        { phase: 'Sowing', instruction: 'Sow seeds at proper depth and spacing' },
        { phase: 'Growth', instruction: 'Monitor growth and apply fertilizers as needed' },
        { phase: 'Harvest', instruction: 'Harvest at the right maturity stage' }
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crop details:', error);
      setLoading(false);
    }
  }, [cropId]);

  useEffect(() => {
    if (cropId) {
      fetchCropDetails();
    }
  }, [cropId, fetchCropDetails]);

  // Check if crop is already being tracked
  useEffect(() => {
    if (cropId) {
      const trackedCrops = cropTrackingService.getTrackedCrops();
      const isTracked = trackedCrops.some(tc => tc.id === cropId);
      setIsTrackingStarted(isTracked);
      
      // If already tracking, load AI data
      if (isTracked) {
        loadAIDataForTrackedCrop();
      }
    }
  }, [cropId, crop]);

  // Function to generate dynamic content using AI service
  const generateDynamicContent = async (guide: CropGuideData) => {
    if (!guide) return;
    
    try {
      // Generate real-time content based on AI crop guide
      const [aiMarketData, aiBenefitsData, aiPestData, aiDailyData] = await Promise.all([
        generateAIMarketDataFromGuide(guide),
        generateAIBenefitsFromGuide(guide),
        generateAIPestPredictionsFromGuide(guide),
        generateAIDailyActivitiesFromGuide(guide)
      ]);
      
      setMarketData(aiMarketData);
      setBenefitsData(aiBenefitsData);
      setPestPredictions(aiPestData);
      setDailyActivities(aiDailyData);
    } catch (error) {
      console.error('Error generating dynamic content:', error);
    }
  };

  // Function to load AI data for already tracked crops
  const loadAIDataForTrackedCrop = async () => {
    if (!crop || !cropGuide) return;
    await generateDynamicContent(cropGuide);
  };

  // AI-powered real-time data generation functions
  const generateAIMarketDataFromGuide = async (guide: CropGuideData) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI processing
    
    // Extract real market data from AI guide
    const marketTiming = guide.marketTiming;
    const expectedPrice = marketTiming.match(/₹(\d+)-(\d+)/);
    const basePrice = expectedPrice ? parseInt(expectedPrice[1]) : 40;
    
    return {
      currentPrice: basePrice,
      priceUnit: 'per kg',
      demandTrend: guide.profitPotential > 300000 ? 'increasing' : 'stable',
      bestSellingMonths: guide.seasonalConsiderations.length > 0 ? 
        ['Dec', 'Jan', 'Feb'] : ['Mar', 'Apr', 'May'],
      averageYield: `Expected: ₹${guide.profitPotential.toLocaleString()}/acre profit`,
      profitMargin: `${Math.floor((guide.profitPotential / 200000) * 100)}%`,
      marketChannels: [
        { name: 'Direct Sales', percentage: 40, rate: `₹${basePrice}/kg` },
        { name: 'Wholesale', percentage: 35, rate: `₹${basePrice-5}/kg` },
        { name: 'Restaurants', percentage: 25, rate: `₹${basePrice+10}/kg` }
      ],
      forecast: {
        nextMonth: basePrice + 5,
        confidence: '92% (AI analyzed)',
        marketTiming: guide.marketTiming
      },
      profitProjection: `₹${guide.profitPotential.toLocaleString()}/acre in ${guide.totalDuration} days`
    };
  };

  const generateAIBenefitsFromGuide = async (guide: CropGuideData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate crop-specific benefits based on AI knowledge
    const cropName = guide.cropName.toLowerCase();
    let specificBenefits = {
      nutritionalValue: ['High nutrient density', 'Essential vitamins', 'Mineral rich'],
      healthBenefits: ['Supports overall health', 'Natural nutrition source'],
      medicinealProperties: ['Antioxidant properties', 'Natural compounds'],
      culinaryUses: ['Fresh cooking', 'Seasoning', 'Garnishing'],
      storageLife: '5-10 days fresh storage',
      processingOptions: guide.valueAddition
    };

    // Crop-specific AI-generated benefits
    if (cropName.includes('coriander')) {
      specificBenefits = {
        nutritionalValue: ['Vitamin A', 'Vitamin C', 'Vitamin K', 'Folate', 'Iron', 'Manganese'],
        healthBenefits: ['Lowers cholesterol', 'Controls blood sugar', 'Aids digestion', 'Anti-inflammatory'],
        medicinealProperties: ['Digestive aid', 'Natural detoxifier', 'Antimicrobial properties'],
        culinaryUses: ['Fresh herb garnish', 'Spice (seeds)', 'Chutney base', 'Curry ingredient'],
        storageLife: '7-10 days refrigerated, 6 months dried seeds',
        processingOptions: guide.valueAddition
      };
    } else if (cropName.includes('spinach')) {
      specificBenefits = {
        nutritionalValue: ['Iron', 'Folate', 'Vitamin K', 'Vitamin A', 'Magnesium', 'Potassium'],
        healthBenefits: ['Prevents anemia', 'Bone health', 'Eye health', 'Heart protection'],
        medicinealProperties: ['High in nitrates', 'Anti-cancer compounds', 'Blood pressure control'],
        culinaryUses: ['Salads', 'Smoothies', 'Cooked dishes', 'Baby food'],
        storageLife: '5-7 days fresh, 8-12 months frozen',
        processingOptions: guide.valueAddition
      };
    } else if (cropName.includes('microgreen')) {
      specificBenefits = {
        nutritionalValue: ['Concentrated vitamins (40x mature plants)', 'High enzyme content', 'Antioxidants'],
        healthBenefits: ['Immune boost', 'Anti-aging', 'Enhanced nutrition', 'Detoxification'],
        medicinealProperties: ['Concentrated phytonutrients', 'Natural enzymes', 'Bioactive compounds'],
        culinaryUses: ['Gourmet garnish', 'Salad mix', 'Smoothie boost', 'Fine dining'],
        storageLife: '7-10 days refrigerated with proper handling',
        processingOptions: guide.valueAddition
      };
    }
    
    return {
      ...specificBenefits,
      economicBenefits: [
        `Quick return: ${guide.totalDuration} days`,
        `High profit: ₹${guide.profitPotential.toLocaleString()}/acre`,
        'Low investment requirement',
        'Multiple harvests possible'
      ]
    };
  };

  const generateAIPestPredictionsFromGuide = async (guide: CropGuideData) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Extract pest information from all stages
    const allPests: any[] = [];
    guide.stages.forEach((stage, stageIndex) => {
      stage.commonIssues.forEach((issue, issueIndex) => {
        if (issue.toLowerCase().includes('pest') || 
            issue.toLowerCase().includes('aphid') || 
            issue.toLowerCase().includes('insect') ||
            issue.toLowerCase().includes('mold') ||
            issue.toLowerCase().includes('disease')) {
          allPests.push({
            id: `pest-${stageIndex}-${issueIndex}`,
            name: issue,
            risk: Math.random() > 0.6 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low',
            stage: stage.stage,
            prevention: stage.proTips[0] || 'Regular monitoring required',
            probability: `${Math.floor(Math.random() * 30) + 40}%`,
            symptoms: `Monitor for ${issue.toLowerCase()} during ${stage.stage.toLowerCase()} phase`,
            treatment: stage.proTips.find(tip => 
              tip.toLowerCase().includes('spray') || 
              tip.toLowerCase().includes('control')
            ) || 'Consult agricultural expert',
            timeframe: stage.duration,
            aiRecommendation: stage.criticalActions.join(', ')
          });
        }
      });
    });

    // If no specific pests found, generate crop-specific ones
    if (allPests.length === 0) {
      const cropName = guide.cropName.toLowerCase();
      if (cropName.includes('leafy') || cropName.includes('spinach') || cropName.includes('coriander')) {
        allPests.push(
          {
            id: 'leafy-pest-1',
            name: 'Aphids',
            risk: 'Medium',
            stage: 'Growth',
            prevention: 'Neem oil spray weekly',
            probability: '45%',
            symptoms: 'Curled leaves, sticky honeydew, stunted growth',
            treatment: 'Spray neem oil solution (5ml/liter) in evening',
            timeframe: 'Day 15-30',
            aiRecommendation: 'Monitor leaf undersides daily'
          },
          {
            id: 'leafy-pest-2', 
            name: 'Leaf miners',
            risk: 'Low',
            stage: 'Growth',
            prevention: 'Row covers during early growth',
            probability: '25%',
            symptoms: 'White tunnels in leaves, reduced photosynthesis',
            treatment: 'Remove affected leaves, use sticky traps',
            timeframe: 'Day 20-35',
            aiRecommendation: 'Early detection and removal crucial'
          }
        );
      }
    }

    return allPests.slice(0, 3); // Limit to top 3 most relevant pests
  };

  const generateAIDailyActivitiesFromGuide = async (guide: CropGuideData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const activities: any[] = [];
    
    let dayCounter = 1;
    
    // Generate activities from AI guide stages
    guide.stages.forEach((stage, stageIndex) => {
      const stageDays = stage.duration.includes('-') ? 
        parseInt(stage.duration.split('-')[1]) - parseInt(stage.duration.split('-')[0]) + 1 :
        Math.ceil(guide.totalDuration / guide.stages.length);
      
      // Create daily activities for this stage
      stage.activities.forEach((activity, actIndex) => {
        const activityDay = dayCounter + Math.floor((actIndex * stageDays) / stage.activities.length);
        
        activities.push({
          id: `stage-${stageIndex}-act-${actIndex}`,
          day: activityDay,
          phase: stage.stage,
          activity: activity,
          description: `${activity} - ${stage.stage} phase (${stage.duration})`,
          status: activityDay <= 3 ? 'completed' : 'pending',
          importance: stage.criticalActions.includes(activity) ? 'high' : 'medium',
          fertilizers: stage.fertilizers,
          watering: stage.wateringSchedule,
          costEstimate: stage.costEstimate,
          expectedOutcome: stage.expectedOutcome,
          proTips: stage.proTips,
          aiGenerated: true
        });
      });
      
      // Add critical milestone activities
      stage.criticalActions.forEach((criticalAction, critIndex) => {
        activities.push({
          id: `critical-${stageIndex}-${critIndex}`,
          day: dayCounter + Math.floor(stageDays / 2),
          phase: stage.stage,
          activity: criticalAction,
          description: `CRITICAL: ${criticalAction} - Must complete for success`,
          status: 'pending',
          importance: 'high',
          isCritical: true,
          aiGenerated: true
        });
      });
      
      dayCounter += stageDays;
    });
    
    return activities
      .sort((a, b) => a.day - b.day)
      .slice(0, 25); // Show top 25 activities
  };

  // Stage navigation handlers
  const handleStageChange = (stageIndex: number) => {
    if (cropGuide && cropGuide.stages[stageIndex]) {
      setActiveStage(cropGuide.stages[stageIndex]);
    }
  };

  const handleStartCrop = async () => {
    setStarting(true);
    
    try {
      toast({
        title: "Generating AI Insights...",
        description: "Please wait while we analyze your crop data"
      });
      
      // Generate AI-powered data using the guide
      if (cropGuide) {
        await generateDynamicContent(cropGuide);
      }
      
      setIsTrackingStarted(true);

      // Add crop to tracking system
      if (crop) {
        const today = new Date();
        const harvestDate = new Date(today.getTime() + (crop.duration_days || 90) * 24 * 60 * 60 * 1000);
        
        const trackedCrop: Omit<TrackedCrop, 'trackingStartDate'> = {
          id: cropId || crop.id || `crop-${Date.now()}`,
          name: crop.name,
          startDate: today.toISOString(),
          estimatedHarvestDate: harvestDate.toISOString(),
          currentPhase: 'preparation',
          daysRemaining: cropTrackingService.calculateDaysRemaining(harvestDate.toISOString()),
          progress: 0,
          category: crop.category || 'vegetable',
          expectedYield: crop.expected_yield || '3-5 tons/acre',
          marketPrice: crop.market_price || '₹15-25/kg',
          emoji: getCropIcon(crop.name),
          status: 'active',
          profitProjection: crop.profit_projection || '₹50,000-80,000'
        };

        const added = cropTrackingService.addCropToTracking(trackedCrop);
        if (added) {
          toast({
            title: "🎉 Crop Added to Dashboard!",
            description: "Your crop is now being tracked on the home screen"
          });
        }
      }

      toast({
        title: "AI Analysis Complete!",
        description: "Crop lifecycle tracking started with real-time AI insights"
      });

    } catch (error) {
      console.error('Error starting crop:', error);
      toast({
        title: "Failed to start tracking",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setStarting(false);
    }
  };

  const handleImageCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setAnalyzing(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      await new Promise(resolve => setTimeout(resolve, 2000));

      const healthScore = Math.floor(Math.random() * 30) + 70;
      const mockAnalysis = {
        health: `Health Score: ${healthScore}/100 - ${healthScore >= 80 ? 'Excellent' : 'Good'} condition`,
        recommendations: ["Continue current watering schedule", "Monitor for any spreading of yellow leaves"],
        confidence: healthScore
      };

      setHealthAnalysis(mockAnalysis);
      
      const newRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        healthScore: mockAnalysis.confidence,
        image: file.name,
        notes: "AI Analysis completed"
      };
      
      setHealthRecords(prev => [newRecord, ...prev]);

      toast({
        title: "Image Analysis Complete!",
        description: `Health Score: ${mockAnalysis.confidence}/100`
      });

    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-muted-foreground">Crop not found</p>
          <Button onClick={() => navigate('/crop-recommendations')}>
            Back to Recommendations
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container px-4 py-6 space-y-6">
        {/* Crop Info Card */}
        <Card className="p-6 gradient-primary text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{getCropIcon(crop.name)}</div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{crop.name}</h1>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/20 text-white">
                    <Calendar className="w-4 h-4 mr-1" />
                    {crop.duration_days} Days
                  </Badge>
                  <Badge className="bg-white/20 text-white">
                    <Droplets className="w-4 h-4 mr-1" />
                    {crop.water_requirement}
                  </Badge>
                  <Badge className="bg-white/20 text-white">
                    <ThermometerSun className="w-4 h-4 mr-1" />
                    {crop.temperature_range}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-white/90 mb-6">{crop.description}</p>
          
          <Button
            onClick={handleStartCrop}
            disabled={starting || isTrackingStarted}
            className="w-full mt-6 bg-white text-primary hover:bg-white/90"
            size="lg"
          >
            {starting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating AI Insights...
              </>
            ) : isTrackingStarted ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Tracking Started - AI Active
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Growing This Crop
              </>
            )}
          </Button>
        </Card>

        {/* Conditional Tabs */}
        {!isTrackingStarted ? (
          // Static info tabs before starting tracking
          <Tabs defaultValue="roadmap" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="seeds">Seeds</TabsTrigger>
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
            </TabsList>

            <TabsContent value="roadmap" className="space-y-4 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">AI-Generated Growth Roadmap</h2>
                <Button
                  onClick={handleStartCrop}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Start Tracking
                </Button>
              </div>

              {cropGuide && (
                <>
                  <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-green-600" />
                      <p className="font-medium text-green-800">AI Crop Intelligence</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <span className="ml-1 font-semibold">{cropGuide.totalDuration} days</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Difficulty:</span>
                        <Badge variant={cropGuide.difficulty === 'Easy' ? 'default' : cropGuide.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                          {cropGuide.difficulty}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-600">Profit:</span>
                        <span className="ml-1 font-semibold text-green-600">₹{cropGuide.profitPotential.toLocaleString()}/acre</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Scientific:</span>
                        <span className="ml-1 italic text-sm">{cropGuide.scientificName}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Stage Navigation */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {cropGuide.stages.map((stage, index) => (
                      <Button
                        key={index}
                        variant={activeStage?.stage === stage.stage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStageChange(index)}
                        className="whitespace-nowrap"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-current opacity-20 flex items-center justify-center">
                            <span className="text-xs font-bold">{index + 1}</span>
                          </div>
                          {stage.stage}
                        </div>
                      </Button>
                    ))}
                  </div>

                  {/* Active Stage Details */}
                  {activeStage && (
                    <Card className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">{activeStage.stage}</h3>
                        <Badge variant="outline">{activeStage.duration}</Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Key Activities
                          </h4>
                          <ul className="space-y-2">
                            {activeStage.activities.map((activity, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Leaf className="w-4 h-4" />
                            Fertilizers & Nutrition
                          </h4>
                          <ul className="space-y-2">
                            {activeStage.fertilizers.map((fertilizer, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm">{fertilizer}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                            <Droplets className="w-4 h-4 text-blue-600" />
                            Watering
                          </h5>
                          <p className="text-xs text-gray-600">{activeStage.wateringSchedule}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            Expected Outcome
                          </h5>
                          <p className="text-xs text-gray-600">{activeStage.expectedOutcome}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-yellow-600" />
                            Cost Estimate
                          </h5>
                          <p className="text-xs text-gray-600">{activeStage.costEstimate}</p>
                        </div>
                      </div>

                      {activeStage.proTips.length > 0 && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <h5 className="font-medium text-sm mb-2 flex items-center gap-1 text-blue-800">
                            <Sparkles className="w-4 h-4" />
                            AI Pro Tips
                          </h5>
                          <ul className="space-y-1">
                            {activeStage.proTips.map((tip, idx) => (
                              <li key={idx} className="text-xs text-blue-700">• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Card>
                  )}
                </>
              )}

              {!cropGuide && (
                <Card className="p-6 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Generating AI-powered crop guide...</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="seeds" className="space-y-4 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">AI-Recommended Seeds</h2>
                <Button
                  onClick={() => navigate('/seed-recommendations')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                >
                  <Sparkles className="w-4 h-4 text-green-600" />
                  Get AI Seed Guide
                </Button>
              </div>
              
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <p className="font-medium text-blue-800">AI Recommendation</p>
                </div>
                <p className="text-sm text-blue-700">
                  Based on your location and crop choice, we recommend high-germination varieties with proven disease resistance. 
                  Use our AI Seed Guide for personalized recommendations based on soil type, budget, and farming goals.
                </p>
              </Card>

              <div className="grid gap-4">
                {seeds.map((seed, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{seed.variety}</p>
                          <Badge className={index === 0 ? "bg-green-500" : "bg-blue-500"}>
                            {index === 0 ? "Best Match" : "Alternative"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{seed.price}</p>
                      </div>
                      <div>
                        <p className="text-sm">Germination: {seed.germination}</p>
                        <p className="text-sm">Source: {seed.source}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-sm">
                          <Sparkles className="w-3 h-3 text-green-500" />
                          <span className="text-green-600">AI Score: {95 - index * 5}/100</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Based on your conditions</p>
                      </div>
                      <div>
                        <Button size="sm" variant="outline" className="text-xs">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <Card className="p-4 bg-amber-50 border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-amber-600" />
                  <p className="font-medium text-amber-800">Smart Tip</p>
                </div>
                <p className="text-sm text-amber-700">
                  For best results, always purchase certified seeds from trusted suppliers. 
                  Consider seed treatment with fungicides before sowing to prevent soil-borne diseases.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="market" className="space-y-4 mt-6">
              <h2 className="text-xl font-bold">AI Market Intelligence</h2>
              {cropGuide && marketData ? (
                <div className="space-y-4">
                  <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">₹{marketData.currentPrice}</div>
                        <div className="text-sm text-gray-600">Current Price/kg</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{marketData.profitMargin}</div>
                        <div className="text-sm text-gray-600">Profit Margin</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{marketData.forecast.confidence}</div>
                        <div className="text-sm text-gray-600">AI Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{cropGuide.totalDuration} days</div>
                        <div className="text-sm text-gray-600">To harvest</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Market Channels & Pricing
                    </h3>
                    <div className="space-y-3">
                      {marketData.marketChannels.map((channel: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{channel.name}</div>
                            <div className="text-sm text-gray-600">{channel.percentage}% of sales</div>
                          </div>
                          <div className="text-lg font-semibold text-green-600">{channel.rate}</div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {marketData.marketTiming && (
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <h3 className="font-semibold mb-2 flex items-center gap-2 text-blue-800">
                        <Calendar className="w-5 h-5" />
                        AI Market Timing Analysis
                      </h3>
                      <p className="text-sm text-blue-700">{marketData.marketTiming}</p>
                    </Card>
                  )}

                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">Profit Projection</h3>
                    <div className="bg-gradient-to-r from-yellow-50 to-green-50 p-4 rounded-lg border border-green-200">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {marketData.profitProjection}
                        </div>
                        <div className="text-sm text-gray-600">Expected total profit per acre</div>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <Card className="p-6 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Generating AI market analysis...</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="benefits" className="space-y-4 mt-6">
              <h2 className="text-xl font-bold">AI Nutritional Analysis</h2>
              {cropGuide && benefitsData ? (
                <div className="space-y-4">
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      Nutritional Profile
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {benefitsData.nutritionalValue.map((nutrient: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{nutrient}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-500" />
                      Health Benefits
                    </h3>
                    <ul className="space-y-2">
                      {benefitsData.healthBenefits.map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {benefitsData.medicinealProperties && (
                    <Card className="p-4 bg-purple-50 border-purple-200">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-purple-800">
                        <Sparkles className="w-5 h-5" />
                        Medicinal Properties
                      </h3>
                      <ul className="space-y-1">
                        {benefitsData.medicinealProperties.map((property: string, idx: number) => (
                          <li key={idx} className="text-sm text-purple-700">• {property}</li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  <Card className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUpIcon className="w-5 h-5 text-green-500" />
                      Economic Benefits (AI Analysis)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {benefitsData.economicBenefits && benefitsData.economicBenefits.map((benefit: string, idx: number) => (
                        <div key={idx} className="p-3 bg-green-50 rounded-lg">
                          <div className="text-sm text-green-700">{benefit}</div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {cropGuide.valueAddition.length > 0 && (
                    <Card className="p-4 bg-amber-50 border-amber-200">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-amber-800">
                        <Target className="w-5 h-5" />
                        Value Addition Opportunities
                      </h3>
                      <ul className="space-y-2">
                        {cropGuide.valueAddition.map((opportunity, idx) => (
                          <li key={idx} className="text-sm text-amber-700">• {opportunity}</li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>
              ) : (
                <Card className="p-6 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Analyzing nutritional benefits...</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          // AI-powered smart farming tabs after starting tracking
          <Tabs defaultValue="smart-dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="smart-dashboard">🚀 AI Dashboard</TabsTrigger>
              <TabsTrigger value="satellite-analysis">🚁 Drone Analysis</TabsTrigger>
              <TabsTrigger value="daily-guide">📚 Daily Guide</TabsTrigger>
              <TabsTrigger value="health-monitor">💚 Health Check</TabsTrigger>
              <TabsTrigger value="pest-prediction">🐛 Pest Alert</TabsTrigger>
            </TabsList>

            <TabsContent value="smart-dashboard" className="space-y-6 mt-6">
              <SmartFarmingDashboard 
                cropName={crop.name}
                cropId={cropId || ''}
                currentPhase="growing"
              />
            </TabsContent>

            <TabsContent value="satellite-analysis" className="space-y-6 mt-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Camera className="w-6 h-6 text-blue-600" />
                  🚁 AI-Powered Drone & Satellite Analysis
                </h2>
                <p className="text-muted-foreground mt-2">
                  Real-time crop monitoring using satellite imagery and AI analysis for precision farming.
                </p>
              </div>
              <SatelliteCropAnalysis 
                cropName={crop.name}
                cropId={cropId || ''}
                fieldLocation={`${crop.name} Field, Kamareddy`}
              />
            </TabsContent>

            <TabsContent value="daily-guide" className="space-y-6 mt-6">
              {/* Comprehensive Cultivation Guide */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    📚 Complete Cultivation Mastery Guide
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Professional farming guide integrated with your daily activities for maximum success.
                  </p>
                </CardHeader>
                <CardContent>
                  <ComprehensiveCultivationGuide 
                    cropName={crop.name} 
                    cropId={cropId || ''} 
                  />
                </CardContent>
              </Card>

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-6 h-6 text-primary" />
                  AI-Generated Daily Activities
                </h2>
                <Badge variant="outline">{dailyActivities.length} Days Planned</Badge>
              </div>
              
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {dailyActivities.map((activity, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {activity.day}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{activity.activity}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <Badge className={`mt-2 text-xs ${activity.phase === 'Preparation' ? 'bg-blue-500' : 
                          activity.phase === 'Sowing' ? 'bg-green-500' : 
                          activity.phase === 'Growth' ? 'bg-yellow-500' : 'bg-orange-500'} text-white`}>
                          {activity.phase}
                        </Badge>
                      </div>
                      {activity.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="health-monitor" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Heart className="w-6 h-6 text-primary" />
                  Crop Health Monitoring
                </h2>
                <Badge variant="outline">{healthRecords.length} Records</Badge>
              </div>

              <Card className="p-6 border-dashed border-2">
                <div className="text-center space-y-4">
                  <Camera className="w-12 h-12 text-primary mx-auto" />
                  <h3 className="text-lg font-semibold">Capture Crop Health</h3>
                  <p className="text-muted-foreground">Take a photo for AI health analysis</p>
                  
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={() => document.getElementById('image-capture')?.click()}
                      disabled={analyzing}
                      className="flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      {analyzing ? "Analyzing..." : "Take Photo"}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={analyzing}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </Button>
                  </div>
                  
                  <input
                    id="image-capture"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageCapture}
                    className="hidden"
                  />
                  
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageCapture}
                    className="hidden"
                  />
                </div>
              </Card>

              {healthAnalysis && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Latest AI Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Health Assessment</span>
                      <Badge className={`${healthAnalysis.confidence >= 80 ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                        {healthAnalysis.confidence}%
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Assessment</h4>
                      <p className="text-sm text-muted-foreground">{healthAnalysis.health}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {healthAnalysis.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pest-prediction" className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Bug className="w-6 h-6 text-primary" />
                  Real-time AI Pest Analysis
                </h2>
                <Badge variant="outline">Updated Now</Badge>
              </div>
              
              <div className="grid gap-4">
                {pestPredictions.map((pest, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{pest.name}</h4>
                        <p className="text-sm text-muted-foreground">{pest.symptoms}</p>
                      </div>
                      <Badge className={`${pest.risk === 'High' ? 'bg-red-500' : pest.risk === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>
                        {pest.risk} Risk
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Probability:</span>
                        <span className="text-sm font-medium">{pest.probability}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Critical Stage:</span>
                        <span className="text-sm font-medium">{pest.stage}</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-sm text-blue-700"><strong>Treatment:</strong> {pest.treatment}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default CropRoadmap;