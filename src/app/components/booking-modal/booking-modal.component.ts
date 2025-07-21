import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Modal Overlay -->
    <div 
      *ngIf="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
      (click)="closeModal($event)"
    >
      <!-- Modal Container -->
      <div class="min-h-screen px-4 text-center">
        <!-- Spacer for centering -->
        <div class="inline-block h-screen align-middle" aria-hidden="true">&#8203;</div>
        
        <!-- Modal Content -->
        <div 
          class="inline-block w-full max-w-6xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl modal-content"
          (click)="$event.stopPropagation()"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <div>
              <h2 class="text-3xl font-bold text-gray-900">Reserva tu Viaje</h2>
              <p class="text-gray-600 mt-1">Complete los siguientes pasos para confirmar su reserva</p>
            </div>
            <button 
              (click)="closeModal()"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

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
                        [class]="step.isActive ? 'text-white' : 'text-gray-500'"
                      >
                        {{ step.number }}
                      </span>
                    </div>
                    <span 
                      class="mt-2 text-xs md:text-sm font-medium text-center max-w-24"
                      [class]="step.isActive ? 'text-yellow-600' : step.isCompleted ? 'text-green-600' : 'text-gray-500'"
                    >
                      {{ step.title }}
                    </span>
                  </div>
                  
                  <!-- Connector Line -->
                  <div 
                    *ngIf="i < steps.length - 1"
                    class="w-8 md:w-16 h-0.5 mx-2 md:mx-4 transition-all duration-300"
                    [class]="steps[i + 1].isCompleted || steps[i + 1].isActive ? 'bg-yellow-500' : 'bg-gray-300'"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step Content Container -->
          <div class="bg-white rounded-lg min-h-[400px]">

            <!-- Step 1: Route Configuration -->
            <div *ngIf="currentStep === 1" class="space-y-6">
              <div class="text-center mb-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Configuración de Ruta</h3>
                <p class="text-gray-600">Seleccione el origen, destino y fechas de su viaje</p>
              </div>

              <form [formGroup]="routeForm" class="space-y-6">
                <!-- Direction Selection -->
                <div class="space-y-4">
                  <label class="block text-sm font-semibold text-gray-700">Dirección del Viaje</label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="relative cursor-pointer">
                      <input
                        type="radio"
                        value="to-airport"
                        formControlName="direction"
                        class="sr-only"
                      >
                      <div class="p-4 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300"
                           [class]="routeForm.get('direction')?.value === 'to-airport' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'">
                        <div class="flex items-center space-x-3">
                          <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                          </svg>
                          <div>
                            <h4 class="font-bold text-gray-900">Hacia el Aeropuerto</h4>
                            <p class="text-sm text-gray-700 font-medium">Desde tu ubicación al aeropuerto</p>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label class="relative cursor-pointer">
                      <input
                        type="radio"
                        value="from-airport"
                        formControlName="direction"
                        class="sr-only"
                      >
                      <div class="p-4 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300"
                           [class]="routeForm.get('direction')?.value === 'from-airport' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'">
                        <div class="flex items-center space-x-3">
                          <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                          </svg>
                          <div>
                            <h4 class="font-bold text-gray-900">Desde el Aeropuerto</h4>
                            <p class="text-sm text-gray-700 font-medium">Del aeropuerto a tu destino</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Origin and Destination -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-bold text-gray-900 mb-2">
                      {{ routeForm.get('direction')?.value === 'to-airport' ? 'Origen' : 'Destino' }}
                    </label>
                    <select formControlName="origin" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium">
                      <option value="">Seleccionar ubicación</option>
                      <option *ngFor="let dest of destinations" [value]="dest.name">
                        {{ dest.name }} - {{ dest.basePrice | currency:'CLP':'symbol':'1.0-0' }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-900 mb-2">
                      {{ routeForm.get('direction')?.value === 'to-airport' ? 'Destino' : 'Origen' }}
                    </label>
                    <input
                      type="text"
                      value="Aeropuerto Arturo Merino Benítez (SCL)"
                      readonly
                      class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-medium"
                    >
                  </div>
                </div>

                <!-- Date and Time -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-bold text-gray-900 mb-2">Fecha de Salida</label>
                    <input
                      type="date"
                      formControlName="departureDate"
                      [min]="minDate"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-gray-900 mb-2">Hora de Salida</label>
                    <input
                      type="time"
                      formControlName="departureTime"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium"
                    >
                  </div>
                </div>

                <!-- Round Trip Option -->
                <div class="space-y-4">
                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      formControlName="isRoundTrip"
                      class="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    >
                    <span class="text-sm font-bold text-gray-900">Viaje de ida y vuelta</span>
                  </label>

                  <div *ngIf="routeForm.get('isRoundTrip')?.value" class="grid grid-cols-1 md:grid-cols-2 gap-6 ml-7">
                    <div>
                      <label class="block text-sm font-bold text-gray-900 mb-2">Fecha de Regreso</label>
                      <input
                        type="date"
                        formControlName="returnDate"
                        [min]="routeForm.get('departureDate')?.value"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium"
                      >
                    </div>

                    <div>
                      <label class="block text-sm font-bold text-gray-900 mb-2">Hora de Regreso</label>
                      <input
                        type="time"
                        formControlName="returnTime"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium"
                      >
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <!-- Step 2: Vehicle Selection -->
            <div *ngIf="currentStep === 2" class="space-y-6">
              <div class="text-center mb-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Selección de Vehículo</h3>
                <p class="text-gray-700 font-medium">Elija el vehículo y configure los detalles de su viaje</p>
              </div>

              <form [formGroup]="vehicleForm" class="space-y-6">
                <!-- Vehicle Type Selection -->
                <div class="space-y-4">
                  <label class="block text-sm font-bold text-gray-900">Tipo de Vehículo</label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="relative cursor-pointer">
                      <input
                        type="radio"
                        value="taxi"
                        formControlName="vehicleType"
                        class="sr-only"
                      >
                      <div class="p-6 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300"
                           [class]="vehicleForm.get('vehicleType')?.value === 'taxi' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'">
                        <div class="text-center space-y-3">
                          <svg class="w-12 h-12 mx-auto text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                          </svg>
                          <div>
                            <h4 class="font-bold text-lg text-gray-900">Taxi</h4>
                            <p class="text-sm text-gray-700 font-medium">1-4 pasajeros</p>
                            <p class="text-xs text-gray-600 font-medium mt-2">Sedan cómodo y económico</p>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label class="relative cursor-pointer">
                      <input
                        type="radio"
                        value="suv"
                        formControlName="vehicleType"
                        class="sr-only"
                      >
                      <div class="p-6 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300"
                           [class]="vehicleForm.get('vehicleType')?.value === 'suv' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'">
                        <div class="text-center space-y-3">
                          <svg class="w-12 h-12 mx-auto text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                          </svg>
                          <div>
                            <h4 class="font-bold text-lg text-gray-900">SUV</h4>
                            <p class="text-sm text-gray-700 font-medium">1-6 pasajeros</p>
                            <p class="text-xs text-gray-600 font-medium mt-2">Mayor espacio y comodidad</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Passengers -->
                <div>
                  <label class="block text-sm font-bold text-gray-900 mb-2">Número de Pasajeros</label>
                  <select formControlName="passengers" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium">
                    <option value="1">1 pasajero</option>
                    <option value="2">2 pasajeros</option>
                    <option value="3">3 pasajeros</option>
                    <option value="4">4 pasajeros</option>
                    <option value="5" *ngIf="vehicleForm.get('vehicleType')?.value === 'suv'">5 pasajeros</option>
                    <option value="6" *ngIf="vehicleForm.get('vehicleType')?.value === 'suv'">6 pasajeros</option>
                  </select>
                </div>

                <!-- Luggage Configuration -->
                <div class="space-y-4">
                  <h4 class="text-lg font-semibold text-gray-900">Configuración de Equipaje</h4>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Maletas de Bodega</label>
                      <select formControlName="luggageTrunk" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                        <option value="0">0 maletas</option>
                        <option value="1">1 maleta</option>
                        <option value="2">2 maletas</option>
                        <option value="3">3 maletas</option>
                        <option value="4">4 maletas</option>
                        <option value="5">5 maletas</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Equipaje de Mano</label>
                      <select formControlName="luggageCabin" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                        <option value="0">0 equipajes</option>
                        <option value="1">1 equipaje</option>
                        <option value="2">2 equipajes</option>
                        <option value="3">3 equipajes</option>
                        <option value="4">4 equipajes</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Mochilas</label>
                      <select formControlName="luggageBackpacks" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                        <option value="0">0 mochilas</option>
                        <option value="1">1 mochila</option>
                        <option value="2">2 mochilas</option>
                        <option value="3">3 mochilas</option>
                        <option value="4">4 mochilas</option>
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <!-- Step 3: Passenger Details -->
            <div *ngIf="currentStep === 3" class="space-y-6">
              <div class="text-center mb-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Detalles del Pasajero</h3>
                <p class="text-gray-600">Ingrese la información del pasajero principal</p>
              </div>

              <form [formGroup]="detailsForm" class="space-y-6">
                <!-- Personal Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      formControlName="passengerName"
                      placeholder="Ingrese su nombre completo"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      formControlName="passengerPhone"
                      placeholder="+56 9 1234 5678"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    formControlName="passengerEmail"
                    placeholder="su.email@ejemplo.com"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                </div>

                <!-- Flight Information -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Número de Vuelo (Opcional)</label>
                  <input
                    type="text"
                    formControlName="flightNumber"
                    placeholder="Ej: LA123, SK456"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                  <p class="mt-1 text-sm text-gray-500">Nos ayuda a monitorear retrasos de vuelos</p>
                </div>

                <!-- Special Requests -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Solicitudes Especiales (Opcional)</label>
                  <textarea
                    formControlName="specialRequests"
                    rows="3"
                    placeholder="Silla para bebé, accesibilidad, etc."
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  ></textarea>
                </div>
              </form>
            </div>

            <!-- Step 4: Payment Summary -->
            <div *ngIf="currentStep === 4" class="space-y-6">
              <div class="text-center mb-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Resumen y Pago</h3>
                <p class="text-gray-600">Revise los detalles de su reserva antes de confirmar</p>
              </div>

              <!-- Booking Summary -->
              <div class="bg-gray-50 rounded-lg p-6 space-y-4">
                <h4 class="text-lg font-semibold text-gray-900 mb-4">Resumen de la Reserva</h4>
                
                <!-- Route Summary -->
                <div class="border-b border-gray-200 pb-4">
                  <h5 class="font-medium text-gray-900 mb-2">Ruta</h5>
                  <p class="text-sm text-gray-600">
                    <span class="font-medium">{{ getRouteDescription() }}</span>
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ bookingData.departureDate }} a las {{ bookingData.departureTime }}
                  </p>
                  <p *ngIf="bookingData.isRoundTrip" class="text-sm text-gray-600">
                    Regreso: {{ bookingData.returnDate }} a las {{ bookingData.returnTime }}
                  </p>
                </div>

                <!-- Vehicle Summary -->
                <div class="border-b border-gray-200 pb-4">
                  <h5 class="font-medium text-gray-900 mb-2">Vehículo</h5>
                  <p class="text-sm text-gray-600">
                    <span class="font-medium">{{ bookingData.vehicleType === 'taxi' ? 'Taxi' : 'SUV' }}</span>
                    - {{ bookingData.passengers }} pasajero{{ bookingData.passengers > 1 ? 's' : '' }}
                  </p>
                  <p class="text-sm text-gray-600">
                    Equipaje: {{ bookingData.luggage.trunk }} maleta{{ bookingData.luggage.trunk !== 1 ? 's' : '' }}, 
                    {{ bookingData.luggage.cabin }} equipaje{{ bookingData.luggage.cabin !== 1 ? 's' : '' }} de mano, 
                    {{ bookingData.luggage.backpacks }} mochila{{ bookingData.luggage.backpacks !== 1 ? 's' : '' }}
                  </p>
                </div>

                <!-- Passenger Summary -->
                <div class="border-b border-gray-200 pb-4">
                  <h5 class="font-medium text-gray-900 mb-2">Pasajero</h5>
                  <p class="text-sm text-gray-600">{{ bookingData.passengerName }}</p>
                  <p class="text-sm text-gray-600">{{ bookingData.passengerEmail }}</p>
                  <p class="text-sm text-gray-600">{{ bookingData.passengerPhone }}</p>
                  <p *ngIf="bookingData.flightNumber" class="text-sm text-gray-600">
                    Vuelo: {{ bookingData.flightNumber }}
                  </p>
                </div>

                <!-- Price Summary -->
                <div *ngIf="priceCalculation" class="space-y-2">
                  <h5 class="font-medium text-gray-900 mb-2">Precio</h5>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Tarifa base:</span>
                    <span class="font-medium">{{ priceCalculation.basePrice | currency:'CLP':'symbol':'1.0-0' }}</span>
                  </div>
                  <div *ngIf="priceCalculation.airportSurcharge > 0" class="flex justify-between text-sm">
                    <span class="text-gray-600">Recargo aeropuerto:</span>
                    <span class="font-medium">{{ priceCalculation.airportSurcharge | currency:'CLP':'symbol':'1.0-0' }}</span>
                  </div>
                  <div class="border-t border-gray-300 pt-2 flex justify-between">
                    <span class="font-semibold text-gray-900">Total:</span>
                    <span class="font-bold text-xl text-yellow-600">{{ priceCalculation.totalPrice | currency:'CLP':'symbol':'1.0-0' }}</span>
                  </div>
                </div>
              </div>

              <!-- Payment Button -->
              <div class="text-center pt-6">
                <button
                  (click)="processPayment()"
                  [disabled]="isProcessingPayment"
                  class="inline-flex items-center px-8 py-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg *ngIf="!isProcessingPayment" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                  <svg *ngIf="isProcessingPayment" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isProcessingPayment ? 'Procesando...' : 'Confirmar y Pagar $' + (priceCalculation?.totalPrice || 0) }}
                </button>
              </div>
            </div>

          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              *ngIf="currentStep > 1"
              (click)="previousStep()"
              class="inline-flex items-center px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Anterior
            </button>

            <div class="flex-1"></div>

            <button
              *ngIf="currentStep < 4"
              (click)="nextStep()"
              [disabled]="!isCurrentStepValid()"
              class="inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Siguiente
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-content {
      max-height: 90vh;
      overflow-y: auto;
    }

    /* Smooth modal animation */
    .modal-content {
      animation: modalSlideIn 0.3s ease-out;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    /* Custom scrollbar for modal */
    .modal-content::-webkit-scrollbar {
      width: 6px;
    }

    .modal-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    .modal-content::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }

    .modal-content::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `]
})
export class BookingModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() bookingCompleted = new EventEmitter<any>();

  private destroy$ = new Subject<void>();
  
  currentStep = 1;
  isProcessingPayment = false;
  
  steps: Step[] = [
    { number: 1, title: 'Ruta', isCompleted: false, isActive: true },
    { number: 2, title: 'Vehículo', isCompleted: false, isActive: false },
    { number: 3, title: 'Detalles', isCompleted: false, isActive: false },
    { number: 4, title: 'Pago', isCompleted: false, isActive: false }
  ];

  destinations: Destination[] = [];
  vehicleTypes: VehicleType[] = [];
  priceCalculation: PriceCalculation | null = null;
  minDate: string;

  // Forms
  routeForm: FormGroup;
  vehicleForm: FormGroup;
  detailsForm: FormGroup;

  // Booking data
  bookingData: BookingData = {
    direction: 'to-airport',
    origin: '',
    destination: 'Aeropuerto Arturo Merino Benítez (SCL)',
    departureDate: '',
    departureTime: '',
    isRoundTrip: false,
    vehicleType: 'taxi',
    passengers: 1,
    luggage: {
      trunk: 1,
      cabin: 1,
      backpacks: 0
    },
    passengerName: '',
    passengerEmail: '',
    passengerPhone: '',
    specialRequests: '',
    flightNumber: ''
  };

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthService,
    private pricingService: PricingService
  ) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    // Initialize forms
    this.routeForm = this.fb.group({
      direction: ['to-airport', Validators.required],
      origin: ['', Validators.required],
      departureDate: ['', Validators.required],
      departureTime: ['', Validators.required],
      isRoundTrip: [false],
      returnDate: [''],
      returnTime: ['']
    });

    this.vehicleForm = this.fb.group({
      vehicleType: ['taxi', Validators.required],
      passengers: [1, [Validators.required, Validators.min(1)]],
      luggageTrunk: [1, [Validators.required, Validators.min(0)]],
      luggageCabin: [1, [Validators.required, Validators.min(0)]],
      luggageBackpacks: [0, [Validators.required, Validators.min(0)]]
    });

    this.detailsForm = this.fb.group({
      passengerName: ['', [Validators.required, Validators.minLength(2)]],
      passengerEmail: ['', [Validators.required, Validators.email]],
      passengerPhone: ['', [Validators.required, Validators.pattern(/^(\+56|56)?[ -]?9[ -]?\d{4}[ -]?\d{4}$/)]],
      flightNumber: [''],
      specialRequests: ['']
    });
  }

  ngOnInit(): void {
    this.loadDestinations();
    this.loadVehicleTypes();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDestinations(): void {
    this.destinations = this.pricingService.getDestinations();
  }

  private loadVehicleTypes(): void {
    this.vehicleTypes = this.pricingService.getVehicleTypes();
  }

  private setupFormSubscriptions(): void {
    // Route form changes
    this.routeForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateBookingData();
        this.calculatePrice();
      });

    // Vehicle form changes
    this.vehicleForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateBookingData();
        this.calculatePrice();
      });

    // Details form changes
    this.detailsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateBookingData();
      });

    // Round trip validation
    this.routeForm.get('isRoundTrip')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(isRoundTrip => {
        const returnDateControl = this.routeForm.get('returnDate');
        const returnTimeControl = this.routeForm.get('returnTime');
        
        if (isRoundTrip) {
          returnDateControl?.setValidators([Validators.required]);
          returnTimeControl?.setValidators([Validators.required]);
        } else {
          returnDateControl?.clearValidators();
          returnTimeControl?.clearValidators();
          returnDateControl?.setValue('');
          returnTimeControl?.setValue('');
        }
        
        returnDateControl?.updateValueAndValidity();
        returnTimeControl?.updateValueAndValidity();
      });
  }

  closeModal(event?: Event): void {
    if (event && event.target !== event.currentTarget) {
      return;
    }
    this.closeEvent.emit();
  }

  getStepClasses(step: Step): string {
    if (step.isCompleted) {
      return 'bg-green-500 border-green-500';
    } else if (step.isActive) {
      return 'bg-yellow-500 border-yellow-500';
    } else {
      return 'bg-white border-gray-300';
    }
  }

  nextStep(): void {
    if (!this.isCurrentStepValid()) return;

    this.steps[this.currentStep - 1].isCompleted = true;
    this.steps[this.currentStep - 1].isActive = false;
    
    if (this.currentStep < 4) {
      this.currentStep++;
      this.steps[this.currentStep - 1].isActive = true;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.steps[this.currentStep - 1].isActive = false;
      this.steps[this.currentStep - 1].isCompleted = false;
      this.currentStep--;
      this.steps[this.currentStep - 1].isActive = true;
      this.steps[this.currentStep - 1].isCompleted = false;
    }
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.routeForm.valid;
      case 2:
        return this.vehicleForm.valid;
      case 3:
        return this.detailsForm.valid;
      case 4:
        return true;
      default:
        return false;
    }
  }

  private updateBookingData(): void {
    // Update from route form
    const routeValues = this.routeForm.value;
    this.bookingData.direction = routeValues.direction;
    this.bookingData.origin = routeValues.origin;
    this.bookingData.departureDate = routeValues.departureDate;
    this.bookingData.departureTime = routeValues.departureTime;
    this.bookingData.isRoundTrip = routeValues.isRoundTrip;
    this.bookingData.returnDate = routeValues.returnDate;
    this.bookingData.returnTime = routeValues.returnTime;

    // Update from vehicle form
    const vehicleValues = this.vehicleForm.value;
    this.bookingData.vehicleType = vehicleValues.vehicleType;
    this.bookingData.passengers = vehicleValues.passengers;
    this.bookingData.luggage = {
      trunk: vehicleValues.luggageTrunk,
      cabin: vehicleValues.luggageCabin,
      backpacks: vehicleValues.luggageBackpacks
    };

    // Update from details form
    const detailsValues = this.detailsForm.value;
    this.bookingData.passengerName = detailsValues.passengerName;
    this.bookingData.passengerEmail = detailsValues.passengerEmail;
    this.bookingData.passengerPhone = detailsValues.passengerPhone;
    this.bookingData.flightNumber = detailsValues.flightNumber;
    this.bookingData.specialRequests = detailsValues.specialRequests;
  }

  private calculatePrice(): void {
    if (!this.routeForm.get('origin')?.value || !this.vehicleForm.get('vehicleType')?.value) {
      return;
    }

    const destinationName = this.routeForm.get('origin')?.value;
    const vehicleType = this.vehicleForm.get('vehicleType')?.value as 'taxi' | 'suv';
    const isFromAirport = this.routeForm.get('direction')?.value === 'from-airport';

    if (destinationName) {
      const calculation = this.pricingService.calculatePrice(destinationName, vehicleType, isFromAirport);
      if (calculation) {
        this.priceCalculation = calculation;
        this.bookingData.priceCalculation = calculation;
      }
    }
  }

  getRouteDescription(): string {
    const origin = this.bookingData.origin;
    const destination = this.bookingData.destination;
    
    if (this.bookingData.direction === 'to-airport') {
      return `${origin} → ${destination}`;
    } else {
      return `${destination} → ${origin}`;
    }
  }

  async processPayment(): Promise<void> {
    this.isProcessingPayment = true;

    try {
      // For now, just simulate the booking process
      // Later this will integrate with the actual booking service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Emit booking completed event with the booking data
      this.bookingCompleted.emit(this.bookingData);
      this.closeModal();
      
      // Reset form for next use
      this.resetModal();
    } catch (error) {
      console.error('Error processing payment:', error);
      // Handle error (show notification, etc.)
    } finally {
      this.isProcessingPayment = false;
    }
  }

  private resetModal(): void {
    this.currentStep = 1;
    this.isProcessingPayment = false;
    this.priceCalculation = null;
    
    // Reset steps
    this.steps = [
      { number: 1, title: 'Ruta', isCompleted: false, isActive: true },
      { number: 2, title: 'Vehículo', isCompleted: false, isActive: false },
      { number: 3, title: 'Detalles', isCompleted: false, isActive: false },
      { number: 4, title: 'Pago', isCompleted: false, isActive: false }
    ];

    // Reset forms
    this.routeForm.reset({
      direction: 'to-airport',
      isRoundTrip: false
    });

    this.vehicleForm.reset({
      vehicleType: 'taxi',
      passengers: 1,
      luggageTrunk: 1,
      luggageCabin: 1,
      luggageBackpacks: 0
    });

    this.detailsForm.reset();

    // Reset booking data
    this.bookingData = {
      direction: 'to-airport',
      origin: '',
      destination: 'Aeropuerto Arturo Merino Benítez (SCL)',
      departureDate: '',
      departureTime: '',
      isRoundTrip: false,
      vehicleType: 'taxi',
      passengers: 1,
      luggage: {
        trunk: 1,
        cabin: 1,
        backpacks: 0
      },
      passengerName: '',
      passengerEmail: '',
      passengerPhone: '',
      specialRequests: '',
      flightNumber: ''
    };
  }
}
