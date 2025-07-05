import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { PricingService, PriceCalculation, Destination, VehicleType } from '../../services/pricing.service';

interface Step {
  number: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface BookingData {
  // Step 1: Route
  direction: 'to-airport' | 'from-airport';
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  returnDate?: string;
  returnTime?: string;
  isRoundTrip: boolean;

  // Step 2: Vehicle
  vehicleType: 'taxi' | 'suv';
  passengers: number;
  luggage: {
    trunk: number;
    cabin: number;
    backpacks: number;
  };

  // Step 3: Details
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  specialRequests: string;
  flightNumber?: string;

  // Step 4: Payment (pricing)
  priceCalculation?: PriceCalculation;
}

@Component({
  selector: 'app-booking-steps',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 pt-20">

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Steps Progress -->
        <div class="mb-8">
          <div class="flex items-center justify-center">
            <div class="flex items-center space-x-4 md:space-x-8">
              <div 
                *ngFor="let step of steps; let i = index"
                class="flex items-center"
              >
                <!-- Step Circle -->
                <div class="flex flex-col items-center">
                  <div 
                    class="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                    [class]="getStepClasses(step)"
                  >
                    <svg 
                      *ngIf="step.isCompleted" 
                      class="w-6 h-6 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span 
                      *ngIf="!step.isCompleted"
                      class="text-sm font-semibold"
                    >
                      {{ step.number }}
                    </span>
                  </div>
                  <span 
                    class="mt-2 text-xs font-medium text-center max-w-20"
                    [class]="step.isActive ? 'text-amber-600' : 'text-gray-500'"
                  >
                    {{ step.title }}
                  </span>
                </div>
                
                <!-- Connector Line -->
                <div 
                  *ngIf="i < steps.length - 1"
                  class="hidden md:block w-16 h-0.5 mx-4 transition-colors duration-300"
                  [class]="steps[i + 1].isCompleted || steps[i + 1].isActive ? 'bg-amber-600' : 'bg-gray-300'"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step Content -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          <!-- Step 1: Route Selection -->
          <div *ngIf="currentStep === 1" class="p-6 md:p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Selecciona tu Ruta</h2>
            
            <form [formGroup]="routeForm" (ngSubmit)="nextStep()">
              <!-- Direction Selection -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">Dirección del viaje</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label class="relative">
                    <input 
                      type="radio" 
                      value="to-airport" 
                      formControlName="direction"
                      class="sr-only"
                    >
                    <div 
                      class="border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
                      [class]="routeForm.get('direction')?.value === 'to-airport' ? 'border-amber-500 bg-amber-50' : 'border-gray-200'"
                    >
                      <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center">
                          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                          </svg>
                        </div>
                        <div>
                          <h3 class="font-semibold text-gray-900">Hacia el Aeropuerto</h3>
                          <p class="text-sm text-gray-500">Desde tu ubicación al aeropuerto</p>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label class="relative">
                    <input 
                      type="radio" 
                      value="from-airport" 
                      formControlName="direction"
                      class="sr-only"
                    >
                    <div 
                      class="border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
                      [class]="routeForm.get('direction')?.value === 'from-airport' ? 'border-amber-500 bg-amber-50' : 'border-gray-200'"
                    >
                      <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 class="font-semibold text-gray-900">Desde el Aeropuerto</h3>
                          <p class="text-sm text-gray-500">Del aeropuerto a tu destino (+$3.000)</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Destination Selection -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ routeForm.get('direction')?.value === 'to-airport' ? 'Origen' : 'Destino' }}
                </label>
                <select 
                  formControlName="destination"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                >
                  <option value="">Selecciona una ubicación</option>
                  <option 
                    *ngFor="let dest of destinations" 
                    [value]="dest.name"
                  >
                    {{ dest.name }} - {{ formatPrice(dest.basePrice) }}
                  </option>
                </select>
              </div>

              <!-- Date and Time -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de salida</label>
                  <input 
                    type="date" 
                    formControlName="departureDate"
                    [min]="minDate"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Hora de salida</label>
                  <input 
                    type="time" 
                    formControlName="departureTime"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                </div>
              </div>

