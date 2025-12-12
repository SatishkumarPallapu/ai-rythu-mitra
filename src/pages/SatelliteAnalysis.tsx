import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SatelliteCropAnalysis from "@/components/ai/SatelliteCropAnalysis";
import { cropTrackingService } from "@/services/cropTrackingService";
import { 
  Satellite, MapPin, Search, Plus, TrendingUp, Eye, 
  Layers, Calendar, BarChart3, Globe
} from "lucide-react";

const SatelliteAnalysis = () => {
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [trackedCrops, setTrackedCrops] = useState<any[]>([]);
  const [customLocation, setCustomLocation] = useState('');
  const [analysisMode, setAnalysisMode] = useState<'tracked' | 'custom'>('tracked');

  useEffect(() => {
    const crops = cropTrackingService.getActiveCrops();
    setTrackedCrops(crops);
    if (crops.length > 0) {
      setSelectedCrop(crops[0].id);
    }
  }, []);

  const handleAnalyzeCustomCrop = () => {
    if (!customLocation) {
      alert('Please enter a location for analysis');
      return;
    }
    // Switch to custom analysis mode
    setAnalysisMode('custom');
  };

  const getSelectedCropData = () => {
    const crop = trackedCrops.find(c => c.id === selectedCrop);
    return crop || { name: 'Tomato', id: 'custom-crop' };
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Satellite className="w-7 h-7 text-blue-600" />
            🛰️ Satellite Crop Analysis
          </h2>
          <p className="text-muted-foreground">
            AI-powered satellite imagery analysis for precision farming
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">3m</div>
              <p className="text-sm text-muted-foreground">Resolution</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">Daily</div>
              <p className="text-sm text-muted-foreground">Updates</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">15+</div>
              <p className="text-sm text-muted-foreground">Metrics</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">95%</div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Select Crop for Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trackedCrops.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Tracked Crops:</label>
                  <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tracked crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {trackedCrops.map(crop => (
                        <SelectItem key={crop.id} value={crop.id}>
                          {crop.emoji} {crop.name} - {crop.currentPhase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  {trackedCrops.map(crop => (
                    <Card 
                      key={crop.id}
                      className={`cursor-pointer border-2 ${selectedCrop === crop.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setSelectedCrop(crop.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{crop.emoji}</div>
                        <h4 className="font-semibold">{crop.name}</h4>
                        <Badge variant="secondary" className="mt-1">
                          {crop.currentPhase}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {crop.daysRemaining} days to harvest
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <Layers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-600 mb-2">No Tracked Crops</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start tracking crops to enable satellite analysis
                </p>
                <Button onClick={() => navigate('/crop-recommendations')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Find Crops to Track
                </Button>
              </div>
            )}

            {/* Custom Location Analysis */}
            <div className="border-t pt-4">
              <label className="text-sm font-medium mb-2 block">Or Analyze Custom Location:</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter location (e.g., Kamareddy, Telangana)"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                />
                <Button onClick={handleAnalyzeCustomCrop} variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Analyze
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Satellite Analysis Component */}
        {(selectedCrop || analysisMode === 'custom') && (
          <SatelliteCropAnalysis 
            cropName={analysisMode === 'custom' ? 'Custom Field' : getSelectedCropData().name}
            cropId={analysisMode === 'custom' ? 'custom-analysis' : selectedCrop}
            fieldLocation={analysisMode === 'custom' ? customLocation : `${getSelectedCropData().name} Field, Kamareddy`}
          />
        )}

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle>🌟 Satellite Analysis Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-green-600" />
                  Real-time Monitoring
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• NDVI vegetation health index</li>
                  <li>• Soil moisture detection</li>
                  <li>• Surface temperature analysis</li>
                  <li>• Growth rate tracking</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  AI-Powered Insights
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Disease early detection</li>
                  <li>• Yield predictions</li>
                  <li>• Problem area identification</li>
                  <li>• Harvest readiness alerts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default SatelliteAnalysis;