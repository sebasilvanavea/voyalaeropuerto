import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Driver {
  id: string;
  user_id: string;
  license_number: string;
  license_expiry: string;
  vehicle_id: string;
  status: 'active' | 'inactive' | 'busy' | 'offline';
  rating: number;
  total_trips: number;
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image_url?: string;
  current_location?: {
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
  };
  last_seen: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  documents: DriverDocument[];
  vehicle: Vehicle;
  earnings: DriverEarnings;
  preferences: DriverPreferences;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  capacity: number;
  type: 'sedan' | 'suv' | 'van' | 'luxury' | 'economy';
  features: string[];
  insurance_expiry: string;
  inspection_expiry: string;
  photos: string[];
  status: 'active' | 'maintenance' | 'inactive';
}

export interface DriverDocument {
  id: string;
  type: 'license' | 'insurance' | 'registration' | 'background_check' | 'photo';
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  expires_at?: string;
  verified_at?: string;
  verified_by?: string;
  notes?: string;
}

export interface DriverEarnings {
  daily: number;
  weekly: number;
  monthly: number;
  total: number;
  pending_payout: number;
  last_payout_date?: string;
  commission_rate: number;
}

export interface DriverPreferences {
  max_distance_km: number;
  preferred_areas: string[];
  work_schedule: WorkSchedule[];
  accepts_cash: boolean;
  accepts_card: boolean;
  auto_accept_nearby: boolean;
  notification_settings: NotificationSettings;
}

export interface WorkSchedule {
  day: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  is_active: boolean;
}

export interface NotificationSettings {
  booking_requests: boolean;
  payment_updates: boolean;
  system_updates: boolean;
  promotional: boolean;
  sound_enabled: boolean;
  vibration_enabled: boolean;
}

export interface DriverMetrics {
  acceptance_rate: number;
  cancellation_rate: number;
  average_rating: number;
  total_distance_km: number;
  online_hours_today: number;
  trips_completed_today: number;
  earnings_today: number;
}

export interface NearbyDriver {
  driver: Driver;
  distance_km: number;
  eta_minutes: number;
  is_available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private supabase = inject(SupabaseClient);
  
  private driversSubject = new BehaviorSubject<Driver[]>([]);
  private onlineDriversSubject = new BehaviorSubject<Driver[]>([]);
  private currentDriverSubject = new BehaviorSubject<Driver | null>(null);
  
  public drivers$ = this.driversSubject.asObservable();
  public onlineDrivers$ = this.onlineDriversSubject.asObservable();
  public currentDriver$ = this.currentDriverSubject.asObservable();

  constructor() {
    this.initializeRealtimeSubscriptions();
  }

