import { useState } from "react";
import { Upload, FileText, Image as ImageIcon } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AICropRecommendation } from "@/components/ai/AICropRecommendation";
import { DiseaseForecasting } from "@/components/ai/DiseaseForecasting";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SoilAnalysis = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [showAIFeatures, setShowAIFeatures] = useState(false);

  // Mock data for demonstration
  const mockSoilData = {
    ph: 6.5,
    nitrogen: 0.8,
    phosphorus: 0.3,
    potassium: 0.5,
    soilType: "Loamy",
    moisture: 45
  };

  const mockWeatherData = {
    temperature: 28,
    humidity: 65,
    rainfall: 150
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast({
        title: "File uploaded",
        description: `${selectedFile.name} is ready for analysis`,
      });
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a soil report",
        variant: "destructive",
      });
      return;
    }

    // Mock analysis for demonstration
    setAnalysisResults({
      report_id: "SOIL-" + Date.now(),
      file_url: URL.createObjectURL(file),
      analysis: "Soil analysis successful. pH: 6.5, N: 0.8%, P: 0.3%, K: 0.5%",
      created_at: new Date().toISOString(),
      soilData: mockSoilData
    });
    
    setShowAIFeatures(true);
    
    toast({
      title: "Analysis Complete",
      description: "Soil analysis completed successfully. Check AI recommendations below!",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Soil Analysis</h2>
          <p className="text-muted-foreground">
            Upload your soil report for AI-powered insights
          </p>
        </div>

        {/* Upload Card */}
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle>Upload Soil Report</CardTitle>
            <CardDescription>
              Supported formats: PDF, JPG, PNG (Max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <Label
                htmlFor="soil-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
                <Input
                  id="soil-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                />
              </Label>
            </div>
            <Button className="w-full" size="lg" onClick={handleSubmit}>
              Analyze with AI
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResults && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">pH Level</p>
                  <p className="text-2xl font-bold">{mockSoilData.ph}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nitrogen</p>
                  <p className="text-2xl font-bold">{mockSoilData.nitrogen}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phosphorus</p>
                  <p className="text-2xl font-bold">{mockSoilData.phosphorus}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Potassium</p>
                  <p className="text-2xl font-bold">{mockSoilData.potassium}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Features */}
        {showAIFeatures && (
          <Tabs defaultValue="recommendations" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recommendations">AI Crop Recommendations</TabsTrigger>
              <TabsTrigger value="disease">Disease Forecasting</TabsTrigger>
            </TabsList>
            <TabsContent value="recommendations" className="space-y-4 mt-4">
              <AICropRecommendation
                soilData={mockSoilData}
                weatherData={mockWeatherData}
                farmSize={2}
                location="Karnataka, India"
              />
            </TabsContent>
            <TabsContent value="disease" className="space-y-4 mt-4">
              <DiseaseForecasting
                cropName="Tomato"
                weatherData={mockWeatherData}
                soilData={mockSoilData}
                cropAge={15}
              />
            </TabsContent>
          </Tabs>
        )}

        {/* Quick Upload Options */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
              <FileText className="w-10 h-10 text-primary" />
              <p className="font-medium text-sm">Upload PDF</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
              <ImageIcon className="w-10 h-10 text-primary" />
              <p className="font-medium text-sm">Upload Image</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <div className="space-y-4">
          <h3 className="font-semibold">Recent Reports</h3>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Field A - Soil Test</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default SoilAnalysis;
