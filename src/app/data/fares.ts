
export interface Zone {
  name: string;
  price: number;
}

// Tarifas base hacia el aeropuerto
export const ZONES: Zone[] = [
  { name: 'Alto Macul', price: 41000 },
  { name: 'Batuco', price: 42000 },
  { name: 'Buin', price: 47000 },
  { name: 'Buin 2', price: 55000 },
  { name: 'Calera de Tango', price: 35000 },
  { name: 'Farellones', price: 120000 },
  { name: 'Casablanca', price: 85000 },
  { name: 'Casino Monticello', price: 75000 },
  { name: 'Cerrillos', price: 25000 },
  { name: 'Cerro Navia', price: 22000 },
  { name: 'Ciudad de los Valles', price: 25000 },
  { name: 'Colina 1 (Plaza)', price: 39000 },
  { name: 'Colina 2', price: 41000 },
  { name: 'Con Con', price: 130000 },
  { name: 'Conchalí', price: 24000 },
  { name: 'Curacaví (Centro)', price: 40000 },
  { name: 'Curacaví (Alrededores)', price: 55000 },
  { name: 'Chicureo', price: 37000 },
  { name: 'Chicureo 2', price: 39000 },
  { name: 'El Bosque', price: 28000 },
  { name: 'El Monte', price: 55000 },
  { name: 'El Noviciado', price: 25000 },
  { name: 'Enea', price: 20000 },
  { name: 'Estación Central', price: 23000 },
  { name: 'Huechuraba (Pedro Fontova)', price: 27000 },
  { name: 'Huechuraba (Av Recoleta)', price: 28000 },
  { name: 'Huechuraba (Av El Salto)', price: 30000 },
  { name: 'Independencia', price: 25000 },
  { name: 'Isla de Maipo', price: 60000 },
  { name: 'La Cisterna', price: 27000 },
  { name: 'La Dehesa 1', price: 40000 },
  { name: 'La Dehesa 2', price: 42000 },
  { name: 'La Florida (Vespucio)', price: 30000 },
  { name: 'La Florida (Av La Florida)', price: 35000 },
  { name: 'La Florida (San José de la Estrella)', price: 33000 },
  { name: 'La Granja', price: 28000 },
  { name: 'La Pintana', price: 30000 },
  { name: 'La Reina', price: 35000 },
  { name: 'La Reina Alta', price: 37000 },
  { name: 'Lampa (Larapinta)', price: 35000 },
  { name: 'Lampa (Valle Grande)', price: 30000 },
  { name: 'Las Condes (El Golf)', price: 28000 },
  { name: 'Las Condes (Parque Arauco)', price: 30000 },
  { name: 'Las Condes (Av Las Condes)', price: 32000 },
  { name: 'Las Condes (San Carlos)', price: 35000 },
  { name: 'Las Vizcachas', price: 48000 },
  { name: 'Las Vizcachas 2', price: 65000 },
  { name: 'Lo Espejo', price: 25000 },
  { name: 'Lo Pinto / Chamisero', price: 37000 },
  { name: 'Lo Prado', price: 22000 },
  { name: 'Lomas de lo Aguirre', price: 25000 },
  { name: 'Lonquén', price: 32000 },
  { name: 'Los Andes', price: 95000 },
  { name: 'Los Vilos', price: 235000 },
  { name: 'Llay-Llay', price: 90000 },
  { name: 'Macul', price: 30000 },
  { name: 'Maipú (Farfana)', price: 22000 },
  { name: 'Maipú (Plaza Maipú)', price: 25000 },
  { name: 'Maipú (4 Poniente)', price: 28000 },
  { name: 'Melipilla', price: 85000 },
  { name: 'Nos', price: 40000 },
  { name: 'Ñuñoa (Estadio Nacional)', price: 27000 },
  { name: 'Ñuñoa (Vespucio)', price: 30000 },
  { name: 'Padre Hurtado', price: 35000 },
  { name: 'Paine', price: 55000 },
  { name: 'Pedro Aguirre Cerda', price: 24000 },
  { name: 'Peñaflor', price: 37000 },
  { name: 'Peñalolén (Vespucio)', price: 35000 },
  { name: 'Peñalolén (Consistorial)', price: 40000 },
  { name: 'Pirque', price: 52000 },
  { name: 'Portillo', price: 195000 },
  { name: 'Providencia', price: 27000 },
  { name: 'Pudahuel', price: 20000 },
  { name: 'Puente Alto (Gabriela)', price: 35000 },
  { name: 'Puente Alto (Tocornal)', price: 37500 },
  { name: 'Quilicura', price: 22000 },
  { name: 'Quilicura (Marcoleta)', price: 25000 },
  { name: 'Quinta Normal', price: 22000 },
  { name: 'Rancagua', price: 90000 },
  { name: 'Recoleta', price: 25000 },
  { name: 'Renca', price: 20000 },
  { name: 'San Bernardo (Colón)', price: 32000 },
  { name: 'San Bernardo (Eucaliptus)', price: 35000 },
  { name: 'San Joaquín', price: 27000 },
  { name: 'Cajón del Maipo', price: 95000 },
  { name: 'San Miguel', price: 25000 },
  { name: 'San Ramón', price: 26000 },
  { name: 'Santiago Centro', price: 25000 },
  { name: 'Talagante', price: 45000 },
  { name: 'Viña del Mar / Valparaíso', price: 125000 },
  { name: 'Vitacura (Kennedy con Vespucio)', price: 27000 },
  { name: 'Vitacura (Padre Hurtado)', price: 29000 },
  { name: 'Vitacura (Lo Curro)', price: 32000 },
];

export interface Vehicle {
  type: 'Taxi' | 'SUV';
  maxPassengers: number;
  luggageCapacity: {
    large: number;    // Maletas en bodega
    medium: number;   // Maletas de mano
    small: number;    // Mochilas
  };
}

export const VEHICLES: Vehicle[] = [
  {
    type: 'Taxi',
    maxPassengers: 3,
    luggageCapacity: {
      large: 2,
      medium: 0,
      small: 2,
    },
  },
  {
    type: 'SUV',
    maxPassengers: 4,
    luggageCapacity: {
      large: 3,
      medium: 2,
      small: 4,
    },
  },
];

export const FARE_CONFIG = {
  // Nota: El usuario mencionó dos valores ($3.000 y $2.000). Usaré $3.000.
  fromAirportSurcharge: 3000,
};
