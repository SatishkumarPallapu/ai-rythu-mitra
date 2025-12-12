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
  Plane, Camera, Calendar as CalendarIcon, MapPin, Star, Phone, Clock,
  CheckCircle2, AlertTriangle, DollarSign, Zap, Activity, Wifi,
  Filter, Search, Eye, Bug, Droplets, TreePine, MessageCircle, Target
} from "lucide-react";
import { format } from "date-fns";

interface DroneService {
  id: string;
  operatorName: string;
  droneModel: string;
  services: string[];
  flightTime: string;
  cameraSpecs: string;
  ratePerAcre: number;
  ratePerHour: number;
  rating: number;
  completedMissions: number;
  location: string;
  phone: string;
  specializations: string[];
  available: boolean;
  weatherDependent: boolean;
  certifications: string[];
  image: string;
}

interface BookingRequest {
  serviceId: string;
  serviceDate: Date | undefined;
  serviceTime: string;
  farmLocation: string;
  farmSize: number;
  cropType: string;
  serviceType: 'health-monitoring' | 'pest-detection' | 'spray-mapping' | 'yield-estimation' | 'general-survey';
  specificRequirements: string;
  urgencyLevel: 'normal' | 'urgent' | 'emergency';
  contactPhone: string;
  totalCost: number;
  reportDelivery: 'digital' | 'physical' | 'both';
}

