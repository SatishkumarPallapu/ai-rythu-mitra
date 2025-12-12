import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Sprout,
  Leaf,
  Flower,
  Package,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit
} from "lucide-react";

interface CropPlan {
  id: string;
  cropName: string;
  startDate: Date;
  harvestDate: Date;
  status: 'pending' | 'active' | 'ready' | 'harvested';
  tasks: Task[];
  progress: number;
  emoji: string;
}

interface Task {
  id: string;
  date: Date;
  title: string;
  description: string;
  completed: boolean;
  category: 'sowing' | 'maintenance' | 'pest-control' | 'fertilize' | 'water' | 'harvest';
}

const HarvestingCalendar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [cropPlans, setCropPlans] = useState<CropPlan[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [selectedCropForTask, setSelectedCropForTask] = useState("");

  useEffect(() => {
    // Initialize with mock crop plans
    initializeMockCrops();
  }, []);

  const initializeMockCrops = () => {
    const today = new Date();
    const mockPlans: CropPlan[] = [
      {
        id: '1',
        cropName: 'Tomato',
        startDate: new Date(today.getFullYear(), today.getMonth() - 2, 15),
        harvestDate: new Date(today.getFullYear(), today.getMonth() + 1, 15),
        status: 'active',
        progress: 65,
        emoji: '🍅',
        tasks: [
          { id: '1', date: new Date(today.getFullYear(), today.getMonth() - 2, 15), title: 'Seed Sowing', description: 'Sow seeds in nursery', completed: true, category: 'sowing' },
          { id: '2', date: new Date(today.getFullYear(), today.getMonth() - 1, 1), title: 'Transplanting', description: 'Move seedlings to main field', completed: true, category: 'maintenance' },
          { id: '3', date: new Date(today.getFullYear(), today.getMonth() - 1, 15), title: 'First Fertilizer', description: 'Apply NPK 20:20:20', completed: true, category: 'fertilize' },
          { id: '4', date: new Date(today.getFullYear(), today.getMonth(), 1), title: 'Pest Monitoring', description: 'Check for early blight', completed: true, category: 'pest-control' },
          { id: '5', date: new Date(today.getFullYear(), today.getMonth(), 10), title: 'Flowering Stage', description: 'Support flowering with potassium', completed: false, category: 'fertilize' },
          { id: '6', date: new Date(today.getFullYear(), today.getMonth() + 1, 15), title: 'Harvesting Ready', description: 'Fruits ripen, ready for picking', completed: false, category: 'harvest' }
        ]
      },
      {
        id: '2',
        cropName: 'Onion',
        startDate: new Date(today.getFullYear(), today.getMonth() - 4, 1),
        harvestDate: new Date(today.getFullYear(), today.getMonth() + 2, 1),
        status: 'active',
        progress: 45,
        emoji: '🧅',
        tasks: [
          { id: '1', date: new Date(today.getFullYear(), today.getMonth() - 4, 1), title: 'Seed Sowing', description: 'Sow onion seeds', completed: true, category: 'sowing' },
          { id: '2', date: new Date(today.getFullYear(), today.getMonth() - 2, 15), title: 'Thinning', description: 'Remove extra seedlings', completed: true, category: 'maintenance' },
          { id: '3', date: new Date(today.getFullYear(), today.getMonth(), 5), title: 'Bulb Formation', description: 'Apply potassium fertilizer', completed: false, category: 'fertilize' },
          { id: '4', date: new Date(today.getFullYear(), today.getMonth() + 2, 1), title: 'Ready for Harvest', description: 'Top dry, bulbs mature', completed: false, category: 'harvest' }
        ]
      },
      {
        id: '3',
        cropName: 'Paddy',
        startDate: new Date(today.getFullYear(), today.getMonth() - 3, 1),
        harvestDate: new Date(today.getFullYear(), today.getMonth() + 1, 20),
        status: 'active',
        progress: 70,
        emoji: '🌾',
        tasks: [
          { id: '1', date: new Date(today.getFullYear(), today.getMonth() - 3, 1), title: 'Land Preparation', description: 'Plough and level field', completed: true, category: 'maintenance' },
          { id: '2', date: new Date(today.getFullYear(), today.getMonth() - 2, 10), title: 'Transplanting', description: 'Move seedlings (30-40 days old)', completed: true, category: 'sowing' },
          { id: '3', date: new Date(today.getFullYear(), today.getMonth() - 1, 5), title: 'Panicle Initiation', description: 'Monitor water level', completed: true, category: 'water' },
          { id: '4', date: new Date(today.getFullYear(), today.getMonth(), 15), title: 'Disease Monitoring', description: 'Check for blast disease', completed: false, category: 'pest-control' },
          { id: '5', date: new Date(today.getFullYear(), today.getMonth() + 1, 20), title: 'Ready for Harvest', description: 'Grain maturity 80%+', completed: false, category: 'harvest' }
        ]
      }
    ];

    setCropPlans(mockPlans);
  };

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const tasksByDate = cropPlans.flatMap(plan =>
    plan.tasks.map(task => ({ ...task, cropName: plan.cropName, emoji: plan.emoji }))
  );

  const getTasksForDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return tasksByDate.filter(
      task => task.date.getDate() === day && 
               task.date.getMonth() === currentMonth.getMonth() &&
               task.date.getFullYear() === currentMonth.getFullYear()
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'ready': return 'bg-yellow-500';
      case 'harvested': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTaskIcon = (category: string) => {
    switch (category) {
      case 'sowing': return <Sprout className="w-4 h-4" />;
      case 'maintenance': return <Leaf className="w-4 h-4" />;
      case 'pest-control': return <AlertCircle className="w-4 h-4" />;
      case 'fertilize': return <Flower className="w-4 h-4" />;
      case 'water': return <Clock className="w-4 h-4" />;
      case 'harvest': return <Package className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const addTask = () => {
    if (!newTaskTitle || !selectedCropForTask || !selectedDate) {
      toast({
        title: "Missing information",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    setCropPlans(cropPlans.map(plan => {
      if (plan.cropName === selectedCropForTask) {
        return {
          ...plan,
          tasks: [...plan.tasks, {
            id: Date.now().toString(),
            date: selectedDate,
            title: newTaskTitle,
            description: newTaskDesc,
            completed: false,
            category: 'maintenance'
          }]
        };
      }
      return plan;
    }));

    setNewTaskTitle("");
    setNewTaskDesc("");
    setSelectedCropForTask("");
    toast({
      title: "Task added",
      description: `${newTaskTitle} scheduled for ${selectedDate.toDateString()}`
    });
  };

  const toggleTaskComplete = (planId: string, taskId: string) => {
    setCropPlans(cropPlans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          tasks: plan.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return plan;
    }));
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="bg-gray-50"></div>);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const tasks = getTasksForDate(day);
      const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();

      days.push(
        <div
          key={day}
          className={`min-h-24 p-2 border rounded-lg cursor-pointer hover:shadow-md transition ${
            isToday ? 'bg-primary/10 border-primary' : 'bg-white'
          }`}
          onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
        >
          <p className={`text-sm font-bold ${isToday ? 'text-primary' : ''}`}>{day}</p>
          <div className="space-y-1 mt-1">
            {tasks.slice(0, 2).map(task => (
              <div
                key={task.id}
                className={`text-xs p-1 rounded flex items-center gap-1 ${
                  task.completed ? 'bg-success/20 line-through' : 'bg-primary/20'
                }`}
              >
                {task.emoji}
                <span className="line-clamp-1">{task.title}</span>
              </div>
            ))}
            {tasks.length > 2 && <p className="text-xs text-muted-foreground">+{tasks.length - 2} more</p>}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Calendar className="w-8 h-8 text-primary" />
              Harvesting Calendar
            </h1>
            <p className="text-muted-foreground mt-2">Track crop progress and daily tasks</p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        </div>

        {/* Active Crops Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cropPlans.map(plan => (
            <Card key={plan.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl">{plan.emoji}</span>
                    {plan.cropName}
                  </CardTitle>
                  <Badge className={getStatusBadgeClass(plan.status)}>
                    {plan.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{plan.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{width: `${plan.progress}%`}}
                    ></div>
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground">
                    Started: {plan.startDate.toLocaleDateString()}
                  </p>
                  <p className="text-muted-foreground">
                    Ready: {plan.harvestDate.toLocaleDateString()}
                  </p>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    Upcoming Tasks: {plan.tasks.filter(t => !t.completed).length}
                  </p>
                  <div className="space-y-1">
                    {plan.tasks.filter(t => !t.completed).slice(0, 2).map(task => (
                      <div key={task.id} className="text-xs p-1 bg-primary/10 rounded flex items-center gap-1">
                        {getTaskIcon(task.category)}
                        <span>{task.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </CardTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendarDays()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Task Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Schedule a task for your crops</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Crop</label>
                <select
                  value={selectedCropForTask}
                  onChange={(e) => setSelectedCropForTask(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                >
                  <option value="">Choose crop...</option>
                  {cropPlans.map(plan => (
                    <option key={plan.id} value={plan.cropName}>{plan.emoji} {plan.cropName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Apply Fertilizer"
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Add details..."
                  className="w-full mt-1 px-3 py-2 border rounded-lg h-20"
                />
              </div>
              <Button onClick={addTask} className="w-full">Add Task</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Daily Tasks */}
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle>Tasks for {selectedDate.toDateString()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getTasksForDate(selectedDate.getDate()).length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No tasks scheduled for this date</p>
              ) : (
                getTasksForDate(selectedDate.getDate()).map(task => (
                  <Card key={task.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded">
                          {getTaskIcon(task.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{task.emoji}</span>
                            <div>
                              <p className={`font-semibold ${task.completed ? 'line-through' : ''}`}>
                                {task.title}
                              </p>
                              <p className="text-sm text-muted-foreground">{task.cropName}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{task.description}</p>
                        </div>
                      </div>
                      <Button
                        variant={task.completed ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleTaskComplete(
                          cropPlans.find(p => p.cropName === task.cropName)?.id || '',
                          task.id
                        )}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${task.completed ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default HarvestingCalendar;
