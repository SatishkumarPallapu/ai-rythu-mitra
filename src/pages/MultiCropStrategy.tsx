import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, TrendingUp, Leaf } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MultiCropStrategy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [strategy, setStrategy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStrategy();
  }, [id]);

  const fetchStrategy = async () => {
    try {
      const { data, error } = await supabase
        .from('multi_crop_strategies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setStrategy(data);
    } catch (error) {
      console.error('Error fetching strategy:', error);
      toast({
        title: "Error loading strategy",
        description: "Could not load strategy details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading strategy...</p>
        </div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="container px-4 py-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">Strategy not found</p>
          </Card>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{strategy.strategy_name}</h2>
          <p className="text-muted-foreground capitalize">{strategy.strategy_type} Strategy</p>
        </div>

        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              Crops Involved
            </h3>
            <div className="flex flex-wrap gap-2">
              {strategy.crops_involved?.map((crop: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {crop}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Start Date
              </p>
              <p className="font-semibold">
                {strategy.start_date ? new Date(strategy.start_date).toLocaleDateString('en-IN') : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                End Date
              </p>
              <p className="font-semibold">
                {strategy.end_date ? new Date(strategy.end_date).toLocaleDateString('en-IN') : 'Not set'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Land Utilization
            </p>
            <p className="font-semibold">{strategy.land_utilization_percent || 0}%</p>
          </div>

          {strategy.expected_total_profit && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Expected Total Profit</p>
              <p className="font-semibold text-success">₹{strategy.expected_total_profit.toLocaleString('en-IN')}</p>
            </div>
          )}

          {strategy.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Notes</p>
              <p className="text-sm">{strategy.notes}</p>
            </div>
          )}
        </Card>

        <Button className="w-full" onClick={() => navigate('/multi-crop-planner')}>
          Edit Strategy
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default MultiCropStrategy;
