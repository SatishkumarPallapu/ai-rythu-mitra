import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { 
  Wrench, Calendar as CalendarIcon, MapPin, Star, Phone, Clock,
  CheckCircle2, AlertTriangle, DollarSign, Settings, Fuel, Shield,
  Filter, Search, Truck, Zap, MessageCircle, Tool
} from "lucide-react";
import { format } from "date-fns";

interface EquipmentRental {
  id: string;
  ownerName: string;
  equipmentType: 'tractor' | 'harvester' | 'plough' | 'seeder' | 'sprayer' | 'cultivator' | 'thresher' | 'pump';
  model: string;
  description: string;
  ratePerDay: number;
  ratePerHour: number;
  ratePerWeek: number;
  rating: number;
  totalHours: number;
  location: string;
  phone: string;
  features: string[];
  available: boolean;
  fuelIncluded: boolean;
  operatorIncluded: boolean;
  deliveryAvailable: boolean;
  maintenanceStatus: 'excellent' | 'good' | 'fair';
  image: string;
}

interface RentalRequest {
  equipmentId: string;
  rentalDate: Date | undefined;
  rentalTime: string;
  duration: number;
  durationType: 'hours' | 'days' | 'weeks';
  workLocation: string;
  workType: string;
  needOperator: boolean;
  needDelivery: boolean;
  specialRequirements: string;
  contactPhone: string;
  totalCost: number;
  securityDeposit: number;
}

