import AIStrategicCropAdvisor from "@/components/ai/AIStrategicCropAdvisor";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const StrategicCropPlanner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-20">
        <AIStrategicCropAdvisor />
      </main>
      <BottomNav />
    </div>
  );
};

export default StrategicCropPlanner;