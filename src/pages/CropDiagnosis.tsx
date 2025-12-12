import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Camera, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  Leaf, 
  Droplets,
  Wind,
  Bug,
  Loader2,
  X
} from "lucide-react";

interface DiagnosisResult {
  disease: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  symptoms: string[];
  similarImages: string[];
  treatment: {
    natural: string[];
    chemical: string[];
    dosage?: string;
  };
  preventiveMeasures: string[];
  daysToTreat: number;
}

const CropDiagnosis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [selectedSimilarImage, setSelectedSimilarImage] = useState<number | null>(null);
  const [diagnosticHistory, setDiagnosticHistory] = useState<{id: string; date: string; symptoms: string; diagnosis: string; confidence: number;}[]>([]);
  const [cropName, setCropName] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      analyzeCropDisease(file);
    };
    reader.readAsDataURL(file);
  };

  const analyzeCropDisease = async (file?: File) => {
    setLoading(true);
    try {
      // Simulate AI diagnosis
      const result = generateMockDiagnosis();
      setDiagnosis(result);

      // Add to history
      setDiagnosticHistory([
        {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          symptoms: `Image uploaded for ${cropName}`,
          diagnosis: result.disease,
          confidence: result.confidence
        },
        ...diagnosticHistory
      ].slice(0, 10));

      toast({
        title: "Diagnosis Complete",
        description: `Disease identified: ${result.disease} (${result.confidence}% confidence)`
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Diagnosis failed",
        description: "Please try again with a clearer image",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeTextInput = async () => {
    if (!textInput.trim()) {
      toast({
        title: "Empty input",
        description: "Please describe the crop issue"
      });
      return;
    }

    setLoading(true);
    try {
      const result = generateMockDiagnosis();
      setDiagnosis(result);

      setDiagnosticHistory([
        {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          symptoms: textInput,
          diagnosis: result.disease,
          confidence: result.confidence
        },
        ...diagnosticHistory
      ].slice(0, 10));

      toast({
        title: "Analysis Complete",
        description: `Issue identified: ${result.disease}`
      });
    } catch (error) {
      console.error('Error analyzing text:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockDiagnosis = (): DiagnosisResult => {
    const diseases = [
      {
        disease: 'Powdery Mildew',
        confidence: 87,
        severity: 'medium' as const,
        symptoms: ['White powder on leaves', 'Leaf curling', 'Stunted growth'],
        treatment: {
          natural: ['Neem oil spray', 'Baking soda solution (1 tbsp per liter)', 'Sulfur dust'],
          chemical: ['Triazole fungicides', 'Sulfur-based fungicides', 'Mancozeb'],
          dosage: '2-3 ml per liter, spray every 7 days'
        },
        preventiveMeasures: [
          'Maintain proper spacing for air circulation',
          'Avoid overhead watering',
          'Remove infected leaves immediately',
          'Apply preventive sprays before infection'
        ],
        daysToTreat: 14
      },
      {
        disease: 'Early Blight',
        confidence: 92,
        severity: 'high' as const,
        symptoms: ['Dark brown spots with concentric rings', 'Yellow halo around spots', 'Lower leaf yellowing'],
        treatment: {
          natural: ['Copper fungicide', 'Sulfur spray', 'Bordeaux mixture'],
          chemical: ['Chlorothalonil', 'Mancozeb', 'Propineb'],
          dosage: '2-3 ml per liter, spray weekly'
        },
        preventiveMeasures: [
          'Remove lower infected leaves',
          'Improve air drainage',
          'Avoid leaf wetness',
          'Crop rotation for 2-3 years',
          'Use disease-free seeds'
        ],
        daysToTreat: 10
      },
      {
        disease: 'Spider Mites',
        confidence: 78,
        severity: 'medium' as const,
        symptoms: ['Fine webbing on leaves', 'Yellow speckled foliage', 'Leaves turn brown and drop'],
        treatment: {
          natural: ['Neem oil', 'Insecticidal soap', 'Water spray (pressure)', 'Predatory mites'],
          chemical: ['Acaricides (Abamectin)', 'Dicofol', 'Sulfur'],
          dosage: '2 ml per liter, spray every 5-7 days'
        },
        preventiveMeasures: [
          'Regular water spray to increase humidity',
          'Avoid excessive nitrogen fertilizer',
          'Remove affected plant parts',
          'Monitor regularly'
        ],
        daysToTreat: 7
      },
      {
        disease: 'Leaf Spot Disease',
        confidence: 85,
        severity: 'medium' as const,
        symptoms: ['Circular brown/black spots', 'Yellow border around lesions', 'Spots merge forming larger areas'],
        treatment: {
          natural: ['Copper sulfate', 'Neem extract', 'Bordeaux mixture'],
          chemical: ['Mancozeb', 'Carbendazim', 'Chlorothalonil'],
          dosage: '2.5 ml per liter, spray every 10 days'
        },
        preventiveMeasures: [
          'Remove infected leaves',
          'Avoid overhead irrigation',
          'Maintain proper spacing',
          'Destroy crop residue after harvest'
        ],
        daysToTreat: 14
      }
    ];

    const selectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
    
    return {
      ...selectedDisease,
      similarImages: [
        'https://images.unsplash.com/photo-1559825481-12a05b0b6d92?w=300',
        'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=300',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300',
        'https://images.unsplash.com/photo-1444432558933-3d67fbc4d662?w=300',
        'https://images.unsplash.com/photo-1470119693039-e28de61cb88d?w=300'
      ]
    };
  };

  const handleConfirmDiagnosis = (index: number) => {
    if (diagnosis) {
      setSelectedSimilarImage(index);
      toast({
        title: "Diagnosis Confirmed",
        description: `You confirmed: ${diagnosis.disease}. Treatment plan activated.`,
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Zap className="w-8 h-8 text-primary" />
              Crop Diagnosis & Treatment
            </h1>
            <p className="text-muted-foreground mt-2">AI-powered disease detection and prevention</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        </div>

        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="treatments">Treatments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Analysis Tab */}
          <TabsContent value="analyze" className="space-y-6 mt-6">
            {/* Crop Input */}
            <Card>
              <CardHeader>
                <CardTitle>Select Your Crop</CardTitle>
              </CardHeader>
              <CardContent>
                <select 
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Choose a crop...</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                  <option value="Brinjal">Brinjal</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Paddy">Paddy/Rice</option>
                  <option value="Maize">Maize</option>
                  <option value="Chilli">Chilli</option>
                </select>
              </CardContent>
            </Card>

            {/* Upload Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Crop Image
                </CardTitle>
                <CardDescription>Take a clear photo of the affected area</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-primary/5 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="font-semibold">Click to upload image</p>
                  <p className="text-sm text-muted-foreground">or drag and drop</p>
                </div>

                {uploadedImage && (
                  <div className="relative inline-block w-full">
                    <img src={uploadedImage} alt="Uploaded crop" className="w-full max-h-64 object-cover rounded-lg" />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => setUploadedImage(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Text Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Describe the Issue
                </CardTitle>
                <CardDescription>Or describe what you see on the crop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Describe symptoms: color changes, spots, wilting, powdery coating, etc."
                  className="w-full px-3 py-2 border rounded-lg h-24"
                />
                <Button 
                  onClick={analyzeTextInput}
                  disabled={loading || !textInput.trim()}
                  className="w-full"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Analyze Description
                </Button>
              </CardContent>
            </Card>

            {/* Diagnosis Results */}
            {diagnosis && (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                      {diagnosis.disease}
                    </span>
                    <Badge className={getSeverityColor(diagnosis.severity)}>
                      {diagnosis.severity.toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Confidence: {diagnosis.confidence}% | Treatment time: {diagnosis.daysToTreat} days
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Symptoms */}
                  <div>
                    <h3 className="font-semibold mb-2">Symptoms Detected:</h3>
                    <ul className="space-y-1">
                      {diagnosis.symptoms.map((symptom, idx) => (
                        <li key={idx} className="text-sm flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-muted-foreground" />
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Similar Images */}
                  <div>
                    <h3 className="font-semibold mb-2">Is this similar to your issue? (Click to confirm)</h3>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {diagnosis.similarImages.map((imageUrl, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleConfirmDiagnosis(idx)}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 transition ${
                            selectedSimilarImage === idx
                              ? 'border-success bg-success/10'
                              : 'border-transparent hover:border-primary'
                          }`}
                        >
                          <img
                            src={imageUrl}
                            alt={`Similar case ${idx + 1}`}
                            className="w-full h-20 object-cover"
                          />
                          {selectedSimilarImage === idx && (
                            <div className="bg-success text-white text-xs font-bold p-1 text-center">
                              ✓ Confirmed
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Treatment */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Recommended Treatment:</h3>

                    <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                      <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Leaf className="w-4 h-4" />
                        Natural Methods (Recommended)
                      </p>
                      <ul className="space-y-1 text-sm">
                        {diagnosis.treatment.natural.map((method, idx) => (
                          <li key={idx}>• {method}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <p className="font-semibold text-sm mb-2">Chemical Treatment (If needed)</p>
                      <ul className="space-y-1 text-sm">
                        {diagnosis.treatment.chemical.map((chemical, idx) => (
                          <li key={idx}>• {chemical}</li>
                        ))}
                      </ul>
                      {diagnosis.treatment.dosage && (
                        <p className="text-sm mt-2 font-semibold text-warning">
                          Dosage: {diagnosis.treatment.dosage}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Preventive Measures */}
                  <div>
                    <h3 className="font-semibold mb-2">Preventive Measures:</h3>
                    <ul className="space-y-1">
                      {diagnosis.preventiveMeasures.map((measure, idx) => (
                        <li key={idx} className="text-sm flex items-center gap-2">
                          <Wind className="w-4 h-4 text-primary" />
                          {measure}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Treatments Tab */}
          <TabsContent value="treatments" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Crop Diseases & Treatment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Powdery Mildew', 'Early Blight', 'Spider Mites', 'Leaf Spot', 'Rust', 'Anthracnose'].map((disease, idx) => (
                    <Card key={idx} className="p-4 hover:shadow-md transition">
                      <h4 className="font-semibold mb-2">{disease}</h4>
                      <p className="text-sm text-muted-foreground mb-3">Click for detailed treatment plan</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setDiagnosis(generateMockDiagnosis());
                          toast({
                            title: "Treatment plan loaded",
                            description: `Details for ${disease}`
                          });
                        }}
                      >
                        View Treatment
                      </Button>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Integrated Pest Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="w-5 h-5" />
                  Integrated Pest Management (IPM)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="font-semibold text-sm">🌿 Cultural Practices</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Crop rotation (2-3 years)</li>
                    <li>• Proper spacing and air circulation</li>
                    <li>• Avoid overhead watering</li>
                    <li>• Remove affected plant parts immediately</li>
                  </ul>
                </div>
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <p className="font-semibold text-sm">🐛 Biological Control</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Use beneficial insects (ladybugs, parasitic wasps)</li>
                    <li>• Neem-based products</li>
                    <li>• Bacterial agents (Bacillus thuringiensis)</li>
                  </ul>
                </div>
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="font-semibold text-sm">🧪 Chemical Control (Last Resort)</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Use registered pesticides only</li>
                    <li>• Follow proper dosage</li>
                    <li>• Maintain safety precautions</li>
                    <li>• Rotate chemical groups to prevent resistance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6 mt-6">
            {diagnosticHistory.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No diagnosis history yet. Start by analyzing a crop image or description.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {diagnosticHistory.map((item, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{item.diagnosis}</p>
                          <p className="text-sm text-muted-foreground">
                            Symptoms: {item.symptoms} | {new Date(item.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm mt-1 text-muted-foreground">
                            Confidence: {item.confidence}%
                          </p>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default CropDiagnosis;
