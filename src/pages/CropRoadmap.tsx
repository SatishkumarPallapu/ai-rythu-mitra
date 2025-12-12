import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getCropIcon } from "@/utils/cropIcons";
import {
  Calendar,
  Droplets,
  TrendingUp,
  Leaf,
  Play,
  CheckCircle2,
  Clock,
  Sprout,
  Loader2
} from "lucide-react";

const CropRoadmap = () => {
  const { cropId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [crop, setCrop] = useState<any>(null);
  const [instructions, setInstructions] = useState<any[]>([]);
  const [seeds, setSeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (cropId) {
      fetchCropDetails();
    }
  }, [cropId]);

  const fetchCropDetails = async () => {
    try {
      const { data: cropData, error: cropError } = await supabase
        .from('crops_master')
        .select('*')
        .eq('id', cropId)
        .single();

      if (cropError) throw cropError;
      setCrop(cropData);

      const { data: instructionsData, error: instructionsError } = await supabase
        .from('crop_cultivation_instructions')
        .select('*')
        .eq('crop_id', cropId)
        .order('day_range', { ascending: true });

      if (instructionsError) throw instructionsError;
      setInstructions(instructionsData || []);

      const { data: seedsData, error: seedsError } = await supabase
        .from('seed_recommendations')
        .select('*')
        .eq('crop_id', cropId)
        .limit(10);

      if (seedsError) throw seedsError;
      setSeeds(seedsData || []);
    } catch (error) {
      console.error('Error fetching crop details:', error);
      toast({
        title: "Error loading crop details",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartCrop = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to start tracking this crop",
        variant: "destructive"
      });
      return;
    }

    setStarting(true);
    try {
      const { data: planData, error: planError } = await supabase
        .from('crop_plans')
        .insert({
          user_id: user.id,
          crop_id: cropId,
          start_date: new Date().toISOString().split('T')[0],
          expected_harvest_date: new Date(Date.now() + crop.duration_days * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          status: 'active'
        })
        .select()
        .single();

      if (planError) throw planError;

      const tasks = instructions.map(instruction => ({
        crop_plan_id: planData.id,
        day_number: parseInt(instruction.day_range.split('-')[0]),
        task_title: instruction.cultivation_phase,
        task_description: instruction.instructions,
        task_type: 'cultivation'
      }));

      const { error: tasksError } = await supabase
        .from('crop_roadmap_tasks')
        .insert(tasks);

      if (tasksError) throw tasksError;

      toast({
        title: "Crop tracking started!",
        description: "Your cultivation journey has begun"
      });

      navigate('/calendar');
    } catch (error) {
      console.error('Error starting crop:', error);
      toast({
        title: "Failed to start tracking",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <p className="text-muted-foreground">Crop not found</p>
          <Button onClick={() => navigate('/crop-recommendations')}>
            Back to Recommendations
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container px-4 py-6 space-y-6">
        <Card className="p-6 gradient-primary text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{getCropIcon(crop.name)}</div>
              <div>
                <h1 className="text-3xl font-bold">{crop.name}</h1>
                <p className="text-white/90 capitalize">{crop.category}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-3">
              <Clock className="w-5 h-5 mb-2" />
              <p className="text-sm text-white/80">Duration</p>
              <p className="font-bold">{crop.duration_days} days</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <Droplets className="w-5 h-5 mb-2" />
              <p className="text-sm text-white/80">Water</p>
              <p className="font-bold capitalize">{crop.water_requirement || 'Medium'}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <TrendingUp className="w-5 h-5 mb-2" />
              <p className="text-sm text-white/80">Profit</p>
              <p className="font-bold capitalize">{crop.profit_index || 'Medium'}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <Leaf className="w-5 h-5 mb-2" />
              <p className="text-sm text-white/80">Season</p>
              <p className="font-bold capitalize">{crop.season || 'All'}</p>
            </div>
          </div>

          <Button
            onClick={handleStartCrop}
            disabled={starting}
            className="w-full mt-6 bg-white text-primary hover:bg-white/90"
            size="lg"
          >
            {starting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Starting Tracking...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Growing This Crop
              </>
            )}
          </Button>
        </Card>

        <Tabs defaultValue="roadmap" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            <TabsTrigger value="seeds">Seeds</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
          </TabsList>

          <TabsContent value="roadmap" className="space-y-4 mt-6">
            <h2 className="text-xl font-bold">Day-by-Day Cultivation Guide</h2>
            
            {instructions.length > 0 ? (
              instructions.map((instruction) => (
                <Card key={instruction.id} className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{instruction.cultivation_phase}</h3>
                        <Badge variant="outline">Days {instruction.day_range}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{instruction.instructions}</p>
                      
                      {instruction.tips && instruction.tips.length > 0 && (
                        <div className="mt-3 p-3 bg-accent/10 rounded-lg">
                          <p className="text-sm font-medium mb-2">💡 Pro Tips:</p>
                          <ul className="text-sm space-y-1">
                            {instruction.tips.map((tip: string, tipIdx: number) => (
                              <li key={tipIdx} className="text-muted-foreground">• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Detailed cultivation instructions will be available soon
                </p>
              </Card>
            )}

            {crop.intercropping_possibility && (
              <Card className="p-5 bg-success/5 border-success/20">
                <div className="flex items-start gap-3">
                  <Sprout className="w-6 h-6 text-success flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Intercropping Opportunity</h3>
                    <p className="text-sm text-muted-foreground">{crop.intercropping_possibility}</p>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="seeds" className="space-y-4 mt-6">
            <h2 className="text-xl font-bold">Top 10 Recommended Seeds</h2>
            
            {seeds.length > 0 ? (
              seeds.map((seed, index) => (
                <Card key={seed.id} className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{seed.seed_variety}</h3>
                      <p className="text-sm text-muted-foreground">Best Season: {seed.best_season || 'All'}</p>
                    </div>
                    <Badge variant="secondary">#{index + 1}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Yield</p>
                      <p className="font-semibold">{seed.avg_yield_per_acre} tons/acre</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="font-semibold">₹{seed.price_per_kg}/kg</p>
                    </div>
                  </div>

                  {seed.resistance_to_pests && seed.resistance_to_pests.length > 0 && (
                    <div className="mt-3 p-3 bg-accent/10 rounded-lg">
                      <p className="text-sm font-medium mb-1">🛡️ Pest Resistance:</p>
                      <p className="text-sm text-muted-foreground">
                        {seed.resistance_to_pests.join(', ')}
                      </p>
                    </div>
                  )}

                  {seed.source && (
                    <p className="text-xs text-muted-foreground mt-2">Source: {seed.source}</p>
                  )}
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Seed recommendations will be available soon
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="benefits" className="space-y-4 mt-6">
            <h2 className="text-xl font-bold">Health & Nutritional Benefits</h2>
            
            <Card className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                ❤️ Health Benefits
              </h3>
              <p className="text-muted-foreground">
                {crop.health_benefits || 'Provides essential nutrients and supports overall health'}
              </p>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                💊 Medical Benefits
              </h3>
              <p className="text-muted-foreground">
                {crop.medical_benefits || 'Known for various medicinal properties'}
              </p>
            </Card>

            {crop.vitamins && (
              <Card className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  ✨ Vitamins
                </h3>
                <p className="text-muted-foreground">{crop.vitamins}</p>
              </Card>
            )}

            {crop.proteins && (
              <Card className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  🥗 Protein Content
                </h3>
                <p className="text-muted-foreground">{crop.proteins}</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default CropRoadmap;
