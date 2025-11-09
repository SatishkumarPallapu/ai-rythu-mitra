import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, TrendingUp, Calendar, Leaf } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CropRecommendation {
  crop_name: string;
  expected_yield: number;
  duration_days: number;
  intercropping_probability: number;
  companion_crops?: string[];
  expected_profit_per_acre?: number;
  cultivation_tips?: string;
  disease_risk?: "low" | "medium" | "high";
}

interface AICropRecommendationProps {
  soilData: any;
  weatherData: any;
  farmSize: number;
  location: string;
}

export const AICropRecommendation = ({ 
  soilData, 
  weatherData, 
  farmSize, 
  location 
}: AICropRecommendationProps) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const { toast } = useToast();

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case "low": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-crop-recommendation', {
        body: { soilData, weatherData, farmSize, location }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setRecommendations(data.recommendations || []);
      
      toast({
        title: "AI Analysis Complete!",
        description: `Found ${data.recommendations?.length || 0} profitable crop recommendations`,
      });
    } catch (error: any) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to get AI recommendations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Crop Recommendations
          </CardTitle>
          <CardDescription>
            Get AI-powered crop suggestions based on your soil, weather, and market trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={getRecommendations} 
            disabled={loading}
            className="w-full gradient-primary"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <div className="grid gap-4">
          {recommendations.map((crop, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-success/10">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-primary" />
                      {crop.crop_name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="gap-1">
                          <Calendar className="h-3 w-3" />
                          {crop.duration_days} days
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <TrendingUp className="h-3 w-3" />
                          ₹{crop.expected_profit_per_acre?.toLocaleString()} / acre
                        </Badge>
                        {crop.disease_risk && (
                          <Badge className={getRiskColor(crop.disease_risk)}>
                            {crop.disease_risk} risk
                          </Badge>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Expected Yield</span>
                    <span className="font-semibold">{crop.expected_yield} kg/acre</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Intercropping Probability</span>
                      <span className="font-semibold">{crop.intercropping_probability}%</span>
                    </div>
                    <Progress value={crop.intercropping_probability} className="h-2" />
                  </div>
                </div>

                {crop.companion_crops && crop.companion_crops.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Companion Crops:</p>
                    <div className="flex flex-wrap gap-2">
                      {crop.companion_crops.map((companion, i) => (
                        <Badge key={i} variant="secondary">{companion}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {crop.cultivation_tips && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Cultivation Tips:</p>
                    <p className="text-sm text-muted-foreground">{crop.cultivation_tips}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
