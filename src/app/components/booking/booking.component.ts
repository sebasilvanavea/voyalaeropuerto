import { Component, ChangeDetectorRef, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { PricingService } from '../../services/pricing.service';
import { BookingService, BookingFormData } from '../../services/booking.service';
import { UINotificationService } from '../../services/ui-notification.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

type BookingVariant = 'hero' | 'section';

interface BookingData {
  route: any;
  vehicle: any;
  details: any;
  totalPrice: number;
  bookingId?: string;
  timestamp?: Date;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

interface ValidationErrors {
  [key: string]: string[];
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="booking-cta-container" [ngClass]="getContainerClasses()">
      <!-- Booking Preview (when not in booking mode) -->
      <div *ngIf="!isBookingMode" class="space-y-6">
        <!-- Modern Hero Section -->
        <div class="text-center" [ngClass]="getHeaderClasses()">
          <div class="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl shadow-lg" [ngClass]="getIconClasses()">
            <svg class="text-white" [ngClass]="getIconSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </div>
          <h2 class="font-bold text-slate-900" [ngClass]="getTitleClasses()">
            Reserva tu Traslado
          </h2>
          <p class="text-slate-600 max-w-md mx-auto" [ngClass]="getSubtitleClasses()">
            Proceso rápido y seguro en 4 simples pasos
          </p>
        </div>

        <!-- Steps Preview -->
        <div class="grid gap-4" [ngClass]="getStepsGridClasses()">
          <div class="text-center">
            <div class="bg-amber-100 rounded-xl flex items-center justify-center mx-auto hover:bg-amber-200 transition-colors duration-300" [ngClass]="getStepIconClasses()">
              <svg class="text-amber-600" [ngClass]="getStepSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"/>
              </svg>
            </div>
            <span class="font-medium text-slate-700" [ngClass]="getStepTextClasses()">Ruta</span>
          </div>
          <div class="text-center">
            <div class="bg-yellow-100 rounded-xl flex items-center justify-center mx-auto hover:bg-yellow-200 transition-colors duration-300" [ngClass]="getStepIconClasses()">
              <svg class="text-yellow-600" [ngClass]="getStepSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
              </svg>
            </div>
            <span class="font-medium text-slate-700" [ngClass]="getStepTextClasses()">Vehículo</span>
          </div>
          <div class="text-center">
            <div class="bg-orange-100 rounded-xl flex items-center justify-center mx-auto hover:bg-orange-200 transition-colors duration-300" [ngClass]="getStepIconClasses()">
              <svg class="text-orange-600" [ngClass]="getStepSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <span class="font-medium text-slate-700" [ngClass]="getStepTextClasses()">Detalles</span>
          </div>
          <div class="text-center">
            <div class="bg-amber-100 rounded-xl flex items-center justify-center mx-auto hover:bg-amber-200 transition-colors duration-300" [ngClass]="getStepIconClasses()">
              <svg class="text-amber-600" [ngClass]="getStepSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="font-medium text-slate-700" [ngClass]="getStepTextClasses()">Confirmar</span>
          </div>
        </div>

        <!-- Features -->
        <div class="bg-gray-50 rounded-xl border border-gray-200" [ngClass]="getFeaturesClasses()">
          <div class="grid gap-4 text-sm" [ngClass]="getFeaturesGridClasses()">
            <div class="flex items-center space-x-3">
              <div class="bg-amber-100 rounded-full flex items-center justify-center" [ngClass]="getFeatureIconClasses()">
                <svg class="text-amber-600" [ngClass]="getFeatureSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <span class="text-slate-700" [ngClass]="getFeatureTextClasses()">Precios transparentes</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="bg-amber-100 rounded-full flex items-center justify-center" [ngClass]="getFeatureIconClasses()">
                <svg class="text-amber-600" [ngClass]="getFeatureSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <span class="text-slate-700" [ngClass]="getFeatureTextClasses()">Cancelación gratuita</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="bg-amber-100 rounded-full flex items-center justify-center" [ngClass]="getFeatureIconClasses()">
                <svg class="text-amber-600" [ngClass]="getFeatureSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <span class="text-slate-700" [ngClass]="getFeatureTextClasses()">Conductores verificados</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="bg-amber-100 rounded-full flex items-center justify-center" [ngClass]="getFeatureIconClasses()">
                <svg class="text-amber-600" [ngClass]="getFeatureSvgClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <span class="text-slate-700" [ngClass]="getFeatureTextClasses()">Seguimiento en tiempo real</span>
            </div>
          </div>
        </div>

        <!-- CTA Button -->
        <button 
          (click)="startBooking()"
          class="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
          [ngClass]="getButtonClasses()"
        >
          <span class="relative z-10 flex items-center justify-center space-x-2">
            <span>Reservar Ahora</span>
            <svg class="transform group-hover:translate-x-1 transition-transform duration-300" [ngClass]="getButtonIconClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </span>
          <div class="absolute inset-0 bg-gradient-to-r from-yellow-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        <!-- Quick Quote Button -->
        <button 
          (click)="quickQuote()"
          class="w-full bg-white border-2 border-gray-200 hover:border-amber-300 text-gray-700 font-medium rounded-xl transition-all duration-200 hover:bg-gray-50"
          [ngClass]="getSecondaryButtonClasses()"
        >
          Ver Precios Rápidamente
        </button>
      </div>

      <!-- Booking Steps (when in booking mode) -->
      <div *ngIf="isBookingMode" class="space-y-4" [ngClass]="variant === 'hero' ? 'space-y-3' : 'space-y-6'">
        <!-- Header with back button and progress -->
        <div class="flex items-center justify-between" [ngClass]="variant === 'hero' ? 'mb-3' : 'mb-6'">
          <button 
            (click)="exitBooking()"
            class="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            [ngClass]="variant === 'hero' ? 'text-xs' : 'text-sm'"
          >
            <svg [ngClass]="variant === 'hero' ? 'w-3 h-3 mr-1' : 'w-5 h-5 mr-2'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Volver
          </button>
          
          <div class="text-center">
            <h2 [ngClass]="variant === 'hero' ? 'text-sm font-bold text-gray-900' : 'text-xl font-bold text-gray-900'">Reserva tu Traslado</h2>
            <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-600' : 'text-sm text-gray-600'">Paso {{currentStep}} de 4</p>
          </div>
          
          <div [ngClass]="variant === 'hero' ? 'w-8' : 'w-16'"></div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full" [ngClass]="variant === 'hero' ? 'h-1 mb-4' : 'h-2 mb-8'">
          <div 
            class="bg-yellow-500 rounded-full transition-all duration-300"
            [ngClass]="variant === 'hero' ? 'h-1' : 'h-2'"
            [style.width.%]="(currentStep / 4) * 100"
          ></div>
        </div>

        <!-- Step Content -->
        <div class="bg-white rounded-xl border border-gray-200" [ngClass]="variant === 'hero' ? 'p-3' : 'p-6'">
          <!-- Step 1: Route Selection -->
          <div *ngIf="currentStep === 1" [ngClass]="variant === 'hero' ? 'space-y-3' : 'space-y-6'">
            <div class="text-center" [ngClass]="variant === 'hero' ? 'mb-4' : 'mb-8'">
              <h3 [ngClass]="variant === 'hero' ? 'text-lg font-bold text-gray-900 mb-1' : 'text-2xl font-bold text-gray-900 mb-2'">Selecciona tu Ruta</h3>
              <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700 font-medium' : 'text-gray-700 font-medium'">Configura tu viaje desde o hacia el aeropuerto</p>
            </div>

            <form [formGroup]="routeForm" [ngClass]="variant === 'hero' ? 'space-y-3' : 'space-y-6'">
              <!-- Direction Selection -->
              <div [ngClass]="variant === 'hero' ? 'space-y-2' : 'space-y-4'">
                <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900' : 'block text-sm font-bold text-gray-900'">Dirección del Viaje</label>
                <div [ngClass]="variant === 'hero' ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-1 md:grid-cols-2 gap-4'">
                  <label class="relative cursor-pointer">
                    <input
                      type="radio"
                      value="to-airport"
                      formControlName="direction"
                      class="sr-only"
                    >
                    <div [ngClass]="variant === 'hero' ? 'p-2 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300' : 'p-4 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300'"
                         [class]="routeForm.get('direction')?.value === 'to-airport' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'">
                      <div [ngClass]="variant === 'hero' ? 'flex items-center space-x-2' : 'flex items-center space-x-3'">
                        <svg [ngClass]="variant === 'hero' ? 'w-4 h-4 text-yellow-600' : 'w-6 h-6 text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                        <div>
                          <h4 [ngClass]="variant === 'hero' ? 'font-bold text-xs text-gray-900' : 'font-bold text-gray-900'">Hacia el Aeropuerto</h4>
                          <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700 font-medium' : 'text-sm text-gray-700 font-medium'">Desde tu ubicación al aeropuerto</p>
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
                    <div [ngClass]="variant === 'hero' ? 'p-2 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300' : 'p-4 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300'"
                         [class]="routeForm.get('direction')?.value === 'from-airport' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'">
                      <div [ngClass]="variant === 'hero' ? 'flex items-center space-x-2' : 'flex items-center space-x-3'">
                        <svg [ngClass]="variant === 'hero' ? 'w-4 h-4 text-yellow-600' : 'w-6 h-6 text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                        <div>
                          <h4 [ngClass]="variant === 'hero' ? 'font-bold text-xs text-gray-900' : 'font-bold text-gray-900'">Desde el Aeropuerto</h4>
                          <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700 font-medium' : 'text-sm text-gray-700 font-medium'">Del aeropuerto a tu destino</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Locations -->
              <div [ngClass]="variant === 'hero' ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 md:grid-cols-2 gap-6'">
                <div>
                  <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900 mb-1' : 'block text-sm font-bold text-gray-900 mb-2'">
                    {{ routeForm.get('direction')?.value === 'to-airport' ? 'Origen' : 'Destino' }}
                  </label>
                  <select formControlName="origin" [ngClass]="variant === 'hero' ? 'w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium' : 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium'">
                    <option value="">Seleccionar ubicación</option>
                    <option *ngFor="let dest of destinations" [value]="dest.name">
                      {{ dest.name }} - {{ dest.basePrice | currency:'CLP':'symbol':'1.0-0' }}
                    </option>
                  </select>
                </div>

                <div>
                  <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900 mb-1' : 'block text-sm font-bold text-gray-900 mb-2'">
                    {{ routeForm.get('direction')?.value === 'to-airport' ? 'Destino' : 'Origen' }}
                  </label>
                  <input
                    type="text"
                    value="Aeropuerto Arturo Merino Benítez (SCL)"
                    readonly
                    [ngClass]="variant === 'hero' ? 'w-full p-2 text-xs border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-medium' : 'w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-medium'"
                  >
                </div>
              </div>

              <!-- Date and Time -->
              <div [ngClass]="variant === 'hero' ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 md:grid-cols-2 gap-6'">
                <div>
                  <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900 mb-1' : 'block text-sm font-bold text-gray-900 mb-2'">Fecha de Salida</label>
                  <input
                    type="date"
                    formControlName="departureDate"
                    [min]="minDate"
                    [ngClass]="variant === 'hero' ? 'w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium' : 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium'"
                  >
                </div>

                <div>
                  <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900 mb-1' : 'block text-sm font-bold text-gray-900 mb-2'">Hora de Salida</label>
                  <input
                    type="time"
                    formControlName="departureTime"
                    [ngClass]="variant === 'hero' ? 'w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium' : 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium'"
                  >
                </div>
              </div>

              <!-- Round Trip Option -->
              <div [ngClass]="variant === 'hero' ? 'space-y-2' : 'space-y-4'">
                <label [ngClass]="variant === 'hero' ? 'flex items-center space-x-2 cursor-pointer' : 'flex items-center space-x-3 cursor-pointer'">
                  <input
                    type="checkbox"
                    formControlName="isRoundTrip"
                    [ngClass]="variant === 'hero' ? 'w-3 h-3 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500' : 'w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500'"
                  >
                  <span [ngClass]="variant === 'hero' ? 'text-xs font-bold text-gray-900' : 'text-sm font-bold text-gray-900'">Viaje de ida y vuelta</span>
                </label>

                <div *ngIf="routeForm.get('isRoundTrip')?.value" [ngClass]="variant === 'hero' ? 'grid grid-cols-1 gap-3 ml-5' : 'grid grid-cols-1 md:grid-cols-2 gap-6 ml-7'">
                  <div>
                    <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900 mb-1' : 'block text-sm font-bold text-gray-900 mb-2'">Fecha de Regreso</label>
                    <input
                      type="date"
                      formControlName="returnDate"
                      [min]="routeForm.get('departureDate')?.value"
                      [ngClass]="variant === 'hero' ? 'w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium' : 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium'"
                    >
                  </div>

                  <div>
                    <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900 mb-1' : 'block text-sm font-bold text-gray-900 mb-2'">Hora de Regreso</label>
                    <input
                      type="time"
                      formControlName="returnTime"
                      [ngClass]="variant === 'hero' ? 'w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium' : 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium'"
                    >
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Step 2: Vehicle Selection -->
          <div *ngIf="currentStep === 2" [ngClass]="variant === 'hero' ? 'space-y-3' : 'space-y-6'">
            <div class="text-center" [ngClass]="variant === 'hero' ? 'mb-4' : 'mb-8'">
              <h3 [ngClass]="variant === 'hero' ? 'text-lg font-bold text-gray-900 mb-1' : 'text-2xl font-bold text-gray-900 mb-2'">Selección de Vehículo</h3>
              <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700 font-medium' : 'text-gray-700 font-medium'">Elije el vehículo y configure los detalles de su viaje</p>
            </div>

            <form [formGroup]="vehicleForm" [ngClass]="variant === 'hero' ? 'space-y-3' : 'space-y-6'">
              <!-- Vehicle Type Selection -->
              <div [ngClass]="variant === 'hero' ? 'space-y-2' : 'space-y-4'">
                <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900' : 'block text-sm font-bold text-gray-900'">Tipo de Vehículo</label>
                <div [ngClass]="variant === 'hero' ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-1 md:grid-cols-2 gap-4'">
                  <label class="relative cursor-pointer">
                    <input
                      type="radio"
                      value="taxi"
                      formControlName="vehicleType"
                      class="sr-only"
                    >
                    <div [ngClass]="variant === 'hero' ? 'p-3 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300' : 'p-6 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300'"
                         [class]="vehicleForm.get('vehicleType')?.value === 'taxi' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'">
                      <div [ngClass]="variant === 'hero' ? 'text-center space-y-1' : 'text-center space-y-3'">
                        <svg [ngClass]="variant === 'hero' ? 'w-6 h-6 mx-auto text-yellow-600' : 'w-12 h-12 mx-auto text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                        </svg>
                        <div>
                          <h4 [ngClass]="variant === 'hero' ? 'font-bold text-sm text-gray-900' : 'font-bold text-lg text-gray-900'">Taxi</h4>
                          <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700 font-medium' : 'text-sm text-gray-700 font-medium'">1-4 pasajeros</p>
                          <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-600 font-medium mt-1' : 'text-xs text-gray-600 font-medium mt-2'">Sedan cómodo y económico</p>
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
                    <div [ngClass]="variant === 'hero' ? 'p-3 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300' : 'p-6 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300'"
                         [class]="vehicleForm.get('vehicleType')?.value === 'suv' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'">
                      <div [ngClass]="variant === 'hero' ? 'text-center space-y-1' : 'text-center space-y-3'">
                        <svg [ngClass]="variant === 'hero' ? 'w-6 h-6 mx-auto text-yellow-600' : 'w-12 h-12 mx-auto text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                        <div>
                          <h4 [ngClass]="variant === 'hero' ? 'font-bold text-sm text-gray-900' : 'font-bold text-lg text-gray-900'">SUV</h4>
                          <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700 font-medium' : 'text-sm text-gray-700 font-medium'">1-6 pasajeros</p>
                          <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-600 font-medium mt-1' : 'text-xs text-gray-600 font-medium mt-2'">Mayor espacio y comodidad</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Passengers and Luggage -->
              <div [ngClass]="variant === 'hero' ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 md:grid-cols-2 gap-6'">
                <div>
                  <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900 mb-1' : 'block text-sm font-bold text-gray-900 mb-2'">Número de Pasajeros</label>
                  <select formControlName="passengers" [ngClass]="variant === 'hero' ? 'w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium' : 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium'">
                    <option value="1">1 pasajero</option>
                    <option value="2">2 pasajeros</option>
                    <option value="3">3 pasajeros</option>
                    <option value="4">4 pasajeros</option>
                    <option value="5" *ngIf="vehicleForm.get('vehicleType')?.value === 'suv'">5 pasajeros</option>
                    <option value="6" *ngIf="vehicleForm.get('vehicleType')?.value === 'suv'">6 pasajeros</option>
                  </select>
                </div>

                <div>
                  <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900 mb-1' : 'block text-sm font-bold text-gray-900 mb-2'">Equipaje</label>
                  <select formControlName="luggage" [ngClass]="variant === 'hero' ? 'w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium' : 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium'">
                    <option value="1">1 maleta</option>
                    <option value="2">2 maletas</option>
                    <option value="3">3 maletas</option>
                    <option value="4">4 maletas</option>
                    <option value="5" *ngIf="vehicleForm.get('vehicleType')?.value === 'suv'">5 maletas</option>
                    <option value="6" *ngIf="vehicleForm.get('vehicleType')?.value === 'suv'">6 maletas</option>
                  </select>
                </div>
              </div>

              <!-- Price Display -->
              <div [ngClass]="variant === 'hero' ? 'bg-yellow-50 border border-yellow-200 rounded-lg p-3' : 'bg-yellow-50 border border-yellow-200 rounded-lg p-4'">
                <div class="flex justify-between items-center">
                  <span [ngClass]="variant === 'hero' ? 'text-sm font-semibold text-gray-900' : 'text-lg font-semibold text-gray-900'">Precio Estimado:</span>
                  <span [ngClass]="variant === 'hero' ? 'text-lg font-bold text-yellow-600' : 'text-2xl font-bold text-yellow-600'">{{ totalPrice | currency:'CLP':'symbol':'1.0-0' }}</span>
                </div>
                <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-600 mt-1' : 'text-sm text-gray-600 mt-1'">*Precio final puede variar según condiciones del viaje</p>
              </div>
            </form>
          </div>

          <!-- Step 3: Passenger Details -->
          <div *ngIf="currentStep === 3" [ngClass]="variant === 'hero' ? 'space-y-3' : 'space-y-6'">
            <div class="text-center" [ngClass]="variant === 'hero' ? 'mb-4' : 'mb-8'">
              <h3 [ngClass]="variant === 'hero' ? 'text-lg font-bold text-gray-900 mb-1' : 'text-2xl font-bold text-gray-900 mb-2'">Detalles del Pasajero</h3>
              <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700 font-medium' : 'text-gray-700 font-medium'">Complete la información de contacto y viaje</p>
            </div>

            <form [formGroup]="detailsForm" [ngClass]="variant === 'hero' ? 'space-y-3' : 'space-y-6'">
              <!-- Personal Information -->
              <div [ngClass]="variant === 'hero' ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 md:grid-cols-2 gap-6'">
                <div>
                  <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900 mb-1' : 'block text-sm font-bold text-gray-900 mb-2'">Nombre Completo</label>
                  <input
                    type="text"
                    formControlName="fullName"
                    placeholder="Ingrese su nombre completo"
                    [ngClass]="variant === 'hero' ? 'w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium' : 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium'"
                  >
                </div>

                <div>
                  <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900 mb-1' : 'block text-sm font-bold text-gray-900 mb-2'">Teléfono</label>
                  <input
                    type="tel"
                    formControlName="phone"
                    placeholder="+56 9 1234 5678"
                    [ngClass]="variant === 'hero' ? 'w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium' : 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium'"
                  >
                </div>
              </div>

              <div>
                <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900 mb-1' : 'block text-sm font-bold text-gray-900 mb-2'">Email</label>
                <input
                  type="email"
                  formControlName="email"
                  placeholder="correo@ejemplo.com"
                  [ngClass]="variant === 'hero' ? 'w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium' : 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium'"
                >
              </div>

              <!-- Flight Information (if applicable) -->
              <div *ngIf="routeForm.get('direction')?.value === 'from-airport'" [ngClass]="variant === 'hero' ? 'space-y-2' : 'space-y-4'">
                <h4 [ngClass]="variant === 'hero' ? 'text-sm font-semibold text-gray-900' : 'text-lg font-semibold text-gray-900'">Información de Vuelo</h4>
                <div [ngClass]="variant === 'hero' ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 md:grid-cols-2 gap-6'">
                  <div>
                    <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900 mb-1' : 'block text-sm font-bold text-gray-900 mb-2'">Número de Vuelo</label>
                    <input
                      type="text"
                      formControlName="flightNumber"
                      placeholder="Ej: LA123"
                      [ngClass]="variant === 'hero' ? 'w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium' : 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium'"
                    >
                  </div>

                  <div>
                    <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900 mb-1' : 'block text-sm font-bold text-gray-900 mb-2'">Aerolínea</label>
                    <input
                      type="text"
                      formControlName="airline"
                      placeholder="Ej: LATAM Airlines"
                      [ngClass]="variant === 'hero' ? 'w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium' : 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium'"
                    >
                  </div>
                </div>
              </div>

              <!-- Special Requests -->
              <div>
                <label [ngClass]="variant === 'hero' ? 'block text-xs font-bold text-gray-900 mb-1' : 'block text-sm font-bold text-gray-900 mb-2'">Solicitudes Especiales (Opcional)</label>
                <textarea
                  formControlName="specialRequests"
                  [rows]="variant === 'hero' ? 2 : 3"
                  placeholder="Ej: Silla para niños, asistencia especial, etc."
                  [ngClass]="variant === 'hero' ? 'w-full p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none text-gray-900 font-medium' : 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none text-gray-900 font-medium'"
                ></textarea>
              </div>
            </form>
          </div>

          <!-- Step 4: Confirmation -->
          <div *ngIf="currentStep === 4" [ngClass]="variant === 'hero' ? 'space-y-3' : 'space-y-6'">
            <div class="text-center" [ngClass]="variant === 'hero' ? 'mb-4' : 'mb-8'">
              <h3 [ngClass]="variant === 'hero' ? 'text-lg font-bold text-gray-900 mb-1' : 'text-2xl font-bold text-gray-900 mb-2'">Confirmar Reserva</h3>
              <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700 font-medium' : 'text-gray-700 font-medium'">Revisa los detalles antes de confirmar</p>
            </div>

            <!-- Summary -->
            <div [ngClass]="variant === 'hero' ? 'bg-gray-50 rounded-lg p-3 space-y-2' : 'bg-gray-50 rounded-lg p-6 space-y-4'">
              <div [ngClass]="variant === 'hero' ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-1 md:grid-cols-2 gap-4'">
                <div>
                  <h4 [ngClass]="variant === 'hero' ? 'font-semibold text-xs text-gray-900 mb-1' : 'font-semibold text-gray-900 mb-2'">Detalles del Viaje</h4>
                  <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700' : 'text-sm text-gray-700'">
                    <strong>Ruta:</strong> {{ getRouteDisplay() }}
                  </p>
                  <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700' : 'text-sm text-gray-700'">
                    <strong>Fecha:</strong> {{ routeForm.get('departureDate')?.value | date:'dd/MM/yyyy' }}
                  </p>
                  <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700' : 'text-sm text-gray-700'">
                    <strong>Hora:</strong> {{ routeForm.get('departureTime')?.value }}
                  </p>
                  <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700' : 'text-sm text-gray-700'">
                    <strong>Vehículo:</strong> {{ vehicleForm.get('vehicleType')?.value === 'taxi' ? 'Taxi' : 'SUV' }}
                  </p>
                  <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700' : 'text-sm text-gray-700'">
                    <strong>Pasajeros:</strong> {{ vehicleForm.get('passengers')?.value }}
                  </p>
                </div>
                <div>
                  <h4 [ngClass]="variant === 'hero' ? 'font-semibold text-xs text-gray-900 mb-1' : 'font-semibold text-gray-900 mb-2'">Información de Contacto</h4>
                  <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700' : 'text-sm text-gray-700'">
                    <strong>Nombre:</strong> {{ detailsForm.get('fullName')?.value }}
                  </p>
                  <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700' : 'text-sm text-gray-700'">
                    <strong>Teléfono:</strong> {{ detailsForm.get('phone')?.value }}
                  </p>
                  <p [ngClass]="variant === 'hero' ? 'text-xs text-gray-700' : 'text-sm text-gray-700'">
                    <strong>Email:</strong> {{ detailsForm.get('email')?.value }}
                  </p>
                </div>
              </div>

              <div [ngClass]="variant === 'hero' ? 'border-t pt-2' : 'border-t pt-4'">
                <div [ngClass]="variant === 'hero' ? 'flex justify-between items-center text-sm font-bold' : 'flex justify-between items-center text-lg font-bold'">
                  <span>Total:</span>
                  <span class="text-yellow-600">{{ totalPrice | currency:'CLP':'symbol':'1.0-0' }}</span>
                </div>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div [ngClass]="variant === 'hero' ? 'space-y-2' : 'space-y-4'">
              <label [ngClass]="variant === 'hero' ? 'flex items-start space-x-2 cursor-pointer' : 'flex items-start space-x-3 cursor-pointer'">
                <input
                  type="checkbox"
                  [(ngModel)]="acceptTerms"
                  [ngClass]="variant === 'hero' ? 'w-3 h-3 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 mt-0.5' : 'w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 mt-1'"
                >
                <span [ngClass]="variant === 'hero' ? 'text-xs text-gray-700' : 'text-sm text-gray-700'">
                  Acepto los <a href="#" class="text-yellow-600 hover:underline">términos y condiciones</a> 
                  y la <a href="#" class="text-yellow-600 hover:underline">política de privacidad</a>
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div [ngClass]="variant === 'hero' ? 'flex justify-between space-x-2' : 'flex justify-between space-x-4'">
          <button 
            *ngIf="currentStep > 1"
            (click)="previousStep()"
            [ngClass]="variant === 'hero' ? 'px-3 py-2 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors' : 'px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'"
          >
            Anterior
          </button>
          
          <div class="flex-1"></div>
          
          <button 
            *ngIf="currentStep < 4"
            (click)="nextStep()"
            [disabled]="!isCurrentStepValid()"
            [ngClass]="variant === 'hero' ? 'px-3 py-2 text-xs bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed' : 'px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'"
          >
            Siguiente
          </button>
          
          <button 
            *ngIf="currentStep === 4"
            (click)="confirmBooking()"
            [disabled]="!acceptTerms || !isCurrentStepValid()"
            [ngClass]="variant === 'hero' ? 'px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed' : 'px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'"
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-cta-container {
      max-width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingComponent implements OnDestroy {
  @Input() variant: BookingVariant = 'section';

  // State management
  isBookingMode = false;
  currentStep = 1;
  acceptTerms = false;
  totalPrice = 0;
  minDate = new Date().toISOString().split('T')[0];
  isLoading = false;
  isSubmitting = false;
  validationErrors: ValidationErrors = {};

  // RxJS
  private destroy$ = new Subject<void>();

  // Forms
  routeForm!: FormGroup;
  vehicleForm!: FormGroup;
  detailsForm!: FormGroup;

  // Data persistence
  private readonly STORAGE_KEY = 'voyalaeropuerto_booking_draft';

  // Destinations data
  destinations = [
    { name: 'Las Condes', basePrice: 25000, zone: 'oriente' },
    { name: 'Providencia', basePrice: 23000, zone: 'centro' },
    { name: 'Santiago Centro', basePrice: 20000, zone: 'centro' },
    { name: 'Ñuñoa', basePrice: 22000, zone: 'centro' },
    { name: 'La Reina', basePrice: 26000, zone: 'oriente' },
    { name: 'Vitacura', basePrice: 28000, zone: 'oriente' },
    { name: 'Lo Barnechea', basePrice: 35000, zone: 'oriente' },
    { name: 'Maipú', basePrice: 18000, zone: 'poniente' },
    { name: 'Pudahuel', basePrice: 15000, zone: 'poniente' },
    { name: 'San Miguel', basePrice: 19000, zone: 'sur' }
  ];

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private pricingService: PricingService,
    private bookingService: BookingService,
    private uiNotificationService: UINotificationService
  ) {
    this.initializeForms();
    this.setupFormSubscriptions();
    this.loadDraftData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms() {
    this.routeForm = this.fb.group({
      direction: ['to-airport', Validators.required],
      origin: ['', Validators.required],
      departureDate: ['', Validators.required],
      departureTime: ['', Validators.required],
      isRoundTrip: [false],
      returnDate: [''],
      returnTime: ['']
    });

    // Add conditional validators for round trip
    this.routeForm.get('isRoundTrip')?.valueChanges.subscribe(isRoundTrip => {
      const returnDateControl = this.routeForm.get('returnDate');
      const returnTimeControl = this.routeForm.get('returnTime');
      
      if (isRoundTrip) {
        returnDateControl?.setValidators([Validators.required]);
        returnTimeControl?.setValidators([Validators.required]);
      } else {
        returnDateControl?.clearValidators();
        returnTimeControl?.clearValidators();
      }
      
      returnDateControl?.updateValueAndValidity();
      returnTimeControl?.updateValueAndValidity();
    });

    this.vehicleForm = this.fb.group({
      vehicleType: ['taxi', Validators.required],
      passengers: [1, [Validators.required, Validators.min(1), Validators.max(6)]],
      luggage: [1, [Validators.required, Validators.min(1), Validators.max(6)]]
    });

    // Add dynamic passenger/luggage validation based on vehicle type
    this.vehicleForm.get('vehicleType')?.valueChanges.subscribe(vehicleType => {
      const passengersControl = this.vehicleForm.get('passengers');
      const luggageControl = this.vehicleForm.get('luggage');
      
      const maxCapacity = vehicleType === 'suv' ? 6 : 4;
      
      passengersControl?.setValidators([
        Validators.required, 
        Validators.min(1), 
        Validators.max(maxCapacity)
      ]);
      luggageControl?.setValidators([
        Validators.required, 
        Validators.min(1), 
        Validators.max(maxCapacity)
      ]);
      
      passengersControl?.updateValueAndValidity();
      luggageControl?.updateValueAndValidity();
    });

    this.detailsForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?56\s?9\s?\d{4}\s?\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      flightNumber: [''],
      airline: [''],
      specialRequests: ['', Validators.maxLength(500)]
    });

    // Add conditional flight info validation
    this.routeForm.get('direction')?.valueChanges.subscribe(direction => {
      const flightNumberControl = this.detailsForm.get('flightNumber');
      const airlineControl = this.detailsForm.get('airline');
      
      if (direction === 'from-airport') {
        flightNumberControl?.setValidators([Validators.required]);
        airlineControl?.setValidators([Validators.required]);
      } else {
        flightNumberControl?.clearValidators();
        airlineControl?.clearValidators();
      }
      
      flightNumberControl?.updateValueAndValidity();
      airlineControl?.updateValueAndValidity();
    });
  }

  private setupFormSubscriptions() {
    // Debounced price calculation
    const formChanges$ = this.routeForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );

    const vehicleChanges$ = this.vehicleForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );

    formChanges$.subscribe(() => {
      this.calculatePrice();
      this.saveDraftData();
      this.clearValidationErrors();
    });

    vehicleChanges$.subscribe(() => {
      this.calculatePrice();
      this.saveDraftData();
    });

    // Auto-save form data
    this.detailsForm.valueChanges.pipe(
      debounceTime(1000),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.saveDraftData();
    });
  }

  private loadDraftData() {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const draftData = JSON.parse(savedData);
        
        // Load data with validation
        if (draftData.route) {
          this.routeForm.patchValue(draftData.route, { emitEvent: false });
        }
        if (draftData.vehicle) {
          this.vehicleForm.patchValue(draftData.vehicle, { emitEvent: false });
        }
        if (draftData.details) {
          this.detailsForm.patchValue(draftData.details, { emitEvent: false });
        }
        
        this.calculatePrice();
      }
    } catch (error) {
      console.warn('Error loading draft data:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private saveDraftData() {
    try {
      const draftData = {
        route: this.routeForm.value,
        vehicle: this.vehicleForm.value,
        details: this.detailsForm.value,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(draftData));
    } catch (error) {
      console.warn('Error saving draft data:', error);
    }
  }

  private clearDraftData() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private clearValidationErrors() {
    this.validationErrors = {};
  }

  private validateStep(step: number): boolean {
    this.clearValidationErrors();
    let isValid = true;

    switch (step) {
      case 1:
        if (this.routeForm.invalid) {
          this.validationErrors['route'] = this.getFormErrors(this.routeForm);
          isValid = false;
        }
        break;
      case 2:
        if (this.vehicleForm.invalid) {
          this.validationErrors['vehicle'] = this.getFormErrors(this.vehicleForm);
          isValid = false;
        }
        break;
      case 3:
        if (this.detailsForm.invalid) {
          this.validationErrors['details'] = this.getFormErrors(this.detailsForm);
          isValid = false;
        }
        break;
    }

    return isValid;
  }

  private getFormErrors(form: FormGroup): any {
    const errors: any = {};
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    // Usar el servicio de notificaciones UI con el formato correcto
    const title = type === 'success' ? 'Éxito' : type === 'error' ? 'Error' : 'Información';
    
    switch (type) {
      case 'success':
        this.uiNotificationService.showSuccess(title, message);
        break;
      case 'error':
        this.uiNotificationService.showError(title, message);
        break;
      default:
        this.uiNotificationService.showInfo(title, message);
        break;
    }
    
    // También mostrar en consola para desarrollo
    const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    console.log(`${emoji} ${type.toUpperCase()}: ${message}`);
  }

  private calculatePrice() {
    const routeData = this.routeForm.value;
    const vehicleData = this.vehicleForm.value;
    
    if (routeData.origin && vehicleData.vehicleType) {
      this.totalPrice = this.bookingService.calculatePrice(routeData, vehicleData);
    }
  }

  // Navigation methods
  startBooking() {
    this.isBookingMode = true;
    this.currentStep = 1;
    this.cd.detectChanges();
  }

  exitBooking() {
    this.isBookingMode = false;
    this.currentStep = 1;
    this.cd.detectChanges();
  }

  nextStep() {
    if (this.validateStep(this.currentStep) && this.currentStep < 4) {
      this.currentStep++;
      this.cd.detectChanges();
      this.showNotification(`Paso ${this.currentStep} completado`, 'success');
    } else {
      this.showNotification('Por favor complete los campos requeridos', 'error');
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.cd.detectChanges();
    }
  }

  isCurrentStepValid(): boolean {
    return this.validateStep(this.currentStep);
  }

  confirmBooking() {
    if (!this.validateStep(4) || !this.acceptTerms) {
      this.showNotification('Por favor complete todos los campos y acepte los términos', 'error');
      return;
    }

    this.isLoading = true;
    
    // Prepare booking data for the service
    const formData: BookingFormData = {
      route: this.routeForm.value,
      vehicle: this.vehicleForm.value,
      details: this.detailsForm.value,
      totalPrice: this.totalPrice
    };

    // Validate data before sending
    const validation = this.bookingService.validateBookingData(formData);
    if (!validation.isValid) {
      this.showNotification(validation.errors.join(', '), 'error');
      this.isLoading = false;
      return;
    }

    // Create booking using the service
    this.bookingService.createBookingFromForm(formData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (booking) => {
        this.showNotification(`¡Reserva confirmada! Código: ${booking.confirmation_code}`, 'success');
        this.clearDraftData();
        this.exitBooking();
        
        // TODO: Navigate to confirmation page or show booking details
        console.log('Booking created successfully:', booking);
      },
      error: (error) => {
        console.error('Booking error:', error);
        this.showNotification(error.message || 'Error al procesar la reserva. Inténtelo nuevamente.', 'error');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getRouteDisplay(): string {
    const direction = this.routeForm.get('direction')?.value;
    const origin = this.routeForm.get('origin')?.value;
    
    if (direction === 'to-airport') {
      return `${origin} → Aeropuerto SCL`;
    } else {
      return `Aeropuerto SCL → ${origin}`;
    }
  }

  // Métodos para obtener clases dinámicas basadas en la variante
  getContainerClasses(): string {
    return this.variant === 'hero' ? 'p-3 max-w-sm mx-auto' : 'p-4';
  }

  getHeaderClasses(): string {
    return this.variant === 'hero' ? 'mb-3' : 'mb-8';
  }

  getIconClasses(): string {
    return this.variant === 'hero' ? 'w-10 h-10 mb-2' : 'w-16 h-16 mb-6';
  }

  getIconSvgClasses(): string {
    return this.variant === 'hero' ? 'w-5 h-5' : 'w-8 h-8';
  }

  getTitleClasses(): string {
    return this.variant === 'hero' ? 'text-lg mb-1' : 'text-3xl mb-4';
  }

  getSubtitleClasses(): string {
    return this.variant === 'hero' ? 'text-xs' : 'text-lg';
  }

  getStepsGridClasses(): string {
    return this.variant === 'hero' ? 'grid-cols-2 gap-2 mb-3' : 'grid-cols-2 md:grid-cols-4 gap-4 mb-8';
  }

  getStepIconClasses(): string {
    return this.variant === 'hero' ? 'w-6 h-6 mb-1' : 'w-12 h-12 mb-2';
  }

  getStepSvgClasses(): string {
    return this.variant === 'hero' ? 'w-3 h-3' : 'w-6 h-6';
  }

  getStepTextClasses(): string {
    return this.variant === 'hero' ? 'text-xs' : 'text-sm';
  }

  getFeaturesClasses(): string {
    return this.variant === 'hero' ? 'p-2 mb-3' : 'p-6 mb-8';
  }

  getFeaturesGridClasses(): string {
    return this.variant === 'hero' ? 'grid-cols-1 gap-1' : 'grid-cols-1 md:grid-cols-2 gap-4';
  }

  getFeatureIconClasses(): string {
    return this.variant === 'hero' ? 'w-3 h-3' : 'w-6 h-6';
  }

  getFeatureSvgClasses(): string {
    return this.variant === 'hero' ? 'w-2 h-2' : 'w-4 h-4';
  }

  getFeatureTextClasses(): string {
    return this.variant === 'hero' ? 'text-xs' : 'text-sm';
  }

  getButtonClasses(): string {
    return this.variant === 'hero' ? 'py-2 px-3 text-sm mb-2' : 'py-4 px-8';
  }

  getButtonIconClasses(): string {
    return this.variant === 'hero' ? 'w-3 h-3' : 'w-5 h-5';
  }

  getSecondaryButtonClasses(): string {
    return this.variant === 'hero' ? 'py-2 px-3 text-xs' : 'mt-3 py-3 px-6';
  }

  quickQuote() {
    // Hacer scroll a la sección de cotización
    const element = document.getElementById('cotizar');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback a navegación
      this.router.navigate(['/cotizar']);
    }
  }
}