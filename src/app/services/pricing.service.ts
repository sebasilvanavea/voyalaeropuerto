import { Injectable } from '@angular/core';

export interface VehicleType {
  name: 'taxi' | 'suv';
  maxPassengers: number;
  maxLuggage: {
    trunk: number;
    cabin: number;
    backpacks?: number;
  };
}

export interface Destination {
  name: string;
  basePrice: number;
  zone?: string;
}

export interface PriceCalculation {
  basePrice: number;
  airportSurcharge: number;
  totalPrice: number;
  vehicleType: VehicleType;
  destination: Destination;
}

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  
  private vehicleTypes: VehicleType[] = [
    {
      name: 'taxi',
      maxPassengers: 3,
      maxLuggage: {
        trunk: 2,
        cabin: 2
      }
    },
    {
      name: 'suv',
      maxPassengers: 4,
      maxLuggage: {
        trunk: 3,
        cabin: 2,
        backpacks: 4
      }
    }
  ];

  private destinations: Destination[] = [
    { name: 'Alto Macul', basePrice: 41000 },
    { name: 'Batuco', basePrice: 42000 },
    { name: 'Buin', basePrice: 47000 },
    { name: 'Buin 2', basePrice: 55000 },
    { name: 'Calera de Tango', basePrice: 35000 },
    { name: 'Farellones', basePrice: 120000 },
    { name: 'Casablanca', basePrice: 85000 },
    { name: 'Casino Monticello', basePrice: 75000 },
    { name: 'Cerrillos', basePrice: 25000 },
    { name: 'Cerro Navia', basePrice: 22000 },
    { name: 'Ciudad de los Valles', basePrice: 25000 },
    { name: 'Colina 1 (Plaza)', basePrice: 39000 },
    { name: 'Colina 2', basePrice: 41000 },
    { name: 'Con Con', basePrice: 130000 },
    { name: 'Conchalí', basePrice: 24000 },
    { name: 'Curacaví (Centro)', basePrice: 40000 },
    { name: 'Curacaví (Alrededores)', basePrice: 55000 },
    { name: 'Chicureo', basePrice: 37000 },
    { name: 'Chicureo 2', basePrice: 39000 },
    { name: 'El Bosque', basePrice: 28000 },
    { name: 'El Monte', basePrice: 55000 },
    { name: 'El Noviciado', basePrice: 25000 },
    { name: 'Enea', basePrice: 20000 },
    { name: 'Estación Central', basePrice: 23000 },
    { name: 'Huechuraba (Pedro Fontova)', basePrice: 27000 },
    { name: 'Huechuraba (Av Recoleta)', basePrice: 28000 },
    { name: 'Huechuraba (Av El Salto)', basePrice: 30000 },
    { name: 'Independencia', basePrice: 25000 },
    { name: 'Isla de Maipo', basePrice: 60000 },
    { name: 'La Cisterna', basePrice: 27000 },
    { name: 'La Dehesa 1', basePrice: 40000 },
    { name: 'La Dehesa 2', basePrice: 42000 },
    { name: 'La Florida (Vespucio)', basePrice: 30000 },
    { name: 'La Florida (Av La Florida)', basePrice: 35000 },
    { name: 'La Florida (San José de la Estrella)', basePrice: 33000 },
    { name: 'La Granja', basePrice: 28000 },
    { name: 'La Pintana', basePrice: 30000 },
    { name: 'La Reina', basePrice: 35000 },
    { name: 'La Reina Alta', basePrice: 37000 },
    { name: 'Lampa (Larapinta)', basePrice: 35000 },
    { name: 'Lampa (Valle Grande)', basePrice: 30000 },
    { name: 'Las Condes (El Golf)', basePrice: 28000 },
    { name: 'Las Condes (Parque Arauco)', basePrice: 30000 },
    { name: 'Las Condes (Av Las Condes)', basePrice: 32000 },
    { name: 'Las Condes (San Carlos)', basePrice: 35000 },
    { name: 'Las Vizcachas', basePrice: 48000 },
    { name: 'Las Vizcachas 2', basePrice: 65000 },
    { name: 'Lo Espejo', basePrice: 25000 },
    { name: 'Lo Pinto / Chamisero', basePrice: 37000 },
    { name: 'Lo Prado', basePrice: 22000 },
    { name: 'Lomas de Lo Aguirre', basePrice: 25000 },
    { name: 'Lonquén', basePrice: 32000 },
    { name: 'Los Andes', basePrice: 95000 },
    { name: 'Los Vilos', basePrice: 235000 },
    { name: 'Llay-Llay', basePrice: 90000 },
    { name: 'Macul', basePrice: 30000 },
    { name: 'Maipú (Farfana)', basePrice: 22000 },
    { name: 'Maipú (Plaza Maipú)', basePrice: 25000 },
    { name: 'Maipú (4 Ponientes)', basePrice: 28000 },
    { name: 'Melipilla', basePrice: 85000 },
    { name: 'Nos', basePrice: 40000 },
    { name: 'Ñuñoa (Estadio Nacional)', basePrice: 27000 },
    { name: 'Ñuñoa (Vespucio)', basePrice: 30000 },
    { name: 'Padre Hurtado', basePrice: 35000 },
    { name: 'Paine', basePrice: 55000 },
    { name: 'Pedro Aguirre Cerda', basePrice: 24000 },
    { name: 'Peñaflor', basePrice: 37000 },
    { name: 'Peñalolén (Vespucio)', basePrice: 35000 },
    { name: 'Peñalolén (Consistorial)', basePrice: 40000 },
    { name: 'Pirque', basePrice: 52000 },
    { name: 'Portillo', basePrice: 195000 },
    { name: 'Providencia', basePrice: 27000 },
    { name: 'Pudahuel', basePrice: 20000 },
    { name: 'Puente Alto (Gabriela)', basePrice: 35000 },
    { name: 'Puente Alto (Tocornal)', basePrice: 37500 },
    { name: 'Quilicura', basePrice: 22000 },
    { name: 'Quilicura (Marcoleta)', basePrice: 25000 },
    { name: 'Quinta Normal', basePrice: 22000 },
    { name: 'Rancagua', basePrice: 90000 },
    { name: 'Recoleta', basePrice: 25000 },
    { name: 'Renca', basePrice: 20000 },
    { name: 'San Bernardo (Colón)', basePrice: 32000 },
    { name: 'San Bernardo (Eucaliptus)', basePrice: 35000 },
    { name: 'San Joaquín', basePrice: 27000 },
    { name: 'Cajón del Maipo', basePrice: 95000 },
    { name: 'San Miguel', basePrice: 25000 },
    { name: 'San Ramón', basePrice: 26000 },
    { name: 'Santiago Centro', basePrice: 25000 },
    { name: 'Talagante', basePrice: 45000 },
    { name: 'Viña del Mar / Valparaíso', basePrice: 125000 },
    { name: 'Vitacura (Kennedy con Vespucio)', basePrice: 27000 },
    { name: 'Vitacura (Padre Hurtado)', basePrice: 29000 },
    { name: 'Vitacura (Lo Curro)', basePrice: 32000 }
  ];

  constructor() { }

  getVehicleTypes(): VehicleType[] {
    return this.vehicleTypes;
  }

  getDestinations(): Destination[] {
    return this.destinations.sort((a, b) => a.name.localeCompare(b.name));
  }

  getVehicleType(type: 'taxi' | 'suv'): VehicleType | undefined {
    return this.vehicleTypes.find(v => v.name === type);
  }

  getDestination(name: string): Destination | undefined {
    return this.destinations.find(d => d.name === name);
  }

  calculatePrice(
    destination: string,
    vehicleType: 'taxi' | 'suv',
    isFromAirport: boolean = false
  ): PriceCalculation | null {
    const dest = this.getDestination(destination);
    const vehicle = this.getVehicleType(vehicleType);

    if (!dest || !vehicle) {
      return null;
    }

    const basePrice = dest.basePrice;
    const airportSurcharge = isFromAirport ? 3000 : 0;
    const totalPrice = basePrice + airportSurcharge;

    return {
      basePrice,
      airportSurcharge,
      totalPrice,
      vehicleType: vehicle,
      destination: dest
    };
  }

  isValidPassengerCount(vehicleType: 'taxi' | 'suv', passengers: number): boolean {
    const vehicle = this.getVehicleType(vehicleType);
    return vehicle ? passengers <= vehicle.maxPassengers : false;
  }

  isValidLuggageCount(
    vehicleType: 'taxi' | 'suv',
    luggage: { trunk: number; cabin: number; backpacks?: number }
  ): boolean {
    const vehicle = this.getVehicleType(vehicleType);
    if (!vehicle) return false;

    const isValidTrunk = luggage.trunk <= vehicle.maxLuggage.trunk;
    const isValidCabin = luggage.cabin <= vehicle.maxLuggage.cabin;
    const isValidBackpacks = vehicleType === 'suv' 
      ? (luggage.backpacks || 0) <= (vehicle.maxLuggage.backpacks || 0)
      : (luggage.backpacks || 0) === 0;

    return isValidTrunk && isValidCabin && isValidBackpacks;
  }

  getRecommendedVehicle(passengers: number): 'taxi' | 'suv' | null {
    if (passengers <= 3) return 'taxi';
    if (passengers <= 4) return 'suv';
    return null;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  }
}
