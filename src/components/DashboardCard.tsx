import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  subtitle?: string;
  status?: "success" | "warning" | "danger" | "neutral";
  onClick?: () => void;
}

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  status = "neutral",
  onClick,
}: DashboardCardProps) => {
  const statusColors = {
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
    neutral: "text-primary",
  };

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-lg cursor-pointer animate-slide-up",
        onClick && "active:scale-95"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn("w-5 h-5", statusColors[status])} />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", statusColors[status])}>
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
