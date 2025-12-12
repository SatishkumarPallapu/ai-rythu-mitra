import { Camera, Upload, Image as ImageIcon, Sparkles, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import AuthModal from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";

const CropHealth = () => {
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

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
                  <h4 className="font-medium mb-2">Similar Issues - Select to Confirm:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {similarIssues.map((issue) => (
                      <Card key={issue.id} className="p-3 cursor-pointer hover:border-primary transition-colors">
                        <div className="text-center">
                          <div className="text-3xl mb-1">{issue.image}</div>
                          <div className="text-xs font-medium">{issue.name}</div>
                          <div className="text-xs text-muted-foreground">{issue.confidence}</div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Treatment Recommendations
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Remove affected leaves immediately</li>
                    <li>• Apply copper-based fungicide (2g per liter)</li>
                    <li>• Spray early morning or evening</li>
                    <li>• Repeat treatment after 7 days</li>
                    <li>• Improve air circulation around plants</li>
                  </ul>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-medium mb-2">🌿 Natural Prevention</h4>
                  <p className="text-sm text-muted-foreground">
                    Mix neem oil (5ml) with water (1 liter) and spray weekly as a preventive measure. Plant marigold flowers around the field to naturally deter pests.
                  </p>
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

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          toast({
            title: "Login Successful",
            description: "You can now upload and save crop diagnoses",
          });
        }}
        title="Login to Save Diagnosis"
        description="Login to save your crop health records and track progress"
      />

      <BottomNav />
    </div>
  );
};

export default CropHealth;
