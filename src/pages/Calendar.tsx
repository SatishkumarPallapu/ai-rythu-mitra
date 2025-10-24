import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Calendar = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: plansData, error: plansError } = await supabase
        .from('crop_plans')
        .select(`
          *,
          crop_roadmap_tasks(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (plansError) throw plansError;

      const allTasks: any[] = [];
      plansData?.forEach(plan => {
        plan.crop_roadmap_tasks?.forEach((task: any) => {
          const taskDate = new Date(plan.start_date);
          taskDate.setDate(taskDate.getDate() + task.day_number);
          
          allTasks.push({
            ...task,
            plan_id: plan.id,
            due_date: taskDate,
            crop_id: plan.crop_id
          });
        });
      });

      setTasks(allTasks.sort((a, b) => 
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      ));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error loading tasks",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('crop_roadmap_tasks')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, is_completed: true, completed_at: new Date().toISOString() }
          : task
      ));

      toast({
        title: "Task completed!",
        description: "Great work on your cultivation journey"
      });
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error updating task",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const tasks = [
    {
      id: 1,
      title: "Apply Fertilizer",
      crop: "Tomato",
      date: "2025-10-24",
      status: "pending",
      type: "fertilization"
    },
    {
      id: 2,
      title: "Pest Inspection",
      crop: "Cotton",
      date: "2025-10-25",
      status: "pending",
      type: "inspection"
    },
    {
      id: 3,
      title: "Irrigation",
      crop: "Paddy",
      date: "2025-10-23",
      status: "completed",
      type: "irrigation"
    },
    {
      id: 4,
      title: "Harvest Ready",
      crop: "Okra",
      date: "2025-10-28",
      status: "upcoming",
      type: "harvest"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'upcoming':
        return <AlertCircle className="w-5 h-5 text-primary" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      pending: "secondary",
      upcoming: "outline"
    };
    return variants[status] || "default";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-primary" />
            Crop Calendar
          </h2>
          <p className="text-muted-foreground">
            Track your farming activities and upcoming tasks
          </p>
        </div>

        <Card className="p-4">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        </Card>

        <div className="space-y-4">
          <h3 className="font-semibold">Upcoming Tasks</h3>
          {tasks.map((task) => (
            <Card key={task.id} className="p-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(task.status)}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        🌾 {task.crop}
                      </p>
                    </div>
                    <Badge variant={getStatusBadge(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    📅 {new Date(task.date).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  {task.status === 'pending' && (
                    <Button size="sm" className="w-full">
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-gradient-subtle">
          <h3 className="font-semibold mb-3">Quick Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">12</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">3</div>
              <div className="text-xs text-muted-foreground">Overdue</div>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Calendar;
