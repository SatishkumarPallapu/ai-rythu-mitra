import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, Wrench, Sprout, Shield, Droplets, Zap, 
  Calculator, ShoppingCart, Star, MapPin, Phone, Clock,
  TrendingUp, Award, Truck, Users, Search, Filter
} from "lucide-react";

interface FarmTool {
  id: string;
  name: string;
  category: 'inputs' | 'tools' | 'equipment' | 'chemicals';
  price: number;
  unit: string;
  rating: number;
  supplier: string;
  location: string;
  description: string;
  inStock: boolean;
  fastDelivery: boolean;
  organic?: boolean;
  icon: string;
}

const FarmInputsMarketplace = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [farmTools, setFarmTools] = useState<FarmTool[]>([]);

  useEffect(() => {
    generateFarmTools();
  }, []);

  const generateFarmTools = () => {
    const tools: FarmTool[] = [
      // Seeds & Plants
      {
        id: 'seed-tomato-hybrid',
        name: 'Hybrid Tomato Seeds (F1)',
        category: 'inputs',
        price: 850,
        unit: '100g packet',
        rating: 4.8,
        supplier: 'AgriSeeds Pro',
        location: 'Kamareddy',
        description: 'High yield hybrid tomato seeds with disease resistance',
        inStock: true,
        fastDelivery: true,
        organic: false,
        icon: '🍅'
      },
      {
        id: 'fertilizer-npk',
        name: 'NPK 19:19:19 Fertilizer',
        category: 'inputs',
        price: 1200,
        unit: '25kg bag',
        rating: 4.6,
        supplier: 'FarmNutrients Ltd',
        location: 'Nizamabad',
        description: 'Balanced fertilizer for all growth stages',
        inStock: true,
        fastDelivery: true,
        organic: false,
        icon: '🌱'
      },
      {
        id: 'organic-compost',
        name: 'Premium Organic Compost',
        category: 'inputs',
        price: 800,
        unit: '50kg bag',
        rating: 4.9,
        supplier: 'Green Earth Organics',
        location: 'Kamareddy',
        description: 'Enriched organic compost for healthy soil',
        inStock: true,
        fastDelivery: false,
        organic: true,
        icon: '🍃'
      },
      
      // Tools & Equipment
      {
        id: 'spray-pump',
        name: 'Battery Sprayer Pump 16L',
        category: 'tools',
        price: 4500,
        unit: 'piece',
        rating: 4.5,
        supplier: 'AgriTools Direct',
        location: 'Hyderabad',
        description: 'Rechargeable battery operated sprayer',
        inStock: true,
        fastDelivery: true,
        organic: false,
        icon: '💨'
      },
      {
        id: 'drip-system',
        name: 'Drip Irrigation Kit (1 Acre)',
        category: 'equipment',
        price: 12000,
        unit: 'complete kit',
        rating: 4.7,
        supplier: 'IrrigationTech',
        location: 'Warangal',
        description: 'Complete drip irrigation system with timers',
        inStock: true,
        fastDelivery: false,
        organic: false,
        icon: '💧'
      },
      {
        id: 'soil-tester',
        name: 'Digital Soil pH & NPK Tester',
        category: 'tools',
        price: 2800,
        unit: 'device',
        rating: 4.4,
        supplier: 'SmartFarm Devices',
        location: 'Secunderabad',
        description: 'Digital meter for soil analysis',
        inStock: true,
        fastDelivery: true,
        organic: false,
        icon: '📊'
      },

      // Pesticides & Chemicals
      {
        id: 'neem-oil',
        name: 'Pure Neem Oil Concentrate',
        category: 'chemicals',
        price: 450,
        unit: '1L bottle',
        rating: 4.8,
        supplier: 'Organic Solutions',
        location: 'Karimnagar',
        description: 'Natural pest control and fungicide',
        inStock: true,
        fastDelivery: true,
        organic: true,
        icon: '🌿'
      },
      {
        id: 'fungicide-copper',
        name: 'Copper Oxychloride Fungicide',
        category: 'chemicals',
        price: 280,
        unit: '250g pack',
        rating: 4.3,
        supplier: 'CropCare Chemicals',
        location: 'Nizamabad',
        description: 'Broad spectrum fungicide for disease control',
        inStock: true,
        fastDelivery: true,
        organic: false,
        icon: '🛡️'
      },
      {
        id: 'bio-pesticide',
        name: 'Bt Bio-Pesticide (Organic)',
        category: 'chemicals',
        price: 650,
        unit: '500g pack',
        rating: 4.6,
        supplier: 'BioAgri Solutions',
        location: 'Medak',
        description: 'Biological pest control for caterpillars',
        inStock: true,
        fastDelivery: false,
        organic: true,
        icon: '🦠'
      },

      // Advanced Equipment
      {
        id: 'weather-station',
        name: 'Farm Weather Monitoring Station',
        category: 'equipment',
        price: 15000,
        unit: 'complete system',
        rating: 4.9,
        supplier: 'WeatherTech Agri',
        location: 'Hyderabad',
        description: 'Real-time weather monitoring with mobile alerts',
        inStock: false,
        fastDelivery: false,
        organic: false,
        icon: '🌡️'
      },
      {
        id: 'mulch-film',
        name: 'Biodegradable Mulch Film',
        category: 'inputs',
        price: 180,
        unit: 'per meter',
        rating: 4.2,
        supplier: 'EcoFarm Materials',
        location: 'Kamareddy',
        description: 'Eco-friendly mulch film for weed control',
        inStock: true,
        fastDelivery: true,
        organic: true,
        icon: '🎬'
      }
    ];
    setFarmTools(tools);
  };

  const categories = [
    { id: 'all', name: 'All Products', icon: '🌾', count: farmTools.length },
    { id: 'inputs', name: 'Seeds & Fertilizers', icon: '🌱', count: farmTools.filter(t => t.category === 'inputs').length },
    { id: 'tools', name: 'Farm Tools', icon: '🔧', count: farmTools.filter(t => t.category === 'tools').length },
    { id: 'equipment', name: 'Equipment', icon: '⚙️', count: farmTools.filter(t => t.category === 'equipment').length },
    { id: 'chemicals', name: 'Crop Protection', icon: '🛡️', count: farmTools.filter(t => t.category === 'chemicals').length }
  ];

  const filteredTools = farmTools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (tool: FarmTool) => {
    setCart([...cart, { ...tool, quantity: 1, addedAt: new Date() }]);
  };

  const getTotalCartValue = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-7 h-7 text-green-600" />
              🛒 Farm Inputs Marketplace
            </h2>
            <p className="text-muted-foreground">Quality farm supplies delivered to your doorstep</p>
          </div>
          
          {cart.length > 0 && (
            <Button onClick={() => navigate('/checkout')} className="relative">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({cart.length})
              <Badge className="ml-2 bg-white text-green-600">₹{getTotalCartValue().toLocaleString()}</Badge>
            </Button>
          )}
        </div>

        {/* Search & Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search farm inputs, tools, equipment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                <span className="mr-1">{category.icon}</span>
                <div className="hidden sm:block">
                  <div>{category.name}</div>
                  <div className="text-xs text-muted-foreground">({category.count})</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">{filteredTools.length}</div>
                    <p className="text-sm text-muted-foreground">Products</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {filteredTools.filter(t => t.inStock).length}
                    </div>
                    <p className="text-sm text-muted-foreground">In Stock</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {filteredTools.filter(t => t.fastDelivery).length}
                    </div>
                    <p className="text-sm text-muted-foreground">Fast Delivery</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {filteredTools.filter(t => t.organic).length}
                    </div>
                    <p className="text-sm text-muted-foreground">Organic</p>
                  </CardContent>
                </Card>
              </div>

              {/* Products Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map(tool => (
                  <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{tool.icon}</span>
                          <div>
                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{tool.rating}</span>
                              </div>
                              {tool.organic && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                  Organic
                                </Badge>
                              )}
                              {tool.fastDelivery && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                  Fast Delivery
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-green-600">₹{tool.price.toLocaleString()}</span>
                          <span className="text-sm text-muted-foreground">per {tool.unit}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{tool.location}</span>
                          <span>•</span>
                          <span>{tool.supplier}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => addToCart(tool)} 
                          disabled={!tool.inStock}
                          className="flex-1"
                        >
                          {tool.inStock ? (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </>
                          ) : (
                            'Out of Stock'
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTools.length === 0 && (
                <Card className="text-center p-8">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Products Found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or category filters</p>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Featured Suppliers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              🏆 Featured Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {['AgriSeeds Pro', 'FarmNutrients Ltd', 'Green Earth Organics'].map((supplier, index) => (
                <div key={supplier} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{supplier}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">4.{8 - index} • Verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" onClick={() => navigate('/labor-booking')}>
                <Users className="w-4 h-4 mr-2" />
                Book Labor
              </Button>
              <Button variant="outline" onClick={() => navigate('/transport-booking')}>
                <Truck className="w-4 h-4 mr-2" />
                Book Transport
              </Button>
              <Button variant="outline" onClick={() => navigate('/drone-services')}>
                <Zap className="w-4 h-4 mr-2" />
                Drone Services
              </Button>
              <Button variant="outline" onClick={() => navigate('/equipment-rental')}>
                <Wrench className="w-4 h-4 mr-2" />
                Rent Equipment
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default FarmInputsMarketplace;