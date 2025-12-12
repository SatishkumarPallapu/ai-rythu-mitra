import AIBasedSeedRecommendation from "@/components/ai/AIBasedSeedRecommendation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const SeedRecommendations = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-20">
        <AIBasedSeedRecommendation />
      </main>
      <BottomNav />
    </div>
  );
};

export default SeedRecommendations;