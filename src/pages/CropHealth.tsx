import { Camera, Upload, Image as ImageIcon } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const CropHealth = () => {
  const { toast } = useToast();

  const handleCapture = () => {
    toast({
      title: "Camera opened",
      description: "Take a photo of your crop",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Crop Health Check</h2>
          <p className="text-muted-foreground">
            AI-powered disease and pest detection
          </p>
        </div>

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
              <Button size="lg" variant="secondary" className="w-full">
                Choose File
              </Button>
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
                  Our AI detects diseases and pests
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-semibold">
                3
              </div>
              <div>
                <p className="font-medium text-sm">Get Solutions</p>
                <p className="text-xs text-muted-foreground">
                  Receive treatment recommendations in Telugu
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <div className="space-y-4">
          <h3 className="font-semibold">Recent Scans</h3>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent scans. Start by capturing or uploading an image.
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
