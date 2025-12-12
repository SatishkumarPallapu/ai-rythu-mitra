import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SoilAnalysis from "./pages/SoilAnalysis";
import MoistureMonitor from "./pages/MoistureMonitor";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import CropHealth from "./pages/CropHealth";
import CropRecommendations from "./pages/CropRecommendations";
import CropRoadmap from "./pages/CropRoadmap";
import VoiceAssistant from "./pages/VoiceAssistant";
import MultiCropPlanner from "./pages/MultiCropPlanner";
import MultiCropStrategy from "./pages/MultiCropStrategy";
import Calendar from "./pages/Calendar";
import Weather from "./pages/Weather";
import PriceAnalysis from "./pages/PriceAnalysis";
import Alerts from "./pages/Alerts";
import PesticideManagementLog from "./pages/PesticideManagementLog";
import SeedRecommendations from "./pages/SeedRecommendations";
import StrategicCropPlanner from "./pages/StrategicCropPlanner";
import SatelliteAnalysis from "./pages/SatelliteAnalysis";
import FarmInputsMarketplace from "./pages/FarmInputsMarketplace";
import LaborBooking from "./pages/LaborBooking";
import TransportBooking from "./pages/TransportBooking";
import DroneServices from "./pages/DroneServices";
import EquipmentRental from "./pages/EquipmentRental";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/soil" element={<SoilAnalysis />} />
          <Route path="/moisture" element={<MoistureMonitor />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/crop-health" element={<CropHealth />} />
          <Route path="/crop-recommendations" element={<CropRecommendations />} />
          <Route path="/crop-roadmap/:cropId" element={<CropRoadmap />} />
          <Route path="/voice-assistant" element={<VoiceAssistant />} />
          <Route path="/multi-crop-planner" element={<MultiCropPlanner />} />
          <Route path="/multi-crop-strategy/:id" element={<MultiCropStrategy />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/price-analysis/:cropId?" element={<PriceAnalysis />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/pesticide-management" element={<PesticideManagementLog />} />
          <Route path="/seed-recommendations" element={<SeedRecommendations />} />
          <Route path="/strategic-crop-planner" element={<StrategicCropPlanner />} />
          <Route path="/satellite-analysis" element={<SatelliteAnalysis />} />
          <Route path="/farm-inputs-marketplace" element={<FarmInputsMarketplace />} />
          <Route path="/labor-booking" element={<LaborBooking />} />
          <Route path="/transport-booking" element={<TransportBooking />} />
          <Route path="/drone-services" element={<DroneServices />} />
          <Route path="/equipment-rental" element={<EquipmentRental />} />
          {/* Auth routes redirect to dashboard since no login required */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