const EquipmentRental = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<EquipmentRental[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRentalForm, setShowRentalForm] = useState<string | null>(null);
  const [rentalData, setRentalData] = useState<RentalRequest>({
    equipmentId: '',
    rentalDate: undefined,
    rentalTime: '08:00',
    duration: 1,
    durationType: 'days',
    workLocation: '',
    workType: '',
    needOperator: false,
    needDelivery: false,
    specialRequirements: '',
    contactPhone: '',
    totalCost: 0,
    securityDeposit: 0
  });

  useEffect(() => {
    generateEquipmentRentals();
  }, []);

  useEffect(() => {
    if (showRentalForm) {
      const item = equipment.find(e => e.id === showRentalForm);
      if (item) {
        let baseCost = 0;
        switch (rentalData.durationType) {
          case 'hours':
            baseCost = item.ratePerHour * rentalData.duration;
            break;
          case 'days':
            baseCost = item.ratePerDay * rentalData.duration;
            break;
          case 'weeks':
            baseCost = item.ratePerWeek * rentalData.duration;
            break;
        }
        
        const operatorCost = rentalData.needOperator ? (rentalData.durationType === 'hours' ? 150 : 1200) * rentalData.duration : 0;
        const deliveryCost = rentalData.needDelivery ? 800 : 0;
        const totalCost = baseCost + operatorCost + deliveryCost;
        const deposit = Math.round(totalCost * 0.2); // 20% security deposit
        
        setRentalData(prev => ({ 
          ...prev, 
          totalCost,
          securityDeposit: deposit
        }));
      }
    }
  }, [rentalData.duration, rentalData.durationType, rentalData.needOperator, rentalData.needDelivery, showRentalForm, equipment]);

  const generateEquipmentRentals = () => {
    const equipmentRentals: EquipmentRental[] = [
      {
        id: 'tractor-mahindra-585',
        ownerName: 'Reddy Farm Equipment',
        equipmentType: 'tractor',
        model: 'Mahindra 585 DI',
        description: '50 HP tractor suitable for plowing, cultivation, and transport',
        ratePerDay: 2800,
        ratePerHour: 400,
        ratePerWeek: 18000,
        rating: 4.8,
        totalHours: 1250,
        location: 'Kamareddy',
        phone: '+91 98765 43240',
        features: ['50 HP Engine', 'Power Steering', 'Dual Clutch', 'PTO'],
        available: true,
        fuelIncluded: false,
        operatorIncluded: false,
        deliveryAvailable: true,
        maintenanceStatus: 'excellent',
        image: '🚜'
      },
      {
        id: 'harvester-john-deere',
        ownerName: 'Modern Agri Solutions',
        equipmentType: 'harvester',
        model: 'John Deere W70',
        description: 'Combine harvester for wheat, rice, and other cereals',
        ratePerDay: 12000,
        ratePerHour: 1800,
        ratePerWeek: 75000,
        rating: 4.9,
        totalHours: 890,
        location: 'Nizamabad',
        phone: '+91 98765 43241',
        features: ['Grain Tank 4200L', 'Auto Guidance', 'Threshing System', 'Cleaning System'],
        available: true,
        fuelIncluded: true,
        operatorIncluded: true,
        deliveryAvailable: true,
        maintenanceStatus: 'excellent',
        image: '🌾'
      },
      {
        id: 'cultivator-lemken',
        ownerName: 'Prime Equipment Rental',
        equipmentType: 'cultivator',
        model: 'Lemken Karat 9',
        description: 'Heavy-duty cultivator for primary and secondary tillage',
        ratePerDay: 3500,
        ratePerHour: 500,
        ratePerWeek: 22000,
        rating: 4.7,
        totalHours: 670,
        location: 'Karimnagar',
        phone: '+91 98765 43242',
        features: ['9 Tines', 'Adjustable Depth', 'Roller Attachment', 'Heavy Frame'],
        available: false,
        fuelIncluded: false,
        operatorIncluded: false,
        deliveryAvailable: false,
        maintenanceStatus: 'good',
        image: '⚙️'
      },
      {
        id: 'sprayer-fieldking',
        ownerName: 'AgriSpray Equipment',
        equipmentType: 'sprayer',
        model: 'FieldKing Boom Sprayer',
        description: 'High-capacity sprayer for pesticides and fertilizers',
        ratePerDay: 1800,
        ratePerHour: 250,
        ratePerWeek: 11000,
        rating: 4.6,
        totalHours: 450,
        location: 'Warangal',
        phone: '+91 98765 43243',
        features: ['600L Tank', '12m Boom', 'Pressure Control', 'Nozzle System'],
        available: true,
        fuelIncluded: false,
        operatorIncluded: false,
        deliveryAvailable: true,
        maintenanceStatus: 'good',
        image: '💧'
      },
      {
        id: 'seeder-john-deere',
        ownerName: 'Precision Agri Tools',
        equipmentType: 'seeder',
        model: 'John Deere 1760NT',
        description: 'No-till planter for precise seed placement',
        ratePerDay: 4200,
        ratePerHour: 600,
        ratePerWeek: 26000,
        rating: 4.8,
        totalHours: 320,
        location: 'Medak',
        phone: '+91 98765 43244',
        features: ['No-Till Technology', 'Seed Monitoring', 'Variable Rate', 'GPS Ready'],
        available: true,
        fuelIncluded: false,
        operatorIncluded: true,
        deliveryAvailable: true,
        maintenanceStatus: 'excellent',
        image: '🌱'
      },
      {
        id: 'thresher-mahindra',
        ownerName: 'Village Equipment Co-op',
        equipmentType: 'thresher',
        model: 'Mahindra Multi Crop Thresher',
        description: 'Multi-crop thresher for wheat, paddy, and other crops',
        ratePerDay: 2200,
        ratePerHour: 320,
        ratePerWeek: 14000,
        rating: 4.5,
        totalHours: 1100,
        location: 'Kamareddy',
        phone: '+91 98765 43245',
        features: ['Multi Crop', 'Easy Operation', 'Low Maintenance', 'High Capacity'],
        available: true,
        fuelIncluded: false,
        operatorIncluded: false,
        deliveryAvailable: false,
        maintenanceStatus: 'fair',
        image: '🌾'
      },
      {
        id: 'pump-kirloskar',
        ownerName: 'Irrigation Equipment Hub',
        equipmentType: 'pump',
        model: 'Kirloskar Diesel Pumpset',
        description: 'High-capacity diesel pump for irrigation',
        ratePerDay: 1500,
        ratePerHour: 200,
        ratePerWeek: 9500,
        rating: 4.7,
        totalHours: 2400,
        location: 'Nizamabad',
        phone: '+91 98765 43246',
        features: ['20 HP Engine', 'Self Priming', 'Fuel Efficient', 'Low Noise'],
        available: true,
        fuelIncluded: true,
        operatorIncluded: false,
        deliveryAvailable: true,
        maintenanceStatus: 'good',
        image: '💧'
      },
      {
        id: 'plough-massey',
        ownerName: 'Traditional Implements',
        equipmentType: 'plough',
        model: 'Massey Ferguson Disc Plough',
        description: 'Heavy-duty disc plough for primary tillage',
        ratePerDay: 1200,
        ratePerHour: 180,
        ratePerWeek: 7500,
        rating: 4.4,
        totalHours: 1800,
        location: 'Medak',
        phone: '+91 98765 43247',
        features: ['5 Disc', 'Adjustable Angle', 'Sturdy Frame', 'Easy Maintenance'],
        available: true,
        fuelIncluded: false,
        operatorIncluded: false,
        deliveryAvailable: false,
        maintenanceStatus: 'good',
        image: '🔧'
      }
    ];
    setEquipment(equipmentRentals);
  };

  const equipmentTypes = [
    { id: 'all', name: 'All Equipment', icon: '🚜', count: equipment.length },
    { id: 'tractor', name: 'Tractors', icon: '🚜', count: equipment.filter(e => e.equipmentType === 'tractor').length },
    { id: 'harvester', name: 'Harvesters', icon: '🌾', count: equipment.filter(e => e.equipmentType === 'harvester').length },
    { id: 'plough', name: 'Ploughs', icon: '🔧', count: equipment.filter(e => e.equipmentType === 'plough').length },
    { id: 'seeder', name: 'Seeders', icon: '🌱', count: equipment.filter(e => e.equipmentType === 'seeder').length },
    { id: 'sprayer', name: 'Sprayers', icon: '💧', count: equipment.filter(e => e.equipmentType === 'sprayer').length },
    { id: 'other', name: 'Others', icon: '⚙️', count: equipment.filter(e => !['tractor', 'harvester', 'plough', 'seeder', 'sprayer'].includes(e.equipmentType)).length }
  ];

  const filteredEquipment = equipment.filter(item => {
    const matchesType = selectedType === 'all' || 
      (selectedType === 'other' ? !['tractor', 'harvester', 'plough', 'seeder', 'sprayer'].includes(item.equipmentType) : item.equipmentType === selectedType);
    const matchesSearch = item.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleRentEquipment = (equipmentId: string) => {
    setShowRentalForm(equipmentId);
    setRentalData(prev => ({ ...prev, equipmentId }));
  };

  const submitRental = async () => {
    if (!rentalData.rentalDate || !rentalData.workLocation || !rentalData.workType || !rentalData.contactPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const item = equipment.find(e => e.id === rentalData.equipmentId);
      
      toast({
        title: "Equipment Rental Confirmed! 🚜",
        description: `${item?.ownerName} will contact you to arrange pickup/delivery and equipment briefing.`
      });
      
      setShowRentalForm(null);
      setRentalData({
        equipmentId: '',
        rentalDate: undefined,
        rentalTime: '08:00',
        duration: 1,
        durationType: 'days',
        workLocation: '',
        workType: '',
        needOperator: false,
        needDelivery: false,
        specialRequirements: '',
        contactPhone: '',
        totalCost: 0,
        securityDeposit: 0
      });
      
    } catch (error) {
      toast({
        title: "Rental Failed",
        description: "Unable to confirm equipment rental. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getMaintenanceColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wrench className="w-7 h-7 text-blue-600" />
            🚜 Equipment Rental
          </h2>
          <p className="text-muted-foreground">
            Rent farm machinery and equipment for your agricultural operations
          </p>
        </div>

        {/* Search & Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search equipment or owners..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Equipment Type" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{equipment.filter(e => e.available).length}</div>
              <p className="text-sm text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {equipment.filter(e => e.deliveryAvailable).length}
              </div>
              <p className="text-sm text-muted-foreground">Delivery Available</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                ₹{Math.round(equipment.reduce((sum, e) => sum + e.ratePerDay, 0) / equipment.length)}
              </div>
              <p className="text-sm text-muted-foreground">Avg. Per Day</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {equipment.filter(e => e.operatorIncluded).length}
              </div>
              <p className="text-sm text-muted-foreground">With Operator</p>
            </CardContent>
          </Card>
        </div>

        {/* Equipment List */}
        <div className="space-y-4">
          {filteredEquipment.map(item => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.image}</span>
                      <div>
                        <h3 className="text-xl font-bold">{item.ownerName}</h3>
                        <p className="text-sm text-muted-foreground">{item.model}</p>
                      </div>
                      <Badge className={getMaintenanceColor(item.maintenanceStatus)}>
                        {item.maintenanceStatus.charAt(0).toUpperCase() + item.maintenanceStatus.slice(1)}
                      </Badge>
                      {item.fuelIncluded && (
                        <Badge className="bg-green-100 text-green-800">Fuel Included</Badge>
                      )}
                      {item.operatorIncluded && (
                        <Badge className="bg-blue-100 text-blue-800">With Operator</Badge>
                      )}
                      {!item.available && (
                        <Badge variant="destructive">Rented</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{item.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{item.totalHours}h total</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                      {item.deliveryAvailable && (
                        <div className="flex items-center gap-1">
                          <Truck className="w-4 h-4 text-green-600" />
                          <span>Delivery</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">₹{item.ratePerDay}</div>
                    <div className="text-sm text-muted-foreground">per day</div>
                    <div className="text-sm text-blue-600">₹{item.ratePerHour}/hr</div>
                    <div className="text-sm text-purple-600">₹{item.ratePerWeek}/week</div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{item.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleRentEquipment(item.id)}
                    disabled={!item.available}
                    className="flex-1"
                  >
                    {item.available ? (
                      <>
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Rent Equipment
                      </>
                    ) : (
                      'Currently Rented'
                    )}
                  </Button>
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <Card className="text-center p-8">
            <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Equipment Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or equipment type filters</p>
          </Card>
        )}

        {/* Rental Form Modal */}
        {showRentalForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>🚜 Rent Equipment</span>
                  <Button variant="ghost" onClick={() => setShowRentalForm(null)}>×</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const item = equipment.find(e => e.id === showRentalForm);
                  if (!item) return null;
                  
                  return (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{item.image}</span>
                          <div>
                            <h3 className="font-semibold">{item.ownerName}</h3>
                            <p className="text-sm text-muted-foreground">{item.model}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>Per Hour: ₹{item.ratePerHour}</div>
                          <div>Per Day: ₹{item.ratePerDay}</div>
                          <div>Per Week: ₹{item.ratePerWeek}</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Rental Date *</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {rentalData.rentalDate ? format(rentalData.rentalDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={rentalData.rentalDate}
                                onSelect={(date) => setRentalData(prev => ({ ...prev, rentalDate: date }))}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Start Time *</label>
                          <Select 
                            value={rentalData.rentalTime} 
                            onValueChange={(value) => setRentalData(prev => ({ ...prev, rentalTime: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {['06:00', '07:00', '08:00', '09:00', '10:00', '14:00', '15:00', '16:00'].map(time => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Duration Type *</label>
                          <Select 
                            value={rentalData.durationType} 
                            onValueChange={(value: 'hours' | 'days' | 'weeks') => setRentalData(prev => ({ ...prev, durationType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                              <SelectItem value="weeks">Weeks</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            Duration ({rentalData.durationType}) *
                          </label>
                          <Input
                            type="number"
                            min="1"
                            max={rentalData.durationType === 'hours' ? 12 : rentalData.durationType === 'days' ? 30 : 4}
                            value={rentalData.duration}
                            onChange={(e) => setRentalData(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Work Location *</label>
                          <Input
                            placeholder="Enter work site address"
                            value={rentalData.workLocation}
                            onChange={(e) => setRentalData(prev => ({ ...prev, workLocation: e.target.value }))}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Work Type *</label>
                          <Select 
                            value={rentalData.workType} 
                            onValueChange={(value) => setRentalData(prev => ({ ...prev, workType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select work type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ploughing">Field Ploughing</SelectItem>
                              <SelectItem value="cultivation">Land Cultivation</SelectItem>
                              <SelectItem value="sowing">Seed Sowing</SelectItem>
                              <SelectItem value="harvesting">Crop Harvesting</SelectItem>
                              <SelectItem value="spraying">Pesticide Spraying</SelectItem>
                              <SelectItem value="irrigation">Irrigation Work</SelectItem>
                              <SelectItem value="transport">Material Transport</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {!item.operatorIncluded && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="needOperator"
                              checked={rentalData.needOperator}
                              onChange={(e) => setRentalData(prev => ({ ...prev, needOperator: e.target.checked }))}
                              className="rounded"
                            />
                            <label htmlFor="needOperator" className="text-sm">
                              Need Operator (+₹{rentalData.durationType === 'hours' ? '150/hr' : '1200/day'})
                            </label>
                          </div>
                        )}

                        {item.deliveryAvailable && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="needDelivery"
                              checked={rentalData.needDelivery}
                              onChange={(e) => setRentalData(prev => ({ ...prev, needDelivery: e.target.checked }))}
                              className="rounded"
                            />
                            <label htmlFor="needDelivery" className="text-sm">
                              Need Delivery & Pickup (+₹800)
                            </label>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium">Special Requirements</label>
                        <Textarea
                          placeholder="Any special requirements, operating conditions, or instructions..."
                          value={rentalData.specialRequirements}
                          onChange={(e) => setRentalData(prev => ({ ...prev, specialRequirements: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Contact Phone *</label>
                        <Input
                          placeholder="+91 98765 43210"
                          value={rentalData.contactPhone}
                          onChange={(e) => setRentalData(prev => ({ ...prev, contactPhone: e.target.value }))}
                        />
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Rental Cost:</span>
                            <span className="text-xl font-bold text-blue-600">
                              ₹{rentalData.totalCost.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Security Deposit:</span>
                            <span className="text-lg font-semibold text-orange-600">
                              ₹{rentalData.securityDeposit.toLocaleString()}
                            </span>
                          </div>
                          <hr className="border-blue-200" />
                          <div className="flex justify-between items-center">
                            <span className="font-bold">Total Amount:</span>
                            <span className="text-2xl font-bold text-green-600">
                              ₹{(rentalData.totalCost + rentalData.securityDeposit).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-blue-700 mt-2">
                          Security deposit will be refunded after equipment return in good condition
                        </p>
                        {!item.fuelIncluded && (
                          <p className="text-xs text-orange-600 mt-1">⚠️ Fuel charges extra</p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setShowRentalForm(null)} className="flex-1">
                          Cancel
                        </Button>
                        <Button onClick={submitRental} className="flex-1">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Confirm Rental
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default EquipmentRental;