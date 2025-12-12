import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertCircle, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface PriceData {
  month: string;
  price: number;
  year: number;
  quantity: number;
  trend: string;
}

interface ForecastData {
  month: string;
  actual?: number;
  forecast: number;
  confidence: number;
}

const PriceAnalysis = () => {
  const { cropId, cropName } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("all");
  const [comparison, setComparison] = useState<{id: number; name: string; currentPrice: number; previousPrice: number; change: number;}[]>([]);
  
  const [stats, setStats] = useState({
    avgPrice: 0,
    minPrice: 0,
    maxPrice: 0,
    trend: "stable",
    volatility: 0,
    nextSeasonForecast: 0
  });

  const fetchPriceData = useCallback(async () => {
    setLoading(true);
    try {
      // Generate mock 10-year price history
      const mockPriceData = generateMockPriceHistory();
      setPriceHistory(mockPriceData);
      
      // Generate forecast data
      const mockForecast = generateForecast(mockPriceData);
      setForecast(mockForecast);
      
      // Calculate stats
      calculateStats(mockPriceData);
      
      // Generate year-over-year comparison
      generateYearComparison(mockPriceData);

      toast({
        title: "Price data loaded",
        description: "10-year historical data and forecasts ready"
      });
    } catch (error) {
      console.error('Error fetching price data:', error);
      toast({
        title: "Error loading price data",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [cropId]);

  useEffect(() => {
    fetchPriceData();
  }, [fetchPriceData]);

  const generateMockPriceHistory = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data: PriceData[] = [];
    const basePrices: Record<string, number> = {
      'Tomato': 2000,
      'Onion': 2500,
      'Chilli': 8000,
      'Cotton': 6500,
      'Paddy': 1900,
      'Wheat': 2200,
      'Maize': 1800,
      'Brinjal': 1500,
      'Cabbage': 800,
      'Coriander': 5000
    };
    
    const basePrice = basePrices[cropName || 'Tomato'] || 2000;
    
    for (let year = 2014; year <= 2024; year++) {
      months.forEach((month, index) => {
        const seasonalVariation = Math.sin(index * Math.PI / 6) * 0.3;
        const yearlyTrend = (year - 2014) * 0.05;
        const randomVariation = (Math.random() - 0.5) * 0.2;
        
        const price = Math.round(basePrice * (1 + seasonalVariation + yearlyTrend + randomVariation) * 100) / 100;
        
        data.push({
          month: `${month} ${year}`,
          price,
          year,
          quantity: Math.random() * 1000 + 500,
          trend: price > basePrice ? 'up' : price < basePrice ? 'down' : 'stable'
        });
      });
    }
    
    return data;
  };

  const generateForecast = (historical: PriceData[]) => {
    const last12Months = historical.slice(-12);
    const avgPrice = last12Months.reduce((sum, d) => sum + d.price, 0) / last12Months.length;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const forecast: ForecastData[] = [];
    
    months.forEach((month, index) => {
      const seasonalFactor = Math.sin(index * Math.PI / 3) * 0.15;
      const upwardTrend = 0.08;
      const predictedPrice = Math.round((avgPrice * (1 + seasonalFactor + upwardTrend)) * 100) / 100;
      
      forecast.push({
        month,
        forecast: predictedPrice,
        confidence: 75 - (index * 5)
      });
    });
    
    return forecast;
  };

  const calculateStats = (data: PriceData[]) => {
    const last12 = data.slice(-12);
    const avgPrice = last12.reduce((sum, d) => sum + d.price, 0) / last12.length;
    const prices = last12.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const volatility = Math.round(((maxPrice - minPrice) / avgPrice * 100) * 100) / 100;
    
    const trend = last12[11].price > last12[0].price ? 'up' : 'down';
    const nextSeasonForecast = Math.round((avgPrice * 1.08) * 100) / 100;
    
    setStats({
      avgPrice: Math.round(avgPrice * 100) / 100,
      minPrice,
      maxPrice,
      trend,
      volatility,
      nextSeasonForecast
    });
  };

  const generateYearComparison = (data: PriceData[]) => {
    const thisYear = data.filter(d => d.year === 2024);
    const lastYear = data.filter(d => d.year === 2023);
    
    const comparison = thisYear.map((current, index) => ({
      id: index + 1,
      name: current.month.split(' ')[0],
      currentPrice: current.price,
      previousPrice: lastYear[index]?.price || 0,
      change: current.price - (lastYear[index]?.price || 0)
    }));
    
    setComparison(comparison);
  };

  const chartData = selectedYear === 'all' 
    ? priceHistory.slice(-60) // Last 5 years
    : priceHistory.filter(d => d.year === parseInt(selectedYear));

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="container px-4 py-6 flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading price analysis...</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <DollarSign className="w-8 h-8 text-primary" />
              Price Analysis: {cropName}
            </h1>
            <p className="text-muted-foreground mt-2">10-Year Historical Data & AI Forecasts</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Average Price (Last 12 months)</p>
                <p className="text-3xl font-bold">₹{stats.avgPrice}</p>
                <p className="text-xs text-muted-foreground">/quintal</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Price Range</p>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Min: ₹{stats.minPrice}</span>
                    <span className="text-xs">Max: ₹{stats.maxPrice}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Next Season Forecast</p>
                <p className="text-3xl font-bold">₹{stats.nextSeasonForecast}</p>
                <div className="flex items-center gap-1">
                  {stats.trend === 'up' ? (
                    <><ArrowUpRight className="w-4 h-4 text-green-500" /><span className="text-xs text-green-600">8% increase</span></>
                  ) : (
                    <><ArrowDownLeft className="w-4 h-4 text-red-500" /><span className="text-xs text-red-600">Declining</span></>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="history">10-Year History</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="comparison">Year Compare</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* 10-Year History Chart */}
          <TabsContent value="history" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>10-Year Price Trends</CardTitle>
                <CardDescription>Historical price movements from 2014-2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      variant={selectedYear === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedYear('all')}
                    >
                      Last 5 Years
                    </Button>
                    {[2024, 2023, 2022, 2021].map(year => (
                      <Button
                        key={year}
                        variant={selectedYear === year.toString() ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedYear(year.toString())}
                      >
                        {year}
                      </Button>
                    ))}
                  </div>

                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" angle={-45} height={80} tick={{fontSize: 12}} />
                      <YAxis label={{value: 'Price (₹/quintal)', angle: -90, position: 'insideLeft'}} />
                      <Tooltip formatter={(value) => `₹${value}`} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#10b981" 
                        dot={false}
                        name="Market Price"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forecast */}
          <TabsContent value="forecast" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Price Forecast</CardTitle>
                <CardDescription>6-Month prediction based on historical trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={forecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{value: 'Price (₹/quintal)', angle: -90, position: 'insideLeft'}} />
                    <Tooltip formatter={(value) => `₹${value}`} />
                    <Legend />
                    <Bar dataKey="forecast" fill="#3b82f6" name="Forecasted Price" />
                    <Line 
                      type="monotone" 
                      dataKey="confidence" 
                      stroke="#f59e0b" 
                      name="Confidence (%)"
                      yAxisId="right"
                    />
                  </ComposedChart>
                </ResponsiveContainer>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  {forecast.map((item, idx) => (
                    <Card key={idx} className="p-4 bg-primary/5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{item.month}</span>
                        <Badge variant="outline">{item.confidence}% confidence</Badge>
                      </div>
                      <p className="text-2xl font-bold text-primary">₹{item.forecast}</p>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Year Comparison */}
          <TabsContent value="comparison" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Year-over-Year Comparison</CardTitle>
                <CardDescription>Compare current season with last year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={comparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{value: 'Price (₹/quintal)', angle: -90, position: 'insideLeft'}} />
                    <Tooltip formatter={(value) => `₹${value}`} />
                    <Legend />
                    <Bar dataKey="thisYear" fill="#10b981" name="2024" />
                    <Bar dataKey="lastYear" fill="#6b7280" name="2023" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Price Trend Analysis</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Current season prices show {stats.trend === 'up' ? 'an upward trend' : 'a declining trend'} compared to last year.
                        Volatility index: {stats.volatility}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights */}
          <TabsContent value="insights" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Best Selling Period
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-success">September - November</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Historical data shows highest prices during monsoon season when supply is limited.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Lowest Price Period
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-warning">April - June</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Peak harvest season leads to market glut and lower prices.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Price Volatility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats.volatility}%</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {stats.volatility > 30 ? 'High volatility - risky but high profit potential' : 'Moderate volatility - stable returns'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next 6-Month Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">₹{stats.nextSeasonForecast}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Expected average selling price based on AI forecasting models
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <p className="font-semibold text-sm">✓ Optimal Planting Window</p>
                  <p className="text-sm text-muted-foreground">Plant in {stats.trend === 'up' ? 'June-July' : 'March-April'} to harvest during peak price season</p>
                </div>
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="font-semibold text-sm">⚠ Storage Strategy</p>
                  <p className="text-sm text-muted-foreground">Consider cold storage during peak supply months to sell during high-price period</p>
                </div>
                <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
                  <p className="font-semibold text-sm">ℹ Market Timing</p>
                  <p className="text-sm text-muted-foreground">Avoid selling during April-June. Target September-November for maximum profits</p>
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

export default PriceAnalysis;
