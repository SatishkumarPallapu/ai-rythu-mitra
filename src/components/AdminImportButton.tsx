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
      const { data, error } = await supabase.functions.invoke('import-crops-data');
      
      if (error) throw error;

      console.log('Import result:', data);
      
      toast({
        title: "Import Successful!",
        description: `Imported ${data.imported.crops} crops successfully`,
      });
      setImported(true);
      
      // Reload the page after 2 seconds to show new data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import crops data",
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
          Import 1000+ Crops
        </>
      )}
    </Button>
  );
};
