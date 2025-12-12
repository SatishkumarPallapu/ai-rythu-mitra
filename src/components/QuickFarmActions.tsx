import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Droplets, Package, Users, Truck, Plane, Wrench, 
  TrendingUp, Brain, Sparkles, Target 
} from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
  description: string;
  color: string;
}

const QuickFarmActions = () => {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    {
      id: 'irrigation',
      label: 'Start Irrigation',
      icon: <Droplets className="w-5 h-5" />,
      route: '/moisture',
      description: 'Monitor and control irrigation',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'order-inputs',
      label: 'Order Inputs',
      icon: <Package className="w-5 h-5" />,
      route: '/farm-inputs-marketplace',
      description: 'Seeds, fertilizers, tools',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'book-labor',
      label: 'Book Labor',
      icon: <Users className="w-5 h-5" />,
      route: '/labor-booking',
      description: 'Skilled farm workers',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'arrange-transport',
      label: 'Arrange Transport',
      icon: <Truck className="w-5 h-5" />,
      route: '/transport-booking',
      description: 'Vehicles for crops & equipment',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      id: 'drone-service',
      label: 'Drone Analysis',
      icon: <Plane className="w-5 h-5" />,
      route: '/drone-services',
      description: 'AI crop monitoring',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      id: 'rent-equipment',
      label: 'Rent Equipment',
      icon: <Wrench className="w-5 h-5" />,
      route: '/equipment-rental',
      description: 'Tractors, harvesters, tools',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      id: 'ai-recommendations',
      label: 'AI Crop Guide',
      icon: <Brain className="w-5 h-5" />,
      route: '/crop-recommendations',
      description: 'Smart crop selection',
      color: 'bg-cyan-500 hover:bg-cyan-600'
    },
    {
      id: 'profit-analysis',
      label: 'Profit Analysis',
      icon: <TrendingUp className="w-5 h-5" />,
      route: '/price-analysis',
      description: 'Market prices & trends',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          🚀 Quick Farm Actions
          <Sparkles className="w-4 h-4 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action) => (
            <Button
              key={action.id}
              onClick={() => navigate(action.route)}
              variant="outline"
              className={`h-auto p-4 flex flex-col items-center gap-2 text-white ${action.color} border-none hover:scale-105 transition-all duration-200`}
            >
              {action.icon}
              <div className="text-center">
                <div className="font-medium text-sm">{action.label}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded border border-blue-200">
          <p className="text-sm text-blue-700 text-center">
            <strong>💡 Smart Tip:</strong> Use these quick actions for daily farm management. 
            Each service is connected to help maximize your profits through smart farming! 🌾
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickFarmActions;