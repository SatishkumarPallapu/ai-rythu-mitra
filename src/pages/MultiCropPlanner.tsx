import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Layers, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MultiCropPlanner = () => {
  const navigate = useNavigate();

  const strategies = [
    {
      id: 1,
      name: "Paddy + Vegetables Rotation",
      crops: ["Rice", "Tomato", "Okra"],
      duration: "12 months",
      profit: "₹2,50,000",
      landUse: "100%",
      type: "Sequential"
    },
    {
      id: 2,
      name: "Cotton + Intercrop Strategy",
      crops: ["Cotton", "Green Gram", "Black Gram"],
      duration: "8 months",
      profit: "₹3,20,000",
      landUse: "100%",
      type: "Intercropping"
    },
    {
      id: 3,
      name: "Fruit + Vegetable Mix",
      crops: ["Banana", "Turmeric", "Ginger"],
      duration: "18 months",
      profit: "₹4,50,000",
      landUse: "100%",
      type: "Mixed"
    }
  ];

  const handleCreatePlan = () => {
    navigate('/crop-recommendations?mode=multi');
  };

  const handleViewDetails = (strategyId: number) => {
    navigate(`/multi-crop-strategy/${strategyId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Layers className="w-7 h-7 text-primary" />
            Multi-Crop Planner
          </h2>
          <p className="text-muted-foreground">
            Maximize profits by growing multiple crops strategically
          </p>
        </div>

        <Button onClick={handleCreatePlan} size="lg" className="w-full">
          <Plus className="w-5 h-5 mr-2" />
          Create New Multi-Crop Plan
        </Button>

        <div className="space-y-4">
          <h3 className="font-semibold">Popular Strategies</h3>
          {strategies.map((strategy) => (
            <Card key={strategy.id} className="p-5 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">{strategy.name}</h4>
                    <Badge variant="secondary" className="mt-2">
                      {strategy.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-success">{strategy.profit}</div>
                    <div className="text-xs text-muted-foreground">Expected Profit</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {strategy.crops.map((crop, idx) => (
                    <Badge key={idx} variant="outline" className="text-sm">
                      🌾 {crop}
                    </Badge>
                  ))}
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
