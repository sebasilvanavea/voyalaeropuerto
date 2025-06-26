import { Injectable } from '@angular/core';
import { ZONES, VEHICLES, FARE_CONFIG, Zone, Vehicle } from '../data/fares';

@Injectable({
  providedIn: 'root'
})
export class FareService {

  constructor() { }

  getZones() {
    return ZONES;
  }

  getVehicles() {
    return VEHICLES;
  }

  calculateFare(zoneName: string, vehicleType: 'Taxi' | 'SUV', direction: 'to-airport' | 'from-airport', passengers: number, largeLuggages: number, mediumLuggages: number, smallLuggages: number) {
    const zone = ZONES.find((z: Zone) => z.name === zoneName);
    if (!zone) {
      throw new Error('Invalid zone');
    }

    const vehicle = VEHICLES.find((v: Vehicle) => v.type === vehicleType);
    if (!vehicle) {
      throw new Error('Invalid vehicle type');
    }

    if (passengers > vehicle.maxPassengers) {
      throw new Error(`El vehículo seleccionado no puede llevar más de ${vehicle.maxPassengers} pasajeros.`);
    }

    if (largeLuggages > vehicle.luggageCapacity.large || mediumLuggages > vehicle.luggageCapacity.medium || smallLuggages > vehicle.luggageCapacity.small) {
        throw new Error('El equipaje excede la capacidad del vehículo.');
    }

    let totalFare = zone.price;

    if (direction === 'from-airport') {
      totalFare += FARE_CONFIG.fromAirportSurcharge;
    }

    return totalFare;
  }
}
