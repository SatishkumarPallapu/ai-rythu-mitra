import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Droplet,
  Plus,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Leaf
} from "lucide-react";

interface PesticideApplication {
  id: string;
  date: Date;
  pesticide: string;
  type: 'insecticide' | 'fungicide' | 'herbicide' | 'miticide';
  crop: string;
  dosage: string;
  totalArea: number;
  daysBeforeHarvest: number;
  targetPest: string;
  weatherCondition: string;
  applicator: string;
  safetyPrecautions: string[];
  effectiveness: 'excellent' | 'good' | 'moderate' | 'poor';
  notes?: string;
}

const PesticideManagementLog = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [applications, setApplications] = useState<PesticideApplication[]>([
    {
      id: '1',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      pesticide: 'Mancozeb',
      type: 'fungicide',
      crop: 'Tomato',
      dosage: '2.5 ml per liter',
      totalArea: 2,
      daysBeforeHarvest: 10,
      targetPest: 'Early Blight',
      weatherCondition: 'Cloudy, No wind',
      applicator: 'Farmer - Sathish',
      safetyPrecautions: ['Wore gloves', 'Wore mask', 'Sprayed in evening'],
      effectiveness: 'good',
      notes: 'Good coverage, no signs of phytotoxicity'
    }
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    pesticide: '',
    type: 'insecticide' as const,
    crop: '',
    dosage: '',
    totalArea: '',
    daysBeforeHarvest: '',
    targetPest: '',
    weatherCondition: '',
    applicator: '',
    safetyPrecautions: [] as string[],
    effectiveness: 'good' as 'excellent' | 'good' | 'moderate' | 'poor',
    notes: ''
  });

  const pesticides = [
    { name: 'Mancozeb', type: 'fungicide', usage: 'Fungal disease control', dosage: '2.5 ml/liter' },
    { name: 'Chlorothalonil', type: 'fungicide', usage: 'Broad-spectrum fungicide', dosage: '2 ml/liter' },
    { name: 'Carbendazim', type: 'fungicide', usage: 'Systemic fungicide', dosage: '1 ml/liter' },
    { name: 'Neem Oil', type: 'insecticide', usage: 'Organic insecticide', dosage: '5 ml/liter' },
    { name: 'Imidacloprid', type: 'insecticide', usage: 'Systemic insecticide', dosage: '0.5 ml/liter' },
    { name: 'Endosulfan', type: 'insecticide', usage: 'Broad-spectrum', dosage: '1.5 ml/liter' },
    { name: 'Paraquat', type: 'herbicide', usage: 'Contact herbicide', dosage: '1 liter/acre' },
    { name: 'Glyphosate', type: 'herbicide', usage: 'Non-selective herbicide', dosage: '1 liter/acre' },
    { name: 'Sulfur', type: 'miticide', usage: 'Mite and fungal control', dosage: '3 kg/acre' },
    { name: 'Abamectin', type: 'miticide', usage: 'Spider mite control', dosage: '2 ml/liter' }
  ];

  const crops = ['Tomato', 'Onion', 'Chilli', 'Paddy', 'Cotton', 'Wheat', 'Maize', 'Brinjal', 'Cabbage'];

  const safetyCheckList = [
    'Wore gloves',
    'Wore mask',
    'Wore eye protection',
    'Wore full-sleeved clothing',
    'Wore boots',
    'Kept children/pets away',
    'Sprayed in morning',
    'Sprayed in evening',
    'Avoided windy conditions',
    'Did not apply before rain'
  ];

  const handleAddApplication = () => {
    if (!formData.pesticide || !formData.crop || !formData.dosage) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const newApplication: PesticideApplication = {
      id: Date.now().toString(),
      date: new Date(),
      pesticide: formData.pesticide,
      type: formData.type,
      crop: formData.crop,
      dosage: formData.dosage,
      totalArea: parseFloat(formData.totalArea) || 1,
      daysBeforeHarvest: parseInt(formData.daysBeforeHarvest) || 0,
      targetPest: formData.targetPest,
      weatherCondition: formData.weatherCondition,
      applicator: formData.applicator,
      safetyPrecautions: formData.safetyPrecautions,
      effectiveness: formData.effectiveness,
      notes: formData.notes
    };

    setApplications([newApplication, ...applications]);
    setShowDialog(false);
    setFormData({
      pesticide: '',
      type: 'insecticide',
      crop: '',
      dosage: '',
      totalArea: '',
      daysBeforeHarvest: '',
      targetPest: '',
      weatherCondition: '',
      applicator: '',
      safetyPrecautions: [],
      effectiveness: 'good',
      notes: ''
    });

    toast({
      title: "Application recorded",
      description: `${formData.pesticide} application logged successfully`
    });
  };

  const deleteApplication = (id: string) => {
    setApplications(applications.filter(app => app.id !== id));
    toast({
      title: "Application deleted",
      variant: "destructive"
    });
  };

  const toggleSafetyPrecaution = (precaution: string) => {
    if (formData.safetyPrecautions.includes(precaution)) {
      setFormData({
        ...formData,
        safetyPrecautions: formData.safetyPrecautions.filter(p => p !== precaution)
      });
    } else {
      setFormData({
        ...formData,
        safetyPrecautions: [...formData.safetyPrecautions, precaution]
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'insecticide': return 'bg-red-500';
      case 'fungicide': return 'bg-blue-500';
      case 'herbicide': return 'bg-yellow-500';
      case 'miticide': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-300';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'poor': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysBeforeHarvestStatus = (days: number) => {
    if (days >= 14) return { status: 'safe', color: 'bg-green-50 border-green-300' };
    if (days >= 7) return { status: 'caution', color: 'bg-yellow-50 border-yellow-300' };
    return { status: 'alert', color: 'bg-red-50 border-red-300' };
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Droplet className="w-8 h-8 text-primary" />
              Pesticide Application Log
            </h1>
            <p className="text-muted-foreground mt-2">Track and manage all pesticide applications</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Applications</p>
              <p className="text-3xl font-bold">{applications.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Fungicides Used</p>
              <p className="text-3xl font-bold">{applications.filter(a => a.type === 'fungicide').length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Insecticides Used</p>
              <p className="text-3xl font-bold">{applications.filter(a => a.type === 'insecticide').length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Avg Effectiveness</p>
              <p className="text-3xl font-bold">{applications.length > 0 ? '4.2' : '0'}/5</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Application Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Log New Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log Pesticide Application</DialogTitle>
              <DialogDescription>Record details of pesticide spray applied to crops</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Pesticide Selection */}
              <div>
                <label className="text-sm font-medium">Pesticide Name *</label>
                <select
                  value={formData.pesticide}
                  onChange={(e) => setFormData({ ...formData, pesticide: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                >
                  <option value="">Select pesticide...</option>
                  {pesticides.map(p => (
                    <option key={p.name} value={p.name}>
                      {p.name} ({p.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Crop Selection */}
              <div>
                <label className="text-sm font-medium">Crop *</label>
                <select
                  value={formData.crop}
                  onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                >
                  <option value="">Select crop...</option>
                  {crops.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Dosage and Area */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Dosage *</label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g., 2.5 ml/liter"
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Area (acres)</label>
                  <input
                    type="number"
                    value={formData.totalArea}
                    onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                    placeholder="1"
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Target Pest */}
              <div>
                <label className="text-sm font-medium">Target Pest/Disease</label>
                <input
                  type="text"
                  value={formData.targetPest}
                  onChange={(e) => setFormData({ ...formData, targetPest: e.target.value })}
                  placeholder="e.g., Early Blight"
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Days Before Harvest */}
              <div>
                <label className="text-sm font-medium">Days Before Harvest</label>
                <input
                  type="number"
                  value={formData.daysBeforeHarvest}
                  onChange={(e) => setFormData({ ...formData, daysBeforeHarvest: e.target.value })}
                  placeholder="e.g., 10"
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  min="0"
                />
              </div>

              {/* Weather Condition */}
              <div>
                <label className="text-sm font-medium">Weather Condition</label>
                <input
                  type="text"
                  value={formData.weatherCondition}
                  onChange={(e) => setFormData({ ...formData, weatherCondition: e.target.value })}
                  placeholder="e.g., Cloudy, No wind"
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Applicator */}
              <div>
                <label className="text-sm font-medium">Applicator Name</label>
                <input
                  type="text"
                  value={formData.applicator}
                  onChange={(e) => setFormData({ ...formData, applicator: e.target.value })}
                  placeholder="Your name"
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Safety Precautions */}
              <div>
                <label className="text-sm font-medium mb-2 block">Safety Precautions Taken</label>
                <div className="grid grid-cols-2 gap-2">
                  {safetyCheckList.map(precaution => (
                    <label key={precaution} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.safetyPrecautions.includes(precaution)}
                        onChange={() => toggleSafetyPrecaution(precaution)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{precaution}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Effectiveness */}
              <div>
                <label className="text-sm font-medium">Effectiveness</label>
                <select
                  value={formData.effectiveness}
                  onChange={(e) => setFormData({ ...formData, effectiveness: e.target.value as 'excellent' | 'good' | 'moderate' | 'poor' })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="moderate">Moderate</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional observations..."
                  className="w-full mt-1 px-3 py-2 border rounded-lg h-20"
                />
              </div>

              <Button onClick={handleAddApplication} className="w-full">
                Save Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Applications List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Application History</h2>

          {applications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No applications logged yet. Click "Log New Application" to get started.
              </CardContent>
            </Card>
          ) : (
            applications.map(app => {
              const harvestStatus = getDaysBeforeHarvestStatus(app.daysBeforeHarvest);
              return (
                <Card key={app.id} className={`overflow-hidden border ${harvestStatus.color}`}>
                  <CardHeader className={`${getTypeColor(app.type)} text-white`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Droplet className="w-5 h-5" />
                          {app.pesticide}
                        </CardTitle>
                        <CardDescription className="text-white/80">
                          {app.date.toLocaleDateString()} | {app.crop}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className={getEffectivenessColor(app.effectiveness)}>
                          {app.effectiveness}
                        </Badge>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteApplication(app.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="font-semibold capitalize">{app.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Dosage</p>
                        <p className="font-semibold">{app.dosage}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Area Covered</p>
                        <p className="font-semibold">{app.totalArea} acres</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Target</p>
                        <p className="font-semibold">{app.targetPest}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {app.daysBeforeHarvest > 0 && (
                        <div className="flex items-start gap-2">
                          {app.daysBeforeHarvest >= 14 ? (
                            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-xs text-muted-foreground">Days Before Harvest</p>
                            <p className="font-semibold">{app.daysBeforeHarvest} days</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-2">
                        <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Weather</p>
                          <p className="font-semibold text-sm">{app.weatherCondition}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Applicator</p>
                          <p className="font-semibold text-sm">{app.applicator}</p>
                        </div>
                      </div>
                    </div>

                    {app.safetyPrecautions.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Safety Precautions:</p>
                        <div className="flex flex-wrap gap-2">
                          {app.safetyPrecautions.map(precaution => (
                            <Badge key={precaution} variant="outline">{precaution}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {app.notes && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Notes:</p>
                        <p className="text-sm text-blue-900">{app.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Pesticide Safety Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Pesticide Safety Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-semibold text-sm text-red-900 mb-1">⚠️ Pre-Application</p>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Read and follow label instructions completely</li>
                <li>• Check expiry date of pesticide</li>
                <li>• Ensure proper equipment calibration</li>
                <li>• Never apply during rain or strong winds</li>
              </ul>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-semibold text-sm text-yellow-900 mb-1">🛡️ During Application</p>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Wear full protective gear (gloves, mask, goggles, boots)</li>
                <li>• Keep children and pets away from treated area</li>
                <li>• Never eat, drink, or smoke while applying</li>
                <li>• Avoid spraying in strong sunlight (risk of phytotoxicity)</li>
              </ul>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-sm text-blue-900 mb-1">📋 Post-Application</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Wait for specified days before harvesting (check label)</li>
                <li>• Wash hands and face thoroughly after spraying</li>
                <li>• Store pesticides in cool, dry place away from children</li>
                <li>• Keep detailed application records for compliance</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default PesticideManagementLog;
