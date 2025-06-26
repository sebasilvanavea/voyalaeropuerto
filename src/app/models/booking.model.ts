export interface Airport {
  id: string;
  name: string;
  code: string;
  city: string;
}

export interface Vehicle {
  id: string;
  name: string;
  serviceType: 'exclusive' | 'shared';
  vehicleType: 'Taxi' | 'SUV';
  capacity: number;
  pricePerKm: number; // Kept for now, but unused in new logic
  imageUrl: string;
  features: string[];
  luggageCapacity: {
    large: number;
    medium: number;
    small: number;
  };
}

export interface BookingRequest {
  id?: string;
  tripType: 'one-way' | 'round-trip';
  origin: Airport;
  destination: Airport;
  departureDate: Date;
  returnDate?: Date;
  departureTime: string;
  returnTime?: string;
  passengers: number;
  vehicle: Vehicle;
  customerInfo: CustomerInfo;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: Date;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface QuoteRequest {
  origin: Airport;
  destination: Airport;
  tripType: 'one-way' | 'round-trip';
  passengers: number;
  departureDate: Date;
  returnDate?: Date;
}

export interface QuoteResponse {
  distance: number;
  estimatedDuration: string;
  vehicles: VehicleQuote[];
}

export interface VehicleQuote {
  vehicle: Vehicle;
  price: number;
  available: boolean;
  unavailabilityReason?: string;
}
