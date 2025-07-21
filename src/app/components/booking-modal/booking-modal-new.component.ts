import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { PricingService, Destination } from '../../services/pricing.service';
import { UINotificationService } from '../../services/ui-notification.service';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
          class="inline-block w-full max-w-2xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl modal-content"
          (click)="$event.stopPropagation()"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Reserva tu Viaje</h2>
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

          <!-- Use the same BookingComponent template optimized for modal -->
          <div class="booking-cta-container max-w-none">
            <!-- Booking Steps (always in booking mode for modal) -->
            <div class="space-y-4">
              <!-- Header with back button and progress -->
              <div class="flex items-center justify-between mb-4">
                <button 
                  (click)="previousStep()"
                  *ngIf="currentStep > 1"
                  class="flex items-center text-gray-600 hover:text-gray-800 transition-colors text-sm"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  Anterior
                </button>
                
                <div class="text-center flex-1">
                  <h3 class="text-lg font-bold text-gray-900">{{ getStepTitle() }}</h3>
                  <p class="text-sm text-gray-600">Paso {{currentStep}} de 4</p>
                </div>
                
                <div class="w-16"></div>
              </div>

              <!-- Progress Bar -->
              <div class="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                  class="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  [style.width.%]="(currentStep / 4) * 100"
                ></div>
              </div>

              <!-- Step Content -->
              <div class="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <!-- Use the same steps as BookingComponent but adapted for modal -->
                <ng-container [ngSwitch]="currentStep">
                  <!-- Step 1: Route Selection -->
                  <div *ngSwitchCase="1" class="space-y-4">
                    <form [formGroup]="routeForm" class="space-y-4">
                      <!-- Direction Selection -->
                      <div class="space-y-3">
                        <label class="block text-sm font-bold text-gray-900">Dirección del Viaje</label>
                        <div class="grid grid-cols-2 gap-3">
                          <label class="relative cursor-pointer">
                            <input type="radio" value="to-airport" formControlName="direction" class="sr-only">
                            <div class="p-3 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300"
                                 [class]="routeForm.get('direction')?.value === 'to-airport' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'">
                              <div class="flex items-center space-x-2">
                                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                                </svg>
                                <div>
                                  <h4 class="font-bold text-sm text-gray-900">Hacia el Aeropuerto</h4>
                                  <p class="text-xs text-gray-700">Desde tu ubicación</p>
                                </div>
                              </div>
                            </div>
                          </label>

                          <label class="relative cursor-pointer">
                            <input type="radio" value="from-airport" formControlName="direction" class="sr-only">
                            <div class="p-3 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300"
                                 [class]="routeForm.get('direction')?.value === 'from-airport' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'">
                              <div class="flex items-center space-x-2">
                                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                </svg>
                                <div>
                                  <h4 class="font-bold text-sm text-gray-900">Desde el Aeropuerto</h4>
                                  <p class="text-xs text-gray-700">A tu destino</p>
                                </div>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>

                      <!-- Locations -->
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-bold text-gray-900 mb-2">
                            {{ routeForm.get('direction')?.value === 'to-airport' ? 'Origen' : 'Destino' }}
                          </label>
                          <select formControlName="origin" class="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900">
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
                          <input type="text" value="Aeropuerto SCL" readonly class="w-full p-3 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                        </div>
                      </div>

                      <!-- Date and Time -->
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-bold text-gray-900 mb-2">Fecha de Salida</label>
                          <input type="date" formControlName="departureDate" [min]="minDate" class="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900">
                        </div>
                        <div>
                          <label class="block text-sm font-bold text-gray-900 mb-2">Hora de Salida</label>
                          <input type="time" formControlName="departureTime" class="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900">
                        </div>
                      </div>

                      <!-- Round Trip -->
                      <div class="space-y-3">
                        <label class="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" formControlName="isRoundTrip" class="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500">
                          <span class="text-sm font-bold text-gray-900">Viaje de ida y vuelta</span>
                        </label>
                        <div *ngIf="routeForm.get('isRoundTrip')?.value" class="grid grid-cols-2 gap-4 ml-7">
                          <div>
                            <label class="block text-sm font-bold text-gray-900 mb-2">Fecha de Regreso</label>
                            <input type="date" formControlName="returnDate" [min]="routeForm.get('departureDate')?.value" class="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900">
                          </div>
                          <div>
                            <label class="block text-sm font-bold text-gray-900 mb-2">Hora de Regreso</label>
                            <input type="time" formControlName="returnTime" class="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900">
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                  <!-- Step 2: Vehicle Selection -->
                  <div *ngSwitchCase="2" class="space-y-4">
                    <form [formGroup]="vehicleForm" class="space-y-4">
                      <!-- Vehicle Type -->
                      <div class="space-y-3">
                        <label class="block text-sm font-bold text-gray-900">Tipo de Vehículo</label>
                        <div class="grid grid-cols-2 gap-3">
                          <label class="relative cursor-pointer">
                            <input type="radio" value="taxi" formControlName="vehicleType" class="sr-only">
                            <div class="p-4 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300"
                                 [class]="vehicleForm.get('vehicleType')?.value === 'taxi' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'">
                              <div class="text-center space-y-2">
                                <svg class="w-8 h-8 mx-auto text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                                </svg>
                                <div>
                                  <h4 class="font-bold text-sm text-gray-900">Taxi</h4>
                                  <p class="text-xs text-gray-700">1-4 pasajeros</p>
                                </div>
                              </div>
                            </div>
                          </label>

                          <label class="relative cursor-pointer">
                            <input type="radio" value="suv" formControlName="vehicleType" class="sr-only">
                            <div class="p-4 border-2 rounded-lg transition-all duration-200 hover:border-yellow-300"
                                 [class]="vehicleForm.get('vehicleType')?.value === 'suv' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'">
                              <div class="text-center space-y-2">
                                <svg class="w-8 h-8 mx-auto text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                </svg>
                                <div>
                                  <h4 class="font-bold text-sm text-gray-900">SUV</h4>
                                  <p class="text-xs text-gray-700">1-6 pasajeros</p>
                                </div>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>

                      <!-- Passengers and Luggage -->
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-bold text-gray-900 mb-2">Pasajeros</label>
                          <select formControlName="passengers" class="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900">
                            <option value="1">1 pasajero</option>
                            <option value="2">2 pasajeros</option>
                            <option value="3">3 pasajeros</option>
                            <option value="4">4 pasajeros</option>
                            <option value="5" *ngIf="vehicleForm.get('vehicleType')?.value === 'suv'">5 pasajeros</option>
                            <option value="6" *ngIf="vehicleForm.get('vehicleType')?.value === 'suv'">6 pasajeros</option>
                          </select>
                        </div>
                        <div>
                          <label class="block text-sm font-bold text-gray-900 mb-2">Equipaje</label>
                          <select formControlName="luggage" class="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900">
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
                      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div class="flex justify-between items-center">
                          <span class="text-lg font-semibold text-gray-900">Precio Estimado:</span>
                          <span class="text-xl font-bold text-yellow-600">{{ totalPrice | currency:'CLP':'symbol':'1.0-0' }}</span>
                        </div>
                        <p class="text-sm text-gray-600 mt-1">*Precio final puede variar según condiciones del viaje</p>
                      </div>
                    </form>
                  </div>

                  <!-- Step 3: Passenger Details -->
                  <div *ngSwitchCase="3" class="space-y-4">
                    <form [formGroup]="detailsForm" class="space-y-4">
                      <!-- Personal Information -->
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-bold text-gray-900 mb-2">Nombre Completo</label>
                          <input type="text" formControlName="fullName" placeholder="Ingrese su nombre completo" class="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900">
                        </div>
                        <div>
                          <label class="block text-sm font-bold text-gray-900 mb-2">Teléfono</label>
                          <input type="tel" formControlName="phone" placeholder="+56 9 1234 5678" class="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900">
                        </div>
                      </div>

                      <div>
                        <label class="block text-sm font-bold text-gray-900 mb-2">Email</label>
                        <input type="email" formControlName="email" placeholder="correo@ejemplo.com" class="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900">
                      </div>

                      <!-- Flight Information -->
                      <div *ngIf="routeForm.get('direction')?.value === 'from-airport'" class="space-y-3">
                        <h4 class="text-lg font-semibold text-gray-900">Información de Vuelo</h4>
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label class="block text-sm font-bold text-gray-900 mb-2">Número de Vuelo</label>
                            <input type="text" formControlName="flightNumber" placeholder="Ej: LA123" class="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900">
                          </div>
                          <div>
                            <label class="block text-sm font-bold text-gray-900 mb-2">Aerolínea</label>
                            <input type="text" formControlName="airline" placeholder="Ej: LATAM Airlines" class="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900">
                          </div>
                        </div>
                      </div>

                      <!-- Special Requests -->
                      <div>
                        <label class="block text-sm font-bold text-gray-900 mb-2">Solicitudes Especiales (Opcional)</label>
                        <textarea formControlName="specialRequests" rows="3" placeholder="Ej: Silla para niños, asistencia especial, etc." class="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none text-gray-900"></textarea>
                      </div>
                    </form>
                  </div>

                  <!-- Step 4: Confirmation -->
                  <div *ngSwitchCase="4" class="space-y-4">
                    <!-- Summary -->
                    <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <h4 class="font-semibold text-gray-900 mb-2">Detalles del Viaje</h4>
                          <p class="text-sm text-gray-700"><strong>Ruta:</strong> {{ getRouteDisplay() }}</p>
                          <p class="text-sm text-gray-700"><strong>Fecha:</strong> {{ routeForm.get('departureDate')?.value | date:'dd/MM/yyyy' }}</p>
                          <p class="text-sm text-gray-700"><strong>Hora:</strong> {{ routeForm.get('departureTime')?.value }}</p>
                          <p class="text-sm text-gray-700"><strong>Vehículo:</strong> {{ vehicleForm.get('vehicleType')?.value === 'taxi' ? 'Taxi' : 'SUV' }}</p>
                          <p class="text-sm text-gray-700"><strong>Pasajeros:</strong> {{ vehicleForm.get('passengers')?.value }}</p>
                        </div>
                        <div>
                          <h4 class="font-semibold text-gray-900 mb-2">Información de Contacto</h4>
                          <p class="text-sm text-gray-700"><strong>Nombre:</strong> {{ detailsForm.get('fullName')?.value }}</p>
                          <p class="text-sm text-gray-700"><strong>Teléfono:</strong> {{ detailsForm.get('phone')?.value }}</p>
                          <p class="text-sm text-gray-700"><strong>Email:</strong> {{ detailsForm.get('email')?.value }}</p>
                        </div>
                      </div>

                      <div class="border-t pt-3">
                        <div class="flex justify-between items-center text-lg font-bold">
                          <span>Total:</span>
                          <span class="text-yellow-600">{{ totalPrice | currency:'CLP':'symbol':'1.0-0' }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Terms -->
                    <div class="space-y-3">
                      <label class="flex items-start space-x-3 cursor-pointer">
                        <input type="checkbox" [(ngModel)]="acceptTerms" class="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 mt-1">
                        <span class="text-sm text-gray-700">
                          Acepto los <a href="#" class="text-yellow-600 hover:underline">términos y condiciones</a> 
                          y la <a href="#" class="text-yellow-600 hover:underline">política de privacidad</a>
                        </span>
                      </label>
                    </div>
                  </div>
                </ng-container>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex justify-between space-x-4 pt-4">
                <button 
                  *ngIf="currentStep > 1"
                  (click)="previousStep()"
                  class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Anterior
                </button>
                
                <div class="flex-1"></div>
                
                <button 
                  *ngIf="currentStep < 4"
                  (click)="nextStep()"
                  [disabled]="!isCurrentStepValid()"
                  class="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
                
                <button 
                  *ngIf="currentStep === 4"
                  (click)="confirmBooking()"
                  [disabled]="!acceptTerms || !isCurrentStepValid()"
                  class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Confirmar Reserva
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() bookingCompleted = new EventEmitter<any>();

  private destroy$ = new Subject<void>();
  private readonly STORAGE_KEY = 'booking_draft_modal';
  
  // Form Groups
  routeForm!: FormGroup;
  vehicleForm!: FormGroup;
  detailsForm!: FormGroup;

  // Component State
  currentStep = 1;
  totalPrice = 0;
  acceptTerms = false;
  isProcessing = false;
  
  // Data
  destinations: Destination[] = [];
  minDate = '';
  validationErrors: any = {};

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthService,
    private pricingService: PricingService,
    private uiNotificationService: UINotificationService
  ) {
    this.initializeForms();
    this.setMinDate();
  }

  ngOnInit() {
    this.loadDestinations();
    this.loadDraftData();
    this.setupFormSubscriptions();
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

    this.vehicleForm = this.fb.group({
      vehicleType: ['taxi', Validators.required],
      passengers: [1, [Validators.required, Validators.min(1)]],
      luggage: [1, [Validators.required, Validators.min(1)]]
    });

    this.detailsForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]{8,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      flightNumber: [''],
      airline: [''],
      specialRequests: ['']
    });
  }

  private setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  private loadDestinations() {
    this.pricingService.getDestinations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (destinations) => {
          this.destinations = destinations;
        },
        error: (error) => {
          console.error('Error loading destinations:', error);
        }
      });
  }

  private setupFormSubscriptions() {
    // Auto-calculate price when forms change
    [this.routeForm, this.vehicleForm].forEach(form => {
      form.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.calculatePrice();
          this.saveDraftData();
        });
    });

    // Auto-save details form
    this.detailsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.saveDraftData();
      });
  }

  // Navigation Methods
  nextStep() {
    if (this.validateStep(this.currentStep)) {
      this.currentStep++;
      this.calculatePrice();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Validation
  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.routeForm.valid;
      case 2:
        return this.vehicleForm.valid;
      case 3:
        return this.detailsForm.valid;
      case 4:
        return this.acceptTerms;
      default:
        return false;
    }
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

  private clearValidationErrors() {
    this.validationErrors = {};
  }

  // Price Calculation
  private calculatePrice() {
    if (!this.routeForm.get('origin')?.value || !this.vehicleForm.get('vehicleType')?.value) {
      this.totalPrice = 0;
      return;
    }

    const selectedDestination = this.destinations.find(d => d.name === this.routeForm.get('origin')?.value);
    if (!selectedDestination) {
      this.totalPrice = 0;
      return;
    }

    let basePrice = selectedDestination.basePrice;
    
    // Vehicle type multiplier
    if (this.vehicleForm.get('vehicleType')?.value === 'suv') {
      basePrice *= 1.3;
    }

    // Round trip
    if (this.routeForm.get('isRoundTrip')?.value) {
      basePrice *= 2;
    }

    this.totalPrice = Math.round(basePrice);
  }

  // Utility Methods
  getStepTitle(): string {
    switch (this.currentStep) {
      case 1: return 'Selecciona tu Ruta';
      case 2: return 'Selección de Vehículo';
      case 3: return 'Detalles del Pasajero';
      case 4: return 'Confirmar Reserva';
      default: return '';
    }
  }

  getRouteDisplay(): string {
    const origin = this.routeForm.get('origin')?.value;
    const direction = this.routeForm.get('direction')?.value;
    
    if (direction === 'to-airport') {
      return `${origin} → Aeropuerto SCL`;
    } else {
      return `Aeropuerto SCL → ${origin}`;
    }
  }

  // Modal Methods
  closeModal(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.closeEvent.emit();
  }

  // Booking Methods
  confirmBooking() {
    if (!this.isCurrentStepValid()) {
      this.showNotification('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    this.isProcessing = true;

    const bookingData = {
      route: this.routeForm.value,
      vehicle: this.vehicleForm.value,
      details: this.detailsForm.value,
      totalPrice: this.totalPrice,
      timestamp: new Date().toISOString()
    };

    this.bookingService.createBooking(bookingData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.showNotification('¡Reserva confirmada exitosamente!', 'success');
          this.bookingCompleted.emit(response);
          this.clearDraftData();
          this.closeModal();
          this.resetForms();
        },
        error: (error) => {
          console.error('Error creating booking:', error);
          this.showNotification('Error al confirmar la reserva. Intente nuevamente.', 'error');
        },
        complete: () => {
          this.isProcessing = false;
        }
      });
  }

  private resetForms() {
    this.currentStep = 1;
    this.totalPrice = 0;
    this.acceptTerms = false;
    this.routeForm.reset({ direction: 'to-airport', isRoundTrip: false });
    this.vehicleForm.reset({ vehicleType: 'taxi', passengers: 1, luggage: 1 });
    this.detailsForm.reset();
  }

  // Storage Methods
  private loadDraftData() {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const draftData = JSON.parse(savedData);
        
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

  private showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
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
  }
}
