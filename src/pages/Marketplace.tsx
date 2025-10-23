import { useState, useEffect } from "react";
import { Search, Plus, Filter } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getCropIcon } from "@/utils/cropIcons";
import CropCard from "@/components/CropCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Marketplace = () => {
  const { toast } = useToast();
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchCrops();
  }, [categoryFilter]);

  const fetchCrops = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('crops_master')
        .select('*')
        .order('market_demand_index', { ascending: false });

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;

      setCrops(data || []);
    } catch (error) {
      console.error('Error fetching crops:', error);
      toast({
        title: "Error loading marketplace",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCrops = crops.filter(crop =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Marketplace</h2>
              <p className="text-muted-foreground">Buy and sell produce</p>
            </div>
            <Button size="icon" className="rounded-full h-12 w-12 shadow-lg">
              <Plus className="w-6 h-6" />
            </Button>
          </div>

          {/* Search & Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search crops..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="vegetable">Vegetables</SelectItem>
                <SelectItem value="fruit">Fruits</SelectItem>
                <SelectItem value="grain">Grains</SelectItem>
                <SelectItem value="pulse">Pulses</SelectItem>
                <SelectItem value="spice">Spices</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Crops Listings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{filteredCrops.length} Crops Available</h3>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading crops...</div>
          ) : filteredCrops.length > 0 ? (
            filteredCrops.map((crop, index) => (
              <CropCard
                key={crop.id}
                crop={crop}
                onSelect={(id) => console.log('View crop details:', id)}
                animationDelay={index * 0.02}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No crops found matching your search
            </div>
          )}
        </div>

        {/* Market Prices */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">Today's Market Prices</h3>
            <div className="space-y-2">
              {[
                { crop: "Tomato", price: "₹38-42/kg", trend: "up" },
                { crop: "Rice", price: "₹33-37/kg", trend: "stable" },
                { crop: "Cotton", price: "₹82-88/kg", trend: "down" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="font-medium">{item.crop}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.price}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        item.trend === "up"
                          ? "bg-success/10 text-success"
                          : item.trend === "down"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Marketplace;