const DroneServices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<DroneService[]>([]);
  const [selectedService, setSelectedService] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingForm, setShowBookingForm] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingRequest>({
    serviceId: '',
    serviceDate: undefined,
    serviceTime: '09:00',
    farmLocation: '',
    farmSize: 1,
    cropType: '',
    serviceType: 'health-monitoring',
    specificRequirements: '',
    urgencyLevel: 'normal',
    contactPhone: '',
    totalCost: 0,
    reportDelivery: 'digital'
  });

  useEffect(() => {
    generateDroneServices();
  }, []);

  useEffect(() => {
    if (showBookingForm) {
      const service = services.find(s => s.id === showBookingForm);
      if (service) {
        const baseCost = service.ratePerAcre * bookingData.farmSize;
        const urgencyMultiplier = bookingData.urgencyLevel === 'urgent' ? 1.5 : bookingData.urgencyLevel === 'emergency' ? 2 : 1;
        const deliveryExtra = bookingData.reportDelivery === 'both' ? 500 : bookingData.reportDelivery === 'physical' ? 300 : 0;
        
        setBookingData(prev => ({ 
          ...prev, 
          totalCost: Math.round(baseCost * urgencyMultiplier + deliveryExtra)
        }));
      }
    }
  }, [bookingData.farmSize, bookingData.urgencyLevel, bookingData.reportDelivery, showBookingForm, services]);

  const generateDroneServices = () => {
    const droneServices: DroneService[] = [
      {
        id: 'precision-ag-drone',
        operatorName: 'PrecisionAg Drones',
        droneModel: 'DJI Matrice 300 RTK',
        services: ['Crop Health Monitoring', 'NDVI Analysis', 'Pest Detection', 'Yield Estimation'],
        flightTime: '55 minutes',
        cameraSpecs: 'Multispectral + RGB 4K',
        ratePerAcre: 250,
        ratePerHour: 3500,
        rating: 4.9,
        completedMissions: 890,
        location: 'Hyderabad',
        phone: '+91 98765 43230',
        specializations: ['Precision Agriculture', 'Disease Detection', 'Growth Analysis'],
        available: true,
        weatherDependent: true,
        certifications: ['DGCA Certified', 'Precision Ag Specialist'],
        image: '🚁'
      },
      {
        id: 'agri-spray-drone',
        operatorName: 'AgriSpray Solutions',
        droneModel: 'DJI Agras T40',
        services: ['Pesticide Spraying', 'Fertilizer Application', 'Targeted Treatment'],
        flightTime: '20 minutes',
        cameraSpecs: 'FPV Camera + Spray System',
        ratePerAcre: 200,
        ratePerHour: 2800,
        rating: 4.8,
        completedMissions: 567,
        location: 'Karimnagar',
        phone: '+91 98765 43231',
        specializations: ['Precision Spraying', 'Chemical Application', 'Pest Control'],
        available: true,
        weatherDependent: true,
        certifications: ['DGCA Certified', 'Chemical Application License'],
        image: '🛸'
      },
      {
        id: 'farm-survey-drone',
        operatorName: 'FarmSurvey Pro',
        droneModel: 'Autel EVO II Pro RTK',
        services: ['Land Surveying', 'Boundary Mapping', 'Crop Counting', 'Damage Assessment'],
        flightTime: '40 minutes',
        cameraSpecs: '6K Camera + LiDAR',
        ratePerAcre: 180,
        ratePerHour: 2500,
        rating: 4.7,
        completedMissions: 234,
        location: 'Nizamabad',
        phone: '+91 98765 43232',
        specializations: ['Land Mapping', 'Survey Analytics', 'Crop Assessment'],
        available: true,
        weatherDependent: false,
        certifications: ['DGCA Certified', 'Survey License'],
        image: '🚁'
      },
      {
        id: 'crop-intel-drone',
        operatorName: 'CropIntel Analytics',
        droneModel: 'Parrot Bluegrass Fields',
        services: ['Plant Health Analysis', 'Water Stress Detection', 'Growth Monitoring'],
        flightTime: '25 minutes',
        cameraSpecs: 'RGB + NIR Multispectral',
        ratePerAcre: 220,
        ratePerHour: 3000,
        rating: 4.8,
        completedMissions: 445,
        location: 'Warangal',
        phone: '+91 98765 43233',
        specializations: ['Plant Analytics', 'Stress Detection', 'AI Analysis'],
        available: false,
        weatherDependent: true,
        certifications: ['DGCA Certified', 'AI Analytics Certified'],
        image: '🛸'
      },
      {
        id: 'emergency-response-drone',
        operatorName: 'RapidResponse Drones',
        droneModel: 'DJI Mavic 3 Enterprise',
        services: ['Emergency Assessment', 'Disaster Response', 'Quick Surveys'],
        flightTime: '46 minutes',
        cameraSpecs: 'Thermal + RGB 4K',
        ratePerAcre: 300,
        ratePerHour: 4000,
        rating: 4.9,
        completedMissions: 156,
        location: 'Medak',
        phone: '+91 98765 43234',
        specializations: ['Emergency Response', 'Thermal Imaging', '24/7 Service'],
        available: true,
        weatherDependent: false,
        certifications: ['DGCA Certified', 'Emergency Response Certified'],
        image: '🚁'
      },
      {
        id: 'livestock-monitor-drone',
        operatorName: 'LivestockWatch Drones',
        droneModel: 'DJI Mini 3 Enterprise',
        services: ['Livestock Monitoring', 'Pasture Assessment', 'Fence Inspection'],
        flightTime: '38 minutes',
        cameraSpecs: 'RGB 4K + Zoom',
        ratePerAcre: 150,
        ratePerHour: 2200,
        rating: 4.6,
        completedMissions: 289,
        location: 'Kamareddy',
        phone: '+91 98765 43235',
        specializations: ['Livestock Tracking', 'Pasture Health', 'Infrastructure Check'],
        available: true,
        weatherDependent: true,
        certifications: ['DGCA Certified', 'Livestock Monitoring Specialist'],
        image: '🛸'
      }
    ];
    setServices(droneServices);
  };

  const serviceTypes = [
    { id: 'all', name: 'All Services', icon: '🚁', count: services.length },
    { id: 'health-monitoring', name: 'Health Monitoring', icon: '💚', count: services.filter(s => s.services.some(srv => srv.includes('Health'))).length },
    { id: 'pest-detection', name: 'Pest Detection', icon: '🐛', count: services.filter(s => s.services.some(srv => srv.includes('Pest'))).length },
    { id: 'spray-mapping', name: 'Spray Services', icon: '💧', count: services.filter(s => s.services.some(srv => srv.includes('Spray'))).length },
    { id: 'yield-estimation', name: 'Yield Analysis', icon: '🌾', count: services.filter(s => s.services.some(srv => srv.includes('Yield'))).length },
    { id: 'general-survey', name: 'Survey & Mapping', icon: '🗺️', count: services.filter(s => s.services.some(srv => srv.includes('Survey') || srv.includes('Mapping'))).length }
  ];

  const filteredServices = services.filter(service => {
    const matchesService = selectedService === 'all' || 
      service.services.some(srv => {
        switch (selectedService) {
          case 'health-monitoring': return srv.includes('Health') || srv.includes('Monitoring');
          case 'pest-detection': return srv.includes('Pest') || srv.includes('Detection');
          case 'spray-mapping': return srv.includes('Spray') || srv.includes('Application');
          case 'yield-estimation': return srv.includes('Yield') || srv.includes('Estimation');
          case 'general-survey': return srv.includes('Survey') || srv.includes('Mapping');
          default: return true;
        }
      });
    
    const matchesSearch = service.operatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.droneModel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesService && matchesSearch;
  });

  const handleBookService = (serviceId: string) => {
    setShowBookingForm(serviceId);
    setBookingData(prev => ({ ...prev, serviceId }));
  };

  const submitBooking = async () => {
    if (!bookingData.serviceDate || !bookingData.farmLocation || !bookingData.cropType || !bookingData.contactPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const service = services.find(s => s.id === bookingData.serviceId);
      
      toast({
        title: "Drone Service Booked! 🚁",
        description: `${service?.operatorName} will contact you to confirm flight details and weather conditions.`
      });
      
      setShowBookingForm(null);
      setBookingData({
        serviceId: '',
        serviceDate: undefined,
        serviceTime: '09:00',
        farmLocation: '',
        farmSize: 1,
        cropType: '',
        serviceType: 'health-monitoring',
        specificRequirements: '',
        urgencyLevel: 'normal',
        contactPhone: '',
        totalCost: 0,
        reportDelivery: 'digital'
      });
      
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Unable to confirm drone service booking. Please try again.",
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
            <Plane className="w-7 h-7 text-blue-600" />
            🚁 Drone Services
          </h2>
          <p className="text-muted-foreground">
            Advanced aerial crop monitoring, pest detection, and precision agriculture services
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
                    placeholder="Search drone operators or models..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map(type => (
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
              <div className="text-2xl font-bold text-blue-600">{services.filter(s => s.available).length}</div>
              <p className="text-sm text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {services.reduce((sum, s) => sum + s.completedMissions, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Missions</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                ₹{Math.round(services.reduce((sum, s) => sum + s.ratePerAcre, 0) / services.length)}
              </div>
              <p className="text-sm text-muted-foreground">Avg. Per Acre</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {services.filter(s => !s.weatherDependent).length}
              </div>
              <p className="text-sm text-muted-foreground">All-Weather</p>
            </CardContent>
          </Card>
        </div>

        {/* Drone Services List */}
        <div className="space-y-4">
          {filteredServices.map(service => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{service.image}</span>
                      <div>
                        <h3 className="text-xl font-bold">{service.operatorName}</h3>
                        <p className="text-sm text-muted-foreground">{service.droneModel}</p>
                      </div>
                      {service.weatherDependent && (
                        <Badge className="bg-orange-100 text-orange-800">Weather Dependent</Badge>
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
                        <Target className="w-4 h-4 text-green-600" />
                        <span>{service.completedMissions} missions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{service.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.flightTime} flight</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">₹{service.ratePerAcre}</div>
                    <div className="text-sm text-muted-foreground">per acre</div>
                    <div className="text-sm text-blue-600">₹{service.ratePerHour}/hour</div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Camera className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm">{service.cameraSpecs}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {service.services.map((serviceType, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {serviceType}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {service.specializations.map((spec, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {service.certifications.map((cert, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                        ✓ {cert}
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
                        Book Drone Service
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
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <Card className="text-center p-8">
            <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Drone Services Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or service type filters</p>
          </Card>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>🚁 Book Drone Service</span>
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
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{service.image}</span>
                          <div>
                            <h3 className="font-semibold">{service.operatorName}</h3>
                            <p className="text-sm text-muted-foreground">{service.droneModel} • {service.cameraSpecs}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Per Acre: ₹{service.ratePerAcre}</div>
                          <div>Flight Time: {service.flightTime}</div>
                        </div>
                        {service.weatherDependent && (
                          <p className="text-xs text-orange-600 mt-2">⚠️ Service depends on weather conditions</p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Service Date *</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {bookingData.serviceDate ? format(bookingData.serviceDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={bookingData.serviceDate}
                                onSelect={(date) => setBookingData(prev => ({ ...prev, serviceDate: date }))}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Preferred Time *</label>
                          <Select 
                            value={bookingData.serviceTime} 
                            onValueChange={(value) => setBookingData(prev => ({ ...prev, serviceTime: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {['06:00', '07:00', '08:00', '09:00', '10:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
                                <SelectItem key={time} value={time}>
                                  {time} {time.startsWith('0') || time === '10:00' ? 'AM' : 'PM'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Farm Location *</label>
                          <Input
                            placeholder="Enter farm address with landmarks"
                            value={bookingData.farmLocation}
                            onChange={(e) => setBookingData(prev => ({ ...prev, farmLocation: e.target.value }))}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Farm Size (acres) *</label>
                          <Input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={bookingData.farmSize}
                            onChange={(e) => setBookingData(prev => ({ ...prev, farmSize: parseFloat(e.target.value) || 1 }))}
                            placeholder="Enter farm size"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Crop Type *</label>
                          <Select 
                            value={bookingData.cropType} 
                            onValueChange={(value) => setBookingData(prev => ({ ...prev, cropType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select crop" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rice">Rice</SelectItem>
                              <SelectItem value="cotton">Cotton</SelectItem>
                              <SelectItem value="maize">Maize</SelectItem>
                              <SelectItem value="soybean">Soybean</SelectItem>
                              <SelectItem value="sugarcane">Sugarcane</SelectItem>
                              <SelectItem value="tomato">Tomato</SelectItem>
                              <SelectItem value="chili">Chili</SelectItem>
                              <SelectItem value="wheat">Wheat</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Service Type *</label>
                          <Select 
                            value={bookingData.serviceType} 
                            onValueChange={(value: any) => setBookingData(prev => ({ ...prev, serviceType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="health-monitoring">💚 Crop Health Monitoring</SelectItem>
                              <SelectItem value="pest-detection">🐛 Pest Detection</SelectItem>
                              <SelectItem value="spray-mapping">💧 Spray Mapping</SelectItem>
                              <SelectItem value="yield-estimation">🌾 Yield Estimation</SelectItem>
                              <SelectItem value="general-survey">🗺️ General Survey</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Urgency Level</label>
                          <Select 
                            value={bookingData.urgencyLevel} 
                            onValueChange={(value: any) => setBookingData(prev => ({ ...prev, urgencyLevel: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">🔵 Normal (3-5 days)</SelectItem>
                              <SelectItem value="urgent">🟡 Urgent (+50% cost)</SelectItem>
                              <SelectItem value="emergency">🔴 Emergency (+100% cost)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Report Delivery</label>
                          <Select 
                            value={bookingData.reportDelivery} 
                            onValueChange={(value: any) => setBookingData(prev => ({ ...prev, reportDelivery: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="digital">📱 Digital Only (Free)</SelectItem>
                              <SelectItem value="physical">📄 Physical Report (+₹300)</SelectItem>
                              <SelectItem value="both">📱📄 Both (+₹500)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Specific Requirements</label>
                        <Textarea
                          placeholder="Any specific areas of concern, symptoms observed, or special instructions..."
                          value={bookingData.specificRequirements}
                          onChange={(e) => setBookingData(prev => ({ ...prev, specificRequirements: e.target.value }))}
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

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total Service Cost:</span>
                          <span className="text-2xl font-bold text-blue-600">
                            ₹{bookingData.totalCost.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          {bookingData.farmSize} acres × ₹{service.ratePerAcre}
                          {bookingData.urgencyLevel === 'urgent' && ' × 1.5 (Urgent)'}
                          {bookingData.urgencyLevel === 'emergency' && ' × 2.0 (Emergency)'}
                          {bookingData.reportDelivery !== 'digital' && ` + ₹${bookingData.reportDelivery === 'both' ? 500 : 300} (Report)`}
                        </p>
                        <div className="mt-2 text-xs text-blue-600">
                          ✅ Includes: Flight service, data analysis, AI insights, digital report
                        </div>
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

export default DroneServices;