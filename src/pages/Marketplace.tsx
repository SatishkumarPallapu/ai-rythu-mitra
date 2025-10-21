import { Search, Plus } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Marketplace = () => {
  const listings = [
    {
      id: 1,
      crop: "Tomatoes",
      quantity: "500 kg",
      price: "₹40/kg",
      location: "Guntur",
      status: "available",
      image: "🍅",
    },
    {
      id: 2,
      crop: "Rice",
      quantity: "1000 kg",
      price: "₹35/kg",
      location: "Krishna",
      status: "available",
      image: "🌾",
    },
    {
      id: 3,
      crop: "Cotton",
      quantity: "750 kg",
      price: "₹85/kg",
      location: "Warangal",
      status: "sold",
      image: "🌱",
    },
  ];

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

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search crops, location..."
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Listings */}
        <div className="space-y-4">
          <h3 className="font-semibold">Recent Listings</h3>
          {listings.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-3xl flex-shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.crop}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} • {item.location}
                        </p>
                      </div>
                      <Badge
                        variant={item.status === "available" ? "default" : "secondary"}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-bold text-lg text-primary">{item.price}</p>
                      {item.status === "available" && (
                        <Button size="sm">Contact Seller</Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
