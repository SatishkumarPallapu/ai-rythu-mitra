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
  Users, Clock, MapPin, Star, Phone, Calendar as CalendarIcon,
  CheckCircle2, AlertCircle, DollarSign, Timer, Award,
  Filter, Search, Plus, ChevronRight, MessageCircle
} from "lucide-react";
import { format } from "date-fns";

interface LaborService {
  id: string;
  name: string;
  category: 'planting' | 'harvesting' | 'maintenance' | 'pest-control' | 'general';
  description: string;
  ratePerDay: number;
  ratePerHour: number;
  workersAvailable: number;
  rating: number;
  completedJobs: number;
  location: string;
  phone: string;
  specialties: string[];
  available: boolean;
  fastResponse: boolean;
}

interface BookingRequest {
  serviceId: string;
  date: Date | undefined;
  duration: number;
  durationType: 'hours' | 'days';
  workersNeeded: number;
  taskDescription: string;
  location: string;
  contactPhone: string;
  totalCost: number;
}

const LaborBooking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<LaborService[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingForm, setShowBookingForm] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingRequest>({
    serviceId: '',
    date: undefined,
    duration: 1,
    durationType: 'days',
    workersNeeded: 1,
    taskDescription: '',
    location: '',
    contactPhone: '',
    totalCost: 0
  });

  useEffect(() => {
    generateLaborServices();
  }, []);

  useEffect(() => {
    if (showBookingForm) {
      const service = services.find(s => s.id === showBookingForm);
      if (service) {
        const cost = bookingData.durationType === 'days' 
          ? service.ratePerDay * bookingData.duration * bookingData.workersNeeded
          : service.ratePerHour * bookingData.duration * bookingData.workersNeeded;
        setBookingData(prev => ({ ...prev, totalCost: cost }));
      }
    }
  }, [bookingData.duration, bookingData.durationType, bookingData.workersNeeded, showBookingForm, services]);

  const generateLaborServices = () => {
    const laborServices: LaborService[] = [
      {
        id: 'planting-team-1',
        name: 'Expert Planting Team',
        category: 'planting',
        description: 'Experienced team for seed sowing, transplanting, and field preparation',
        ratePerDay: 800,
        ratePerHour: 120,
        workersAvailable: 15,
        rating: 4.8,
        completedJobs: 234,
        location: 'Kamareddy',
        phone: '+91 98765 43210',
        specialties: ['Transplanting', 'Direct Sowing', 'Bed Preparation'],
        available: true,
        fastResponse: true
      },
      {
        id: 'harvest-specialists',
        name: 'Harvest Specialists',
        category: 'harvesting',
        description: 'Skilled workers for fruit and vegetable harvesting with care',
        ratePerDay: 900,
        ratePerHour: 135,
        workersAvailable: 12,
        rating: 4.9,
        completedJobs: 189,
        location: 'Nizamabad',
        phone: '+91 98765 43211',
        specialties: ['Fruit Picking', 'Vegetable Harvest', 'Post-harvest Handling'],
        available: true,
        fastResponse: true
      },
      {
        id: 'maintenance-crew',
        name: 'Field Maintenance Crew',
        category: 'maintenance',
        description: 'General field maintenance, weeding, and irrigation support',
        ratePerDay: 700,
        ratePerHour: 100,
        workersAvailable: 20,
        rating: 4.6,
        completedJobs: 156,
        location: 'Kamareddy',
        phone: '+91 98765 43212',
        specialties: ['Weeding', 'Pruning', 'Irrigation Setup'],
        available: true,
        fastResponse: false
      },
      {
        id: 'pest-control-team',
        name: 'Pest Control Experts',
        category: 'pest-control',
        description: 'Certified team for safe and effective pest management',
        ratePerDay: 1200,
        ratePerHour: 180,
        workersAvailable: 8,
        rating: 4.9,
        completedJobs: 278,
        location: 'Karimnagar',
        phone: '+91 98765 43213',
        specialties: ['Organic Spraying', 'IPM Methods', 'Disease Control'],
        available: true,
        fastResponse: true
      },
      {
        id: 'general-laborers',
        name: 'General Farm Workers',
        category: 'general',
        description: 'Multi-skilled workers for various farm activities',
        ratePerDay: 650,
        ratePerHour: 95,
        workersAvailable: 25,
        rating: 4.4,
        completedJobs: 145,
        location: 'Medak',
        phone: '+91 98765 43214',
        specialties: ['Loading/Unloading', 'Field Cleaning', 'Basic Maintenance'],
        available: true,
        fastResponse: false
      },
      {
        id: 'irrigation-specialists',
        name: 'Irrigation System Installers',
        category: 'maintenance',
        description: 'Specialized team for drip and sprinkler system installation',
        ratePerDay: 1500,
        ratePerHour: 220,
        workersAvailable: 6,
        rating: 4.7,
        completedJobs: 89,
        location: 'Warangal',
        phone: '+91 98765 43215',
        specialties: ['Drip Installation', 'Sprinkler Setup', 'System Maintenance'],
        available: false,
        fastResponse: true
      }
    ];
    setServices(laborServices);
  };

  const categories = [
    { id: 'all', name: 'All Services', icon: '👥', count: services.length },
    { id: 'planting', name: 'Planting', icon: '🌱', count: services.filter(s => s.category === 'planting').length },
    { id: 'harvesting', name: 'Harvesting', icon: '🌾', count: services.filter(s => s.category === 'harvesting').length },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧', count: services.filter(s => s.category === 'maintenance').length },
    { id: 'pest-control', name: 'Pest Control', icon: '🛡️', count: services.filter(s => s.category === 'pest-control').length },
    { id: 'general', name: 'General', icon: '👷', count: services.filter(s => s.category === 'general').length }
  ];

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookService = (serviceId: string) => {
    setShowBookingForm(serviceId);
    setBookingData(prev => ({ ...prev, serviceId }));
  };

  const submitBooking = async () => {
    if (!bookingData.date || !bookingData.taskDescription || !bookingData.location || !bookingData.contactPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const service = services.find(s => s.id === bookingData.serviceId);
      
      toast({
        title: "Booking Request Sent! 🎉",
        description: `Your request to ${service?.name} has been sent. They will contact you within 2 hours.`
      });
      
      setShowBookingForm(null);
      setBookingData({
        serviceId: '',
        date: undefined,
        duration: 1,
        durationType: 'days',
        workersNeeded: 1,
        taskDescription: '',
        location: '',
        contactPhone: '',
        totalCost: 0
      });
      
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Unable to send booking request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            👥 Labor Booking Service
          </h2>
          <p className="text-muted-foreground">
            Book skilled farm workers for all your agricultural needs
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
                    placeholder="Search labor services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
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
              <div className="text-2xl font-bold text-blue-600">{services.filter(s => s.available).length}</div>
              <p className="text-sm text-muted-foreground">Available Teams</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {services.reduce((sum, s) => sum + s.workersAvailable, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Workers</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                ₹{Math.round(services.reduce((sum, s) => sum + s.ratePerDay, 0) / services.length)}
              </div>
              <p className="text-sm text-muted-foreground">Avg. Daily Rate</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {services.filter(s => s.fastResponse).length}
              </div>
              <p className="text-sm text-muted-foreground">Fast Response</p>
            </CardContent>
          </Card>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {filteredServices.map(service => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold">{service.name}</h3>
                      {service.fastResponse && (
                        <Badge className="bg-blue-100 text-blue-800">Fast Response</Badge>
                      )}
                      {!service.available && (
                        <Badge variant="destructive">Busy</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{service.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>{service.completedJobs} jobs completed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{service.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">₹{service.ratePerDay}</div>
                    <div className="text-sm text-muted-foreground">per day</div>
                    <div className="text-sm text-blue-600">₹{service.ratePerHour}/hour</div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{service.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{service.workersAvailable} workers available</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {service.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleBookService(service.id)}
                    disabled={!service.available}
                    className="flex-1"
                  >
                    {service.available ? (
                      <>
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Book Now
                      </>
                    ) : (
                      'Currently Busy'
                    )}
                  </Button>
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <Card className="text-center p-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Services Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filters</p>
          </Card>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>📋 Book Labor Service</span>
                  <Button variant="ghost" onClick={() => setShowBookingForm(null)}>×</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const service = services.find(s => s.id === showBookingForm);
                  if (!service) return null;
                  
                  return (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex justify-between mt-2">
                          <span>Daily Rate: ₹{service.ratePerDay}</span>
                          <span>Hourly Rate: ₹{service.ratePerHour}</span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Preferred Date *</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {bookingData.date ? format(bookingData.date, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={bookingData.date}
                                onSelect={(date) => setBookingData(prev => ({ ...prev, date }))}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Workers Needed *</label>
                          <Select 
                            value={bookingData.workersNeeded.toString()} 
                            onValueChange={(value) => setBookingData(prev => ({ ...prev, workersNeeded: parseInt(value) }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: Math.min(service.workersAvailable, 20) }, (_, i) => i + 1).map(num => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} worker{num > 1 ? 's' : ''}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Duration Type *</label>
                          <Select 
                            value={bookingData.durationType} 
                            onValueChange={(value: 'hours' | 'days') => setBookingData(prev => ({ ...prev, durationType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            Duration ({bookingData.durationType}) *
                          </label>
                          <Input
                            type="number"
                            min="1"
                            max={bookingData.durationType === 'hours' ? 12 : 30}
                            value={bookingData.duration}
                            onChange={(e) => setBookingData(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Task Description *</label>
                        <Textarea
                          placeholder="Describe the work to be done..."
                          value={bookingData.taskDescription}
                          onChange={(e) => setBookingData(prev => ({ ...prev, taskDescription: e.target.value }))}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Work Location *</label>
                          <Input
                            placeholder="Enter farm/field location"
                            value={bookingData.location}
                            onChange={(e) => setBookingData(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Contact Phone *</label>
                          <Input
                            placeholder="+91 98765 43210"
                            value={bookingData.contactPhone}
                            onChange={(e) => setBookingData(prev => ({ ...prev, contactPhone: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total Cost:</span>
                          <span className="text-2xl font-bold text-green-600">
                            ₹{bookingData.totalCost.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          {bookingData.workersNeeded} worker{bookingData.workersNeeded > 1 ? 's' : ''} × {bookingData.duration} {bookingData.durationType} × ₹{bookingData.durationType === 'days' ? service.ratePerDay : service.ratePerHour}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setShowBookingForm(null)} className="flex-1">
                          Cancel
                        </Button>
                        <Button onClick={submitBooking} className="flex-1">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Confirm Booking
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

export default LaborBooking;