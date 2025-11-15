import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Satellite,
  ExternalLink,
  Info,
  Map,
  TrendingUp,
  Droplets,
  Sun
} from "lucide-react";

const SatelliteMonitoring = () => {
  const platforms = [
    {
      name: "Farmonaut",
      description: "Free satellite-based crop health monitoring with NDVI maps",
      features: ["NDVI vegetation index", "Weather data", "Pest & disease alerts"],
      link: "https://farmonaut.com",
      isFree: true,
      icon: <Satellite className="w-6 h-6" />
    },
    {
      name: "Sentinel Hub (ESA)",
      description: "Free access to Copernicus Sentinel satellite imagery",
      features: ["High-resolution imagery", "Multiple spectral bands", "Historical data"],
      link: "https://www.sentinel-hub.com",
      isFree: true,
      icon: <Map className="w-6 h-6" />
    },
    {
      name: "Google Earth Engine",
      description: "Planetary-scale geospatial analysis (requires some technical knowledge)",
      features: ["30+ years of satellite data", "Cloud computing", "Free for research"],
      link: "https://earthengine.google.com",
      isFree: true,
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  const howToGuide = [
    {
      step: 1,
      title: "Sign up for Farmonaut (Easiest for farmers)",
      description: "Create a free account using your mobile number or email",
      icon: <Satellite className="w-5 h-5" />
    },
    {
      step: 2,
      title: "Mark your farm boundaries",
      description: "Use GPS or manually draw your field boundaries on the satellite map",
      icon: <Map className="w-5 h-5" />
    },
    {
      step: 3,
      title: "Select your crop type",
      description: "Choose the crop you're growing for accurate health monitoring",
      icon: <Sun className="w-5 h-5" />
    },
    {
      step: 4,
      title: "Monitor crop health regularly",
      description: "Check NDVI (Normalized Difference Vegetation Index) maps every 3-5 days. Green = healthy, Yellow/Red = stress",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      step: 5,
      title: "Act on alerts",
      description: "When you see yellow/red zones, inspect those areas for pests, water stress, or nutrient deficiency",
      icon: <Droplets className="w-5 h-5" />
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-subtle">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-2">What is Satellite Monitoring?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Satellites take pictures of your farm from space every few days. These pictures can show:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✅ Which parts of your field are healthy (green)</li>
              <li>⚠️ Which parts need attention (yellow/red)</li>
              <li>💧 Water stress areas (plants not getting enough water)</li>
              <li>🐛 Possible pest/disease affected zones</li>
              <li>📊 Crop growth progress over time</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Free Satellite Monitoring Platforms</h3>
        {platforms.map((platform, idx) => (
          <Card key={idx} className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded">
                {platform.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{platform.name}</h4>
                    <p className="text-sm text-muted-foreground">{platform.description}</p>
                  </div>
                  {platform.isFree && (
                    <Badge variant="secondary" className="ml-2">FREE</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {platform.features.map((feature, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(platform.link, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Website
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">How to Use Satellite Monitoring (Step-by-Step)</h3>
        <div className="space-y-4">
          {howToGuide.map((item) => (
            <div key={item.step} className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  {item.step}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {item.icon}
                  <h4 className="font-semibold">{item.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Understanding NDVI (Crop Health Index)
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span><strong>Dark Green (0.7-1.0):</strong> Very healthy crops, growing well</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-lime-400"></div>
            <span><strong>Light Green (0.5-0.7):</strong> Healthy crops, normal growth</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-400"></div>
            <span><strong>Yellow (0.3-0.5):</strong> Moderate stress, needs attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500"></div>
            <span><strong>Orange (0.2-0.3):</strong> High stress, check immediately</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span><strong>Red (0-0.2):</strong> Very poor health or bare soil</span>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-muted">
        <h4 className="font-semibold mb-2">💡 Pro Tips</h4>
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li>📱 Install the mobile app for easy access in the field</li>
          <li>🔔 Enable notifications for health alerts</li>
          <li>📊 Compare current maps with previous weeks to spot changes</li>
          <li>🗺️ Use satellite data along with your field observations</li>
          <li>💰 Can save 15-20% on inputs by targeting only problem areas</li>
          <li>⏰ Best to check maps every 3-5 days for timely intervention</li>
        </ul>
      </Card>
    </div>
  );
};

export default SatelliteMonitoring;
