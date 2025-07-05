import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

interface SystemSettings {
  general: {
    platformName: string;
    supportEmail: string;
    supportPhone: string;
    currency: string;
    timezone: string;
    language: string;
  };
  pricing: {
    baseFare: number;
    perKmRate: number;
    perMinuteRate: number;
    airportSurcharge: number;
    minimumFare: number;
    cancellationFee: number;
    platformFeePercentage: number;
  };
  booking: {
    maxAdvanceBookingDays: number;
    minAdvanceBookingMinutes: number;
    cancellationTimeLimit: number;
    autoAssignDrivers: boolean;
    requirePaymentUpfront: boolean;
    allowCashPayments: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    bookingConfirmations: boolean;
    driverAssignments: boolean;
    tripReminders: boolean;
    paymentReceipts: boolean;
  };
  integrations: {
    googleMapsApiKey: string;
    stripePublishableKey: string;
    transbank: {
      commerceCode: string;
      apiKey: string;
      environment: string;
    };
    mercadoPago: {
      publicKey: string;
      accessToken: string;
    };
    firebase: {
      apiKey: string;
      projectId: string;
      messagingSenderId: string;
    };
    twilio: {
      accountSid: string;
      authToken: string;
      phoneNumber: string;
    };
  };
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Navegación de pestañas -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button *ngFor="let tab of tabs" 
                  (click)="activeTab = tab.id"
                  [class.border-blue-500]="activeTab === tab.id"
                  [class.text-blue-600]="activeTab === tab.id"
                  [class.border-transparent]="activeTab !== tab.id"
                  [class.text-gray-500]="activeTab !== tab.id"
                  class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm hover:text-gray-700 hover:border-gray-300">
            {{tab.label}}
          </button>
        </nav>
      </div>

      <!-- Configuración General -->
      <div *ngIf="activeTab === 'general'" class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Configuración General</h3>
        <form [formGroup]="generalForm" (ngSubmit)="saveGeneralSettings()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la Plataforma</label>
              <input type="text" 
                     formControlName="platformName"
                     class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email de Soporte</label>
              <input type="email" 
                     formControlName="supportEmail"
                     class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono de Soporte</label>
              <input type="tel" 
                     formControlName="supportPhone"
                     class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
              <select formControlName="currency"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="CLP">Peso Chileno (CLP)</option>
                <option value="USD">Dólar Americano (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Zona Horaria</label>
              <select formControlName="timezone"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="America/Santiago">Chile/Santiago</option>
                <option value="America/New_York">Nueva York</option>
                <option value="Europe/Madrid">Madrid</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
              <select formControlName="language"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button type="submit" 
                    [disabled]="!generalForm.valid || savingGeneral"
                    class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{savingGeneral ? 'Guardando...' : 'Guardar Configuración'}}
            </button>
          </div>
        </form>
      </div>

