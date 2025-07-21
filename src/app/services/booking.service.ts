import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Booking {
  id?: string;
  user_id: string;
  service_type: 'toAirport' | 'fromAirport';
  vehicle_type: 'taxi' | 'suv' | 'van';
  destination: string;
  date_time: string;
  address: string;
  passengers: number;
  luggage?: {
    trunk: number;
    cabin: number;
    backpacks?: number;
  };
  base_price: number;
  airport_surcharge: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at?: string;
  notes?: string;
  // New fields for enhanced booking
  full_name?: string;
  phone?: string;
  email?: string;
  flight_number?: string;
  airline?: string;
  return_date_time?: string;
  confirmation_code?: string;
}

export interface BookingFormData {
  route: {
    direction: string;
    origin: string;
    departureDate: string;
    departureTime: string;
    isRoundTrip: boolean;
    returnDate?: string;
    returnTime?: string;
  };
  vehicle: {
    vehicleType: string;
    passengers: number;
    luggage: number;
  };
  details: {
    fullName: string;
    phone: string;
    email: string;
    flightNumber?: string;
    airline?: string;
    specialRequests?: string;
  };
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  /**
   * Create booking from form data (Observable pattern for component)
   */
  createBookingFromForm(formData: BookingFormData): Observable<Booking> {
    const booking: Omit<Booking, 'id' | 'created_at'> = {
      user_id: 'temp-user-id', // TODO: Get from auth service
      service_type: formData.route.direction === 'to-airport' ? 'toAirport' : 'fromAirport',
      vehicle_type: formData.vehicle.vehicleType as 'taxi' | 'suv' | 'van',
      destination: formData.route.origin,
      date_time: `${formData.route.departureDate}T${formData.route.departureTime}`,
      address: formData.route.origin, // TODO: Get actual address
      passengers: formData.vehicle.passengers,
      luggage: {
        trunk: formData.vehicle.luggage,
        cabin: 0,
        backpacks: 0
      },
      base_price: formData.totalPrice,
      airport_surcharge: 0,
      total_price: formData.totalPrice,
      status: 'pending',
      notes: formData.details.specialRequests,
      full_name: formData.details.fullName,
      phone: formData.details.phone,
      email: formData.details.email,
      flight_number: formData.details.flightNumber,
      airline: formData.details.airline,
      return_date_time: formData.route.isRoundTrip && formData.route.returnDate && formData.route.returnTime 
        ? `${formData.route.returnDate}T${formData.route.returnTime}` 
        : undefined,
      confirmation_code: this.generateConfirmationCode()
    };

    return from(this.createBooking(booking)).pipe(
      catchError(error => {
        console.error('Booking creation error:', error);
        return throwError(() => new Error('Error al crear la reserva. Inténtelo nuevamente.'));
      })
    );
  }

  /**
   * Calculate estimated price based on route and vehicle
   */
  calculatePrice(route: any, vehicle: any): number {
    let basePrice = 25000; // Base price in CLP

    // Distance/destination multiplier
    const distanceMultipliers: { [key: string]: number } = {
      'Vitacura': 1.0,
      'Las Condes': 1.1,
      'Providencia': 1.2,
      'Santiago Centro': 1.5,
      'Maipú': 1.8,
      'San Bernardo': 2.0,
      'Pudahuel': 0.8,
      'Ñuñoa': 1.3,
      'La Reina': 1.2
    };
    
    basePrice *= distanceMultipliers[route.origin] || 1.0;

    // Vehicle type multiplier
    const vehicleMultipliers: { [key: string]: number } = {
      'taxi': 1.0,
      'suv': 1.3,
      'van': 1.6
    };
    basePrice *= vehicleMultipliers[vehicle.vehicleType] || 1.0;

    // Passenger multiplier (for vehicles with extra capacity)
    if (vehicle.passengers > 2) {
      basePrice *= (1 + (vehicle.passengers - 2) * 0.1);
    }

    // Round trip discount
    if (route.isRoundTrip) {
      basePrice *= 1.8; // 10% discount compared to two separate trips
    }

    // Airport surcharge for arrivals
    if (route.direction === 'from-airport') {
      basePrice += 3000; // Airport pickup surcharge
    }

    return Math.round(basePrice);
  }

  /**
   * Validate booking data
   */
  validateBookingData(formData: Partial<BookingFormData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Route validation
    if (!formData.route?.origin) {
      errors.push('Debe seleccionar un destino');
    }
    if (!formData.route?.departureDate) {
      errors.push('Debe seleccionar una fecha de salida');
    }
    if (!formData.route?.departureTime) {
      errors.push('Debe seleccionar una hora de salida');
    }

    // Round trip validation
    if (formData.route?.isRoundTrip) {
      if (!formData.route.returnDate) {
        errors.push('Debe seleccionar una fecha de regreso');
      }
      if (!formData.route.returnTime) {
        errors.push('Debe seleccionar una hora de regreso');
      }
    }

    // Vehicle validation
    if (!formData.vehicle?.vehicleType) {
      errors.push('Debe seleccionar un tipo de vehículo');
    }
    if (!formData.vehicle?.passengers || formData.vehicle.passengers < 1) {
      errors.push('Debe especificar el número de pasajeros');
    }

    // Contact details validation
    if (!formData.details?.fullName?.trim()) {
      errors.push('Debe proporcionar su nombre completo');
    }
    if (!formData.details?.phone?.trim()) {
      errors.push('Debe proporcionar un número de teléfono');
    }
    if (!formData.details?.email?.trim()) {
      errors.push('Debe proporcionar un email válido');
    }

    // Flight info validation for airport pickups
    if (formData.route?.direction === 'from-airport') {
      if (!formData.details?.flightNumber?.trim()) {
        errors.push('Debe proporcionar el número de vuelo para recogidas en aeropuerto');
      }
      if (!formData.details?.airline?.trim()) {
        errors.push('Debe proporcionar la aerolínea para recogidas en aeropuerto');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private generateConfirmationCode(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  async createBooking(booking: Omit<Booking, 'id' | 'created_at'>) {
    const { data, error } = await this.supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserBookings(userId: string) {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateBooking(id: string, updates: Partial<Booking>) {
    const { data, error } = await this.supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async cancelBooking(id: string) {
    return this.updateBooking(id, { status: 'cancelled' });
  }

  async getBooking(bookingId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('bookings')
        .select(`
          *,
          user:user_id(id, email, full_name, phone),
          driver:driver_id(id, name, phone, vehicle_info),
          payment:payments(id, amount, status, provider)
        `)
        .eq('id', bookingId)
        .single();

      if (error) {
        console.error('Error fetching booking:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getBooking:', error);
      throw error;
    }
  }
}