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
  Truck, Calendar as CalendarIcon, MapPin, Star, Phone, Clock,
  CheckCircle2, AlertTriangle, DollarSign, Package, Users, Fuel,
  Filter, Search, Navigation, MessageCircle
} from "lucide-react";
import { format } from "date-fns";

interface TransportService {
  id: string;
  ownerName: string;
  vehicleType: 'truck' | 'tractor' | 'pickup' | 'van' | 'trailer';
  vehicleModel: string;
  capacity: string;
  ratePerKm: number;
  ratePerDay: number;
  ratePerHour: number;
  rating: number;
  completedTrips: number;
  location: string;
  phone: string;
  services: string[];
  available: boolean;
  hasDriver: boolean;
  fuelIncluded: boolean;
  image: string;
}

interface BookingRequest {
  serviceId: string;
  pickupDate: Date | undefined;
  pickupTime: string;
  pickupLocation: string;
  dropLocation: string;
  estimatedDistance: number;
  goodsType: string;
  goodsWeight: string;
  bookingType: 'trip' | 'hourly' | 'daily';
  duration: number;
  specialInstructions: string;
  contactPhone: string;
  totalCost: number;
}

const TransportBooking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState<TransportService[]>([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingForm, setShowBookingForm] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingRequest>({
    serviceId: '',
    pickupDate: undefined,
    pickupTime: '09:00',
    pickupLocation: '',
    dropLocation: '',
    estimatedDistance: 0,
    goodsType: '',
    goodsWeight: '',
    bookingType: 'trip',
    duration: 1,
    specialInstructions: '',
    contactPhone: '',
    totalCost: 0
  });

  useEffect(() => {
    generateTransportServices();
  }, []);

  useEffect(() => {
    if (showBookingForm) {
      const service = services.find(s => s.id === showBookingForm);
      if (service) {
        let cost = 0;
        switch (bookingData.bookingType) {
          case 'trip':
            cost = service.ratePerKm * bookingData.estimatedDistance;
            break;
          case 'hourly':
            cost = service.ratePerHour * bookingData.duration;
            break;
          case 'daily':
            cost = service.ratePerDay * bookingData.duration;
            break;
        }
        setBookingData(prev => ({ ...prev, totalCost: cost }));
      }
    }
  }, [bookingData.estimatedDistance, bookingData.duration, bookingData.bookingType, showBookingForm, services]);

  const generateTransportServices = () => {
    const transportServices: TransportService[] = [
      {
        id: 'truck-heavy-1',
        ownerName: 'Rajesh Transport',
        vehicleType: 'truck',
        vehicleModel: 'Tata 1613',
        capacity: '10 Tons',
        ratePerKm: 25,
        ratePerDay: 3500,
        ratePerHour: 450,
        rating: 4.8,
        completedTrips: 456,
        location: 'Kamareddy',
        phone: '+91 98765 43220',
        services: ['Goods Transport', 'Bulk Materials', 'Long Distance'],
        available: true,
        hasDriver: true,
        fuelIncluded: false,
        image: '🚛'
      },
      {
        id: 'tractor-trailer-1',
        ownerName: 'Farmers Transport Co-op',
        vehicleType: 'tractor',
        vehicleModel: 'Mahindra 585 + Trailer',
        capacity: '5 Tons',
        ratePerKm: 18,
        ratePerDay: 2800,
        ratePerHour: 350,
        rating: 4.7,
        completedTrips: 234,
        location: 'Nizamabad',
        phone: '+91 98765 43221',
        services: ['Farm Produce', 'Equipment Transport', 'Field to Market'],
        available: true,
        hasDriver: true,
        fuelIncluded: true,
        image: '🚜'
      },
      {
        id: 'pickup-1',
        ownerName: 'Quick Move Services',
        vehicleType: 'pickup',
        vehicleModel: 'Mahindra Bolero Pickup',
        capacity: '1.5 Tons',
        ratePerKm: 15,
        ratePerDay: 2200,
        ratePerHour: 280,
        rating: 4.6,
        completedTrips: 189,
        location: 'Karimnagar',
        phone: '+91 98765 43222',
        services: ['Small Loads', 'Local Transport', 'Quick Delivery'],
        available: true,
        hasDriver: false,
        fuelIncluded: false,
        image: '🛻'
      },
      {
        id: 'van-1',
        ownerName: 'City Cargo Van',
        vehicleType: 'van',
        vehicleModel: 'Ashok Leyland Dost',
        capacity: '1 Ton',
        ratePerKm: 12,
        ratePerDay: 1800,
        ratePerHour: 250,
        rating: 4.5,
        completedTrips: 167,
        location: 'Medak',
        phone: '+91 98765 43223',
        services: ['City Delivery', 'Packaged Goods', 'Door to Door'],
        available: false,
        hasDriver: true,
        fuelIncluded: false,
        image: '🚐'
      },
      {
        id: 'truck-medium-1',
        ownerName: 'Highway Express',
        vehicleType: 'truck',
        vehicleModel: 'Eicher Pro 1049',
        capacity: '4.9 Tons',
        ratePerKm: 20,
        ratePerDay: 3000,
        ratePerHour: 400,
        rating: 4.9,
        completedTrips: 378,
        location: 'Warangal',
        phone: '+91 98765 43224',
        services: ['Interstate Transport', 'Covered Goods', 'Refrigerated'],
        available: true,
        hasDriver: true,
        fuelIncluded: true,
        image: '🚛'
      },
      {
        id: 'trailer-1',
        ownerName: 'Heavy Haul Logistics',
        vehicleType: 'trailer',
        vehicleModel: 'Ashok Leyland 2518 + Trailer',
        capacity: '25 Tons',
        ratePerKm: 35,
        ratePerDay: 5000,
        ratePerHour: 650,
        rating: 4.8,
        completedTrips: 123,
        location: 'Hyderabad',
        phone: '+91 98765 43225',
        services: ['Heavy Machinery', 'Construction Materials', 'Industrial Transport'],
        available: true,
        hasDriver: true,
        fuelIncluded: false,
        image: '🚚'
      }
    ];
    setServices(transportServices);
  };

  const vehicleTypes = [
    { id: 'all', name: 'All Vehicles', icon: '🚛', count: services.length },
    { id: 'truck', name: 'Trucks', icon: '🚛', count: services.filter(s => s.vehicleType === 'truck').length },
    { id: 'tractor', name: 'Tractors', icon: '🚜', count: services.filter(s => s.vehicleType === 'tractor').length },
    { id: 'pickup', name: 'Pickups', icon: '🛻', count: services.filter(s => s.vehicleType === 'pickup').length },
    { id: 'van', name: 'Vans', icon: '🚐', count: services.filter(s => s.vehicleType === 'van').length },
    { id: 'trailer', name: 'Trailers', icon: '🚚', count: services.filter(s => s.vehicleType === 'trailer').length }
  ];

  const filteredServices = services.filter(service => {
    const matchesType = selectedVehicleType === 'all' || service.vehicleType === selectedVehicleType;
    const matchesSearch = service.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleBookService = (serviceId: string) => {
    setShowBookingForm(serviceId);
    setBookingData(prev => ({ ...prev, serviceId }));
  };

  const submitBooking = async () => {
    if (!bookingData.pickupDate || !bookingData.pickupLocation || !bookingData.dropLocation || !bookingData.contactPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const service = services.find(s => s.id === bookingData.serviceId);
      
      toast({
        title: "Transport Booking Confirmed! 🚛",
        description: `${service?.ownerName} will contact you to confirm pickup details within 1 hour.`
      });
      
      setShowBookingForm(null);
      setBookingData({
        serviceId: '',
        pickupDate: undefined,
        pickupTime: '09:00',
        pickupLocation: '',
        dropLocation: '',
        estimatedDistance: 0,
        goodsType: '',
        goodsWeight: '',
        bookingType: 'trip',
        duration: 1,
        specialInstructions: '',
        contactPhone: '',
        totalCost: 0
      });
      
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Unable to confirm transport booking. Please try again.",
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
            <Truck className="w-7 h-7 text-blue-600" />
            🚛 Transport Booking
          </h2>
          <p className="text-muted-foreground">
            Book vehicles for transporting crops, equipment, and farm materials
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
                    placeholder="Search vehicles or owners..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedVehicleType} onValueChange={setSelectedVehicleType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Vehicle Type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map(type => (
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
                {services.filter(s => s.hasDriver).length}
              </div>
              <p className="text-sm text-muted-foreground">With Driver</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                ₹{Math.round(services.reduce((sum, s) => sum + s.ratePerKm, 0) / services.length)}
              </div>
              <p className="text-sm text-muted-foreground">Avg. Per KM</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {services.filter(s => s.fuelIncluded).length}
              </div>
              <p className="text-sm text-muted-foreground">Fuel Included</p>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Services List */}
        <div className="space-y-4">
          {filteredServices.map(service => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{service.image}</span>
                      <div>
                        <h3 className="text-xl font-bold">{service.ownerName}</h3>
                        <p className="text-sm text-muted-foreground">{service.vehicleModel}</p>
                      </div>
                      {service.hasDriver && (
                        <Badge className="bg-green-100 text-green-800">With Driver</Badge>
                      )}
                      {service.fuelIncluded && (
                        <Badge className="bg-blue-100 text-blue-800">Fuel Included</Badge>
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
                        <span>{service.completedTrips} trips</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{service.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        <span>{service.capacity}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">₹{service.ratePerKm}/km</div>
                    <div className="text-sm text-muted-foreground">₹{service.ratePerDay}/day</div>
                    <div className="text-sm text-blue-600">₹{service.ratePerHour}/hour</div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex flex-wrap gap-2">
                    {service.services.map((serviceType, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {serviceType}
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
                        Book Transport
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
                    <Navigation className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <Card className="text-center p-8">
            <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Vehicles Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or vehicle type filters</p>
          </Card>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>🚛 Book Transport Service</span>
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
                            <h3 className="font-semibold">{service.ownerName}</h3>
                            <p className="text-sm text-muted-foreground">{service.vehicleModel} • {service.capacity}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>Per KM: ₹{service.ratePerKm}</div>
                          <div>Per Hour: ₹{service.ratePerHour}</div>
                          <div>Per Day: ₹{service.ratePerDay}</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Pickup Date *</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {bookingData.pickupDate ? format(bookingData.pickupDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={bookingData.pickupDate}
                                onSelect={(date) => setBookingData(prev => ({ ...prev, pickupDate: date }))}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Pickup Time *</label>
                          <Select 
                            value={bookingData.pickupTime} 
                            onValueChange={(value) => setBookingData(prev => ({ ...prev, pickupTime: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => {
                                const hour = i.toString().padStart(2, '0');
                                return (
                                  <SelectItem key={hour} value={`${hour}:00`}>
                                    {hour}:00
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Pickup Location *</label>
                          <Input
                            placeholder="Enter pickup address"
                            value={bookingData.pickupLocation}
                            onChange={(e) => setBookingData(prev => ({ ...prev, pickupLocation: e.target.value }))}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Drop Location *</label>
                          <Input
                            placeholder="Enter destination address"
                            value={bookingData.dropLocation}
                            onChange={(e) => setBookingData(prev => ({ ...prev, dropLocation: e.target.value }))}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Booking Type *</label>
                          <Select 
                            value={bookingData.bookingType} 
                            onValueChange={(value: 'trip' | 'hourly' | 'daily') => setBookingData(prev => ({ ...prev, bookingType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="trip">One Trip</SelectItem>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {bookingData.bookingType === 'trip' ? (
                          <div>
                            <label className="text-sm font-medium">Estimated Distance (km) *</label>
                            <Input
                              type="number"
                              min="1"
                              value={bookingData.estimatedDistance}
                              onChange={(e) => setBookingData(prev => ({ ...prev, estimatedDistance: parseInt(e.target.value) || 0 }))}
                              placeholder="Enter distance in km"
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="text-sm font-medium">
                              Duration ({bookingData.bookingType === 'hourly' ? 'Hours' : 'Days'}) *
                            </label>
                            <Input
                              type="number"
                              min="1"
                              max={bookingData.bookingType === 'hourly' ? 24 : 30}
                              value={bookingData.duration}
                              onChange={(e) => setBookingData(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                            />
                          </div>
                        )}

                        <div>
                          <label className="text-sm font-medium">Goods Type</label>
                          <Select 
                            value={bookingData.goodsType} 
                            onValueChange={(value) => setBookingData(prev => ({ ...prev, goodsType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select goods type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="crops">Agricultural Crops</SelectItem>
                              <SelectItem value="equipment">Farm Equipment</SelectItem>
                              <SelectItem value="fertilizer">Fertilizers/Chemicals</SelectItem>
                              <SelectItem value="machinery">Heavy Machinery</SelectItem>
                              <SelectItem value="general">General Goods</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Estimated Weight</label>
                          <Input
                            placeholder="e.g., 2 tons, 500 kg"
                            value={bookingData.goodsWeight}
                            onChange={(e) => setBookingData(prev => ({ ...prev, goodsWeight: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Special Instructions</label>
                        <Textarea
                          placeholder="Any special handling, loading/unloading requirements..."
                          value={bookingData.specialInstructions}
                          onChange={(e) => setBookingData(prev => ({ ...prev, specialInstructions: e.target.value }))}
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

                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total Estimated Cost:</span>
                          <span className="text-2xl font-bold text-green-600">
                            ₹{bookingData.totalCost.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          {bookingData.bookingType === 'trip' ? 
                            `${bookingData.estimatedDistance} km × ₹${service.ratePerKm}` :
                            `${bookingData.duration} ${bookingData.bookingType === 'hourly' ? 'hours' : 'days'} × ₹${bookingData.bookingType === 'hourly' ? service.ratePerHour : service.ratePerDay}`
                          }
                          {!service.fuelIncluded && ' + fuel charges'}
                        </p>
                        {!service.fuelIncluded && (
                          <p className="text-xs text-orange-600 mt-1">⚠️ Fuel charges extra</p>
                        )}
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

export default TransportBooking;