              <!-- Round Trip Option -->
              <div class="mb-6">
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    formControlName="isRoundTrip"
                    class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  >
                  <span class="text-sm font-medium text-gray-700">Viaje de ida y vuelta</span>
                </label>
              </div>

              <!-- Return Date/Time (if round trip) -->
              <div 
                *ngIf="routeForm.get('isRoundTrip')?.value"
                class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
              >
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de regreso</label>
                  <input 
                    type="date" 
                    formControlName="returnDate"
                    [min]="routeForm.get('departureDate')?.value"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Hora de regreso</label>
                  <input 
                    type="time" 
                    formControlName="returnTime"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                </div>
              </div>

              <!-- Continue Button -->
              <div class="flex justify-end">
                <button 
                  type="submit"
                  [disabled]="!routeForm.valid"
                  class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Continuar
                  <svg class="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <!-- Step 2: Vehicle Selection -->
          <div *ngIf="currentStep === 2" class="p-6 md:p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Selecciona tu Vehículo</h2>
            
            <form [formGroup]="vehicleForm" (ngSubmit)="nextStep()">
              <!-- Vehicle Types -->
              <div class="mb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    *ngFor="let vehicle of vehicleTypes"
                    class="border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg"
                    [class]="vehicleForm.get('vehicleType')?.value === vehicle.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'"
                    (click)="selectVehicle(vehicle.name)"
                  >
                    <div class="text-center">
                      <!-- Vehicle Icon -->
                      <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r rounded-xl flex items-center justify-center"
                           [class]="vehicle.name === 'taxi' ? 'from-yellow-400 to-orange-500' : 'from-gray-700 to-gray-900'">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                        </svg>
                      </div>
                      
                      <h3 class="text-xl font-bold text-gray-900 mb-2 capitalize">{{ vehicle.name }}</h3>
                      <p class="text-sm text-gray-600 mb-4">
                        Hasta {{ vehicle.maxPassengers }} pasajeros
                      </p>
                      
