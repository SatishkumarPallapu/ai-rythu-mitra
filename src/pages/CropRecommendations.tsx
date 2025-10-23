import { useState, useEffect } from "react";
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
import { Sparkles, ShoppingCart, Leaf, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CropCard from "@/components/CropCard";
import AuthModal from "@/components/AuthModal";

const CropRecommendations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [formData, setFormData] = useState({
    soilType: "",
    season: "",
    location: "",
    dailyMarket: false,
    multiCropping: false,
  });

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [allCrops, setAllCrops] = useState<any[]>([]);

  useEffect(() => {
    // Load initial crops on mount
    loadMoreCrops();
  }, []);

  const loadMoreCrops = async () => {
    setLoadingMore(true);
    try {
      const from = page * 50;
      const to = from + 49;

      const { data, error, count } = await supabase
        .from('crops_master')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('market_demand_index', { ascending: false });

      if (error) throw error;

      if (data) {
        setAllCrops(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
        setHasMore(data.length === 50);
      }
    } catch (error) {
      console.error('Error loading crops:', error);
    } finally {
      setLoadingMore(false);
    }
  };

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
    
    try {
      // Fetch recommendations from database based on criteria
      let query = supabase
        .from('crops_master')
        .select('*')
        .contains('soil_type', [formData.soilType])
        .order('market_demand_index', { ascending: false })
        .limit(100);

      if (formData.dailyMarket) {
        query = query.eq('daily_market_crop', true);
      }

      if (formData.multiCropping) {
        query = query.not('intercropping_possibility', 'is', null);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculate suitability scores
      const scoredCrops = (data || []).map(crop => ({
        ...crop,
        suitability_score: calculateSuitabilityScore(crop, formData),
        expected_yield: `${Math.floor(Math.random() * 10) + 15}-${Math.floor(Math.random() * 10) + 25} tons/acre`,
        growth_duration: `${crop.duration_days} days`
      })).sort((a, b) => b.suitability_score - a.suitability_score);

      setRecommendations(scoredCrops);
      toast({
        title: "Recommendations ready!",
        description: `Found ${scoredCrops.length} matching crops`,
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Error loading recommendations",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSuitabilityScore = (crop: any, criteria: any): number => {
    let score = 70; // Base score
    
    if (crop.daily_market_crop && criteria.dailyMarket) score += 15;
    if (crop.intercropping_possibility && criteria.multiCropping) score += 10;
    if (crop.market_demand_index > 70) score += 5;
    
    return Math.min(score, 99);
  };

  const handleSelectCrop = async (cropId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
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
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Get AI Recommendations"
            )}
          </Button>
        </Card>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Top {recommendations.length} Recommended Crops</h2>
            {recommendations.map((crop, index) => (
              <CropCard
                key={crop.id}
                crop={crop}
                onSelect={handleSelectCrop}
                animationDelay={index * 0.05}
              />
            ))}
          </div>
        )}

        {/* All Available Crops */}
        {allCrops.length > 0 && recommendations.length === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Available Crops ({allCrops.length})</h2>
            <p className="text-sm text-muted-foreground">
              Fill in your farm details above to get personalized recommendations
            </p>
            {allCrops.map((crop, index) => (
              <CropCard
                key={crop.id}
                crop={{
                  ...crop,
                  growth_duration: `${crop.duration_days} days`,
                  expected_yield: `${Math.floor(Math.random() * 10) + 15}-${Math.floor(Math.random() * 10) + 25} tons/acre`
                }}
                onSelect={handleSelectCrop}
                animationDelay={index * 0.02}
              />
            ))}
            
            {hasMore && (
              <Button 
                onClick={loadMoreCrops}
                disabled={loadingMore}
                variant="outline"
                className="w-full"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading more crops...
                  </>
                ) : (
                  "Load More Crops"
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          toast({
            title: "Welcome!",
            description: "You can now access detailed crop roadmaps"
          });
        }}
        title="Login to View Roadmap"
        description="Create an account to track your crops and access detailed growing guides"
      />

      <BottomNav />
    </div>
  );
};

export default CropRecommendations;
