import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PricingService, PriceCalculation, Destination, VehicleType } from '../../services/pricing.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-price-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 class="text-2xl font-bold text-gray-900 mb-4 tracking-tight flex items-center gap-2">
        <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
        Calculadora de Tarifas
      </h2>
      <p class="text-gray-600 mb-6">Calcula el precio de tu viaje hacia o desde el aeropuerto</p>

      <form [formGroup]="priceForm" class="space-y-6">
        <!-- Tipo de Servicio -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">Tipo de Servicio</label>
          <div class="grid grid-cols-2 gap-3">
            <label class="relative">
              <input 
                type="radio" 
                formControlName="serviceType" 
                value="toAirport"
                class="sr-only"
                (change)="calculatePrice()"
              >
              <div [class.border-amber-500]="priceForm.value.serviceType === 'toAirport'" 
                   [class.bg-amber-50]="priceForm.value.serviceType === 'toAirport'"
                   class="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-amber-300">
                <svg class="w-8 h-8 text-amber-600 mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="text-sm font-medium">Hacia el Aeropuerto</span>
                <span class="text-xs text-gray-500">Desde tu ubicación</span>
              </div>
            </label>
            <label class="relative">
              <input 
                type="radio" 
                formControlName="serviceType" 
                value="fromAirport"
                class="sr-only"
                (change)="calculatePrice()"
              >
              <div [class.border-amber-500]="priceForm.value.serviceType === 'fromAirport'" 
                   [class.bg-amber-50]="priceForm.value.serviceType === 'fromAirport'"
                   class="flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-amber-300">
                <svg class="w-8 h-8 text-amber-600 mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                <span class="text-sm font-medium">Desde el Aeropuerto</span>
                <span class="text-xs text-gray-500">Recargo de $2.000</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Destino -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Destino</label>
          <select 
            formControlName="destination" 
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            (change)="calculatePrice()"
          >
            <option value="">Selecciona tu destino</option>
            <option *ngFor="let dest of destinations" [value]="dest.name">
              {{ dest.name }} - {{ formatPrice(dest.basePrice) }}
            </option>
          </select>
        </div>

        <!-- Tipo de Vehículo -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">Tipo de Vehículo</label>
          <div class="grid grid-cols-2 gap-4">
            <label class="relative">
              <input 
                type="radio" 
                formControlName="vehicleType" 
                value="taxi"
                class="sr-only"
                (change)="calculatePrice()"
              >
              <div [class.border-amber-500]="priceForm.value.vehicleType === 'taxi'" 
                   [class.bg-amber-50]="priceForm.value.vehicleType === 'taxi'"
                   class="p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-amber-300">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-semibold">Taxi Ejecutivo</span>
                  <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                </div>
                <div class="text-xs text-gray-600 space-y-1">
                  <div>• Máximo 3 pasajeros</div>
                  <div>• 2 maletas bodega + 2 de mano</div>
                </div>
              </div>
            </label>
            <label class="relative">
              <input 
                type="radio" 
                formControlName="vehicleType" 
                value="suv"
                class="sr-only"
                (change)="calculatePrice()"
              >
              <div [class.border-amber-500]="priceForm.value.vehicleType === 'suv'" 
                   [class.bg-amber-50]="priceForm.value.vehicleType === 'suv'"
                   class="p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-amber-300">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-semibold">SUV</span>
                  <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                </div>
                <div class="text-xs text-gray-600 space-y-1">
                  <div>• Máximo 4 pasajeros</div>
                  <div>• 3 maletas bodega + 2 de mano + 4 mochilas</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Número de Pasajeros -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Número de Pasajeros</label>
          <select 
            formControlName="passengers" 
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            (change)="validatePassengers()"
          >
            <option value="">Selecciona cantidad</option>
            <option value="1">1 pasajero</option>
            <option value="2">2 pasajeros</option>
            <option value="3">3 pasajeros</option>
            <option value="4">4 pasajeros</option>
          </select>
          <div *ngIf="passengerError" class="mt-1 text-sm text-red-600">
            {{ passengerError }}
          </div>
        </div>
      </form>

      <!-- Resultado del Cálculo -->
      <div *ngIf="priceCalculation" class="mt-8 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
        <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Cotización
        </h3>
        
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-white rounded-lg">
            <span class="text-gray-600">Destino:</span>
            <span class="font-semibold">{{ priceCalculation.destination.name }}</span>
          </div>
          
          <div class="flex justify-between items-center p-3 bg-white rounded-lg">
            <span class="text-gray-600">Vehículo:</span>
            <span class="font-semibold capitalize">{{ priceCalculation.vehicleType.name === 'taxi' ? 'Taxi Ejecutivo' : 'SUV' }}</span>
          </div>
          
          <div class="flex justify-between items-center p-3 bg-white rounded-lg">
            <span class="text-gray-600">Precio Base:</span>
            <span class="font-semibold">{{ formatPrice(priceCalculation.basePrice) }}</span>
          </div>
          
          <div *ngIf="priceCalculation.airportSurcharge > 0" class="flex justify-between items-center p-3 bg-white rounded-lg">
            <span class="text-gray-600">Recargo desde Aeropuerto:</span>
            <span class="font-semibold text-orange-600">+ {{ formatPrice(priceCalculation.airportSurcharge) }}</span>
          </div>
          
          <div class="flex justify-between items-center p-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg">
            <span class="text-lg font-bold">Precio Total:</span>
            <span class="text-2xl font-bold">{{ formatPrice(priceCalculation.totalPrice) }}</span>
          </div>
        </div>

        <!-- Información adicional del vehículo -->
        <div class="mt-4 p-4 bg-white rounded-lg">
          <h4 class="font-semibold text-gray-700 mb-2">Capacidad del Vehículo:</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Pasajeros:</span>
              <span class="ml-2 font-semibold">{{ priceCalculation.vehicleType.maxPassengers }}</span>
            </div>
            <div>
              <span class="text-gray-600">Maletas bodega:</span>
              <span class="ml-2 font-semibold">{{ priceCalculation.vehicleType.maxLuggage.trunk }}</span>
            </div>
            <div>
              <span class="text-gray-600">Maletas de mano:</span>
              <span class="ml-2 font-semibold">{{ priceCalculation.vehicleType.maxLuggage.cabin }}</span>
            </div>
            <div *ngIf="priceCalculation.vehicleType.name === 'suv'">
              <span class="text-gray-600">Mochilas:</span>
              <span class="ml-2 font-semibold">{{ priceCalculation.vehicleType.maxLuggage.backpacks }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div *ngIf="errorMessage" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-center gap-2 text-red-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 1rem;
    }
  `]
})
export class PriceCalculatorComponent implements OnInit {
  priceForm: FormGroup;
  destinations: Destination[] = [];
  vehicleTypes: VehicleType[] = [];
  priceCalculation: PriceCalculation | null = null;
  errorMessage: string = '';
  passengerError: string = '';

  constructor(
    private fb: FormBuilder,
    private pricingService: PricingService
  ) {
    this.priceForm = this.fb.group({
      serviceType: ['toAirport', Validators.required],
      destination: ['', Validators.required],
      vehicleType: ['taxi', Validators.required],
      passengers: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.destinations = this.pricingService.getDestinations();
    this.vehicleTypes = this.pricingService.getVehicleTypes();
  }

  calculatePrice() {
    const formValue = this.priceForm.value;
    this.errorMessage = '';
    this.priceCalculation = null;

    if (!formValue.destination || !formValue.vehicleType) {
      return;
    }

    const isFromAirport = formValue.serviceType === 'fromAirport';
    
    const calculation = this.pricingService.calculatePrice(
      formValue.destination,
      formValue.vehicleType,
      isFromAirport
    );

    if (calculation) {
      this.priceCalculation = calculation;
    } else {
      this.errorMessage = 'No se pudo calcular el precio para la selección actual.';
    }

    this.validatePassengers();
  }

  validatePassengers() {
    const passengers = parseInt(this.priceForm.value.passengers);
    const vehicleType = this.priceForm.value.vehicleType;
    
    this.passengerError = '';

    if (passengers && vehicleType) {
      const isValid = this.pricingService.isValidPassengerCount(vehicleType, passengers);
      
      if (!isValid) {
        const maxPassengers = vehicleType === 'taxi' ? 3 : 4;
        this.passengerError = `El ${vehicleType === 'taxi' ? 'taxi ejecutivo' : 'SUV'} tiene capacidad máxima para ${maxPassengers} pasajeros.`;
        
        // Sugerir vehículo alternativo
        const recommended = this.pricingService.getRecommendedVehicle(passengers);
        if (recommended && recommended !== vehicleType) {
          this.passengerError += ` Te recomendamos usar un ${recommended === 'suv' ? 'SUV' : 'taxi ejecutivo'}.`;
        }
      }
    }
  }

  formatPrice(price: number): string {
    return this.pricingService.formatPrice(price);
  }
}
