import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, EMPTY } from 'rxjs';
import { switchMap, catchError, takeUntil, filter } from 'rxjs/operators';
import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface TripUpdate {
  id: string;
  booking_id: string;
  driver_location: LocationData;
  estimated_arrival?: string;
  distance_remaining?: number;
  traffic_delay?: number;
  status: 'approaching' | 'arrived' | 'in_transit' | 'completed';
  message?: string;
}

export interface GeofenceArea {
  center: { lat: number; lng: number };
  radius: number; // en metros
  type: 'pickup' | 'destination' | 'airport';
}

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private supabase: SupabaseClient;
  private trackingChannel: RealtimeChannel | null = null;
  private watchId: number | null = null;
  private isTracking = false;

  // Observables para el estado del tracking
  private tripUpdatesSubject = new BehaviorSubject<TripUpdate | null>(null);
  private driverLocationSubject = new BehaviorSubject<LocationData | null>(null);
  private connectionStatusSubject = new BehaviorSubject<'connected' | 'disconnected' | 'connecting'>('disconnected');
  private geofenceAlertsSubject = new BehaviorSubject<{type: string; message: string} | null>(null);

  public tripUpdates$ = this.tripUpdatesSubject.asObservable();
  public driverLocation$ = this.driverLocationSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();
  public geofenceAlerts$ = this.geofenceAlertsSubject.asObservable();

  // Estado interno
  private currentBookingId: string | null = null;
  private geofences: GeofenceArea[] = [];
  private lastKnownLocation: LocationData | null = null;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.setupRealtimeConnection();
  }

  // ===============================================
  // CONFIGURACIÓN DEL TRACKING
  // ===============================================

  async startTracking(bookingId: string): Promise<void> {
    try {
      this.currentBookingId = bookingId;
      this.connectionStatusSubject.next('connecting');

      // Configurar geofences para este viaje
      await this.setupGeofences(bookingId);

      // Suscribirse a updates en tiempo real
      await this.subscribeToBookingUpdates(bookingId);

      // Iniciar geolocalización si es conductor
      if (this.isDriver()) {
        await this.startLocationTracking();
      }

      this.isTracking = true;
      this.connectionStatusSubject.next('connected');

    } catch (error) {
      console.error('Error starting tracking:', error);
      this.connectionStatusSubject.next('disconnected');
      throw error;
    }
  }

  async stopTracking(): Promise<void> {
    this.isTracking = false;
    this.currentBookingId = null;

    // Detener geolocalización
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    // Cerrar conexión realtime
    if (this.trackingChannel) {
      await this.supabase.removeChannel(this.trackingChannel);
      this.trackingChannel = null;
    }

    // Limpiar estado
    this.tripUpdatesSubject.next(null);
    this.driverLocationSubject.next(null);
    this.geofenceAlertsSubject.next(null);
    this.connectionStatusSubject.next('disconnected');
  }

  // ===============================================
  // REALTIME SUBSCRIPTIONS
  // ===============================================

  private async setupRealtimeConnection(): Promise<void> {    // Configurar reconexión automática
    // Note: onConnect and onDisconnect are not available in current Supabase version
    // this.supabase.realtime.onConnect(() => {
    //   this.connectionStatusSubject.next('connected');
    // });

    // this.supabase.realtime.onDisconnect(() => {
    //   this.connectionStatusSubject.next('disconnected');
    // });
    
    // Set initial connection status
    this.connectionStatusSubject.next('connected');
  }

  private async subscribeToBookingUpdates(bookingId: string): Promise<void> {
    this.trackingChannel = this.supabase
      .channel(`booking-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trip_tracking',
          filter: `booking_id=eq.${bookingId}`
        },
        (payload) => {
          this.handleTrackingUpdate(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${bookingId}`
        },
        (payload) => {
          this.handleBookingUpdate(payload);
        }
      )
      .subscribe();
  }

  private handleTrackingUpdate(payload: any): void {
    const trackingData = payload.new;
    
    const locationData: LocationData = {
      latitude: trackingData.driver_location.x,
      longitude: trackingData.driver_location.y,
      accuracy: trackingData.accuracy,
      heading: trackingData.heading,
      speed: trackingData.speed,
      timestamp: new Date(trackingData.timestamp).getTime()
    };

    this.driverLocationSubject.next(locationData);
    this.checkGeofences(locationData);
    this.lastKnownLocation = locationData;
  }

  private handleBookingUpdate(payload: any): void {
    const booking = payload.new;
    
    // Notificar cambios de estado del viaje
    if (booking.status) {
      const message = this.getStatusMessage(booking.status);
      this.tripUpdatesSubject.next({
        id: payload.new.id,
        booking_id: booking.id,
        driver_location: this.lastKnownLocation!,
        status: booking.status,
        message
      });
    }
  }

  // ===============================================
  // GEOLOCALIZACIÓN PARA CONDUCTORES
  // ===============================================

  private async startLocationTracking(): Promise<void> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation not supported');
    }

    // Configuración de alta precisión
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.handleLocationUpdate(position),
      (error) => this.handleLocationError(error),
      options
    );
  }

  private async handleLocationUpdate(position: GeolocationPosition): Promise<void> {
    if (!this.currentBookingId) return;

    const locationData: LocationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      heading: position.coords.heading || undefined,
      speed: position.coords.speed || undefined,
      timestamp: position.timestamp
    };

    // Guardar en base de datos
    try {
      await this.supabase
        .from('trip_tracking')
        .insert({
          booking_id: this.currentBookingId,
          driver_location: `POINT(${locationData.longitude} ${locationData.latitude})`,
          speed: locationData.speed,
          heading: locationData.heading,
          accuracy: locationData.accuracy,
          timestamp: new Date(locationData.timestamp).toISOString()
        });

      this.lastKnownLocation = locationData;
      this.driverLocationSubject.next(locationData);

    } catch (error) {
      console.error('Error saving location:', error);
    }
  }

  private handleLocationError(error: GeolocationPositionError): void {
    let message = 'Error de ubicación desconocido';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'Permisos de ubicación denegados';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Ubicación no disponible';
        break;
      case error.TIMEOUT:
        message = 'Tiempo de espera agotado para obtener ubicación';
        break;
    }

    console.error('Geolocation error:', message);
  }

  // ===============================================
  // GEOFENCING
  // ===============================================

  private async setupGeofences(bookingId: string): Promise<void> {
    try {
      const { data: booking } = await this.supabase
        .from('bookings')
        .select(`
          *,
          pickup_location,
          destination_location
        `)
        .eq('id', bookingId)
        .single();

      if (!booking) return;

      this.geofences = [];

      // Geofence de recogida
      if (booking.pickup_location) {
        this.geofences.push({
          center: {
            lat: booking.pickup_location.x,
            lng: booking.pickup_location.y
          },
          radius: 100, // 100 metros
          type: 'pickup'
        });
      }

      // Geofence de destino
      if (booking.destination_location) {
        this.geofences.push({
          center: {
            lat: booking.destination_location.x,
            lng: booking.destination_location.y
          },
          radius: 100,
          type: 'destination'
        });
      }

      // Geofence del aeropuerto (si aplica)
      if (booking.service_type === 'toAirport' || booking.service_type === 'fromAirport') {
        this.geofences.push({
          center: {
            lat: -33.3928, // Coordenadas del Aeropuerto SCL
            lng: -70.7856
          },
          radius: 500, // 500 metros para el aeropuerto
          type: 'airport'
        });
      }

    } catch (error) {
      console.error('Error setting up geofences:', error);
    }
  }

  private checkGeofences(location: LocationData): void {
    for (const geofence of this.geofences) {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        geofence.center.lat,
        geofence.center.lng
      );

      if (distance <= geofence.radius) {
        this.triggerGeofenceAlert(geofence.type, distance);
      }
    }
  }

  private triggerGeofenceAlert(type: string, distance: number): void {
    let message = '';

    switch (type) {
      case 'pickup':
        message = `El conductor ha llegado al punto de recogida (${Math.round(distance)}m)`;
        break;
      case 'destination':
        message = `Llegando al destino (${Math.round(distance)}m)`;
        break;
      case 'airport':
        message = `Entrando al área del aeropuerto (${Math.round(distance)}m)`;
        break;
    }

    this.geofenceAlertsSubject.next({ type, message });

    // Auto-limpiar la alerta después de 5 segundos
    setTimeout(() => {
      this.geofenceAlertsSubject.next(null);
    }, 5000);
  }

  // ===============================================
  // CÁLCULOS Y ESTIMACIONES
  // ===============================================

  async getEstimatedArrival(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number
  ): Promise<{ duration: number; distance: number; route?: any }> {
    try {
      // Usar Google Maps API o similar para estimaciones precisas
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?` +
        `origin=${fromLat},${fromLng}&` +
        `destination=${toLat},${toLng}&` +
        `key=${environment.googleMapsApiKey}&` +
        `departure_time=now&` +
        `traffic_model=best_guess`
      );

      const data = await response.json();
      
      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];

        return {
          duration: leg.duration_in_traffic?.value || leg.duration.value, // en segundos
          distance: leg.distance.value, // en metros
          route: route
        };
      }

      // Fallback: cálculo estimado
      const distance = this.calculateDistance(fromLat, fromLng, toLat, toLng);
      const estimatedDuration = (distance / 1000) * 120; // 30 km/h promedio en ciudad

      return {
        duration: estimatedDuration,
        distance: distance
      };

    } catch (error) {
      console.error('Error calculating estimated arrival:', error);
      
      // Fallback calculation
      const distance = this.calculateDistance(fromLat, fromLng, toLat, toLng);
      const estimatedDuration = (distance / 1000) * 120;

      return {
        duration: estimatedDuration,
        distance: distance
      };
    }
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distancia en metros
  }

  // ===============================================
  // NOTIFICACIONES Y ALERTAS
  // ===============================================

  async sendLocationUpdate(bookingId: string, message: string): Promise<void> {
    try {
      await this.supabase
        .from('notifications')
        .insert({
          user_id: (await this.getBookingUserId(bookingId)),
          type: 'booking',
          title: 'Actualización de ubicación',
          message: message,
          data: {
            booking_id: bookingId,
            location: this.lastKnownLocation
          }
        });
    } catch (error) {
      console.error('Error sending location update:', error);
    }
  }

  private async getBookingUserId(bookingId: string): Promise<string> {
    const { data } = await this.supabase
      .from('bookings')
      .select('user_id')
      .eq('id', bookingId)
      .single();
    
    return data?.user_id;
  }

  // ===============================================
  // MÉTODOS PÚBLICOS PARA LA UI
  // ===============================================

  async getBookingLocation(bookingId: string): Promise<LocationData | null> {
    try {
      const { data } = await this.supabase
        .from('trip_tracking')
        .select('*')
        .eq('booking_id', bookingId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (!data) return null;

      return {
        latitude: data.driver_location.x,
        longitude: data.driver_location.y,
        accuracy: data.accuracy,
        heading: data.heading,
        speed: data.speed,
        timestamp: new Date(data.timestamp).getTime()
      };

    } catch (error) {
      console.error('Error fetching booking location:', error);
      return null;
    }
  }

  async getTripHistory(bookingId: string): Promise<LocationData[]> {
    try {
      const { data } = await this.supabase
        .from('trip_tracking')
        .select('*')
        .eq('booking_id', bookingId)
        .order('timestamp', { ascending: true });

      if (!data) return [];

      return data.map(record => ({
        latitude: record.driver_location.x,
        longitude: record.driver_location.y,
        accuracy: record.accuracy,
        heading: record.heading,
        speed: record.speed,
        timestamp: new Date(record.timestamp).getTime()
      }));

    } catch (error) {
      console.error('Error fetching trip history:', error);
      return [];
    }
  }

  isLocationTrackingEnabled(): boolean {
    return this.isTracking && this.watchId !== null;
  }

  getCurrentLocation(): LocationData | null {
    return this.lastKnownLocation;
  }

  // ===============================================
  // UTILIDADES
  // ===============================================

  private isDriver(): boolean {
    // Verificar si el usuario actual es un conductor
    // Esto debería verificarse con el servicio de autenticación
    return localStorage.getItem('user_role') === 'driver';
  }
  private getStatusMessage(status: string): string {
    const messages: { [key: string]: string } = {
      'confirmed': 'Tu viaje ha sido confirmado',
      'assigned': 'Conductor asignado',
      'approaching': 'El conductor se está acercando',
      'arrived': 'El conductor ha llegado',
      'in_progress': 'Viaje en progreso',
      'completed': 'Viaje completado'
    };

    return messages[status] || 'Estado actualizado';
  }

  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    } else {
      return `${(meters / 1000).toFixed(1)}km`;
    }
  }

  formatDuration(seconds: number): string {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  }
}
