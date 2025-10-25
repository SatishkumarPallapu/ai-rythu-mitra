import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Sprout, TrendingUp, Calendar, Droplets, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  const [hoveredCrop, setHoveredCrop] = useState<string | null>(null);

  const categories = ["all", "vegetable", "fruit", "grain", "pulse", "spice", "oilseed", "plantation", "medicinal", "fodder", "flower"];

  useEffect(() => {
    fetchCrops();
  }, [selectedCategory]);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('crops_master')
        .select('*')
        .order('market_demand_index', { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      if (mode === 'multi-crop') {
        query = query.eq('home_growable', true);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;

      setCrops(data || []);
    } catch (error: any) {
      console.error('Error fetching crops:', error);
      toast({
        title: "Error loading crops",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

                  {crop.daily_market_crop && (
                    <Badge variant="default" className="text-xs">
                      Daily Market Crop
                    </Badge>
                  )}

                  {crop.home_growable && (
                    <Badge variant="secondary" className="text-xs">
                      Home Growable
                    </Badge>
                  )}

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
      </main>

      <BottomNav />
    </div>
  );
};

export default CropRecommendations;