      <!-- Configuración de Precios -->
      <div *ngIf="activeTab === 'pricing'" class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Configuración de Precios</h3>
        <form [formGroup]="pricingForm" (ngSubmit)="savePricingSettings()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tarifa Base ($)</label>
              <input type="number" 
                     formControlName="baseFare"
                     min="0"
                     step="100"
                     class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <p class="mt-1 text-sm text-gray-500">Tarifa fija por iniciar el viaje</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tarifa por Kilómetro ($)</label>
              <input type="number" 
                     formControlName="perKmRate"
                     min="0"
                     step="10"
                     class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <p class="mt-1 text-sm text-gray-500">Costo por kilómetro recorrido</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tarifa por Minuto ($)</label>
              <input type="number" 
                     formControlName="perMinuteRate"
                     min="0"
                     step="5"
                     class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <p class="mt-1 text-sm text-gray-500">Costo por minuto de viaje</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Recargo Aeropuerto ($)</label>
              <input type="number" 
                     formControlName="airportSurcharge"
                     min="0"
                     step="100"
                     class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <p class="mt-1 text-sm text-gray-500">Recargo adicional para viajes al aeropuerto</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tarifa Mínima ($)</label>
              <input type="number" 
                     formControlName="minimumFare"
                     min="0"
                     step="100"
                     class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <p class="mt-1 text-sm text-gray-500">Tarifa mínima por cualquier viaje</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tarifa por Cancelación ($)</label>
              <input type="number" 
                     formControlName="cancellationFee"
                     min="0"
                     step="100"
                     class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <p class="mt-1 text-sm text-gray-500">Cargo por cancelar un viaje</p>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Comisión de la Plataforma (%)</label>
              <input type="number" 
                     formControlName="platformFeePercentage"
                     min="0"
                     max="50"
                     step="0.5"
                     class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <p class="mt-1 text-sm text-gray-500">Porcentaje que se queda la plataforma de cada viaje</p>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button type="submit" 
                    [disabled]="!pricingForm.valid || savingPricing"
                    class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{savingPricing ? 'Guardando...' : 'Guardar Precios'}}
            </button>
          </div>
        </form>
      </div>

      <!-- Configuración de Reservas -->
      <div *ngIf="activeTab === 'booking'" class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Configuración de Reservas</h3>
        <form [formGroup]="bookingForm" (ngSubmit)="saveBookingSettings()">
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Máximo días de anticipación</label>
                <input type="number" 
                       formControlName="maxAdvanceBookingDays"
                       min="1"
                       max="365"
                       class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <p class="mt-1 text-sm text-gray-500">Días máximos para reservar con anticipación</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mínimo minutos de anticipación</label>
                <input type="number" 
                       formControlName="minAdvanceBookingMinutes"
                       min="0"
                       step="5"
                       class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <p class="mt-1 text-sm text-gray-500">Minutos mínimos para reservar con anticipación</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Límite de cancelación (minutos)</label>
                <input type="number" 
                       formControlName="cancellationTimeLimit"
                       min="0"
                       step="5"
                       class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <p class="mt-1 text-sm text-gray-500">Minutos antes del viaje para cancelar sin cargo</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center">
                <input type="checkbox" 
                       id="autoAssignDrivers"
                       formControlName="autoAssignDrivers"
                       class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="autoAssignDrivers" class="ml-2 block text-sm text-gray-900">
                  Asignar conductores automáticamente
                </label>
              </div>

              <div class="flex items-center">
                <input type="checkbox" 
                       id="requirePaymentUpfront"
                       formControlName="requirePaymentUpfront"
                       class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="requirePaymentUpfront" class="ml-2 block text-sm text-gray-900">
                  Requerir pago por adelantado
                </label>
              </div>

              <div class="flex items-center">
                <input type="checkbox" 
                       id="allowCashPayments"
                       formControlName="allowCashPayments"
                       class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="allowCashPayments" class="ml-2 block text-sm text-gray-900">
                  Permitir pagos en efectivo
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button type="submit" 
                    [disabled]="!bookingForm.valid || savingBooking"
                    class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{savingBooking ? 'Guardando...' : 'Guardar Configuración'}}
            </button>
          </div>
        </form>
      </div>

      <!-- Configuración de Notificaciones -->
      <div *ngIf="activeTab === 'notifications'" class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Configuración de Notificaciones</h3>
        <form [formGroup]="notificationsForm" (ngSubmit)="saveNotificationsSettings()">
          <div class="space-y-6">
            <div>
              <h4 class="text-md font-medium text-gray-900 mb-4">Canales de Notificación</h4>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input type="checkbox" 
                         id="emailNotifications"
                         formControlName="emailNotifications"
                         class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label for="emailNotifications" class="ml-2 block text-sm text-gray-900">
                    Notificaciones por email
                  </label>
                </div>

                <div class="flex items-center">
                  <input type="checkbox" 
                         id="smsNotifications"
                         formControlName="smsNotifications"
                         class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label for="smsNotifications" class="ml-2 block text-sm text-gray-900">
                    Notificaciones por SMS
                  </label>
                </div>

                <div class="flex items-center">
                  <input type="checkbox" 
                         id="pushNotifications"
                         formControlName="pushNotifications"
                         class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label for="pushNotifications" class="ml-2 block text-sm text-gray-900">
                    Notificaciones push
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-md font-medium text-gray-900 mb-4">Tipos de Notificación</h4>
              <div class="space-y-4">
                <div class="flex items-center">
                  <input type="checkbox" 
                         id="bookingConfirmations"
                         formControlName="bookingConfirmations"
                         class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label for="bookingConfirmations" class="ml-2 block text-sm text-gray-900">
                    Confirmaciones de reserva
                  </label>
                </div>

                <div class="flex items-center">
                  <input type="checkbox" 
                         id="driverAssignments"
                         formControlName="driverAssignments"
                         class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label for="driverAssignments" class="ml-2 block text-sm text-gray-900">
                    Asignación de conductor
                  </label>
                </div>

                <div class="flex items-center">
                  <input type="checkbox" 
                         id="tripReminders"
                         formControlName="tripReminders"
                         class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label for="tripReminders" class="ml-2 block text-sm text-gray-900">
                    Recordatorios de viaje
                  </label>
                </div>

                <div class="flex items-center">
                  <input type="checkbox" 
                         id="paymentReceipts"
                         formControlName="paymentReceipts"
                         class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label for="paymentReceipts" class="ml-2 block text-sm text-gray-900">
                    Recibos de pago
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button type="submit" 
                    [disabled]="!notificationsForm.valid || savingNotifications"
                    class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{savingNotifications ? 'Guardando...' : 'Guardar Configuración'}}
            </button>
          </div>
        </form>
      </div>

      <!-- Configuración de Integraciones -->
      <div *ngIf="activeTab === 'integrations'" class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Configuración de Integraciones</h3>
        
        <div class="space-y-8">
          <!-- Google Maps -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Google Maps</h4>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input type="password" 
                     [(ngModel)]="settings.integrations.googleMapsApiKey"
                     class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <p class="mt-1 text-sm text-gray-500">Clave API de Google Maps para geocodificación y mapas</p>
            </div>
          </div>

          <!-- Stripe -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Stripe</h4>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Publishable Key</label>
              <input type="text" 
                     [(ngModel)]="settings.integrations.stripePublishableKey"
                     class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <p class="mt-1 text-sm text-gray-500">Clave pública de Stripe para pagos internacionales</p>
            </div>
          </div>

          <!-- Transbank -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Transbank</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Código de Comercio</label>
                <input type="text" 
                       [(ngModel)]="settings.integrations.transbank.commerceCode"
                       class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input type="password" 
                       [(ngModel)]="settings.integrations.transbank.apiKey"
                       class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Entorno</label>
                <select [(ngModel)]="settings.integrations.transbank.environment"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Producción</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Firebase -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Firebase</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input type="password" 
                       [(ngModel)]="settings.integrations.firebase.apiKey"
                       class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Project ID</label>
                <input type="text" 
                       [(ngModel)]="settings.integrations.firebase.projectId"
                       class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Messaging Sender ID</label>
                <input type="text" 
                       [(ngModel)]="settings.integrations.firebase.messagingSenderId"
                       class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
            </div>
          </div>

          <!-- Twilio -->
          <div>
            <h4 class="text-md font-medium text-gray-900 mb-4">Twilio (SMS)</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Account SID</label>
                <input type="text" 
                       [(ngModel)]="settings.integrations.twilio.accountSid"
                       class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Auth Token</label>
                <input type="password" 
                       [(ngModel)]="settings.integrations.twilio.authToken"
                       class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Número de Teléfono</label>
                <input type="tel" 
                       [(ngModel)]="settings.integrations.twilio.phoneNumber"
                       class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button (click)="saveIntegrationsSettings()" 
                    [disabled]="savingIntegrations"
                    class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {{savingIntegrations ? 'Guardando...' : 'Guardar Integraciones'}}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminSettingsComponent implements OnInit {
  activeTab = 'general';
  
  tabs = [
    { id: 'general', label: 'General' },
    { id: 'pricing', label: 'Precios' },
    { id: 'booking', label: 'Reservas' },
    { id: 'notifications', label: 'Notificaciones' },
    { id: 'integrations', label: 'Integraciones' }
  ];
  generalForm!: FormGroup;
  pricingForm!: FormGroup;
  bookingForm!: FormGroup;
  notificationsForm!: FormGroup;

  savingGeneral = false;
  savingPricing = false;
  savingBooking = false;
  savingNotifications = false;
  savingIntegrations = false;

  settings: SystemSettings = {
    general: {
      platformName: 'Voy al Aeropuerto',
      supportEmail: 'soporte@voyalaeropuerto.cl',
      supportPhone: '+56912345678',
      currency: 'CLP',
      timezone: 'America/Santiago',
      language: 'es'
    },
    pricing: {
      baseFare: 2500,
      perKmRate: 800,
      perMinuteRate: 150,
      airportSurcharge: 3000,
      minimumFare: 5000,
      cancellationFee: 2000,
      platformFeePercentage: 15
    },
    booking: {
      maxAdvanceBookingDays: 30,
      minAdvanceBookingMinutes: 30,
      cancellationTimeLimit: 60,
      autoAssignDrivers: true,
      requirePaymentUpfront: false,
      allowCashPayments: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      bookingConfirmations: true,
      driverAssignments: true,
      tripReminders: true,
      paymentReceipts: true
    },
    integrations: {
      googleMapsApiKey: '',
      stripePublishableKey: '',
      transbank: {
        commerceCode: '',
        apiKey: '',
        environment: 'sandbox'
      },
      mercadoPago: {
        publicKey: '',
        accessToken: ''
      },
      firebase: {
        apiKey: '',
        projectId: '',
        messagingSenderId: ''
      },
      twilio: {
        accountSid: '',
        authToken: '',
        phoneNumber: ''
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  private initializeForms(): void {
    this.generalForm = this.fb.group({
      platformName: [this.settings.general.platformName, Validators.required],
      supportEmail: [this.settings.general.supportEmail, [Validators.required, Validators.email]],
      supportPhone: [this.settings.general.supportPhone, Validators.required],
      currency: [this.settings.general.currency, Validators.required],
      timezone: [this.settings.general.timezone, Validators.required],
      language: [this.settings.general.language, Validators.required]
    });

    this.pricingForm = this.fb.group({
      baseFare: [this.settings.pricing.baseFare, [Validators.required, Validators.min(0)]],
      perKmRate: [this.settings.pricing.perKmRate, [Validators.required, Validators.min(0)]],
      perMinuteRate: [this.settings.pricing.perMinuteRate, [Validators.required, Validators.min(0)]],
      airportSurcharge: [this.settings.pricing.airportSurcharge, [Validators.required, Validators.min(0)]],
      minimumFare: [this.settings.pricing.minimumFare, [Validators.required, Validators.min(0)]],
      cancellationFee: [this.settings.pricing.cancellationFee, [Validators.required, Validators.min(0)]],
      platformFeePercentage: [this.settings.pricing.platformFeePercentage, [Validators.required, Validators.min(0), Validators.max(50)]]
    });

    this.bookingForm = this.fb.group({
      maxAdvanceBookingDays: [this.settings.booking.maxAdvanceBookingDays, [Validators.required, Validators.min(1)]],
      minAdvanceBookingMinutes: [this.settings.booking.minAdvanceBookingMinutes, [Validators.required, Validators.min(0)]],
      cancellationTimeLimit: [this.settings.booking.cancellationTimeLimit, [Validators.required, Validators.min(0)]],
      autoAssignDrivers: [this.settings.booking.autoAssignDrivers],
      requirePaymentUpfront: [this.settings.booking.requirePaymentUpfront],
      allowCashPayments: [this.settings.booking.allowCashPayments]
    });

    this.notificationsForm = this.fb.group({
      emailNotifications: [this.settings.notifications.emailNotifications],
      smsNotifications: [this.settings.notifications.smsNotifications],
      pushNotifications: [this.settings.notifications.pushNotifications],
      bookingConfirmations: [this.settings.notifications.bookingConfirmations],
      driverAssignments: [this.settings.notifications.driverAssignments],
      tripReminders: [this.settings.notifications.tripReminders],
      paymentReceipts: [this.settings.notifications.paymentReceipts]
    });
  }

  private async loadSettings(): Promise<void> {
    try {
      // TODO: Cargar configuraciones desde la base de datos
      // const settings = await this.adminService.getSystemSettings();
      // this.settings = settings;
      // this.updateForms();
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  private updateForms(): void {
    this.generalForm.patchValue(this.settings.general);
    this.pricingForm.patchValue(this.settings.pricing);
    this.bookingForm.patchValue(this.settings.booking);
    this.notificationsForm.patchValue(this.settings.notifications);
  }

  async saveGeneralSettings(): Promise<void> {
    if (!this.generalForm.valid) return;

    this.savingGeneral = true;
    try {
      this.settings.general = { ...this.settings.general, ...this.generalForm.value };
      // TODO: Guardar en base de datos
      // await this.adminService.updateSystemSettings('general', this.settings.general);
      console.log('General settings saved:', this.settings.general);
    } catch (error) {
      console.error('Error saving general settings:', error);
    } finally {
      this.savingGeneral = false;
    }
  }

  async savePricingSettings(): Promise<void> {
    if (!this.pricingForm.valid) return;

    this.savingPricing = true;
    try {
      this.settings.pricing = { ...this.settings.pricing, ...this.pricingForm.value };
      // TODO: Guardar en base de datos
      // await this.adminService.updateSystemSettings('pricing', this.settings.pricing);
      console.log('Pricing settings saved:', this.settings.pricing);
    } catch (error) {
      console.error('Error saving pricing settings:', error);
    } finally {
      this.savingPricing = false;
    }
  }

  async saveBookingSettings(): Promise<void> {
    if (!this.bookingForm.valid) return;

    this.savingBooking = true;
    try {
      this.settings.booking = { ...this.settings.booking, ...this.bookingForm.value };
      // TODO: Guardar en base de datos
      // await this.adminService.updateSystemSettings('booking', this.settings.booking);
      console.log('Booking settings saved:', this.settings.booking);
    } catch (error) {
      console.error('Error saving booking settings:', error);
    } finally {
      this.savingBooking = false;
    }
  }

  async saveNotificationsSettings(): Promise<void> {
    if (!this.notificationsForm.valid) return;

    this.savingNotifications = true;
    try {
      this.settings.notifications = { ...this.settings.notifications, ...this.notificationsForm.value };
      // TODO: Guardar en base de datos
      // await this.adminService.updateSystemSettings('notifications', this.settings.notifications);
      console.log('Notifications settings saved:', this.settings.notifications);
    } catch (error) {
      console.error('Error saving notifications settings:', error);
    } finally {
      this.savingNotifications = false;
    }
  }

  async saveIntegrationsSettings(): Promise<void> {
    this.savingIntegrations = true;
    try {
      // TODO: Guardar en base de datos
      // await this.adminService.updateSystemSettings('integrations', this.settings.integrations);
      console.log('Integrations settings saved:', this.settings.integrations);
    } catch (error) {
      console.error('Error saving integrations settings:', error);
    } finally {
      this.savingIntegrations = false;
    }
  }
}
