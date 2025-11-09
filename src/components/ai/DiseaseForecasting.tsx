import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Calendar } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DiseaseForecast {
  week_number: number;
  disease_name: string;
  probability: number;
  risk_level: "low" | "medium" | "high";
  symptoms?: string;
  prevention?: string;
  treatment?: string;
  treatment_timing?: string;
}

interface DiseaseforecastingProps {
  cropId?: string;
  cropName: string;
  weatherData: any;
  soilData: any;
  cropAge: number;
}

export const DiseaseForecasting = ({
  cropId,
  cropName,
  weatherData,
  soilData,
  cropAge
}: DiseaseforecastingProps) => {
  const [loading, setLoading] = useState(false);
  const [forecasts, setForecasts] = useState<DiseaseForecast[]>([]);
  const { toast } = useToast();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getForecast = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-disease-forecast', {
        body: { cropId, cropName, weatherData, soilData, cropAge }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setForecasts(data.forecasts || []);
      
      toast({
        title: "Disease Forecast Ready!",
        description: `Analyzed risks for next ${data.forecasts?.length || 0} weeks`,
      });
    } catch (error: any) {
      console.error('Error getting forecast:', error);
      toast({
        title: "Forecast Failed",
        description: error.message || "Failed to get disease forecast",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-warning/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-warning" />
            Disease Forecasting
          </CardTitle>
          <CardDescription>
            AI-powered disease risk prediction for the next 4 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={getForecast} 
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Get Disease Forecast
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {forecasts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Disease Risks</CardTitle>
            <CardDescription>
              Monitor and prevent diseases with AI-powered insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {forecasts.map((forecast, index) => (
                <AccordionItem key={index} value={`week-${forecast.week_number}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Week {forecast.week_number}</span>
                        <span className="text-sm text-muted-foreground">
                          {forecast.disease_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getRiskColor(forecast.risk_level)}>
                          {forecast.risk_level}
                        </Badge>
                        <Badge variant="outline">
                          {forecast.probability}% risk
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {forecast.symptoms && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Symptoms to Watch:</h4>
                        <p className="text-sm text-muted-foreground">{forecast.symptoms}</p>
                      </div>
                    )}
                    
                    {forecast.prevention && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Prevention Measures:</h4>
                        <p className="text-sm text-muted-foreground">{forecast.prevention}</p>
                      </div>
                    )}
                    
                    {forecast.treatment && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Treatment Plan:</h4>
                        <p className="text-sm text-muted-foreground">{forecast.treatment}</p>
                      </div>
                    )}
                    
                    {forecast.treatment_timing && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Best Treatment Time:</h4>
                        <p className="text-sm text-muted-foreground">{forecast.treatment_timing}</p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
