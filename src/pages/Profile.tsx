import { User, MapPin, Phone, Settings, HelpCircle, LogOut } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const menuItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Help & Support", path: "/help" },
    { icon: LogOut, label: "Logout", path: "/logout", variant: "destructive" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  RF
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">Raju Farmer</h2>
                <p className="text-sm text-muted-foreground">Farmer ID: RF12345</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Guntur, Andhra Pradesh</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">Contact Information</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">+91 98765 43210</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farm Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-primary">5</p>
              <p className="text-xs text-muted-foreground mt-1">Fields</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground mt-1">Reports</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-primary">3</p>
              <p className="text-xs text-muted-foreground mt-1">Sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      item.variant === "destructive"
                        ? "bg-destructive/10"
                        : "bg-primary/10"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        item.variant === "destructive"
                          ? "text-destructive"
                          : "text-primary"
                      }`}
                    />
                  </div>
                  <span
                    className={`font-medium ${
                      item.variant === "destructive"
                        ? "text-destructive"
                        : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <span className="text-muted-foreground">›</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Version Info */}
        <p className="text-center text-xs text-muted-foreground">
          AI Rythu Mitra v1.0.0
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
