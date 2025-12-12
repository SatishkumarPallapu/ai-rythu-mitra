import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Satellite, MapPin, Camera, TrendingUp, Activity, AlertTriangle,
  Droplets, Thermometer, Wind, CloudRain, Zap, Target, Calendar,
  BarChart3, PieChart, Layers, Eye, Download, RefreshCw, Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SatelliteData {
  cropId: string;
  fieldArea: number;
  coordinates: { lat: number; lng: number };
  captureDate: string;
  resolution: string;
  cloudCover: number;
}

interface CropHealthMetrics {
  ndvi: number; // Normalized Difference Vegetation Index (0-1)
  moisture: number; // Soil moisture percentage
  temperature: number; // Surface temperature
  stress: number; // Stress indicator (0-100)
  growth: number; // Growth rate percentage
  disease: number; // Disease probability (0-100)
}

interface FieldAnalysis {
  healthScore: number;
  uniformity: number;
  problemAreas: Array<{
    type: 'drought' | 'disease' | 'pest' | 'nutrient' | 'waterlog';
    severity: 'low' | 'medium' | 'high';
    area: number; // percentage of field
    description: string;
    recommendations: string[];
  }>;
  predictions: {
    yieldEstimate: string;
    harvestReadiness: number;
    riskFactors: string[];
  };
}

interface SatelliteCropAnalysisProps {
  cropName: string;
  cropId: string;
  fieldLocation?: string;
}

