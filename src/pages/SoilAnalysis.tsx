import { Upload, FileText, Image as ImageIcon } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SoilAnalysis = () => {
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "File uploaded",
        description: `${file.name} is ready for analysis`,
      });
    }
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
            <Button className="w-full" size="lg">
              Analyze with AI
            </Button>
          </CardContent>
        </Card>

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
