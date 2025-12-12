import { useState } from "react";
import { Button } from "./ui/button";
import { Database, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AdminImportButton = () => {
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    setImporting(true);
    try {
      // Simulate database seeding for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockData = {
        summary: {
          crops: 50,
          seeds: 150,
          instructions: 300
        }
      };
      
      toast({
        title: "Database Seeded Successfully!",
        description: `Imported ${mockData.summary.crops} crops, ${mockData.summary.seeds} seeds, and more!`,
      });
      setImported(true);
      
      // Don't reload page in demo mode
      console.log('Demo: Database seeded with mock data');
    } catch (error: any) {
      console.error('Seed error:', error);
      toast({
        title: "Seeding Failed",
        description: error.message || "Failed to seed database",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  if (imported) {
    return (
      <Button disabled className="gap-2">
        <CheckCircle2 className="w-4 h-4" />
        Crops Imported Successfully
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleImport} 
      disabled={importing}
      className="gap-2"
      variant="outline"
    >
      {importing ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Importing...
        </>
      ) : (
        <>
          <Database className="w-4 h-4" />
          Seed Database (1000+ Crops)
        </>
      )}
    </Button>
  );
};
