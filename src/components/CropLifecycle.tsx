import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertTriangle,
  Camera,
  Upload,
  Loader2,
  Shield,
  Leaf,
  Droplet,
  Bug
} from "lucide-react";

interface CropLifecycleProps {
  cropId: string;
  cropName: string;
  cropPlanId?: string;
}

const CropLifecycle = ({ cropId, cropName, cropPlanId }: CropLifecycleProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [pestDetection, setPestDetection] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadDiseaseForecasts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('disease_forecasts')
        .select('*')
        .eq('crop_id', cropId)
        .order('expected_week', { ascending: true });

      if (error) throw error;
      setForecasts(data || []);
    } catch (error) {
      console.error('Error loading forecasts:', error);
      toast({
        title: "Error loading disease forecasts",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        const { data, error } = await supabase.functions.invoke('ai-pest-detection', {
          body: {
            imageUrl: base64Image,
            cropName: cropName
          }
        });

        if (error) throw error;
        setPestDetection(data);
        
        toast({
          title: "Analysis complete!",
          description: `Detected: ${data.diagnosis.pest_or_disease}`
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Disease Forecasts Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Disease Risk Forecasts
          </h3>
          <Button onClick={loadDiseaseForecasts} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load Forecasts"}
          </Button>
        </div>

        {forecasts.length > 0 ? (
          <div className="space-y-4">
            {forecasts.map((forecast, idx) => (
              <Card key={idx} className="p-4 border-l-4" style={{
                borderLeftColor: 
                  forecast.risk_level === 'high' ? 'rgb(239 68 68)' :
                  forecast.risk_level === 'medium' ? 'rgb(251 146 60)' :
                  'rgb(34 197 94)'
              }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{forecast.disease_name}</h4>
                    <p className="text-sm text-muted-foreground">Week {forecast.expected_week}</p>
                  </div>
                  <Badge variant={
                    forecast.risk_level === 'high' ? 'destructive' :
                    forecast.risk_level === 'medium' ? 'default' :
                    'secondary'
                  }>
                    {forecast.risk_level} Risk ({forecast.probability_percent}%)
                  </Badge>
                </div>

                {forecast.symptoms && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Symptoms to watch for:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {forecast.symptoms.map((symptom: string, i: number) => (
                        <li key={i}>• {symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {forecast.preventive_measures && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1 flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      Prevention:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {forecast.preventive_measures.map((measure: string, i: number) => (
                        <li key={i}>• {measure}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(forecast.organic_treatment || forecast.chemical_treatment) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {forecast.organic_treatment && (
                      <div className="bg-success/10 p-3 rounded">
                        <p className="text-sm font-medium mb-1 flex items-center gap-1">
                          <Leaf className="w-4 h-4 text-success" />
                          Organic Treatment:
                        </p>
                        <ul className="text-xs space-y-1">
                          {forecast.organic_treatment.map((treatment: string, i: number) => (
                            <li key={i}>• {treatment}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {forecast.chemical_treatment && (
                      <div className="bg-primary/10 p-3 rounded">
                        <p className="text-sm font-medium mb-1 flex items-center gap-1">
                          <Droplet className="w-4 h-4 text-primary" />
                          Chemical Treatment:
                        </p>
                        <ul className="text-xs space-y-1">
                          {forecast.chemical_treatment.map((treatment: string, i: number) => (
                            <li key={i}>• {treatment}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Click "Load Forecasts" to see disease predictions based on historical data and current conditions
          </p>
        )}
      </Card>

      {/* Pest Detection Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-primary" />
          Pest & Disease Detection
        </h3>

        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="hidden"
              id="pest-image-upload"
            />
            <label htmlFor="pest-image-upload">
              <Button
                variant="outline"
                className="w-full"
                disabled={uploadingImage}
                asChild
              >
                <span>
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload or Capture Crop Image
                    </>
                  )}
                </span>
              </Button>
            </label>
            <p className="text-sm text-muted-foreground mt-2">
              Take a clear photo of affected leaves, stems, or fruits
            </p>
          </div>

          {pestDetection && (
            <Card className="p-4 bg-gradient-subtle">
              <div className="flex items-start gap-3 mb-3">
                <Bug className="w-6 h-6 text-destructive flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{pestDetection.diagnosis.pest_or_disease}</h4>
                  <p className="text-sm text-muted-foreground">{pestDetection.diagnosis.scientific_name}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={
                      pestDetection.diagnosis.severity === 'critical' ? 'destructive' :
                      pestDetection.diagnosis.severity === 'severe' ? 'destructive' :
                      'default'
                    }>
                      {pestDetection.diagnosis.severity}
                    </Badge>
                    <Badge variant="outline">
                      {pestDetection.diagnosis.spread_risk} spread risk
                    </Badge>
                    <Badge variant="secondary">
                      {pestDetection.confidence_score}% confident
                    </Badge>
                  </div>
                </div>
              </div>

              {pestDetection.immediate_actions && (
                <div className="mb-4 p-3 bg-destructive/10 rounded">
                  <p className="font-semibold text-sm mb-2">🚨 DO THIS TODAY:</p>
                  <ul className="text-sm space-y-1">
                    {pestDetection.immediate_actions.map((action: string, i: number) => (
                      <li key={i}>• {action}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pestDetection.organic_treatment && (
                  <div className="space-y-2">
                    <h5 className="font-semibold text-sm flex items-center gap-1">
                      <Leaf className="w-4 h-4 text-success" />
                      Organic Treatment
                    </h5>
                    <p className="text-sm"><strong>Method:</strong> {pestDetection.organic_treatment.method}</p>
                    <p className="text-sm"><strong>Ingredients:</strong> {pestDetection.organic_treatment.ingredients?.join(', ')}</p>
                    <p className="text-sm"><strong>How to prepare:</strong> {pestDetection.organic_treatment.preparation}</p>
                    <p className="text-sm"><strong>Apply:</strong> {pestDetection.organic_treatment.application}</p>
                    <p className="text-sm"><strong>Frequency:</strong> {pestDetection.organic_treatment.frequency}</p>
                    <p className="text-sm text-success"><strong>Cost:</strong> ₹{pestDetection.organic_treatment.cost_estimate_inr}</p>
                  </div>
                )}

                {pestDetection.chemical_treatment && (
                  <div className="space-y-2">
                    <h5 className="font-semibold text-sm flex items-center gap-1">
                      <Droplet className="w-4 h-4 text-primary" />
                      Chemical Treatment
                    </h5>
                    <p className="text-sm"><strong>Products:</strong> {pestDetection.chemical_treatment.products?.join(', ')}</p>
                    <p className="text-sm"><strong>Dosage:</strong> {pestDetection.chemical_treatment.dosage}</p>
                    <p className="text-sm"><strong>Apply:</strong> {pestDetection.chemical_treatment.application}</p>
                    <p className="text-sm"><strong>Frequency:</strong> {pestDetection.chemical_treatment.frequency}</p>
                    {pestDetection.chemical_treatment.safety_precautions && (
                      <div className="text-sm">
                        <strong>⚠️ Safety:</strong>
                        <ul className="ml-4 mt-1">
                          {pestDetection.chemical_treatment.safety_precautions.map((precaution: string, i: number) => (
                            <li key={i}>• {precaution}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="text-sm text-primary"><strong>Cost:</strong> ₹{pestDetection.chemical_treatment.cost_estimate_inr}</p>
                  </div>
                )}
              </div>

              {pestDetection.prevention && (
                <div className="mt-4 p-3 bg-muted rounded">
                  <h5 className="font-semibold text-sm mb-2">🛡️ Prevention for Next Season:</h5>
                  <div className="text-sm space-y-2">
                    {pestDetection.prevention.causes && (
                      <div>
                        <strong>What caused this:</strong>
                        <ul className="ml-4 mt-1">
                          {pestDetection.prevention.causes.map((cause: string, i: number) => (
                            <li key={i}>• {cause}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {pestDetection.prevention.preventive_measures && (
                      <div>
                        <strong>How to prevent:</strong>
                        <ul className="ml-4 mt-1">
                          {pestDetection.prevention.preventive_measures.map((measure: string, i: number) => (
                            <li key={i}>• {measure}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {pestDetection.expected_recovery && (
                <p className="mt-3 text-sm text-center text-muted-foreground">
                  ⏱️ Expected recovery: {pestDetection.expected_recovery}
                </p>
              )}
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CropLifecycle;