const SatelliteCropAnalysis: React.FC<SatelliteCropAnalysisProps> = ({ 
  cropName, 
  cropId, 
  fieldLocation = "Kamareddy, Telangana" 
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<CropHealthMetrics | null>(null);
  const [fieldAnalysis, setFieldAnalysis] = useState<FieldAnalysis | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    // Auto-load satellite data on component mount
    loadSatelliteData();
  }, [cropId]);

  const loadSatelliteData = async () => {
    setAnalyzing(true);
    
    try {
      // Simulate satellite data acquisition
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock satellite data
      const mockSatelliteData: SatelliteData = {
        cropId,
        fieldArea: Math.random() * 5 + 1, // 1-6 acres
        coordinates: { 
          lat: 18.3200 + (Math.random() - 0.5) * 0.1, 
          lng: 78.0408 + (Math.random() - 0.5) * 0.1 
        },
        captureDate: new Date().toISOString(),
        resolution: "3m/pixel",
        cloudCover: Math.random() * 20 // 0-20%
      };

      // Mock health metrics based on crop type and season
      const baseHealth = getCropBaseHealth(cropName);
      const mockHealthMetrics: CropHealthMetrics = {
        ndvi: baseHealth + (Math.random() - 0.5) * 0.2,
        moisture: 65 + (Math.random() - 0.5) * 30,
        temperature: 28 + (Math.random() - 0.5) * 10,
        stress: Math.random() * 40,
        growth: 75 + (Math.random() - 0.5) * 30,
        disease: Math.random() * 25
      };

      // Generate field analysis
      const mockFieldAnalysis = generateFieldAnalysis(mockHealthMetrics, cropName);

      setSatelliteData(mockSatelliteData);
      setHealthMetrics(mockHealthMetrics);
      setFieldAnalysis(mockFieldAnalysis);
      setLastUpdate(new Date());

      toast({
        title: "🛰️ Satellite Analysis Complete",
        description: `Latest imagery analyzed for ${cropName} field`
      });

    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to fetch satellite data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getCropBaseHealth = (cropName: string): number => {
    const healthMap: { [key: string]: number } = {
      'tomato': 0.75,
      'rice': 0.82,
      'cotton': 0.70,
      'maize': 0.78,
      'wheat': 0.80,
      'onion': 0.65,
      'potato': 0.72
    };
    return healthMap[cropName.toLowerCase()] || 0.75;
  };

  const generateFieldAnalysis = (metrics: CropHealthMetrics, cropName: string): FieldAnalysis => {
    const problemAreas = [];
    
    if (metrics.moisture < 40) {
      problemAreas.push({
        type: 'drought' as const,
        severity: metrics.moisture < 25 ? 'high' as const : 'medium' as const,
        area: Math.random() * 30 + 10,
        description: 'Low soil moisture detected in field sections',
        recommendations: [
          'Increase irrigation frequency',
          'Install drip irrigation system',
          'Apply mulching to retain moisture'
        ]
      });
    }

    if (metrics.disease > 15) {
      problemAreas.push({
        type: 'disease' as const,
        severity: metrics.disease > 25 ? 'high' as const : 'medium' as const,
        area: Math.random() * 15 + 5,
        description: 'Potential disease symptoms identified',
        recommendations: [
          'Apply organic fungicide spray',
          'Improve field drainage',
          'Remove affected plant parts'
        ]
      });
    }

    if (metrics.ndvi < 0.6) {
      problemAreas.push({
        type: 'nutrient' as const,
        severity: metrics.ndvi < 0.5 ? 'high' as const : 'medium' as const,
        area: Math.random() * 25 + 15,
        description: 'Nutrient deficiency indicated by vegetation index',
        recommendations: [
          'Apply balanced NPK fertilizer',
          'Conduct soil nutrient test',
          'Consider organic compost application'
        ]
      });
    }

    return {
      healthScore: Math.round(metrics.ndvi * 100),
      uniformity: Math.round((1 - metrics.stress / 100) * 100),
      problemAreas,
      predictions: {
        yieldEstimate: `${Math.round(metrics.growth * 0.8)}-${Math.round(metrics.growth * 1.2)} quintals/acre`,
        harvestReadiness: Math.round(metrics.growth),
        riskFactors: problemAreas.map(p => p.description)
      }
    };
  };

  const getHealthColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Satellite className="w-6 h-6 text-blue-600" />
              🛰️ Satellite Crop Analysis
            </CardTitle>
            <Button 
              onClick={loadSatelliteData} 
              disabled={analyzing}
              variant="outline"
              size="sm"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
          <p className="text-muted-foreground">
            AI-powered satellite imagery analysis for {cropName} at {fieldLocation}
          </p>
        </CardHeader>
      </Card>

      {analyzing && (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Satellite className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold">Acquiring Satellite Data...</h3>
            <p className="text-muted-foreground">Processing latest imagery and generating AI insights</p>
            <Progress value={65} className="w-full" />
          </div>
        </Card>
      )}

      {satelliteData && healthMetrics && fieldAnalysis && !analyzing && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Field Health</TabsTrigger>
            <TabsTrigger value="problems">Problem Areas</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Satellite Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Field Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Area:</span>
                    <span className="font-medium">{satelliteData.fieldArea.toFixed(1)} acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resolution:</span>
                    <span className="font-medium">{satelliteData.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cloud Cover:</span>
                    <span className="font-medium">{satelliteData.cloudCover.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">{lastUpdate.toLocaleTimeString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    Overall Health Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-3">
                    <div className={`text-4xl font-bold p-4 rounded-full ${getHealthColor(fieldAnalysis.healthScore)}`}>
                      {fieldAnalysis.healthScore}%
                    </div>
                    <p className="text-muted-foreground">
                      {fieldAnalysis.healthScore >= 80 ? 'Excellent' : 
                       fieldAnalysis.healthScore >= 60 ? 'Good' : 'Needs Attention'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{(healthMetrics.ndvi * 100).toFixed(0)}%</div>
                  <p className="text-sm text-muted-foreground">NDVI Score</p>
                  <p className="text-xs">Vegetation Health</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{healthMetrics.moisture.toFixed(0)}%</div>
                  <p className="text-sm text-muted-foreground">Soil Moisture</p>
                  <p className="text-xs">Water Content</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">{healthMetrics.temperature.toFixed(1)}°C</div>
                  <p className="text-sm text-muted-foreground">Surface Temp</p>
                  <p className="text-xs">Field Temperature</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">{fieldAnalysis.uniformity}%</div>
                  <p className="text-sm text-muted-foreground">Uniformity</p>
                  <p className="text-xs">Growth Consistency</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Health Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Vegetation Index (NDVI)</span>
                      <span className="font-medium">{(healthMetrics.ndvi * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={healthMetrics.ndvi * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Soil Moisture Level</span>
                      <span className="font-medium">{healthMetrics.moisture.toFixed(1)}%</span>
                    </div>
                    <Progress value={healthMetrics.moisture} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Growth Rate</span>
                      <span className="font-medium">{healthMetrics.growth.toFixed(1)}%</span>
                    </div>
                    <Progress value={healthMetrics.growth} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Stress Level</span>
                      <span className="font-medium text-red-600">{healthMetrics.stress.toFixed(1)}%</span>
                    </div>
                    <Progress value={healthMetrics.stress} className="h-2 bg-red-100" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problems" className="space-y-4">
            {fieldAnalysis.problemAreas.length > 0 ? (
              fieldAnalysis.problemAreas.map((problem, index) => (
                <Card key={index} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg capitalize flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        {problem.type} Issue
                      </CardTitle>
                      <Badge className={`${getSeverityColor(problem.severity)} text-white`}>
                        {problem.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground">{problem.description}</p>
                    <p className="text-sm"><strong>Affected Area:</strong> {problem.area.toFixed(1)}% of field</p>
                    
                    <div>
                      <h4 className="font-semibold mb-2">🎯 Recommendations:</h4>
                      <ul className="space-y-1">
                        {problem.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <Target className="w-3 h-3 text-green-600" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center p-8">
                <div className="text-green-600 mb-4">
                  <Target className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">No Major Issues Detected! 🎉</h3>
                <p className="text-muted-foreground">Your crop field is showing healthy growth patterns.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Yield Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {fieldAnalysis.predictions.yieldEstimate}
                  </div>
                  <p className="text-muted-foreground">Expected yield based on current growth patterns</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Harvest Readiness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-blue-600">
                      {fieldAnalysis.predictions.harvestReadiness}%
                    </div>
                    <Progress value={fieldAnalysis.predictions.harvestReadiness} className="h-3" />
                    <p className="text-muted-foreground">
                      {fieldAnalysis.predictions.harvestReadiness >= 90 ? 'Ready for harvest soon!' :
                       fieldAnalysis.predictions.harvestReadiness >= 70 ? 'Harvest in 2-3 weeks' :
                       'Still growing - monitor weekly'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {fieldAnalysis.predictions.riskFactors.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Risk Factors:</strong> {fieldAnalysis.predictions.riskFactors.join(', ')}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SatelliteCropAnalysis;