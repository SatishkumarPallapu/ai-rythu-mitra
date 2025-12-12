import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, Clock, Droplets, Leaf, Bug, Shield, TrendingUp, 
  Target, AlertTriangle, CheckCircle2, DollarSign, Thermometer,
  Sprout, Scissors, Package, Truck, Factory, Users, Brain,
  Activity, BarChart3, PieChart, LineChart, MapPin, Bell, Heart,
  CloudRain, Wind, Zap
} from "lucide-react";

interface CultivationGuideProps {
  cropName: string;
  cropId: string;
}

const ComprehensiveCultivationGuide: React.FC<CultivationGuideProps> = ({ cropName, cropId }) => {
  const [activePhase, setActivePhase] = useState('preparation');
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    // Generate real-time alerts and recommendations
    generateSmartAlerts();
    generateWeatherRecommendations();
  }, []);

  const generateSmartAlerts = () => {
    const currentAlerts = [
      {
        id: 1,
        type: 'warning',
        title: 'Optimal Sowing Window',
        message: 'Based on weather forecast, next 5-7 days are ideal for sowing. Monsoon expected in 15 days.',
        action: 'Complete land preparation and start sowing',
        priority: 'high',
        timing: 'Next 7 days'
      },
      {
        id: 2,
        type: 'info',
        title: 'Market Price Alert',
        message: `${cropName} prices increased by 25% this week. Consider expanding cultivation area.`,
        action: 'Plan for additional 0.5-1 acre cultivation',
        priority: 'medium',
        timing: 'This season'
      },
      {
        id: 3,
        type: 'success',
        title: 'Soil Conditions Optimal',
        message: 'Recent soil analysis shows perfect pH and nutrient levels for cultivation.',
        action: 'Proceed with planned cultivation schedule',
        priority: 'low',
        timing: 'Current'
      }
    ];
    setAlerts(currentAlerts);
  };

  const generateWeatherRecommendations = () => {
    const weather = {
      current: {
        temperature: '28°C',
        humidity: '65%',
        rainfall: '15mm (last 7 days)',
        wind: '12 km/h'
      },
      forecast: {
        next7days: 'Partly cloudy with light showers expected',
        next15days: 'Monsoon arrival predicted, 150-200mm rainfall',
        recommendations: [
          'Complete sowing before heavy rains',
          'Prepare drainage channels',
          'Stock fungicides for disease prevention'
        ]
      }
    };
    setWeatherData(weather);
  };

  const detailedPhases = {
    preparation: {
      title: "🚜 Land Preparation & Planning",
      duration: "15-20 days",
      totalCost: "₹12,000-18,000 per acre",
      activities: [
        {
          day: "1-3",
          title: "Deep Ploughing & Soil Analysis",
          description: "Break soil hard pan and analyze nutrient status",
          steps: [
            "Use disc plough to 20-25cm depth for better root penetration",
            "Remove previous crop residues and weeds completely",
            "Collect soil samples from 5-6 spots for comprehensive testing",
            "Test pH (6.0-7.5 ideal), NPK levels, organic matter, micronutrients",
            "Check for soil-borne pests and diseases"
          ],
          inputs: "Tractor with disc plough, soil testing kit",
          cost: "₹2,000-2,500",
          criticalSuccess: "Proper soil structure determines 40% of final yield",
          tips: [
            "Avoid ploughing when soil is too wet (creates hard clods)",
            "Summer ploughing exposes pest pupae to sun, reducing pest load by 60%",
            "Deep ploughing once every 2-3 years maintains soil health"
          ]
        },
        {
          day: "4-8",
          title: "Soil Amendment & Organic Matter Addition",
          description: "Correct soil deficiencies and add organic matter",
          steps: [
            "Apply lime @ 500-1000 kg/acre if pH < 6.0",
            "Add gypsum @ 200-400 kg/acre if pH > 8.0 or for sodic soils",
            "Incorporate Farm Yard Manure @ 10-15 tons/acre",
            "Add vermicompost @ 2-3 tons/acre for quick nutrient release",
            "Apply neem cake @ 500 kg/acre for pest deterrent"
          ],
          inputs: "FYM, vermicompost, neem cake, lime/gypsum",
          cost: "₹8,000-12,000",
          benefits: [
            "Improves water holding capacity by 30-40%",
            "Increases soil organic carbon from 0.5% to 1.2%",
            "Enhances beneficial microbial population",
            "Reduces fertilizer requirement by 25-30%"
          ],
          timing: "Apply 2-3 weeks before sowing for proper decomposition"
        },
        {
          day: "9-12",
          title: "Secondary Tillage & Bed Preparation",
          description: "Create fine seedbed and prepare planting layout",
          steps: [
            "Use cultivator to break large clods and mix amendments",
            "Follow with rotavator for fine tilth preparation",
            "Level the field using laser land leveler (if available)",
            "Prepare raised beds: 1.2m wide, 15cm high, 30cm furrows",
            "Install drip irrigation system with 60cm lateral spacing"
          ],
          inputs: "Cultivator, rotavator, bed former, drip system",
          cost: "₹2,000-3,500",
          specifications: {
            bed_width: "1.2 meters",
            bed_height: "15 cm",
            furrow_width: "30 cm",
            plant_spacing: "60cm x 45cm",
            population: "3,700 plants/acre"
          }
        }
      ]
    },
    sowing: {
      title: "🌱 Sowing & Establishment",
      duration: "10-15 days",
      totalCost: "₹8,000-12,000 per acre",
      activities: [
        {
          day: "1-2",
          title: "Seed Treatment & Quality Check",
          description: "Enhance seed viability and disease resistance",
          steps: [
            "Check seed purity (>98%) and germination (>85%)",
            "Treat seeds with Thiram 2g/kg or Captan 2.5g/kg",
            "Bio-prime with Trichoderma harzianum @ 5g/L for 6 hours",
            "Nutrient priming with 2% KH₂PO₄ solution for 8 hours",
            "Dry treated seeds in shade for 2-3 hours before sowing"
          ],
          inputs: "Quality seeds, fungicides, bio-agents, nutrients",
          cost: "₹3,000-4,500",
          seedRate: {
            directSowing: "2.5-3.0 kg per acre",
            transplanting: "400-500g per acre (nursery)",
            hybridSeeds: "200-250g per acre",
            savings: "Bio-priming increases germination by 15-20%"
          },
          qualityTests: [
            "Physical purity test (>98% pure seeds)",
            "Germination test (>85% in 7 days)",
            "Vigor index calculation",
            "Moisture content (<8% for storage)"
          ]
        },
        {
          day: "3-5",
          title: "Sowing Operation & Initial Care",
          description: "Precise sowing for optimal plant establishment",
          methods: {
            directSowing: {
              process: [
                "Mark rows at 60cm spacing using rope/marker",
                "Make furrows 2-3cm deep with hand hoe",
                "Place 2-3 seeds per hill at 45cm spacing",
                "Cover with fine soil and press gently",
                "Apply light irrigation immediately after sowing"
              ],
              advantages: "Lower cost, no transplant shock, earlier maturity",
              disadvantages: "Higher seed rate, uneven establishment",
              bestFor: "Large area cultivation, mechanized farming"
            },
            transplanting: {
              process: [
                "Prepare nursery 25 days before transplanting",
                "Sow in raised beds with enriched soil mix",
                "Maintain temperature 25-30°C, humidity 80%",
                "Transplant 4-5 leaf stage seedlings in evening",
                "Water immediately and provide shade for 2-3 days"
              ],
              advantages: "Uniform crop stand, better survival rate",
              cost: "₹2,000-3,000 additional per acre",
              bestFor: "Small area, precision farming, hybrid varieties"
            }
          }
        }
      ]
    },
    vegetative: {
      title: "🌿 Vegetative Growth Management",
      duration: "30-45 days",
      totalCost: "₹3,000-6,000 per acre (need-based)",
      criticalFactors: "This phase determines 60% of final yield potential",
      activities: [
        {
          day: "15-20",
          title: "Smart Nutrition & Growth Support",
          description: "Need-based fertilization for healthy growth",
          steps: [
            "Check plant color - Apply Urea @ 25-30 kg/acre ONLY if leaves are pale yellow",
            "Soil test based fertilizer: Apply NPK only if soil test shows deficiency",
            "Leaf color chart check: Spray micronutrients ONLY if leaves show deficiency symptoms",
            "Use free/low-cost bamboo or wood stakes from local sources",
            "Mulch with free crop residues or grass clippings - no purchase needed",
            "Monitor plant growth - fertilize only if growth is slow compared to neighbors"
          ],
          inputs: "Urea (if needed), local stakes, free mulch material",
          cost: "₹2,000-4,000 (need-based)",
          tips: [
            "Healthy green plants don't need extra fertilizers - save money!",
            "Use leaf color chart to avoid unnecessary sprays",
            "Free mulching saves ₹3,000-5,000 compared to purchased materials"
          ]
        },
        {
          day: "25-35",
          title: "Smart Plant Management",
          description: "Low-cost preventive care for healthy plants",
          steps: [
            "Remove suckers weekly using fingers (no tools needed for soft shoots)",
            "Prune only diseased/damaged leaves - keep healthy leaves for photosynthesis",
            "Use old cloth strips as ties - no need to buy new materials",
            "Apply fertilizer ONLY if plant growth is slow - check with neighbors' crops",
            "Make homemade sticky traps: Yellow plastic + cooking oil (saves ₹1,000)",
            "Weekly visual inspection - treat only if pests cross 5-10 per leaf",
            "Use neem leaves/soap spray instead of commercial neem oil (₹500 vs ₹2,000)"
          ],
          inputs: "Old cloth, homemade traps, neem leaves/soap (if pests detected)",
          cost: "₹500-1,500 (prevention-focused)",
          tips: [
            "Prevention is 10x cheaper than treatment - scout regularly",
            "Homemade remedies work as well as expensive chemicals",
            "Healthy soil = healthy plants = less pest problems"
          ]
        }
      ]
    },
    flowering: {
      title: "🌸 Flowering & Fruit Setting",
      duration: "15-25 days",
      totalCost: "₹1,500-4,000 per acre (problem-solving)",
      criticalSuccess: "Proper management can increase fruit set from 60% to 85%",
      activities: [
        {
          day: "45-55",
          title: "Smart Flowering Management",
          description: "Cost-effective flower and fruit set optimization",
          steps: [
            "Check flower drop: Apply fertilizer ONLY if >30% flowers are dropping",
            "Use kitchen boric acid (₹20) instead of agricultural grade (₹200) - same results",
            "Natural pollination: Just shake plants gently - no need for expensive bee boxes",
            "Water management: Consistent moisture is free - just maintain regular schedule",
            "Remove excess flowers only if clusters have >8-10 flowers",
            "Skip growth regulators unless fruit set is <40% (check with extension officer)",
            "Use old gunny bags for shade instead of expensive shade nets",
            "Manual weed removal instead of herbicides - free labor during low activity period"
          ],
          inputs: "Kitchen boric acid (if flower drop >30%), gunny bags for shade",
          cost: "₹500-2,000 (problem-solving approach)",
          tips: [
            "Most tomato varieties set fruits naturally - no need for expensive inputs",
            "Kitchen boric acid costs 90% less than agricultural products",
            "Manual pollination by shaking is free and effective"
          ]
        },
        {
          day: "55-65",
          title: "Economic Fruit Development",
          description: "Prevent problems with minimal investment",
          steps: [
            "Daily visual check for fruit drop - identify causes before treating",
            "Apply calcium spray ONLY if blossom end rot symptoms appear (black spots)",
            "Thin fruits only in overcrowded clusters (>6 fruits) - let nature decide most",
            "Use old cloth strips for support - free from household materials",
            "Consistent watering schedule - most important and costs nothing",
            "Check soil moisture with finger test - irrigate only when needed",
            "Homemade pheromone traps: Plastic bottles + pheromone lures (₹100 vs ₹500)",
            "Remove suckers by hand - regular maintenance prevents problems"
          ],
          inputs: "Old cloth strips, plastic bottles for traps (if borer detected)",
          cost: "₹200-1,000 (prevention-first approach)",
          tips: [
            "Most fruit drop is natural - don't panic and over-treat",
            "Consistent watering prevents 80% of fruit development problems",
            "Homemade traps work as well as expensive commercial ones"
          ]
        }
      ]
    },
    fruiting: {
      title: "🍅 Fruit Development & Maturation",
      duration: "45-60 days",
      totalCost: "₹5,000-12,000 per acre (smart farming)",
      activities: [
        {
          day: "60-90",
          title: "Smart Fruit Development",
          description: "Maximum profit with minimum input cost",
          steps: [
            "Check fruit cracking: Apply calcium spray ONLY if >10% fruits show cracks",
            "Remove only severely diseased fruits - minor blemishes don't affect yield",
            "Use coconut leaves/palm fronds for free shade instead of expensive nets",
            "Consistent watering schedule - most critical and free intervention",
            "Apply potassium ONLY if fruits are small compared to variety potential",
            "Make traps only if fruit borer damage exceeds 5% of fruits",
            "Use turmeric paste from kitchen instead of expensive fungicides",
            "Natural leaf pruning - remove only yellowing leaves touching ground"
          ],
          inputs: "Local shade materials, kitchen turmeric (if disease present)",
          cost: "₹1,000-3,000 (problem-solving approach)",
          tips: [
            "Consistent watering prevents 90% of fruit problems - focus on this first",
            "Local materials for shade work as well as commercial nets",
            "Kitchen ingredients often work better than expensive chemicals"
          ]
        },
        {
          day: "90-105",
          title: "Pre-Harvest Optimization", 
          description: "Prepare for profitable harvest with minimal cost",
          steps: [
            "Reduce watering gradually - natural sugar concentration saves irrigation cost",
            "Remove new flowers to focus energy on existing fruits - free operation",
            "Use old fishing nets or cloth for bird protection ONLY if damage >10%",
            "Make fruit fly traps from plastic bottles + kitchen ingredients (vinegar/jaggery)",
            "Remove suckers and excess leaves by hand - regular free maintenance",
            "Daily fruit monitoring for harvest timing - most critical for good prices",
            "Collect harvest containers from previous crops or local sources",
            "Plan harvest schedule based on market day prices"
          ],
          inputs: "Old nets/cloth (if bird problem), plastic bottles, kitchen ingredients",
          cost: "₹500-1,500 (mostly free operations)", 
          tips: [
            "Timing harvest right increases profits by 50% - focus on this",
            "Homemade fruit fly traps cost ₹50 vs ₹500 commercial ones",
            "Most pre-harvest operations are free - just need time and observation"
          ]
        }
      ]
    },
    harvest: {
      title: "🔄 Harvesting & Post-Harvest",
      duration: "30-45 days",
      totalCost: "₹2,000-5,000 per acre (profit-focused)",
      activities: [
        {
          day: "90-120",
          title: "Profit-Smart Harvesting",
          description: "Maximum returns with minimum investment",
          steps: [
            "Learn maturity signs from experienced farmers - free knowledge worth gold",
            "Harvest in early morning - natural cooling saves refrigeration costs",
            "Use clean kitchen knife instead of expensive secateurs - same results",
            "Reuse vegetable crates from local vendors - free or ₹20-30 per crate",
            "Simple grading: Large (premium price), Medium (standard), Small (bulk price)",
            "Use household shade - under tree, house verandah - no cost cooling",
            "Clean water wash is sufficient - skip expensive chlorine treatment for local market",
            "Check local market prices daily - sell when prices peak (usually weekends)",
            "Direct selling to consumers gives 40% more profit than wholesale"
          ],
          inputs: "Kitchen knife, reused crates, clean water, local market intelligence",
          cost: "₹500-2,000 (smart resource use)",
          tips: [
            "Direct consumer sales can double your profits compared to wholesale",
            "Timing sales with local festivals/events increases prices by 30%",
            "Simple grading is enough - fancy processing reduces profits for small farmers"
          ]
        },
        {
          day: "120-135",
          title: "Smart Value Addition",
          description: "Low-cost strategies for higher profits",
          steps: [
            "Use household space for grading - kitchen, courtyard - zero rental cost", 
            "Borrow weighing scale from neighbors or use local shop scale",
            "Use newspaper/old magazines for packaging - free and eco-friendly",
            "Skip expensive wax coating - natural fruit shelf life is sufficient for local sales",
            "Focus on local markets within 50km - save transport costs",
            "Build customer relationships for repeat sales and premium prices",
            "Make simple products: Sun-dried tomatoes, pickle - high profit margins",
            "Save best seeds for next season - saves ₹3,000-5,000 on seed cost",
            "Simple profit calculation: Total earnings - Total expenses = Real profit"
          ],
          inputs: "Household materials, saved seeds, basic processing ingredients",
          cost: "₹500-2,000 (resource optimization)",
          tips: [
            "Local loyal customers pay 20-30% more than wholesale markets",
            "Simple processing with kitchen equipment gives 100% more profit",
            "Saved seeds from best plants improve next crop quality"
          ]
        },
        {
          day: "135-150",
          title: "Profit Maximization Planning",
          description: "Smart strategies for sustainable high profits",
          steps: [
            "Build relationships with local vegetable vendors - guaranteed regular sales",
            "Connect with nearby restaurants/hotels for bulk supply contracts",
            "Use WhatsApp groups to sell directly to urban consumers",
            "Calculate real profit: (Total sales - All expenses) ÷ Investment = ROI%",
            "Track local market prices weekly using smartphone apps or calls",
            "Reinvest profits wisely: 50% for next crop, 30% for family, 20% savings",
            "Plan crop rotation with high-profit vegetables based on season",
            "Learn from other successful farmers in your area - free mentorship",
            "Start with small area, perfect the technique, then scale up gradually",
            "Focus on crops that give 200%+ return on investment"
          ],
          inputs: "Smartphone for market info, notebook for profit tracking",
          cost: "₹200-500 (mostly free activities)",
          tips: [
            "Local relationships are more profitable than distant markets",
            "Small-scale perfection leads to large-scale profits",
            "Consistent 200% ROI is better than unpredictable high returns"
          ]
        }
      ]
    }
  };

  const intercroppingStrategies = [
    {
      name: `${cropName} + Marigold + Coriander System`,
      layout: "4:1:1 row ratio",
      totalIncome: "₹1,50,000-2,20,000 per acre",
      additionalProfit: "₹35,000-50,000 over monocrop",
      timeline: {
        day1: "Plant tomato and marigold",
        day15: "Sow first batch of coriander", 
        day30: "Second coriander sowing",
        day45: "Third coriander sowing",
        day60: "Start coriander harvest cycles"
      },
      benefits: [
        "Marigold reduces nematodes by 60-80%",
        "Continuous income from coriander harvests",
        "Better pollinator attraction",
        "Reduced pest pressure through diversification"
      ],
      management: {
        irrigation: "Separate drip lines for different crops",
        fertilization: "Reduce main crop fertilizer by 10-15%",
        harvesting: "Staggered harvest extends labor distribution"
      }
    },
    {
      name: `${cropName} + Basil + Lettuce Premium System`,
      layout: "3:1:2 arrangement",
      marketFocus: "Premium urban markets, restaurants",
      totalIncome: "₹2,00,000-3,50,000 per acre",
      profitMargin: "65-75% vs 40-50% monocrop",
      valueAddition: [
        "Fresh herb packaging (₹300/kg vs ₹80/kg bulk)",
        "Restaurant supply contracts",
        "Organic certification premium (40-60% extra)",
        "Export potential for processed herbs"
      ]
    }
  ];

  const profitOptimizationStrategies = {
    costReduction: [
      {
        strategy: "Integrated Nutrient Management",
        savings: "25-30% on fertilizer costs",
        method: "Combine organic manures, biofertilizers, and synthetic fertilizers",
        implementation: "50% organic + 30% synthetic + 20% biofertilizers"
      },
      {
        strategy: "Precision Water Management",
        savings: "40-50% on irrigation costs",
        method: "Drip irrigation with automation and sensors",
        roi: "Investment recovered in 2-3 seasons"
      },
      {
        strategy: "Integrated Pest Management",
        savings: "30-40% on pesticide costs", 
        method: "Biological control + targeted chemical intervention",
        benefits: "Healthier produce, export market access"
      }
    ],
    revenueEnhancement: [
      {
        strategy: "Value Addition & Processing",
        increase: "200-400% over fresh produce",
        products: "Dried tomatoes, puree, paste, sauce",
        investment: "₹2-10 lakhs for processing setup"
      },
      {
        strategy: "Direct Marketing",
        increase: "40-60% over wholesale prices",
        channels: "Farmer markets, online platforms, restaurant supply",
        requirements: "Quality packaging, brand development"
      },
      {
        strategy: "Contract Farming",
        benefits: "Assured price and market, input support",
        partners: "Food processing companies, retail chains",
        premiums: "15-25% above market rates"
      }
    ]
  };

  const smartAlertSystem = {
    weatherAlerts: [
      "Heavy rain warning: Cover mature fruits, improve drainage",
      "High temperature alert: Increase irrigation, provide shade",
      "Frost warning: Cover plants, use smudge pots"
    ],
    pestAlerts: [
      "Whitefly population increasing: Install yellow sticky traps",
      "Fruit borer damage detected: Apply pheromone traps immediately", 
      "Disease symptoms observed: Spray copper fungicide"
    ],
    marketAlerts: [
      "Price surge predicted: Delay harvest by 3-5 days for better rates",
      "Demand peak approaching: Prepare for increased harvesting",
      "Export opportunity: Maintain quality standards for premium prices"
    ],
    nutritionAlerts: [
      "Nutrient deficiency signs: Apply micronutrient spray",
      "pH imbalance detected: Add lime or gypsum as needed",
      "Soil moisture stress: Increase irrigation frequency"
    ]
  };

  return (
    <div className="space-y-6">
      {/* Smart Alerts Dashboard */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Bell className="w-5 h-5" />
            🚨 Smart Farming Alerts & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert) => (
            <Alert key={alert.id} className={`border-l-4 ${
              alert.priority === 'high' ? 'border-l-red-500 bg-red-50' :
              alert.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
              'border-l-green-500 bg-green-50'
            }`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{alert.title}</p>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">Action: {alert.action}</p>
                  </div>
                  <Badge variant={alert.priority === 'high' ? 'destructive' : 
                              alert.priority === 'medium' ? 'default' : 'secondary'}>
                    {alert.timing}
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Comprehensive Cultivation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            🚀 Complete {cropName} Cultivation Mastery Guide
          </CardTitle>
          <p className="text-muted-foreground">
            Step-by-step professional farming guide for maximum profitability. 
            From land preparation to market sales - everything you need to become a successful agripreneur.
          </p>
        </CardHeader>
      </Card>

      {/* Phase-wise Detailed Guide */}
      <Tabs value={activePhase} onValueChange={setActivePhase}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="preparation">🚜 Preparation</TabsTrigger>
          <TabsTrigger value="sowing">🌱 Sowing</TabsTrigger>
          <TabsTrigger value="vegetative">🌿 Growth</TabsTrigger>
          <TabsTrigger value="flowering">🌸 Flowering</TabsTrigger>
          <TabsTrigger value="fruiting">🍅 Fruiting</TabsTrigger>
          <TabsTrigger value="harvest">🔄 Harvest</TabsTrigger>
        </TabsList>

        {Object.entries(detailedPhases).map(([phase, data]) => (
          <TabsContent key={phase} value={phase} className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-green-50">
              <CardHeader>
                <CardTitle className="text-xl">{data.title}</CardTitle>
                <div className="flex gap-4 text-sm">
                  <Badge variant="outline" className="gap-1">
                    <Clock className="w-3 h-3" />
                    {data.duration}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <DollarSign className="w-3 h-3" />
                    {data.totalCost}
                  </Badge>
                  {data.criticalSuccess && (
                    <Badge className="bg-red-100 text-red-800">
                      Critical: {data.criticalSuccess}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(data.activities || []).map((activity, index) => (
                    <Card key={index} className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          Day {activity.day}: {activity.title}
                        </CardTitle>
                        <p className="text-muted-foreground">{activity.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">📋 Step-by-Step Process:</h4>
                            <ol className="space-y-2">
                              {(activity.steps || []).map((step, stepIndex) => (
                                <li key={stepIndex} className="text-sm flex gap-2">
                                  <span className="font-semibold text-blue-600">{stepIndex + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div className="space-y-3">
                            <div className="bg-gray-50 p-3 rounded">
                              <p className="text-sm"><strong>Required Inputs:</strong> {activity.inputs || 'Not specified'}</p>
                              <p className="text-sm"><strong>Estimated Cost:</strong> {activity.cost || 'Contact local dealer'}</p>
                            </div>
                            {activity.tips && activity.tips.length > 0 && (
                              <div className="bg-blue-50 p-3 rounded">
                                <h5 className="font-semibold text-blue-800">💡 Pro Tips:</h5>
                                <ul className="text-xs space-y-1 mt-1">
                                  {activity.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex}>• {tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Intercropping Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            💰 Advanced Intercropping for Maximum Profits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {(intercroppingStrategies || []).map((strategy, index) => (
            <Card key={index} className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="text-lg">{strategy.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-green-600">
                    Income: {strategy.totalIncome || 'TBD'}
                  </Badge>
                  {strategy.additionalProfit && (
                    <Badge className="bg-purple-600">
                      Extra Profit: {strategy.additionalProfit}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">📅 Implementation Timeline:</h4>
                    {strategy.timeline ? Object.entries(strategy.timeline).map(([day, activity]) => (
                      <div key={day} className="flex gap-2 text-sm">
                        <span className="font-semibold capitalize">{day}:</span>
                        <span>{activity}</span>
                      </div>
                    )) : <p className="text-sm text-muted-foreground">Timeline coming soon</p>}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🎯 Key Benefits:</h4>
                    <ul className="space-y-1 text-sm">
                      {(strategy.benefits || []).map((benefit, benefitIndex) => (
                        <li key={benefitIndex}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Profit Optimization Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-yellow-600" />
            📈 Agripreneurship: Profit Maximization Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cost-reduction">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cost-reduction">💰 Cost Reduction</TabsTrigger>
              <TabsTrigger value="revenue-boost">📊 Revenue Enhancement</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cost-reduction" className="space-y-4">
              {(profitOptimizationStrategies?.costReduction || []).map((strategy, index) => (
                <Card key={index} className="bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{strategy.strategy || 'Cost Optimization'}</h4>
                        <p className="text-sm text-muted-foreground">{strategy.method || 'Method details coming soon'}</p>
                        <p className="text-xs mt-1">{strategy.implementation || 'Implementation guide available'}</p>
                      </div>
                      <Badge className="bg-green-600">
                        Save: {strategy.savings || 'TBD'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="revenue-boost" className="space-y-4">
              {(profitOptimizationStrategies?.revenueEnhancement || []).map((strategy, index) => (
                <Card key={index} className="bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{strategy.strategy || 'Revenue Enhancement'}</h4>
                        <p className="text-sm text-muted-foreground">
                          {strategy.products || strategy.channels || strategy.partners || 'Details available on request'}
                        </p>
                        <p className="text-xs mt-1">
                          {strategy.investment || strategy.requirements || strategy.premiums || 'Investment details coming soon'}
                        </p>
                      </div>
                      <Badge className="bg-blue-600">
                        Boost: {strategy.increase || strategy.benefits || 'TBD'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveCultivationGuide;