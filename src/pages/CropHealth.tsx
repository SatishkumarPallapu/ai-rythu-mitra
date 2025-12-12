import { Camera, Upload, Image as ImageIcon, Sparkles, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const CropHealth = () => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    toast({
      title: "Image uploaded",
      description: "AI is analyzing your crop...",
    });
  };

  const handleCapture = async () => {
    toast({
      title: "Camera opened",
      description: "Take a photo of your crop",
    });
  };

  const similarIssues = [
    { id: 1, name: "Leaf Blight", image: "🍂", confidence: "95%" },
    { id: 2, name: "Fungal Infection", image: "🍄", confidence: "87%" },
    { id: 3, name: "Pest Damage", image: "🐛", confidence: "78%" }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">AI Crop Health Diagnosis</h2>
          <p className="text-muted-foreground">
            Upload or capture crop images for instant AI-powered diagnosis
          </p>
        </div>

        {selectedImage && (
          <Card className="overflow-hidden">
            <img src={selectedImage} alt="Uploaded crop" className="w-full h-64 object-cover" />
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">AI Analysis Results</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Detected Issue</span>
                    <Badge variant="destructive">Leaf Blight</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Confidence: 92%
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Similar Issues - Click to Confirm Diagnosis:
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {similarIssues.map((issue) => (
                      <Card key={issue.id} className="p-3 cursor-pointer hover:border-primary transition-colors border-2 hover:shadow-md">
                        <div className="text-center">
                          <div className="text-3xl mb-1">{issue.image}</div>
                          <div className="text-xs font-medium">{issue.name}</div>
                          <div className="text-xs text-muted-foreground">{issue.confidence}</div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-lg">Treatment Options</h4>
                  
                  {/* Natural Treatment */}
                  <Card className="p-4 border-green-200 bg-green-50">
                    <h5 className="font-medium flex items-center gap-2 mb-3 text-green-800">
                      🌿 Natural & Organic Treatment (Recommended First)
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-medium mb-2">Neem Oil Solution:</p>
                        <ul className="space-y-1 text-green-700">
                          <li>• Mix 10ml neem oil + 2ml liquid soap in 1 liter water</li>
                          <li>• Spray in evening hours (avoid midday sun)</li>
                          <li>• Apply every 3-4 days for 2 weeks</li>
                          <li>• Safe for beneficial insects</li>
                        </ul>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-medium mb-2">Companion Planting:</p>
                        <ul className="space-y-1 text-green-700">
                          <li>• Plant marigold flowers on field borders</li>
                          <li>• Grow basil or mint between crop rows</li>
                          <li>• These naturally repel harmful insects</li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  {/* Chemical Treatment */}
                  <Card className="p-4 border-orange-200 bg-orange-50">
                    <h5 className="font-medium flex items-center gap-2 mb-3 text-orange-800">
                      ⚗️ Chemical Treatment (If Natural Methods Fail)
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-medium mb-2">Copper-based Fungicide:</p>
                        <ul className="space-y-1 text-orange-700">
                          <li>• Dosage: 2-3g per liter of water</li>
                          <li>• Spray in early morning or evening</li>
                          <li>• Repeat after 7-10 days if needed</li>
                          <li>• Use protective equipment</li>
                        </ul>
                      </div>
                      <div className="bg-yellow-100 p-2 rounded text-xs text-yellow-800">
                        ⚠️ Wait 15 days before harvest after chemical spray
                      </div>
                    </div>
                  </Card>

                  {/* Prevention */}
                  <Card className="p-4 border-blue-200 bg-blue-50">
                    <h5 className="font-medium flex items-center gap-2 mb-3 text-blue-800">
                      🛡️ Prevention for Future Crops
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-medium mb-2">Cultural Practices:</p>
                        <ul className="space-y-1 text-blue-700">
                          <li>• Ensure proper plant spacing</li>
                          <li>• Remove crop debris after harvest</li>
                          <li>• Rotate crops annually</li>
                        </ul>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-medium mb-2">Water Management:</p>
                        <ul className="space-y-1 text-blue-700">
                          <li>• Avoid overhead watering</li>
                          <li>• Water at base of plants</li>
                          <li>• Ensure good drainage</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <Button className="w-full">Save Diagnosis Record</Button>
            </CardContent>
          </Card>
        )}

        {/* Upload Options */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="border-2 border-primary/20 cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="w-10 h-10 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">Take Photo</h3>
                <p className="text-sm text-muted-foreground">
                  Capture image using camera
                </p>
              </div>
              <Button size="lg" className="w-full" onClick={handleCapture}>
                Open Camera
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-secondary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">Upload Image</h3>
                <p className="text-sm text-muted-foreground">
                  Select from gallery
                </p>
              </div>
              <label className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button size="lg" variant="secondary" className="w-full" asChild>
                  <span>Choose File</span>
                </Button>
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-semibold">
                1
              </div>
              <div>
                <p className="font-medium text-sm">Capture or Upload</p>
                <p className="text-xs text-muted-foreground">
                  Take a clear photo of affected crop parts
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-semibold">
                2
              </div>
              <div>
                <p className="font-medium text-sm">AI Analysis</p>
                <p className="text-xs text-muted-foreground">
                  Our AI detects diseases and pests instantly
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-semibold">
                3
              </div>
              <div>
                <p className="font-medium text-sm">Confirm & Get Solutions</p>
                <p className="text-xs text-muted-foreground">
                  Select similar images to confirm and get treatment recommendations
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-semibold">
                4
              </div>
              <div>
                <p className="font-medium text-sm">Track Progress</p>
                <p className="text-xs text-muted-foreground">
                  Save diagnosis and monitor crop health over time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <div className="space-y-4">
          <h3 className="font-semibold">Recent Diagnoses</h3>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent diagnoses. Start by capturing or uploading an image.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default CropHealth;
