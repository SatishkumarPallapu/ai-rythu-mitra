import { useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Layers, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MultiCropPlanner = () => {
  const navigate = useNavigate();

  const croppingTypes = [
    {
      id: 'sequential',
      name: 'Sequential Cropping',
      description: 'Grow crops one after another on same land',
      icon: '🔄',
      benefits: ['Maximum land utilization', '3-4 crops per year', 'Reduced pest buildup'],
      example: 'Wheat → Rice → Maize',
      efficiency: '15-20% yield increase'
    },
    {
      id: 'intercropping',
      name: 'Intercropping',
      description: 'Grow multiple crops simultaneously in patterns',
      icon: '🌾',
      benefits: ['Risk diversification', 'Improved soil health', 'Pest control'],
      example: 'Maize + Beans + Squash',
      efficiency: '25-30% profit increase'
    },
    {
      id: 'mixed',
      name: 'Mixed Cropping',
      description: 'Multiple crops together without specific pattern',
      icon: '🌿',
      benefits: ['Risk reduction', 'Better resource use', 'Continuous income'],
      example: 'Wheat + Mustard + Gram',
      efficiency: '10-15% risk reduction'
    },
    {
      id: 'relay',
      name: 'Relay Cropping',
      description: 'Plant next crop before previous harvest',
      icon: '⚡',
      benefits: ['Zero downtime', 'Water efficiency', 'Extended growing season'],
      example: 'Sowing wheat in standing rice',
      efficiency: '30-40% time saving'
    }
  ];

  const strategies = [
    {
      id: 1,
      name: "High-Value Sequential Plan",
      crops: ["Tomato", "Coriander", "Spinach"],
      duration: "12 months",
      profit: "₹4,50,000",
      type: "Sequential",
      cycles: 4,
      marketFocus: "Daily Market"
    },
    {
      id: 2,
      name: "Cotton + Pulse Intercrop",
      crops: ["Cotton", "Green Gram", "Black Gram"],
      duration: "8 months",
      profit: "₹3,20,000",
      type: "Intercropping",
      cycles: 1,
      marketFocus: "Commercial"
    },
    {
      id: 3,
      name: "Restaurant Supply Mix",
      crops: ["Onion", "Chilli", "Garlic"],
      duration: "10 months",
      profit: "₹3,80,000",
      type: "Mixed",
      cycles: 2,
      marketFocus: "Restaurant"
    },
    {
      id: 4,
      name: "Rice-Wheat Relay System",
      crops: ["Rice", "Wheat"],
      duration: "12 months",
      profit: "₹2,80,000",
      type: "Relay",
      cycles: 2,
      marketFocus: "Grain Market"
    }
  ];

  const handleCreatePlan = async () => {
    navigate('/crop-recommendations?mode=multi');
  };

  const handleViewDetails = (strategyId: number) => {
    const strategy = strategies.find(s => s.id === strategyId);
    if (strategy) {
      // Navigate to a detailed strategy view
      navigate(`/multi-crop-strategy/${strategyId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Layers className="w-7 h-7 text-primary" />
            Multi-Crop Strategy Planner
          </h2>
          <p className="text-muted-foreground">
            Maximize land use and profits with smart cropping strategies
          </p>
        </div>

        {/* Cropping Types */}
        <div className="space-y-4">
          <h3 className="font-semibold">Choose Your Cropping Strategy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {croppingTypes.map((type) => (
              <Card key={type.id} className="p-5 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/30">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <h4 className="font-semibold">{type.name}</h4>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {type.efficiency}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-600">Benefits:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {type.benefits.map((benefit, idx) => (
                        <li key={idx}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-accent/10 p-3 rounded-lg">
                    <p className="text-xs font-medium mb-1">Example:</p>
                    <p className="text-sm text-muted-foreground">{type.example}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Button onClick={handleCreatePlan} size="lg" className="w-full">
          <Plus className="w-5 h-5 mr-2" />
          Create Custom Multi-Crop Plan
        </Button>

        <div className="space-y-4">
          <h3 className="font-semibold">Recommended Strategies for Your Region</h3>
          {strategies.map((strategy) => (
            <Card key={strategy.id} className="p-5 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewDetails(strategy.id)}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{strategy.name}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{strategy.type}</Badge>
                      <Badge variant="outline" className="text-xs">{strategy.marketFocus}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-success">{strategy.profit}</div>
                    <div className="text-xs text-muted-foreground">Expected Annual Profit</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {strategy.crops.map((crop, idx) => (
                    <Badge key={idx} variant="outline" className="text-sm">
                      🌾 {crop}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <Calendar className="w-4 h-4 text-muted-foreground mb-1" />
                    <p className="font-medium">{strategy.duration}</p>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </div>
                  <div>
                    <TrendingUp className="w-4 h-4 text-muted-foreground mb-1" />
                    <p className="font-medium">{strategy.cycles} cycles/year</p>
                    <p className="text-xs text-muted-foreground">Harvest Cycles</p>
                  </div>
                  <div>
                    <Layers className="w-4 h-4 text-muted-foreground mb-1" />
                    <p className="font-medium">{strategy.type}</p>
                    <p className="text-xs text-muted-foreground">Strategy Type</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{strategy.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{strategy.landUse} Land Use</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleViewDetails(strategy.id)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-gradient-subtle">
          <h3 className="font-semibold mb-3">Why Multi-Cropping?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Maximum land utilization throughout the year</li>
            <li>✓ Reduced risk with diversified income sources</li>
            <li>✓ Better soil health with crop rotation</li>
            <li>✓ Steady income across seasons</li>
            <li>✓ Natural pest control with companion planting</li>
          </ul>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default MultiCropPlanner;
