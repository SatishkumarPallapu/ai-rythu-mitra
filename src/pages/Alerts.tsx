import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import AlertsSystem from "@/components/AlertsSystem";

const Alerts = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Alerts & Notifications</h2>
          <p className="text-muted-foreground">
            Manage your WhatsApp alerts, voice notifications, and daily reports
          </p>
        </div>

        <AlertsSystem />
      </main>

      <BottomNav />
    </div>
  );
};

export default Alerts;