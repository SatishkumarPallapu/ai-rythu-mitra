import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/soil" element={<ProtectedRoute><SoilAnalysis /></ProtectedRoute>} />
          <Route path="/moisture" element={<ProtectedRoute><MoistureMonitor /></ProtectedRoute>} />
          <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/crop-health" element={<ProtectedRoute><CropHealth /></ProtectedRoute>} />
          <Route path="/crop-recommendations" element={<ProtectedRoute><CropRecommendations /></ProtectedRoute>} />
          <Route path="/crop-roadmap/:cropId" element={<ProtectedRoute><CropRoadmap /></ProtectedRoute>} />
          <Route path="/voice-assistant" element={<ProtectedRoute><VoiceAssistant /></ProtectedRoute>} />
          <Route path="/multi-crop-planner" element={<ProtectedRoute><MultiCropPlanner /></ProtectedRoute>} />
          <Route path="/multi-crop-strategy/:id" element={<ProtectedRoute><MultiCropStrategy /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
