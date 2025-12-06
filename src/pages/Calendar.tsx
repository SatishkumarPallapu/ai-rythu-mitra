import { useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock tasks for demo
  const tasks = [
    {
      id: '1',
      task_name: 'Prepare soil for sowing',
      task_description: 'Till the land and add organic compost',
      day_number: 1,
      due_date: new Date(),
      is_completed: false
    },
    {
      id: '2',
      task_name: 'Sow seeds',
      task_description: 'Plant seeds at proper spacing',
      day_number: 3,
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      is_completed: false
    }
  ];

  const [taskList, setTaskList] = useState(tasks);

  const handleCompleteTask = (taskId: string) => {
    setTaskList(taskList.map(task => 
      task.id === taskId 
        ? { ...task, is_completed: true }
        : task
    ));
  };

  const getTaskStatus = (task: any) => {
    if (task.is_completed) return 'completed';
    const today = new Date();
    const dueDate = new Date(task.due_date);
    const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'pending';
    return 'upcoming';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
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
      overdue: "destructive",
      upcoming: "outline"
    };
    return variants[status] || "default";
  };

  const taskStats = {
    pending: taskList.filter(t => getTaskStatus(t) === 'pending').length,
    completed: taskList.filter(t => t.is_completed).length,
    overdue: taskList.filter(t => getTaskStatus(t) === 'overdue').length
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
          {taskList.map((task) => {
            const status = getTaskStatus(task);
            return (
              <Card key={task.id} className="p-4">
                <div className="flex items-start gap-3">
                  {getStatusIcon(status)}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{task.task_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {task.task_description}
                        </p>
                      </div>
                      <Badge variant={getStatusBadge(status)}>
                        {status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      📅 Day {task.day_number} • {new Date(task.due_date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    {!task.is_completed && (
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-6 bg-gradient-subtle">
          <h3 className="font-semibold mb-3">Quick Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{taskStats.pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">{taskStats.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-destructive">{taskStats.overdue}</div>
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
