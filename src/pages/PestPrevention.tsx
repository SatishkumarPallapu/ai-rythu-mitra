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
  Bug,
  Leaf,
  Droplets,
  Wind,
  Flower,
  AlertCircle,
  CheckCircle2,
  Shield,
  Book,
  ChevronRight,
  Lightbulb
} from "lucide-react";

interface PestInfo {
  id: string;
  name: string;
  icon: string;
  damage: string;
  severity: 'low' | 'medium' | 'high';
  naturalControl: string[];
  animalPests?: boolean;
  deterrents?: string[];
}

const PestPrevention = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedPest, setSelectedPest] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");

  const pests: PestInfo[] = [
    {
      id: '1',
      name: 'Monkeys',
      icon: '🐵',
      damage: 'Raids crops, destroys fruits and grains, damages vines',
      severity: 'high',
      animalPests: true,
      naturalControl: [],
      deterrents: [
        'Plant thorny borders (cactus, bamboo) around fields',
        'Use visual deterrents: hanging CDs, old radios, flags',
        'Create noise barriers with metal sheets and stones',
        'Apply capsicum spray on crops (unpalatable to monkeys)',
        'Keep dogs or maintain a watch during harvest season',
        'Avoid storing food near crop fields',
        'Use trained falcons to scare away monkeys'
      ]
    },
    {
      id: '2',
      name: 'Rats/Rodents',
      icon: '🐭',
      damage: 'Eat seeds, grains, roots; cause storage loss',
      severity: 'high',
      animalPests: true,
      naturalControl: [],
      deterrents: [
        'Use snap traps or live traps strategically placed',
        'Poison baits (rat poison) in bait stations away from pets',
        'Keep field clean to remove hiding spots',
        'Encourage owl nesting boxes for natural predation',
        'Ensure proper crop residue removal after harvest',
        'Plant rat-repellent plants (mint, castor) around boundaries',
        'Use smoke or capsicum spray as temporary repellent',
        'Maintain proper field spacing to reduce cover'
      ]
    },
    {
      id: '3',
      name: 'Snakes',
      icon: '🐍',
      damage: 'Eat crops, create panic, occasional risk to farmers',
      severity: 'medium',
      animalPests: true,
      naturalControl: [],
      deterrents: [
        'Remove rodent population (snakes follow rodents)',
        'Keep field borders clear and dry',
        'Use snake repellent plants (marigold, strong-smelling herbs)',
        'Install wire mesh fencing (1.5m high)',
        'Reduce water accumulation and standing water',
        'Avoid heavy mulching which provides snake habitat',
        'Use vibration devices (sonic repellents)',
        'Maintain clear paths in fields for safe movement'
      ]
    },
    {
      id: '4',
      name: 'Wild Boars/Pigs',
      icon: '🐗',
      damage: 'Root out fields, destroy entire crops, cause erosion',
      severity: 'high',
      animalPests: true,
      naturalControl: [],
      deterrents: [
        'Build strong fencing (1.5-2m high) with electric wire',
        'Trenches (60cm deep) along field boundaries',
        'Mix thorny plants and cactus in hedgerows',
        'Use motion-activated lights and noise makers',
        'Keep fields free of food waste and fallen fruits',
        'Avoid leaving water sources accessible',
        'Employ herders to guard during critical periods',
        'Coordinate with neighboring farms for unified protection'
      ]
    },
    {
      id: '5',
      name: 'Aphids',
      icon: '🦗',
      damage: 'Suck plant sap, transmit viruses, cause leaf curling',
      severity: 'medium',
      naturalControl: [
        'Spray strong water jets to dislodge aphids',
        'Neem oil spray (5% concentration)',
        'Insecticidal soap solution',
        'Garlic or chili extract spray',
        'Release ladybugs or parasitic wasps',
        'Reflective mulch to confuse aphids'
      ]
    },
    {
      id: '6',
      name: 'Whiteflies',
      icon: '🦟',
      damage: 'Drain sap, cause yellowing, transmit viruses',
      severity: 'medium',
      naturalControl: [
        'Yellow sticky traps',
        'Neem oil every 7 days',
        'Encourage parasitic wasps',
        'Reflective aluminum mulch',
        'Remove affected leaves'
      ]
    },
    {
      id: '7',
      name: 'Caterpillars',
      icon: '🐛',
      damage: 'Eat foliage and fruits, cause defoliation',
      severity: 'high',
      naturalControl: [
        'Hand-pick eggs and caterpillars early morning',
        'Bacillus thuringiensis (Bt) spray',
        'Neem spray (disrupts molting)',
        'Pheromone traps for moths',
        'Encourage parasitic wasps',
        'Plant trap crops (marigold) away from main crop'
      ]
    },
    {
      id: '8',
      name: 'Mites',
      icon: '🕷️',
      damage: 'Cause yellowing and browning, fine webbing',
      severity: 'medium',
      naturalControl: [
        'Regular water spray (increase humidity)',
        'Neem oil spray',
        'Sulfur dust application',
        'Release predatory mites',
        'Remove heavily infested leaves'
      ]
    }
  ];

  const preventiveMeasures = [
    {
      title: 'Bund Planting',
      description: 'Plant small flowering plants on field bunds',
      benefits: ['Reduce pest infestation by 20-30%', 'Provide beneficial insect habitat', 'Add aesthetic value'],
      plants: ['Marigold', 'Chrysanthemum', 'Dhaniya flowers', 'Sunflower'],
      icon: <Flower className="w-6 h-6" />
    },
    {
      title: 'Air Ventilation',
      description: 'Maintain proper spacing and air circulation',
      benefits: ['Reduce fungal diseases', 'Improve plant health', 'Reduce humidity-loving pests'],
      practices: [
        'Leave gaps in windward direction',
        'Maintain 30-45cm spacing between plants',
        'Prune lower leaves to improve circulation',
        'Avoid over-irrigation'
      ],
      icon: <Wind className="w-6 h-6" />
    },
    {
      title: 'Water Management',
      description: 'Proper irrigation timing and amount',
      benefits: ['Stronger plant immunity', 'Reduced fungal growth', 'Less water stress'],
      practices: [
        'Water early morning or late evening',
        'Avoid overhead watering (drip is better)',
        'Maintain soil moisture, not waterlogged',
        'Reduce water in peak disease season'
      ],
      icon: <Droplets className="w-6 h-6" />
    },
    {
      title: 'Crop Rotation',
      description: 'Change crops annually or seasonally',
      benefits: ['Break pest/disease cycle', 'Improve soil fertility', 'Reduce chemical use'],
      practices: [
        'Rotate with different crop families',
        '2-3 year rotation for serious pests',
        'Include legumes for nitrogen fixation',
        'Avoid same crop in same field'
      ],
      icon: <Leaf className="w-6 h-6" />
    }
  ];

  const waterSavingTips = [
    {
      title: 'Drip Irrigation',
      savings: '40-50%',
      description: 'Water reaches roots directly, minimal evaporation',
      implementation: 'Install drip lines, adjust spacing by crop type'
    },
    {
      title: 'Mulching',
      savings: '30-40%',
      description: 'Organic mulch retains soil moisture',
      implementation: 'Apply 5-10cm layer of straw or compost'
    },
    {
      title: 'Soil Preparation',
      savings: '20-30%',
      description: 'Rich soil with organic matter holds more water',
      implementation: 'Add compost, manure before planting'
    },
    {
      title: 'Scheduling',
      savings: '15-25%',
      description: 'Water during cooler hours, avoid evaporation',
      implementation: 'Water early morning or evening only'
    }
  ];

  const getPest = () => pests.find(p => p.id === selectedPest);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              Pest Prevention & Management
            </h1>
            <p className="text-muted-foreground mt-2">Natural methods and best practices for healthy crops</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        </div>

        <Tabs defaultValue="pests" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pests">Pests & Control</TabsTrigger>
            <TabsTrigger value="prevention">Prevention</TabsTrigger>
            <TabsTrigger value="water">Water Saving</TabsTrigger>
            <TabsTrigger value="guide">IPM Guide</TabsTrigger>
          </TabsList>

          {/* Pests Tab */}
          <TabsContent value="pests" className="space-y-6 mt-6">
            {!selectedPest ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pests.map(pest => (
                  <Card
                    key={pest.id}
                    className="cursor-pointer hover:shadow-lg transition hover:border-primary"
                    onClick={() => setSelectedPest(pest.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <span className="text-4xl">{pest.icon}</span>
                            {pest.name}
                          </CardTitle>
                          {pest.animalPests && <Badge className="mt-2">Animal Pest</Badge>}
                        </div>
                        <Badge
                          variant="outline"
                          className={`${
                            pest.severity === 'high'
                              ? 'bg-red-100 text-red-800'
                              : pest.severity === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {pest.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{pest.damage}</p>
                      <Button variant="outline" className="w-full">
                        View Deterrents
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl">{getPest()?.icon}</span>
                      <div>
                        <CardTitle>{getPest()?.name}</CardTitle>
                        <CardDescription className="mt-1">{getPest()?.damage}</CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedPest(null)}>Back</Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {getPest()?.animalPests ? (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Natural Deterrents
                      </h3>
                      <div className="space-y-2">
                        {getPest()?.deterrents?.map((deterrent, idx) => (
                          <div key={idx} className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{deterrent}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Leaf className="w-5 h-5" />
                          Natural Control Methods
                        </h3>
                        <div className="space-y-2">
                          {getPest()?.naturalControl.map((method, idx) => (
                            <div key={idx} className="p-3 bg-success/10 border border-success/20 rounded-lg flex items-start gap-2">
                              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                              <p className="text-sm">{method}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                        <p className="font-semibold text-sm mb-2">Chemical Control (Last Resort)</p>
                        <p className="text-sm text-muted-foreground">
                          Only use registered pesticides if natural methods fail. Follow label instructions carefully and wear protective equipment.
                        </p>
                      </div>
                    </>
                  )}

                  {/* Monitoring Tips */}
                  <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
                    <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Monitoring Tips
                    </p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Monitor fields daily, especially early morning</li>
                      <li>• Use pheromone traps to detect pest presence early</li>
                      <li>• Act immediately when pests are detected</li>
                      <li>• Keep records of pest occurrences and treatments</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Prevention Tab */}
          <TabsContent value="prevention" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preventiveMeasures.map((measure, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {measure.icon}
                      {measure.title}
                    </CardTitle>
                    <CardDescription>{measure.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-semibold text-sm mb-2">Benefits:</p>
                      <ul className="space-y-1">
                        {measure.benefits.map((benefit, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {measure.plants && (
                      <div>
                        <p className="font-semibold text-sm mb-2">Recommended Plants:</p>
                        <div className="flex flex-wrap gap-2">
                          {measure.plants.map((plant, i) => (
                            <Badge key={i} variant="outline">{plant}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {measure.practices && (
                      <div>
                        <p className="font-semibold text-sm mb-2">Implementation:</p>
                        <ul className="space-y-1">
                          {measure.practices.map((practice, i) => (
                            <li key={i} className="text-sm text-muted-foreground">• {practice}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Water Saving Tab */}
          <TabsContent value="water" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-6 h-6" />
                  Water Conservation Techniques
                </CardTitle>
                <CardDescription>Methods to reduce water consumption while maintaining crop health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {waterSavingTips.map((tip, idx) => (
                  <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{tip.title}</h4>
                      <Badge className="bg-success text-white">Save {tip.savings}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{tip.description}</p>
                    <p className="text-sm font-medium text-primary">📋 {tip.implementation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seasonal Water Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-semibold text-sm text-blue-900">🌧️ Monsoon (June-September)</p>
                  <p className="text-sm text-blue-800">Reduce irrigation. Focus on drainage. Apply fungicides preventively.</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="font-semibold text-sm text-orange-900">☀️ Summer (March-May)</p>
                  <p className="text-sm text-orange-800">Increase irrigation frequency. Use mulch. Early morning watering.</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="font-semibold text-sm text-green-900">🍂 Winter (October-February)</p>
                  <p className="text-sm text-green-800">Reduce irrigation. Use rainwater harvesting. 2-3 day intervals.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* IPM Guide Tab */}
          <TabsContent value="guide" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-6 h-6" />
                  Integrated Pest Management (IPM) Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 border-l-4 border-primary">
                    <p className="font-semibold mb-2">1. Prevention First</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>✓ Use disease-resistant varieties</li>
                      <li>✓ Maintain field hygiene</li>
                      <li>✓ Practice crop rotation</li>
                      <li>✓ Optimize plant nutrition and water</li>
                    </ul>
                  </div>

                  <div className="p-4 border-l-4 border-success">
                    <p className="font-semibold mb-2">2. Monitor & Identify</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>✓ Regular field scouting (weekly minimum)</li>
                      <li>✓ Use pheromone and light traps</li>
                      <li>✓ Keep detailed records</li>
                      <li>✓ Know Economic Threshold Levels (ETL)</li>
                    </ul>
                  </div>

                  <div className="p-4 border-l-4 border-warning">
                    <p className="font-semibold mb-2">3. Natural Control (First Response)</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>✓ Beneficial insects (ladybugs, wasps)</li>
                      <li>✓ Botanical insecticides (neem, chili spray)</li>
                      <li>✓ Hand-picking and physical removal</li>
                      <li>✓ Biopesticides (Bt, pheromone traps)</li>
                    </ul>
                  </div>

                  <div className="p-4 border-l-4 border-destructive">
                    <p className="font-semibold mb-2">4. Chemical Control (Last Resort)</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>✓ Use only when natural methods fail</li>
                      <li>✓ Follow recommended dosages</li>
                      <li>✓ Rotate chemical groups</li>
                      <li>✓ Observe safety precautions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>When to Apply IPM Stages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <span className="font-semibold">Pest Population: &lt; 10% crop affected</span>
                    <Badge className="bg-success">Prevention Only</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <span className="font-semibold">Pest Population: 10-30% crop affected</span>
                    <Badge className="bg-warning">Natural Control</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="font-semibold">Pest Population: &gt; 30% crop affected</span>
                    <Badge className="bg-destructive">Chemical Control</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default PestPrevention;
