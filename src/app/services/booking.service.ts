import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Booking {
  id?: string;
  user_id: string;
  service_type: 'toAirport' | 'fromAirport';
  vehicle_type: 'taxi' | 'suv';
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