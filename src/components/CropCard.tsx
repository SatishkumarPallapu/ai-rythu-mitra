import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Clock, 
  Droplets, 
  Sparkles, 
  ShoppingCart,
  ArrowRight,
  Heart,
  Pill,
  Leaf
} from "lucide-react";
import { getCropIcon } from "@/utils/cropIcons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CropCardProps {
  crop: {
    id: string;
    name: string;
    category: string;
    suitability_score?: number;
    expected_yield?: string;
    growth_duration?: string;
    duration_days?: number;
    water_requirement?: string;
    profit_index?: string;
    daily_market_crop?: boolean;
    compatible_crops?: string[];
    health_benefits?: string;
    medical_benefits?: string;
    vitamins?: string;
    proteins?: string;
    intercropping_possibility?: string;
  };
  onSelect: (cropId: string) => void;
  animationDelay?: number;
}

const CropCard = ({ crop, onSelect, animationDelay = 0 }: CropCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={showDetails} onOpenChange={setShowDetails}>
        <TooltipTrigger asChild>
          <Card
            className="p-6 card-hover cursor-pointer animate-slideUp"
            style={{ animationDelay: `${animationDelay}s` }}
            onClick={() => onSelect(crop.id)}
            onMouseEnter={() => setShowDetails(true)}
            onMouseLeave={() => setShowDetails(false)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{getCropIcon(crop.name)}</div>
                <div>
                  <h3 className="text-xl font-bold text-primary">{crop.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{crop.category}</p>
                </div>
              </div>
              {crop.suitability_score && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-success">
                    {crop.suitability_score}%
                  </div>
                  <p className="text-xs text-muted-foreground">Match</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {crop.expected_yield && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span>{crop.expected_yield}</span>
                </div>
              )}
              {(crop.growth_duration || crop.duration_days) && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{crop.growth_duration || `${crop.duration_days} days`}</span>
                </div>
              )}
              {crop.water_requirement && (
                <div className="flex items-center gap-2 text-sm">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="capitalize">{crop.water_requirement}</span>
                </div>
              )}
              {crop.profit_index && (
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="capitalize">{crop.profit_index} Profit</span>
                </div>
              )}
            </div>

            {crop.daily_market_crop && (
              <Badge variant="secondary" className="mb-3">
                <ShoppingCart className="w-3 h-3 mr-1" />
                Daily Market Crop
              </Badge>
            )}

            {crop.compatible_crops && crop.compatible_crops.length > 0 && (
              <div className="text-sm text-muted-foreground mb-3">
                <span className="font-medium">Compatible: </span>
                {crop.compatible_crops.join(", ")}
              </div>
            )}

            <Button className="w-full gradient-primary text-white group">
              View Complete Roadmap
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm p-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Heart className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs mb-1">Health Benefits</p>
                <p className="text-xs text-muted-foreground">{crop.health_benefits || 'Nutritious food source'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Pill className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs mb-1">Medical Benefits</p>
                <p className="text-xs text-muted-foreground">{crop.medical_benefits || 'General health support'}</p>
              </div>
            </div>

            {crop.vitamins && (
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs mb-1">Vitamins</p>
                  <p className="text-xs text-muted-foreground">{crop.vitamins}</p>
                </div>
              </div>
            )}

            {crop.proteins && (
              <div className="flex items-start gap-2">
                <Leaf className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs mb-1">Protein Content</p>
                  <p className="text-xs text-muted-foreground">{crop.proteins}</p>
                </div>
              </div>
            )}

            {crop.intercropping_possibility && (
              <div className="text-xs text-muted-foreground pt-2 border-t">
                <span className="font-semibold">Intercropping: </span>
                {crop.intercropping_possibility}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CropCard;
