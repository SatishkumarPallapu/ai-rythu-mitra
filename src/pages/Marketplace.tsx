import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Filter } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getCropIcon } from "@/utils/cropIcons";
import CropCard from "@/components/CropCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Marketplace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchCrops();
  }, [categoryFilter]);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      // Quick-Income Crop Marketplace Data (30-120 days)
      let mockCrops = [
        {
          id: '1',
          name: 'Coriander',
          category: 'leafy',
          suitability_score: 98,
          expected_yield: '8-12 tons/acre',
          growth_duration: '30-45 days',
          duration_days: 45,
          water_requirement: 'low',
          profit_index: 'very_high',
          market_demand_index: 9.5,
          daily_market_crop: true,
          home_growable: true,
          intercropping_possibility: 'Excellent with spinach, radish, fenugreek',
          health_benefits: 'Rich in antioxidants, aids digestion, lowers cholesterol.',
          vitamins: 'A, C, K, Folate',
          season: 'Winter'
        },
        {
          id: '2',
          name: 'Spinach',
          category: 'leafy',
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
          vitamins: 'A, C, E, K, Folate, Iron',
          season: 'Winter'
        },
        {
          id: '3',
          name: 'Radish',
          category: 'root',
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
          vitamins: 'C, Folate, Potassium',
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
          profit_index: 'very_high',
          market_demand_index: 9.5,
          daily_market_crop: true,
          home_growable: true,
          intercropping_possibility: 'Good with tomato, chili, marigold',
          health_benefits: 'High fiber, controls diabetes, heart healthy.',
          vitamins: 'A, C, K, Folate',
          season: 'Summer'
        },
        {
          id: '5',
          name: 'Fenugreek',
          category: 'leafy',
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
          vitamins: 'A, C, Iron, Calcium',
          season: 'Winter'
        },
        {
          id: '6',
          name: 'Microgreens',
          category: 'microgreens',
          suitability_score: 99,
          expected_yield: '1-2 kg/sq.ft',
          growth_duration: '10-20 days',
          duration_days: 20,
          water_requirement: 'low',
          profit_index: 'ultra_high',
          market_demand_index: 9.8,
          daily_market_crop: true,
          home_growable: true,
          intercropping_possibility: 'Indoor controlled environment',
          health_benefits: 'Concentrated nutrients, antioxidants, enzymes.',
          vitamins: 'All vitamins concentrated',
          season: 'Year-round'
        },
        {
          id: '7',
          name: 'Beetroot',
          category: 'root',
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
          vitamins: 'A, C, Folate, Iron',
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
          vitamins: 'C, K, Potassium',
          season: 'Summer'
        }
      ];

      if (categoryFilter !== 'all') {
        mockCrops = mockCrops.filter(crop => crop.category === categoryFilter);
      }

      // Sort by market demand
      mockCrops.sort((a, b) => b.market_demand_index - a.market_demand_index);

      setCrops(mockCrops);
    } catch (error) {
      console.error('Error loading crops:', error);
      toast({
        title: "Error loading marketplace",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Marketplace</h2>
              <p className="text-muted-foreground">Buy and sell produce</p>
            </div>
            <Button size="icon" className="rounded-full h-12 w-12 shadow-lg">
              <Plus className="w-6 h-6" />
            </Button>
          </div>

          {/* Search & Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search crops..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="vegetable">Vegetables</SelectItem>
                <SelectItem value="fruit">Fruits</SelectItem>
                <SelectItem value="grain">Grains</SelectItem>
                <SelectItem value="pulse">Pulses</SelectItem>
                <SelectItem value="spice">Spices</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Crops Listings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{filteredCrops.length} Crops Available</h3>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading crops...</div>
          ) : filteredCrops.length > 0 ? (
            filteredCrops.map((crop, index) => (
              <CropCard
                key={crop.id}
                crop={crop}
                onSelect={(id) => navigate(`/crop-roadmap/${id}`)}
                animationDelay={index * 0.02}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No crops found matching your search
            </div>
          )}
        </div>

        {/* Market Prices */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">Today's Market Prices</h3>
            <div className="space-y-2">
              {[
                { crop: "Tomato", price: "₹38-42/kg", trend: "up" },
                { crop: "Rice", price: "₹33-37/kg", trend: "stable" },
                { crop: "Cotton", price: "₹82-88/kg", trend: "down" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="font-medium">{item.crop}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.price}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        item.trend === "up"
                          ? "bg-success/10 text-success"
                          : item.trend === "down"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Marketplace;