                      <!-- Vehicle Features -->
                      <div class="space-y-2 text-sm text-gray-600">
                        <div class="flex items-center justify-center space-x-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                          <span>{{ vehicle.maxPassengers }} pasajeros máx.</span>
                        </div>
                        <div class="flex items-center justify-center space-x-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                          </svg>
                          <span>{{ vehicle.maxLuggage.trunk }} maletas bodega</span>
                        </div>
                        <div *ngIf="vehicle.name === 'suv'" class="flex items-center justify-center space-x-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                          </svg>
                          <span>{{ vehicle.maxLuggage.backpacks }} mochilas extra</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Passengers and Luggage -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Pasajeros</label>
                  <select 
                    formControlName="passengers"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option 
                      *ngFor="let i of getPassengerOptions()" 
                      [value]="i"
                    >
                      {{ i }} {{ i === 1 ? 'pasajero' : 'pasajeros' }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Maletas bodega</label>
                  <select 
                    formControlName="trunkLuggage"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option 
                      *ngFor="let i of getTrunkLuggageOptions()" 
                      [value]="i"
                    >
                      {{ i }} {{ i === 1 ? 'maleta' : 'maletas' }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Equipaje de mano</label>
                  <select 
                    formControlName="cabinLuggage"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option 
                      *ngFor="let i of getCabinLuggageOptions()" 
                      [value]="i"
                    >
                      {{ i }} {{ i === 1 ? 'equipaje' : 'equipajes' }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Backpacks (only for SUV) -->
              <div 
                *ngIf="vehicleForm.get('vehicleType')?.value === 'suv'"
                class="mb-6"
              >
                <label class="block text-sm font-medium text-gray-700 mb-2">Mochilas adicionales</label>
                <select 
                  formControlName="backpacks"
                  class="w-full md:w-1/3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option 
                    *ngFor="let i of getBackpackOptions()" 
                    [value]="i"
                  >
                    {{ i }} {{ i === 1 ? 'mochila' : 'mochilas' }}
                  </option>
                </select>
              </div>

              <!-- Price Preview -->
              <div 
                *ngIf="pricePreview"
                class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6"
              >
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Resumen de precio</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Tarifa base:</span>
                    <span class="font-medium">{{ formatPrice(pricePreview.basePrice) }}</span>
                  </div>
                  <div 
                    *ngIf="pricePreview.airportSurcharge > 0"
                    class="flex justify-between"
                  >
                    <span class="text-gray-600">Recargo aeropuerto:</span>
                    <span class="font-medium">{{ formatPrice(pricePreview.airportSurcharge) }}</span>
                  </div>
                  <div class="border-t pt-2 flex justify-between">
                    <span class="font-semibold text-gray-900">Total:</span>
                    <span class="font-bold text-xl text-blue-600">{{ formatPrice(pricePreview.totalPrice) }}</span>
                  </div>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex justify-between">
                <button 
                  type="button"
                  (click)="previousStep()"
                  class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"/>
                  </svg>
                  Atrás
                </button>
                <button 
                  type="submit"
                  [disabled]="!vehicleForm.valid"
                  class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Continuar
                  <svg class="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <!-- Step 3: Details -->
          <div *ngIf="currentStep === 3" class="p-6 md:p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Detalles del Pasajero</h2>
            
            <form [formGroup]="detailsForm" (ngSubmit)="nextStep()">
              <!-- Passenger Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                  <input 
                    type="text" 
                    formControlName="passengerName"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ingresa tu nombre completo"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input 
                    type="tel" 
                    formControlName="passengerPhone"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+56 9 XXXX XXXX"
                  >
                </div>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  formControlName="passengerEmail"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="tu@email.com"
                >
              </div>

              <!-- Flight Number (if from airport) -->
              <div 
                *ngIf="bookingData.direction === 'from-airport'"
                class="mb-6"
              >
                <label class="block text-sm font-medium text-gray-700 mb-2">Número de vuelo (opcional)</label>
                <input 
                  type="text" 
                  formControlName="flightNumber"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="LA123, AA456, etc."
                >
                <p class="mt-1 text-sm text-gray-500">Nos ayuda a monitorear tu vuelo para ajustar el horario si es necesario</p>
              </div>

              <!-- Special Requests -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">Solicitudes especiales (opcional)</label>
                <textarea 
                  formControlName="specialRequests"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Silla para bebé, aire acondicionado específico, etc."
                ></textarea>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex justify-between">
                <button 
                  type="button"
                  (click)="previousStep()"
                  class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"/>
                  </svg>
                  Atrás
                </button>
                <button 
                  type="submit"
                  [disabled]="!detailsForm.valid"
                  class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Continuar
                  <svg class="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <!-- Step 4: Payment/Confirmation -->
          <div *ngIf="currentStep === 4" class="p-6 md:p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Confirmar Reserva</h2>
            
            <!-- Booking Summary -->
            <div class="space-y-6">
              <!-- Trip Details -->
              <div class="bg-gray-50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Detalles del viaje</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600">Ruta:</span>
                    <p class="font-medium">
                      {{ bookingData.direction === 'to-airport' ? bookingData.destination + ' → Aeropuerto' : 'Aeropuerto → ' + bookingData.destination }}
                    </p>
                  </div>
                  <div>
                    <span class="text-gray-600">Fecha y hora:</span>
                    <p class="font-medium">{{ formatDate(bookingData.departureDate) }} - {{ bookingData.departureTime }}</p>
                  </div>
                  <div>
                    <span class="text-gray-600">Vehículo:</span>
                    <p class="font-medium capitalize">{{ bookingData.vehicleType }}</p>
                  </div>
                  <div>
                    <span class="text-gray-600">Pasajeros:</span>
                    <p class="font-medium">{{ bookingData.passengers }} {{ bookingData.passengers === 1 ? 'pasajero' : 'pasajeros' }}</p>
                  </div>
                </div>
              </div>

              <!-- Passenger Details -->
              <div class="bg-gray-50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Datos del pasajero</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600">Nombre:</span>
                    <p class="font-medium">{{ bookingData.passengerName }}</p>
                  </div>
                  <div>
                    <span class="text-gray-600">Teléfono:</span>
                    <p class="font-medium">{{ bookingData.passengerPhone }}</p>
                  </div>
                  <div class="md:col-span-2">
                    <span class="text-gray-600">Email:</span>
                    <p class="font-medium">{{ bookingData.passengerEmail }}</p>
                  </div>
                  <div *ngIf="bookingData.flightNumber" class="md:col-span-2">
                    <span class="text-gray-600">Número de vuelo:</span>
                    <p class="font-medium">{{ bookingData.flightNumber }}</p>
                  </div>
                </div>
              </div>

              <!-- Price Breakdown -->
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumen de precio</h3>
                <div class="space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Tarifa base ({{ bookingData.destination }}):</span>
                    <span class="font-medium">{{ formatPrice(bookingData.priceCalculation!.basePrice) }}</span>
                  </div>
                  <div 
                    *ngIf="bookingData.priceCalculation!.airportSurcharge > 0"
                    class="flex justify-between text-sm"
                  >
                    <span class="text-gray-600">Recargo desde aeropuerto:</span>
                    <span class="font-medium">{{ formatPrice(bookingData.priceCalculation!.airportSurcharge) }}</span>
                  </div>
                  <div class="border-t border-blue-200 pt-3 flex justify-between">
                    <span class="font-bold text-lg text-gray-900">Total a pagar:</span>
                    <span class="font-bold text-2xl text-blue-600">{{ formatPrice(bookingData.priceCalculation!.totalPrice) }}</span>
                  </div>
                </div>
              </div>

              <!-- Terms and Conditions -->
              <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div class="flex items-start space-x-3">
                  <svg class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                  <div class="text-sm text-yellow-800">
                    <p class="font-medium mb-1">Términos importantes:</p>
                    <ul class="space-y-1">
                      <li>• El conductor te contactará 15 minutos antes del viaje</li>
                      <li>• Cancelaciones sin costo hasta 2 horas antes</li>
                      <li>• El precio incluye conductor, combustible y peajes</li>
                      <li>• Tiempo de espera máximo: 15 minutos en origen</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex justify-between pt-4">
                <button 
                  type="button"
                  (click)="previousStep()"
                  class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"/>
                  </svg>
                  Atrás
                </button>
                <button 
                  (click)="confirmBooking()"
                  [disabled]="isSubmitting"
                  class="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span *ngIf="!isSubmitting">
                    Confirmar Reserva
                    <svg class="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                  <span *ngIf="isSubmitting" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .floating-elements {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .floating-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 6s ease-in-out infinite;
    }

    .floating-1 {
      width: 60px;
      height: 60px;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    .floating-2 {
      width: 40px;
      height: 40px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }

    .floating-3 {
      width: 80px;
      height: 80px;
      bottom: 20%;
      left: 60%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    .header-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      opacity: 0.9;
    }

    .title-underline {
      height: 3px;
      background: linear-gradient(90deg, #fff, transparent);
      margin-top: 8px;
      border-radius: 2px;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    .animate-pulse-slow {
      animation: pulse 3s ease-in-out infinite;
    }
  `]
})
export class BookingStepsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentStep = 1;
  isSubmitting = false;
  minDate = new Date().toISOString().split('T')[0];

  steps: Step[] = [
    { number: 1, title: 'Ruta', isCompleted: false, isActive: true },
    { number: 2, title: 'Vehículo', isCompleted: false, isActive: false },
    { number: 3, title: 'Detalles', isCompleted: false, isActive: false },
    { number: 4, title: 'Confirmar', isCompleted: false, isActive: false }
  ];

  destinations: Destination[] = [];
  vehicleTypes: VehicleType[] = [];
  pricePreview?: PriceCalculation;

  // Forms
  routeForm: FormGroup;
  vehicleForm: FormGroup;
  detailsForm: FormGroup;

  // Booking data accumulator
  bookingData: BookingData = {
    direction: 'to-airport',
    origin: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    isRoundTrip: false,
    vehicleType: 'taxi',
    passengers: 1,
    luggage: { trunk: 0, cabin: 0, backpacks: 0 },
    passengerName: '',
    passengerEmail: '',
    passengerPhone: '',
    specialRequests: ''
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private bookingService: BookingService,
    private pricingService: PricingService,
    private authService: AuthService
  ) {
    this.destinations = this.pricingService.getDestinations();
    this.vehicleTypes = this.pricingService.getVehicleTypes();

    // Initialize forms
    this.routeForm = this.fb.group({
      direction: ['to-airport', Validators.required],
      destination: ['', Validators.required],
      departureDate: ['', Validators.required],
      departureTime: ['', Validators.required],
      isRoundTrip: [false],
      returnDate: [''],
      returnTime: ['']
    });

    this.vehicleForm = this.fb.group({
      vehicleType: ['taxi', Validators.required],
      passengers: [1, [Validators.required, Validators.min(1)]],
      trunkLuggage: [0, [Validators.required, Validators.min(0)]],
      cabinLuggage: [0, [Validators.required, Validators.min(0)]],
      backpacks: [0, [Validators.required, Validators.min(0)]]
    });

    this.detailsForm = this.fb.group({
      passengerName: ['', [Validators.required, Validators.minLength(2)]],
      passengerEmail: ['', [Validators.required, Validators.email]],
      passengerPhone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{8,}$/)]],
      flightNumber: [''],
      specialRequests: ['']
    });
  }

  ngOnInit() {
    // Set default departure time to current time + 2 hours
    const now = new Date();
    now.setHours(now.getHours() + 2);
    const timeString = now.toTimeString().slice(0, 5);
    this.routeForm.patchValue({ departureTime: timeString });

    // Watch for form changes to update price preview
    this.routeForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateBookingData();
      this.updatePricePreview();
    });

    this.vehicleForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateBookingData();
      this.updatePricePreview();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Step navigation
  nextStep() {
    if (this.currentStep < 4) {
      this.updateBookingData();
      this.steps[this.currentStep - 1].isCompleted = true;
      this.steps[this.currentStep - 1].isActive = false;
      this.currentStep++;
      this.steps[this.currentStep - 1].isActive = true;
      this.updatePricePreview();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.steps[this.currentStep - 1].isActive = false;
      this.steps[this.currentStep - 1].isCompleted = false;
      this.currentStep--;
      this.steps[this.currentStep - 1].isActive = true;
      this.steps[this.currentStep - 1].isCompleted = false;
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  // Step styles
  getStepClasses(step: Step): string {
    if (step.isCompleted) {
      return 'bg-amber-600 border-amber-600 text-white';
    } else if (step.isActive) {
      return 'bg-white border-amber-600 text-amber-600 ring-2 ring-amber-600 ring-offset-2';
    } else {
      return 'bg-white border-gray-300 text-gray-400';
    }
  }

  // Vehicle selection
  selectVehicle(vehicleType: 'taxi' | 'suv') {
    this.vehicleForm.patchValue({ vehicleType });
    
    // Reset passengers and luggage to valid ranges
    const maxPassengers = vehicleType === 'taxi' ? 3 : 4;
    if (this.vehicleForm.get('passengers')?.value > maxPassengers) {
      this.vehicleForm.patchValue({ passengers: maxPassengers });
    }

    // Reset luggage limits
    const maxTrunk = vehicleType === 'taxi' ? 2 : 3;
    const maxCabin = 2;
    
    if (this.vehicleForm.get('trunkLuggage')?.value > maxTrunk) {
      this.vehicleForm.patchValue({ trunkLuggage: maxTrunk });
    }
    
    if (this.vehicleForm.get('cabinLuggage')?.value > maxCabin) {
      this.vehicleForm.patchValue({ cabinLuggage: maxCabin });
    }

    // Reset backpacks for taxi
    if (vehicleType === 'taxi') {
      this.vehicleForm.patchValue({ backpacks: 0 });
    }
  }

  // Options generators
  getPassengerOptions(): number[] {
    const vehicleType = this.vehicleForm.get('vehicleType')?.value;
    const max = vehicleType === 'taxi' ? 3 : 4;
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  getTrunkLuggageOptions(): number[] {
    const vehicleType = this.vehicleForm.get('vehicleType')?.value;
    const max = vehicleType === 'taxi' ? 2 : 3;
    return Array.from({ length: max + 1 }, (_, i) => i);
  }

  getCabinLuggageOptions(): number[] {
    return Array.from({ length: 3 }, (_, i) => i);
  }

  getBackpackOptions(): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }

  // Update booking data
  updateBookingData() {
    if (this.currentStep >= 1) {
      const routeValues = this.routeForm.value;
      this.bookingData = {
        ...this.bookingData,
        ...routeValues
      };
    }

    if (this.currentStep >= 2) {
      const vehicleValues = this.vehicleForm.value;
      this.bookingData = {
        ...this.bookingData,
        vehicleType: vehicleValues.vehicleType,
        passengers: vehicleValues.passengers,
        luggage: {
          trunk: vehicleValues.trunkLuggage,
          cabin: vehicleValues.cabinLuggage,
          backpacks: vehicleValues.backpacks
        }
      };
    }

    if (this.currentStep >= 3) {
      const detailsValues = this.detailsForm.value;
      this.bookingData = {
        ...this.bookingData,
        ...detailsValues
      };
    }
  }

  // Update price preview
  updatePricePreview() {
    if (this.bookingData.destination && this.bookingData.vehicleType) {
      this.pricePreview = this.pricingService.calculatePrice(
        this.bookingData.destination,
        this.bookingData.vehicleType,
        this.bookingData.direction === 'from-airport'
      ) || undefined;
      
      this.bookingData.priceCalculation = this.pricePreview;
    }
  }

  // Confirm booking
  async confirmBooking() {
    this.isSubmitting = true;
    
    try {
      // Get current user
      const user = this.authService.getCurrentUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Prepare booking data for submission according to Booking interface
      const bookingRequest = {
        user_id: user.id,
        service_type: this.bookingData.direction === 'to-airport' ? 'toAirport' as const : 'fromAirport' as const,
        vehicle_type: this.bookingData.vehicleType,
        destination: this.bookingData.destination,
        date_time: `${this.bookingData.departureDate}T${this.bookingData.departureTime}:00`,
        address: this.bookingData.direction === 'to-airport' ? this.bookingData.destination : 'Aeropuerto Internacional Arturo Merino Benítez',
        passengers: this.bookingData.passengers,
        luggage: this.bookingData.luggage,
        base_price: this.bookingData.priceCalculation?.basePrice || 0,
        airport_surcharge: this.bookingData.priceCalculation?.airportSurcharge || 0,
        total_price: this.bookingData.priceCalculation?.totalPrice || 0,
        status: 'pending' as const,
        notes: [
          this.bookingData.specialRequests,
          this.bookingData.flightNumber ? `Vuelo: ${this.bookingData.flightNumber}` : '',
          `Contacto: ${this.bookingData.passengerName} - ${this.bookingData.passengerPhone} - ${this.bookingData.passengerEmail}`
        ].filter(Boolean).join(' | ')
      };

      const result = await this.bookingService.createBooking(bookingRequest);
      
      // Redirect to success page
      this.router.navigate(['/booking-success'], {
        queryParams: { 
          bookingId: result.id,
          total: this.bookingData.priceCalculation?.totalPrice 
        }
      });
      
    } catch (error) {
      console.error('Error creating booking:', error);
      // Handle error (show toast, etc.)
    } finally {
      this.isSubmitting = false;
    }
  }

  // Utility methods
  formatPrice(price: number): string {
    return this.pricingService.formatPrice(price);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
