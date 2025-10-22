import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Sprout,
  TrendingUp,
  Clock,
  Droplets,
  MapPin,
  Sparkles,
  ShoppingCart,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CropRecommendations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    soilType: "",
    season: "",
    location: "",
    dailyMarket: false,
    multiCropping: false,
  });

  // Mock recommendations (will be replaced with AI recommendations)
  const mockRecommendations = [
    {
      id: "1",
      name: "Tomato",
      category: "vegetables",
      suitability_score: 95,
      expected_yield: "25-30 tons/acre",
      growth_duration: "85-90 days",
      water_requirement: "Medium",
      profit_index: "Very High",
      daily_market_crop: true,
      compatible_crops: ["Coriander", "Marigold"],
    },
    {
      id: "2",
      name: "Green Chilli",
      category: "vegetables",
      suitability_score: 92,
      expected_yield: "8-10 tons/acre",
      growth_duration: "90-120 days",
      water_requirement: "Medium",
      profit_index: "High",
      daily_market_crop: true,
      compatible_crops: ["Onion", "Garlic"],
    },
    {
      id: "3",
      name: "Coriander",
      category: "herbs",
      suitability_score: 88,
      expected_yield: "2-3 tons/acre",
      growth_duration: "35-40 days",
      water_requirement: "Low",
      profit_index: "High",
      daily_market_crop: true,
      compatible_crops: ["Tomato", "Cabbage"],
    },
  ];

  const [recommendations, setRecommendations] = useState(mockRecommendations);

  const handleGetRecommendations = async () => {
    if (!formData.soilType || !formData.season || !formData.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // TODO: Call AI recommendation API
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
      toast({
        title: "Recommendations ready!",
        description: "AI has analyzed your farm conditions",
      });
    }, 1500);
  };

  const handleSelectCrop = (cropId: string) => {
    navigate(`/crop-roadmap/${cropId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <div className="p-4 space-y-6">
        {/* Hero Section */}
        <div className="gradient-primary rounded-2xl p-6 text-white animate-fadeIn">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            AI Crop Recommendations
          </h1>
          <p className="text-white/90">
            Get personalized crop suggestions based on your soil, season, and market demand
          </p>
        </div>

        {/* Input Form */}
        <Card className="p-6 space-y-4 animate-slideUp">
          <h2 className="text-lg font-semibold mb-4">Your Farm Details</h2>

          <div>
            <Label htmlFor="soilType">Soil Type</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, soilType: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clay">Clay</SelectItem>
                <SelectItem value="loamy">Loamy</SelectItem>
                <SelectItem value="sandy">Sandy</SelectItem>
                <SelectItem value="black">Black Soil</SelectItem>
                <SelectItem value="red">Red Soil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="season">Season</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, season: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                <SelectItem value="summer">Summer</SelectItem>
                <SelectItem value="year-round">Year-round</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter your location (e.g., Guntur, AP)"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="dailyMarket"
              checked={formData.dailyMarket}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, dailyMarket: checked as boolean })
              }
            />
            <label
              htmlFor="dailyMarket"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <ShoppingCart className="inline w-4 h-4 mr-1" />
              Prefer daily market crops (fast-selling)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="multiCropping"
              checked={formData.multiCropping}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, multiCropping: checked as boolean })
              }
            />
            <label
              htmlFor="multiCropping"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <Leaf className="inline w-4 h-4 mr-1" />
              Show multi-cropping strategies
            </label>
          </div>

          <Button
            onClick={handleGetRecommendations}
            className="w-full gradient-success text-white"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Get AI Recommendations"}
          </Button>
        </Card>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Recommended Crops for You</h2>

            {recommendations.map((crop, index) => (
              <Card
                key={crop.id}
                className="p-6 card-hover cursor-pointer animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleSelectCrop(crop.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary">{crop.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{crop.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-success">
                      {crop.suitability_score}%
                    </div>
                    <p className="text-xs text-muted-foreground">Match Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span>{crop.expected_yield}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{crop.growth_duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>{crop.water_requirement}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span>{crop.profit_index} Profit</span>
                  </div>
                </div>

                {crop.daily_market_crop && (
                  <div className="inline-flex items-center gap-1 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium mb-3">
                    <ShoppingCart className="w-3 h-3" />
                    Daily Market Crop
                  </div>
                )}

                {crop.compatible_crops && crop.compatible_crops.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Compatible with: </span>
                    {crop.compatible_crops.join(", ")}
                  </div>
                )}

                <Button className="w-full mt-4 gradient-primary text-white group">
                  View Complete Roadmap
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default CropRecommendations;
