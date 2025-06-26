import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Airport,
  Vehicle,
  BookingRequest,
  QuoteRequest,
  QuoteResponse,
  VehicleQuote
} from '../models/booking.model';
import { ZONES, VEHICLES as FareVehicles, FARE_CONFIG, Zone, Vehicle as FareVehicle } from '../data/fares';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private bookings: BookingRequest[] = [];

  private mapZoneToAirport(zone: Zone, index: number): Airport {
    return {
      id: (index + 1).toString(),
      name: zone.name,
      code: zone.name.substring(0, 3).toUpperCase(),
      city: 'Santiago' // Assuming all zones are in Santiago for now
    };
  }

  private mapFareVehicleToVehicle(fareVehicle: FareVehicle, index: number): Vehicle {
    const vehicleImages = {
      'Taxi': '/assets/images/sedan.jpg',
      'SUV': '/assets/images/suv.jpg'
    };
    const vehicleFeatures = {
        'Taxi': ['Aire acondicionado', 'WiFi', 'Agua gratis', 'Chofer profesional'],
        'SUV': ['Aire acondicionado', 'WiFi', 'Agua gratis', 'Espacio extra', 'Chofer profesional']
    };

    return {
      id: (index + 1).toString(),
      name: fareVehicle.type === 'Taxi' ? 'Sedán Ejecutivo' : 'SUV Premium',
      serviceType: 'exclusive', // All new vehicles are exclusive
      vehicleType: fareVehicle.type,
      capacity: fareVehicle.maxPassengers,
      pricePerKm: 0, // This is no longer used for fare calculation
      imageUrl: vehicleImages[fareVehicle.type],
      features: vehicleFeatures[fareVehicle.type],
      luggageCapacity: fareVehicle.luggageCapacity
    };
  }

  getAirports(): Observable<Airport[]> {
    const airport: Airport = { id: '0', name: 'Aeropuerto Internacional Arturo Merino Benítez', code: 'SCL', city: 'Santiago' };
    const zonesAsAirports = ZONES.map((zone, index) => this.mapZoneToAirport(zone, index));
    return of([airport, ...zonesAsAirports]).pipe(delay(500));
  }

  getVehicles(): Observable<Vehicle[]> {
    const vehicles = FareVehicles.map((v, i) => this.mapFareVehicleToVehicle(v, i));
    return of(vehicles).pipe(delay(500));
  }

  calculateFare(
    zoneName: string,
    vehicleType: 'Taxi' | 'SUV',
    direction: 'to-airport' | 'from-airport',
    passengers: number,
    largeLuggages: number,
    mediumLuggages: number,
    smallLuggages: number
  ): number {
    const zone = ZONES.find((z: Zone) => z.name === zoneName);
    if (!zone) {
      throw new Error('Invalid zone');
    }

    const fareVehicle = FareVehicles.find((v: FareVehicle) => v.type === vehicleType);
    if (!fareVehicle) {
      throw new Error('Invalid vehicle type');
    }

    if (passengers > fareVehicle.maxPassengers) {
      throw new Error(`El vehículo seleccionado no puede llevar más de ${fareVehicle.maxPassengers} pasajeros.`);
    }

    if (largeLuggages > fareVehicle.luggageCapacity.large || mediumLuggages > fareVehicle.luggageCapacity.medium || smallLuggages > fareVehicle.luggageCapacity.small) {
        throw new Error('El equipaje excede la capacidad del vehículo.');
    }

    let totalFare = zone.price;

    // Surcharge for SUV
    if (fareVehicle.type === 'SUV') {
        totalFare *= 1.25; // 25% surcharge for SUV
    }

    if (direction === 'from-airport') {
      totalFare += FARE_CONFIG.fromAirportSurcharge;
    }

    return Math.round(totalFare);
  }


  getQuote(request: QuoteRequest): Observable<QuoteResponse> {
    const { origin, destination, passengers } = request;

    // Determine direction and zone for fare calculation
    let direction: 'to-airport' | 'from-airport';
    let zoneName: string;

    if (origin.code === 'SCL' && destination.code !== 'SCL') {
        direction = 'from-airport';
        zoneName = destination.name;
    } else if (origin.code !== 'SCL' && destination.code === 'SCL') {
        direction = 'to-airport';
        zoneName = origin.name;
    } else {
        // Invalid route, either both are airport or neither is.
        return of({ distance: 0, estimatedDuration: '0', vehicles: [] });
    }

    const vehicleQuotes: VehicleQuote[] = FareVehicles.map((vehicle, index) => {
      let price = 0;
      let available = true;
      let unavailabilityReason = '';

      if (passengers > vehicle.maxPassengers) {
          available = false;
          unavailabilityReason = 'Excede la capacidad de pasajeros.';
      }

      if (available) {
          try {
              // Assuming 0 luggage for quote, or we need to add it to QuoteRequest
              price = this.calculateFare(zoneName, vehicle.type, direction, passengers, 0, 0, 0);
          } catch (error: unknown) {
              available = false;
              if (error instanceof Error) {
                unavailabilityReason = error.message;
              } else {
                unavailabilityReason = 'An unknown error occurred during fare calculation.';
              }
          }
      }

      return {
        vehicle: this.mapFareVehicleToVehicle(vehicle, index),
        price: price,
        available: available,
        unavailabilityReason: !available ? unavailabilityReason : undefined
      };
    });

    const response: QuoteResponse = {
      distance: 50, // This is now an estimate, not used for pricing
      estimatedDuration: '45 mins', // Static estimate
      vehicles: vehicleQuotes
    };

    return of(response).pipe(delay(800));
  }

  createBooking(booking: BookingRequest): Observable<BookingRequest> {
    const newBooking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      status: 'confirmed' as 'confirmed',
      createdAt: new Date()
    };
    this.bookings.push(newBooking);
    console.log('Booking created:', newBooking);
    return of(newBooking).pipe(delay(1000));
  }

  getBooking(id: string): Observable<BookingRequest | undefined> {
    const booking = this.bookings.find(b => b.id === id);
    return of(booking).pipe(delay(500));
  }

  getZones(): Observable<Zone[]> {
    return of(ZONES).pipe(delay(300));
  }

  getFareVehicles(): Observable<FareVehicle[]> {
    return of(FareVehicles).pipe(delay(300));
  }
}