  private initializeRealtimeSubscriptions(): void {
    // Subscribe to driver location updates
    this.supabase
      .channel('driver_locations')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'driver_locations' },
        (payload) => this.handleDriverLocationUpdate(payload)
      )
      .subscribe();

    // Subscribe to driver status changes
    this.supabase
      .channel('drivers')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'drivers' },
        (payload) => this.handleDriverStatusUpdate(payload)
      )
      .subscribe();
  }

  private handleDriverLocationUpdate(payload: any): void {
    const drivers = this.driversSubject.value;
    const updatedDrivers = drivers.map(driver => {
      if (driver.id === payload.new.driver_id) {
        return {
          ...driver,
          current_location: {
            latitude: payload.new.latitude,
            longitude: payload.new.longitude,
            heading: payload.new.heading,
            speed: payload.new.speed
          },
          last_seen: payload.new.timestamp
        };
      }
      return driver;
    });
    
    this.driversSubject.next(updatedDrivers);
    this.updateOnlineDrivers(updatedDrivers);
  }

  private handleDriverStatusUpdate(payload: any): void {
    const drivers = this.driversSubject.value;
    const updatedDrivers = drivers.map(driver => {
      if (driver.id === payload.new.id) {
        return { ...driver, ...payload.new };
      }
      return driver;
    });
    
    this.driversSubject.next(updatedDrivers);
    this.updateOnlineDrivers(updatedDrivers);
  }

  private updateOnlineDrivers(drivers: Driver[]): void {
    const onlineDrivers = drivers.filter(driver => 
      driver.status === 'active' && 
      this.isDriverRecentlyActive(driver.last_seen)
    );
    this.onlineDriversSubject.next(onlineDrivers);
  }

  private isDriverRecentlyActive(lastSeen: string): boolean {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Date(lastSeen) > fiveMinutesAgo;
  }

  // Driver Management
  async getAllDrivers(): Promise<Driver[]> {
    try {
      const { data, error } = await this.supabase
        .from('drivers')
        .select(`
          *,
          vehicles (*),
          driver_documents (*),
          user_profiles (first_name, last_name, phone, email, profile_image_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const drivers = data.map(this.mapDriverData);
      this.driversSubject.next(drivers);
      this.updateOnlineDrivers(drivers);
      
      return drivers;
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  }

  async getDriverById(driverId: string): Promise<Driver | null> {
    try {
      const { data, error } = await this.supabase
        .from('drivers')
        .select(`
          *,
          vehicles (*),
          driver_documents (*),
          user_profiles (first_name, last_name, phone, email, profile_image_url)
        `)
        .eq('id', driverId)
        .single();

      if (error) throw error;
      
      return this.mapDriverData(data);
    } catch (error) {
      console.error('Error fetching driver:', error);
      return null;
    }
  }

  async createDriver(driverData: Partial<Driver>): Promise<Driver> {
    try {
      const { data, error } = await this.supabase
        .from('drivers')
        .insert([{
          ...driverData,
          status: 'inactive',
          verification_status: 'pending',
          rating: 5.0,
          total_trips: 0
        }])
        .select()
        .single();

      if (error) throw error;

      const newDriver = await this.getDriverById(data.id);
      if (newDriver) {
        const drivers = [...this.driversSubject.value, newDriver];
        this.driversSubject.next(drivers);
      }

      return newDriver!;
    } catch (error) {
      console.error('Error creating driver:', error);
      throw error;
    }
  }

  async updateDriver(driverId: string, updates: Partial<Driver>): Promise<Driver> {
    try {
      const { error } = await this.supabase
        .from('drivers')
        .update(updates)
        .eq('id', driverId);

      if (error) throw error;

      const updatedDriver = await this.getDriverById(driverId);
      if (updatedDriver) {
        const drivers = this.driversSubject.value.map(driver =>
          driver.id === driverId ? updatedDriver : driver
        );
        this.driversSubject.next(drivers);
      }

      return updatedDriver!;
    } catch (error) {
      console.error('Error updating driver:', error);
      throw error;
    }
  }

  async updateDriverStatus(driverId: string, status: Driver['status']): Promise<void> {
    try {
      await this.updateDriver(driverId, { status });
      
      // Update current driver if it's the same
      const currentDriver = this.currentDriverSubject.value;
      if (currentDriver && currentDriver.id === driverId) {
        this.currentDriverSubject.next({ ...currentDriver, status });
      }
    } catch (error) {
      console.error('Error updating driver status:', error);
      throw error;
    }
  }

  // Location Tracking
  async updateDriverLocation(
    driverId: string,
    latitude: number,
    longitude: number,
    heading?: number,
    speed?: number
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('driver_locations')
        .upsert({
          driver_id: driverId,
          latitude,
          longitude,
          heading,
          speed,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating driver location:', error);
      throw error;
    }
  }

  async getNearbyDrivers(
    latitude: number,
    longitude: number,
    radiusKm: number = environment.app.driverRadiusKm
  ): Promise<NearbyDriver[]> {
    try {
      // Call Supabase function to get nearby drivers with distance calculation
      const { data, error } = await this.supabase
        .rpc('get_nearby_drivers', {
          search_lat: latitude,
          search_lng: longitude,
          radius_km: radiusKm
        });

      if (error) throw error;

      return data.map((item: any) => ({
        driver: this.mapDriverData(item.driver_data),
        distance_km: parseFloat(item.distance_km),
        eta_minutes: this.calculateETA(item.distance_km),
        is_available: item.driver_data.status === 'active'
      }));
    } catch (error) {
      console.error('Error getting nearby drivers:', error);
      return [];
    }
  }

  private calculateETA(distanceKm: number): number {
    // Assume average speed of 30 km/h in city traffic
    const averageSpeedKmh = 30;
    const etaHours = distanceKm / averageSpeedKmh;
    return Math.round(etaHours * 60); // Convert to minutes
  }

  // Driver Verification
  async uploadDriverDocument(
    driverId: string,
    documentType: DriverDocument['type'],
    file: File
  ): Promise<DriverDocument> {
    try {
      // Upload file to Supabase storage
      const fileName = `drivers/${driverId}/${documentType}-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Save document record
      const { data, error } = await this.supabase
        .from('driver_documents')
        .insert([{
          driver_id: driverId,
          type: documentType,
          url: urlData.publicUrl,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error uploading driver document:', error);
      throw error;
    }
  }

  async verifyDriverDocument(
    documentId: string,
    status: 'approved' | 'rejected',
    notes?: string
  ): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      const { error } = await this.supabase
        .from('driver_documents')
        .update({
          status,
          notes,
          verified_at: new Date().toISOString(),
          verified_by: user?.id
        })
        .eq('id', documentId);

      if (error) throw error;

      // Check if all required documents are approved
      await this.checkDriverVerificationStatus(documentId);
    } catch (error) {
      console.error('Error verifying driver document:', error);
      throw error;
    }
  }

  private async checkDriverVerificationStatus(documentId: string): Promise<void> {
    try {
      // Get driver ID from document
      const { data: doc } = await this.supabase
        .from('driver_documents')
        .select('driver_id')
        .eq('id', documentId)
        .single();

      if (!doc) return;

      // Check all required documents
      const { data: documents } = await this.supabase
        .from('driver_documents')
        .select('type, status')
        .eq('driver_id', doc.driver_id);

      const requiredDocs = ['license', 'insurance', 'registration', 'background_check', 'photo'];
      const approvedDocs = documents?.filter(d => d.status === 'approved').map(d => d.type) || [];
      
      const allRequiredApproved = requiredDocs.every(type => approvedDocs.includes(type));
      
      if (allRequiredApproved) {
        await this.updateDriver(doc.driver_id, { 
          verification_status: 'verified',
          status: 'active'
        });
      }
    } catch (error) {
      console.error('Error checking driver verification status:', error);
    }
  }

  // Driver Metrics and Analytics
  async getDriverMetrics(driverId: string): Promise<DriverMetrics> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_driver_metrics', { driver_id: driverId });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error getting driver metrics:', error);
      throw error;
    }
  }

  async getDriverEarnings(driverId: string, period: 'daily' | 'weekly' | 'monthly'): Promise<DriverEarnings> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_driver_earnings', { 
          driver_id: driverId,
          period: period
        });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error getting driver earnings:', error);
      throw error;
    }
  }

  // Driver Assignment
  async assignDriverToBooking(bookingId: string, driverId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('bookings')
        .update({ 
          driver_id: driverId,
          status: 'driver_assigned',
          driver_assigned_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      // Update driver status to busy
      await this.updateDriverStatus(driverId, 'busy');

      // Send notification to driver and passenger
      await this.notifyDriverAssignment(bookingId, driverId);
    } catch (error) {
      console.error('Error assigning driver to booking:', error);
      throw error;
    }
  }

  async findOptimalDriver(
    latitude: number,
    longitude: number,
    vehicleType?: string,
    passengerCount?: number
  ): Promise<Driver | null> {
    try {
      const nearbyDrivers = await this.getNearbyDrivers(latitude, longitude);
      
      // Filter by vehicle type and capacity if specified
      let eligibleDrivers = nearbyDrivers.filter(nd => nd.is_available);
      
      if (vehicleType) {
        eligibleDrivers = eligibleDrivers.filter(nd => 
          nd.driver.vehicle.type === vehicleType
        );
      }
      
      if (passengerCount) {
        eligibleDrivers = eligibleDrivers.filter(nd => 
          nd.driver.vehicle.capacity >= passengerCount
        );
      }
      
      if (eligibleDrivers.length === 0) return null;
      
      // Sort by combination of distance, rating, and acceptance rate
      eligibleDrivers.sort((a, b) => {
        const scoreA = this.calculateDriverScore(a);
        const scoreB = this.calculateDriverScore(b);
        return scoreB - scoreA; // Higher score is better
      });
      
      return eligibleDrivers[0].driver;
    } catch (error) {
      console.error('Error finding optimal driver:', error);
      return null;
    }
  }

  private calculateDriverScore(nearbyDriver: NearbyDriver): number {
    const { driver, distance_km, eta_minutes } = nearbyDriver;
    
    // Scoring factors (0-1 scale, higher is better)
    const distanceScore = Math.max(0, 1 - (distance_km / 10)); // Closer is better
    const ratingScore = driver.rating / 5; // Higher rating is better
    const etaScore = Math.max(0, 1 - (eta_minutes / 30)); // Faster ETA is better
    
    // Weighted combination
    return (distanceScore * 0.4) + (ratingScore * 0.4) + (etaScore * 0.2);
  }

  private async notifyDriverAssignment(bookingId: string, driverId: string): Promise<void> {
    // Implementation would use NotificationService
    // This is a placeholder for the notification logic
    console.log(`Notifying driver ${driverId} about booking ${bookingId}`);
  }

  // Utility Methods
  private mapDriverData(data: any): Driver {
    return {
      id: data.id,
      user_id: data.user_id,
      license_number: data.license_number,
      license_expiry: data.license_expiry,
      vehicle_id: data.vehicle_id,
      status: data.status,
      rating: data.rating,
      total_trips: data.total_trips,
      phone: data.user_profiles?.phone || data.phone,
      email: data.user_profiles?.email || data.email,
      first_name: data.user_profiles?.first_name || data.first_name,
      last_name: data.user_profiles?.last_name || data.last_name,
      profile_image_url: data.user_profiles?.profile_image_url,
      current_location: data.current_location,
      last_seen: data.last_seen,
      verification_status: data.verification_status,
      documents: data.driver_documents || [],
      vehicle: data.vehicles,
      earnings: data.earnings || this.getDefaultEarnings(),
      preferences: data.preferences || this.getDefaultPreferences(),
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  private getDefaultEarnings(): DriverEarnings {
    return {
      daily: 0,
      weekly: 0,
      monthly: 0,
      total: 0,
      pending_payout: 0,
      commission_rate: environment.app.driverCommissionPercent
    };
  }

  private getDefaultPreferences(): DriverPreferences {
    return {
      max_distance_km: environment.app.driverRadiusKm,
      preferred_areas: [],
      work_schedule: this.getDefaultWorkSchedule(),
      accepts_cash: true,
      accepts_card: true,
      auto_accept_nearby: false,
      notification_settings: {
        booking_requests: true,
        payment_updates: true,
        system_updates: true,
        promotional: false,
        sound_enabled: true,
        vibration_enabled: true
      }
    };
  }

  private getDefaultWorkSchedule(): WorkSchedule[] {
    return Array.from({ length: 7 }, (_, i) => ({
      day: i,
      start_time: '06:00',
      end_time: '22:00',
      is_active: true
    }));
  }

  // Current Driver Management (for driver app)
  setCurrentDriver(driver: Driver): void {
    this.currentDriverSubject.next(driver);
  }

  getCurrentDriver(): Driver | null {
    return this.currentDriverSubject.value;
  }

  async goOnline(driverId: string): Promise<void> {
    await this.updateDriverStatus(driverId, 'active');
  }

  async goOffline(driverId: string): Promise<void> {
    await this.updateDriverStatus(driverId, 'offline');
  }
}
